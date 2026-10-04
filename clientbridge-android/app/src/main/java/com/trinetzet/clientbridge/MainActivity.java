package com.trinetzet.clientbridge;

import android.app.Activity;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.webkit.*;
import android.widget.FrameLayout;
import android.widget.TextView;
import androidx.webkit.*;
import org.json.JSONObject;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.Set;

public final class MainActivity extends Activity {
 private WebView web;
 private ValueCallback<Uri[]> importCallback;
 private JavaScriptReplyProxy saveReply;
 private String saveId, saveText, deferredScript;
 private File pendingSaveFile(){return new File(getFilesDir(),"pending-export.json");}
 private static final int SAVE=10, IMPORT=11;
 @Override public void onCreate(Bundle state) {
  super.onCreate(state);
  FrameLayout root=new FrameLayout(this);root.setBackgroundColor(Color.rgb(21,29,41));setContentView(root);
  root.setOnApplyWindowInsetsListener((v,insets)->{
   if(android.os.Build.VERSION.SDK_INT>=30){android.graphics.Insets i=insets.getInsets(android.view.WindowInsets.Type.systemBars() | android.view.WindowInsets.Type.ime());v.setPadding(i.left,i.top,i.right,i.bottom);}
   else v.setPadding(insets.getSystemWindowInsetLeft(),insets.getSystemWindowInsetTop(),insets.getSystemWindowInsetRight(),insets.getSystemWindowInsetBottom());return insets;
  });root.requestApplyInsets();
  if(!WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER)){TextView notice=new TextView(this);notice.setText("Please update Android System WebView to open ClientBridge.");notice.setTextColor(Color.WHITE);notice.setPadding(32,64,32,32);root.addView(notice);return;}
  if(state==null || !state.getBoolean("pendingSave",false))pendingSaveFile().delete();
  try {if(state!=null && state.getBoolean("pendingSave",false) && pendingSaveFile().exists()){JSONObject pending=new JSONObject(new String(java.nio.file.Files.readAllBytes(pendingSaveFile().toPath()),StandardCharsets.UTF_8));saveId=pending.getString("id");saveText=pending.getString("text");}}catch(Exception ignored){pendingSaveFile().delete();}
  web=new WebView(this);root.addView(web,new FrameLayout.LayoutParams(-1,-1));
  WebSettings settings=web.getSettings();settings.setJavaScriptEnabled(true);settings.setDomStorageEnabled(true);settings.setAllowFileAccess(false);settings.setAllowContentAccess(true);settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
  WebViewAssetLoader loader=new WebViewAssetLoader.Builder().addPathHandler("/assets/clientbridge/",path->{
   if(!java.util.Arrays.asList("index.html","styles.css","app.mjs","core.mjs","practice.mjs","scenarios.mjs","extra-scenarios.mjs","android-adapter.js").contains(path))return denied();
   try {String mime=path.endsWith(".html")?"text/html":path.endsWith(".css")?"text/css":"text/javascript";return new WebResourceResponse(mime,"UTF-8",getAssets().open("clientbridge/"+path));}catch(IOException e){return denied();}
  }).build();
  web.setWebViewClient(new WebViewClient(){
   @Override public WebResourceResponse shouldInterceptRequest(WebView v,WebResourceRequest request){WebResourceResponse response=loader.shouldInterceptRequest(request.getUrl());return response==null?denied():response;}
   @Override public void onPageFinished(WebView v,String url){if(deferredScript!=null){v.evaluateJavascript(deferredScript,null);deferredScript=null;}}
   @Override public boolean shouldOverrideUrlLoading(WebView v,WebResourceRequest request){return !BridgePolicy.isTrusted(request.getUrl().toString());}
  });
  web.setWebChromeClient(new WebChromeClient(){
   @Override public boolean onShowFileChooser(WebView v,ValueCallback<Uri[]> callback,FileChooserParams params){
    if(importCallback!=null)importCallback.onReceiveValue(null);importCallback=callback;
    Intent intent=new Intent(Intent.ACTION_OPEN_DOCUMENT).addCategory(Intent.CATEGORY_OPENABLE).setType("application/json");
    try{startActivityForResult(intent,IMPORT);}catch(Exception e){importCallback.onReceiveValue(null);importCallback=null;}return true;
   }
  });
  WebViewCompat.addWebMessageListener(web,"ClientBridgeAndroid",java.util.Collections.singleton("https://appassets.androidplatform.net"),(v,message,origin,mainFrame,reply)->{
   if(!mainFrame || !BridgePolicy.isTrusted(v.getUrl()) || !"https://appassets.androidplatform.net".equals(origin.toString()))return;
   String id="";
   try {
    if(message.getData()==null || message.getData().length()>1100000)throw new IllegalArgumentException();
    JSONObject obj=new JSONObject(message.getData());id=obj.getString("id");if(!id.matches("[0-9]{1,12}"))throw new IllegalArgumentException();
    String text=obj.getString("text");if(!BridgePolicy.validText(text))throw new IllegalArgumentException();
    String type=obj.getString("type");
    if(type.equals("copy")){ClipboardManager clipboard=(ClipboardManager)getSystemService(CLIPBOARD_SERVICE);clipboard.setPrimaryClip(ClipData.newPlainText("ClientBridge email",text));respond(reply,id,true,false,null);}
    else if(type.equals("save")){
     if(saveText!=null){respond(reply,id,false,false,"Finish the current save first.");return;}
     String name=BridgePolicy.exportName(obj.optString("name"));
     JSONObject pending=new JSONObject();pending.put("id",id);pending.put("text",text);try(FileOutputStream out=new FileOutputStream(pendingSaveFile())){out.write(pending.toString().getBytes(StandardCharsets.UTF_8));}
     saveReply=reply;saveId=id;saveText=text;
     Intent intent=new Intent(Intent.ACTION_CREATE_DOCUMENT).addCategory(Intent.CATEGORY_OPENABLE).setType(name.endsWith(".json")?"application/json":"text/plain").putExtra(Intent.EXTRA_TITLE,name);
     try{startActivityForResult(intent,SAVE);}catch(Exception e){clearSave(false,false,"No file picker is available.");}
    }else throw new IllegalArgumentException();
   }catch(Exception e){respond(reply,id,false,false,"Invalid native request.");}
  });
  if(state==null || web.restoreState(state)==null)web.loadUrl(BridgePolicy.HOME+"#practice");
 }
 private static WebResourceResponse denied(){return new WebResourceResponse("text/plain","UTF-8",403,"Blocked",java.util.Collections.emptyMap(),new ByteArrayInputStream(new byte[0]));}
 private void respond(JavaScriptReplyProxy reply,String id,boolean ok,boolean cancelled,String error){try{JSONObject response=new JSONObject();response.put("id",id);response.put("ok",ok);response.put("cancelled",cancelled);if(error!=null)response.put("error",error);reply.postMessage(response.toString());}catch(Exception ignored){}}
 private void clearSave(boolean ok,boolean cancelled,String error){
  if(saveReply!=null)respond(saveReply,saveId,ok,cancelled,error);
  else {String message=ok?"File saved in your chosen location.":cancelled?"Save cancelled.":error;runWhenReady("(()=>{const el=document.querySelector('#toast');if(el){el.textContent="+JSONObject.quote(message)+";el.classList.add('visible');}})()");}
  saveReply=null;saveText=null;saveId=null;pendingSaveFile().delete();
 }
 private void runWhenReady(String script){if(web!=null && web.getProgress()==100)web.evaluateJavascript(script,null);else deferredScript=script;}
 private void restoreSelectedImport(Uri uri){
  try(InputStream in=getContentResolver().openInputStream(uri);ByteArrayOutputStream out=new ByteArrayOutputStream()){
   if(in==null)throw new IOException();byte[] buffer=new byte[8192];int count;while((count=in.read(buffer))!=-1){out.write(buffer,0,count);if(out.size()>1000000)throw new IOException();}
   String encoded=android.util.Base64.encodeToString(out.toByteArray(),android.util.Base64.NO_WRAP);
   runWhenReady("(()=>{location.hash='progress';setTimeout(()=>{const data=Uint8Array.from(atob("+JSONObject.quote(encoded)+"),c=>c.charCodeAt(0));const files=new DataTransfer();files.items.add(new File([data],'clientbridge-progress.json',{type:'application/json'}));const input=document.querySelector('#import-file');input.files=files.files;input.dispatchEvent(new Event('change',{bubbles:true}));},100);})()");
  }catch(Exception e){runWhenReady("(()=>{const el=document.querySelector('#toast');if(el){el.textContent='Could not import this backup. Select a JSON file under 1 MB.';el.classList.add('visible');}})()");}
 }
 @Override protected void onActivityResult(int request,int result,Intent data){super.onActivityResult(request,result,data);
  if(request==IMPORT && importCallback!=null){importCallback.onReceiveValue(result==RESULT_OK && data!=null && data.getData()!=null?new Uri[]{data.getData()}:null);importCallback=null;}
  else if(request==IMPORT && result==RESULT_OK && data!=null && data.getData()!=null)restoreSelectedImport(data.getData());
  if(request==SAVE && saveText!=null){
   if(result!=RESULT_OK || data==null || data.getData()==null){clearSave(false,true,null);return;}
   try(OutputStream out=getContentResolver().openOutputStream(data.getData(),"wt")){if(out==null)throw new IOException();out.write(saveText.getBytes(StandardCharsets.UTF_8));clearSave(true,false,null);}catch(Exception e){clearSave(false,false,"The file could not be saved.");}
  }
 }
 @Override protected void onSaveInstanceState(Bundle state){super.onSaveInstanceState(state);state.putBoolean("pendingSave",saveText!=null);if(web!=null)web.saveState(state);}
 @Override public void onBackPressed(){if(web!=null && web.canGoBack())web.goBack();else super.onBackPressed();}
 @Override protected void onDestroy(){if(importCallback!=null)importCallback.onReceiveValue(null);if(isFinishing() && saveText!=null)clearSave(false,true,null);if(web!=null){WebViewCompat.removeWebMessageListener(web,"ClientBridgeAndroid");web.destroy();}super.onDestroy();}
}
