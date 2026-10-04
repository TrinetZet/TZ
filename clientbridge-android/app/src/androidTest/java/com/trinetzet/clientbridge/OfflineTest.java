package com.trinetzet.clientbridge;

import android.content.ClipboardManager;
import android.content.Context;
import android.graphics.Bitmap;
import android.webkit.WebView;
import androidx.test.core.app.ActivityScenario;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.platform.app.InstrumentationRegistry;
import androidx.test.uiautomator.*;
import org.json.*;
import org.junit.Test;
import org.junit.runner.RunWith;
import java.io.File;
import java.io.FileOutputStream;
import java.util.concurrent.*;
import static org.junit.Assert.*;

@RunWith(AndroidJUnit4.class)
public class OfflineTest {
 private ActivityScenario<MainActivity> scenario;
 private WebView web;
 private final UiDevice device=UiDevice.getInstance(InstrumentationRegistry.getInstrumentation());
 private String js(String code) throws Exception {
  CountDownLatch latch=new CountDownLatch(1);String[] result={null};
  InstrumentationRegistry.getInstrumentation().runOnMainSync(()->{
   MainActivity active=null;for(android.app.Activity a:androidx.test.runner.lifecycle.ActivityLifecycleMonitorRegistry.getInstance().getActivitiesInStage(androidx.test.runner.lifecycle.Stage.RESUMED))if(a instanceof MainActivity)active=(MainActivity)a;
   if(active==null){result[0]="false";latch.countDown();return;}
   android.view.ViewGroup content=active.findViewById(android.R.id.content);web=(WebView)((android.view.ViewGroup)content.getChildAt(0)).getChildAt(0);
   web.evaluateJavascript(code,r->{result[0]=r;latch.countDown();});
  });
  assertTrue("JavaScript callback",latch.await(10,TimeUnit.SECONDS));return result[0];
 }
 private void open() throws Exception {
  scenario=ActivityScenario.launch(MainActivity.class);
  scenario.onActivity(a->{android.view.ViewGroup content=a.findViewById(android.R.id.content);android.view.ViewGroup root=(android.view.ViewGroup)content.getChildAt(0);web=(WebView)root.getChildAt(0);});
  waitFor("document.querySelector('[data-start]')!==null");
 }
 private void waitFor(String condition) throws Exception {long until=System.currentTimeMillis()+45000;do{if("true".equals(js("Boolean("+condition+")")))return;Thread.sleep(150);}while(System.currentTimeMillis()<until);fail("Timed out: "+condition+"; "+js("document.body.innerText"));}
 private void click(String selector) throws Exception {waitFor("document.querySelector("+JSONObject.quote(selector)+")!==null");js("document.querySelector("+JSONObject.quote(selector)+").click()");}
 private void touch(String selector) throws Exception {
  js("document.querySelector("+JSONObject.quote(selector)+").scrollIntoView({block:'center'})");Thread.sleep(500);
  JSONObject rect=new JSONObject(js("(()=>{const r=document.querySelector("+JSONObject.quote(selector)+").getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2,scale:devicePixelRatio};})()"));
  int[] offset=new int[2];InstrumentationRegistry.getInstrumentation().runOnMainSync(()->web.getLocationOnScreen(offset));
  device.click(offset[0]+(int)(rect.getDouble("x")*rect.getDouble("scale")),offset[1]+(int)(rect.getDouble("y")*rect.getDouble("scale")));
 }
 private void route(String hash,String selector) throws Exception {js("location.hash="+JSONObject.quote(hash));waitFor("document.querySelector("+JSONObject.quote(selector)+")!==null");}
 private void shot(String name) throws Exception {Thread.sleep(700);Bitmap bitmap=InstrumentationRegistry.getInstrumentation().getUiAutomation().takeScreenshot();File dir=new File(InstrumentationRegistry.getInstrumentation().getTargetContext().getExternalFilesDir(null),"screenshots");dir.mkdirs();try(FileOutputStream out=new FileOutputStream(new File(dir,name+".png"))){bitmap.compress(Bitmap.CompressFormat.PNG,100,out);}bitmap.recycle();}
 private UiObject2 findText(String text) {return device.wait(Until.findObject(By.text(text)),10000);}
 private void saveDocument(String name) throws Exception {
  assertNotNull("System save chooser",device.wait(Until.findObject(By.pkg("com.google.android.documentsui").depth(0)),10000));
  UiObject2 field=device.wait(Until.findObject(By.res("com.google.android.documentsui","title")),3000);
  if(field==null)field=device.wait(Until.findObject(By.clazz("android.widget.EditText")),3000);
  assertNotNull("Save filename",field);field.setText(name);
  UiObject2 save=device.wait(Until.findObject(By.text("SAVE")),5000);if(save==null)save=device.wait(Until.findObject(By.text("Save")),3000);assertNotNull("Save action",save);save.click();
  waitFor("document.querySelector('#toast').textContent.includes('File saved')");
 }
 @Test public void learningAndNativeFiles() throws Exception {
  open();js("localStorage.clear();location.reload()");waitFor("document.querySelector('[data-start]')!==null");shot("01-practice");
  js("window.testResult='running';(async()=>{try{const {difficulties,missionsFor}=await import('https://appassets.androidplatform.net/assets/clientbridge/curriculum.mjs');const {phrases}=await import('https://appassets.androidplatform.net/assets/clientbridge/scenarios.mjs');if(difficulties.length!==3||missionsFor('expert').length!==12||phrases.length!==36)throw Error('catalog');const tick=()=>new Promise(r=>setTimeout(r,80));for(const level of difficulties){location.hash='practice';await tick();document.querySelector('[data-difficulty='+level.id+']').click();await tick();for(const s of missionsFor(level.id)){location.hash='practice';await tick();document.querySelector('.card-start[data-start=\"'+s.id+'\"]').click();await tick();for(let i=0;i<3;i++){const best=s.steps[i].choices.findIndex(c=>c.score.every(n=>n===3));document.querySelector('[data-choice=\"'+best+'\"]').click();await tick();if(!document.querySelector('.feedback').textContent.includes('9 / 9'))throw Error('feedback');document.querySelector('[data-continue]').click();await tick();}if(document.querySelector('.score-inner strong').textContent!=='100%')throw Error('score');}}window.testResult='ok';}catch(e){window.testResult=e.message;}})()");
  waitFor("window.testResult!=='running'");assertEquals("\"ok\"",js("window.testResult"));shot("02-results");
  route("flashcards","[data-session]");click("[data-session]");for(int i=0;i<8;i++){click("[data-reveal]");click("[data-rating='good']");}waitFor("document.body.textContent.includes('SESSION COMPLETE')");
  assertEquals("8",js("Object.keys(JSON.parse(localStorage.getItem('clientbridge.progress.v1')).reviews).length"));
  route("emails","#client-email");js("const area=document.querySelector('#client-email');area.value='ClientBridge native email — offline test';area.dispatchEvent(new Event('input',{bubbles:true}))");click("[data-copy]");waitFor("document.querySelector('#toast').textContent.includes('Email copied')");
  Context ctx=InstrumentationRegistry.getInstrumentation().getTargetContext();String[] clip={null};InstrumentationRegistry.getInstrumentation().runOnMainSync(()->{ClipboardManager c=(ClipboardManager)ctx.getSystemService(Context.CLIPBOARD_SERVICE);clip[0]=c.getPrimaryClip().getItemAt(0).getText().toString();});assertEquals("ClientBridge native email — offline test",clip[0]);shot("03-email");
  device.executeShellCommand("settings put global always_finish_activities 1");
  click("[data-download]");saveDocument("clientbridge-native-test.txt");assertEquals("ClientBridge native email — offline test",device.executeShellCommand("cat /sdcard/Download/clientbridge-native-test.txt"));
  device.executeShellCommand("settings put global always_finish_activities 0");
  route("progress","[data-export]");assertEquals("12",js("JSON.parse(localStorage.getItem('clientbridge.progress.v1')).levels.expert.history.length"));click("[data-export]");saveDocument("clientbridge-progress.json");assertEquals(12,new JSONObject(device.executeShellCommand("cat /sdcard/Download/clientbridge-progress.json")).getJSONObject("levels").getJSONObject("expert").getJSONArray("history").length());
  click("[data-export]");device.wait(Until.hasObject(By.pkg("com.google.android.documentsui")),10000);device.pressBack();waitFor("document.querySelector('#toast').textContent.includes('cancelled')");
  click("[data-reset]");click("#reset-confirm");waitFor("document.querySelector('#rail-fraction').textContent==='0 / 12'");route("progress","[data-import]");device.executeShellCommand("settings put global always_finish_activities 1");touch("[data-import]");assertTrue("System import chooser",device.wait(Until.hasObject(By.pkg("com.google.android.documentsui")),10000));
  UiObject2 file=findText("clientbridge-progress.json");if(file==null){UiObject2 menu=device.wait(Until.findObject(By.desc("Show roots")),3000);if(menu!=null){menu.click();UiObject2 downloads=findText("Downloads");if(downloads!=null)downloads.click();}file=findText("clientbridge-progress.json");}if(file==null)shot("04-picker-failure");assertNotNull("Real JSON document in picker",file);file.click();waitFor("document.querySelector('#import-dialog').open");device.executeShellCommand("settings put global always_finish_activities 0");click("#import-confirm");waitFor("document.querySelector('.history-row')!==null");assertEquals("12",js("JSON.parse(localStorage.getItem('clientbridge.progress.v1')).levels.expert.history.length"));shot("04-progress-restored");
  route("emails","#client-email");assertEquals("\"ClientBridge native email — offline test\"",js("document.querySelector('#client-email').value"));
  touch("#client-email");assertTrue("Android keyboard",device.wait(Until.hasObject(By.pkg("com.google.android.inputmethod.latin")),10000));device.pressBack();route("phrasebook","#phrase-search");device.pressBack();waitFor("location.hash==='#emails'");
  assertEquals("false",js("document.documentElement.scrollWidth>innerWidth"));
  assertEquals("null",js("document.querySelector('iframe')"));scenario.close();
 }
 @Test public void persistedAfterForceStop() throws Exception {
  open();assertEquals("12",js("JSON.parse(localStorage.getItem('clientbridge.progress.v1')).levels.expert.history.length"));route("emails","#client-email");assertEquals("\"ClientBridge native email — offline test\"",js("document.querySelector('#client-email').value"));shot("05-restarted");route("progress","[data-export]");click("[data-export]");assertTrue("Abandoned save does not block new export",device.wait(Until.hasObject(By.pkg("com.google.android.documentsui")),10000));device.pressBack();waitFor("document.querySelector('#toast').textContent.includes('cancelled')");scenario.close();
 }
}
