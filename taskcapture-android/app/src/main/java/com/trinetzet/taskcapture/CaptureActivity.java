package com.trinetzet.taskcapture;
import android.app.Activity;
import android.os.*;
import android.content.*;
import android.view.*;
import android.widget.*;
import java.util.UUID;
public class CaptureActivity extends Activity {
 private String delivery,savedId;private boolean attempted,resumed;private FrameLayout root;
 protected boolean readsClipboard(){return false;}
 @Override protected void onCreate(Bundle state){
  super.onCreate(state);delivery=state==null?UUID.randomUUID().toString():state.getString("delivery",UUID.randomUUID().toString());
  savedId=state==null?null:state.getString("saved_id");
  getWindow().addFlags(WindowManager.LayoutParams.FLAG_DIM_BEHIND);
  if(Build.VERSION.SDK_INT>=31)try{getWindow().setBackgroundBlurRadius(GlassUi.dp(this,32));}catch(RuntimeException ignored){}
  root=new FrameLayout(this);root.setBackgroundColor(0x33090b10);
  TextView waiting=GlassUi.text(this,readsClipboard()?"Читаю буфер…":"Сохраняю текст…",16);waiting.setGravity(Gravity.CENTER);root.addView(waiting,new FrameLayout.LayoutParams(-1,-1));
  setContentView(root);Insets.apply(root);
  if(savedId!=null){attempted=true;root.post(this::showSaved);}else if(!readsClipboard())root.post(this::capture);
 }
 @Override protected void onResume(){super.onResume();resumed=true;captureIfFocused();}
 @Override protected void onPause(){resumed=false;super.onPause();}
 @Override public void onWindowFocusChanged(boolean focus){super.onWindowFocusChanged(focus);if(focus)captureIfFocused();}
 private void captureIfFocused(){if(readsClipboard()&&resumed&&hasWindowFocus()&&!attempted)root.post(()->{if(resumed&&hasWindowFocus())capture();});}
 private void capture(){
  if(attempted||isFinishing())return;attempted=true;
  try{
   String text;
   if(readsClipboard())text=ClipboardCapture.read(getSystemService(ClipboardManager.class));
   else{
    Intent intent=getIntent();CharSequence selected=CaptureInput.PROCESS.equals(intent.getAction())?intent.getCharSequenceExtra(Intent.EXTRA_PROCESS_TEXT):intent.getCharSequenceExtra(Intent.EXTRA_TEXT);
    text=CaptureInput.parse(intent.getAction(),selected);
   }
   try(TaskRepository repo=new TaskRepository(this)){savedId=repo.capture(text,delivery);}
   try{QueueScheduler.enqueue(this);}catch(Exception ignored){/* Already durable; opening the app resumes the queue. */}
   showSaved();
  }catch(Exception e){
   Toast.makeText(this,e instanceof IllegalArgumentException?e.getMessage():"Не удалось сохранить задачу. Проверьте свободное место и повторите.",Toast.LENGTH_LONG).show();finish();
  }
 }
 private void showSaved(){if(isFinishing())return;root.removeAllViews();SuccessView success=new SuccessView(this);root.addView(success,new FrameLayout.LayoutParams(-1,-1));success.showSaved(this::finish);}
 @Override protected void onSaveInstanceState(Bundle out){out.putString("delivery",delivery);out.putString("saved_id",savedId);super.onSaveInstanceState(out);}
}
