package com.trinetzet.taskcapture;
import android.content.*;
import android.os.SystemClock;
import androidx.test.core.app.*;
import androidx.test.platform.app.InstrumentationRegistry;
import androidx.test.uiautomator.*;
import org.junit.Test;
import static org.junit.Assert.*;
public class VisualTest {
 @Test public void glassScreensWithMotionAndLargeText()throws Exception{
  Context c=ApplicationProvider.getApplicationContext();UiDevice d=UiDevice.getInstance(InstrumentationRegistry.getInstrumentation());c.deleteDatabase("tasks.db");
  d.executeShellCommand("mkdir -p /sdcard/Download/taskcapture-qa");
  String first;
  try(TaskRepository r=new TaskRepository(c)){
   first=r.capture("Подготовить презентацию для команды","visual1");r.complete(r.claimNext(),new NormalizedTask("Подготовить презентацию","Собрать результаты проекта и показать следующие шаги команде."));
   String second=r.capture("Позвонить Кате и согласовать расписание занятий","visual2");r.complete(r.claimNext(),new NormalizedTask("Согласовать расписание с Катей","Обсудить время занятий на следующую неделю."));r.setStatus(second,"in_progress");
   String third=r.capture("Проверить отчёт по проекту","visual3");r.complete(r.claimNext(),new NormalizedTask("Проверить отчёт","Проверить результаты и финальные показатели."));r.setStatus(third,"done");
  }
  try(ActivityScenario<MainActivity> main=ActivityScenario.launch(MainActivity.class)){
   assertTrue(d.wait(Until.hasObject(By.text("TaskCapture")),5000));d.waitForIdle();shot(d,"main");
   d.findObject(By.text("Подготовить презентацию")).click();assertTrue(d.wait(Until.hasObject(By.desc("Изменить статус задачи")),5000));d.waitForIdle();shot(d,"detail");d.pressBack();
   d.executeShellCommand("settings put system font_scale 1.3");SystemClock.sleep(500);d.waitForIdle();shot(d,"large-text");d.executeShellCommand("settings put system font_scale 1.0");
   d.executeShellCommand("wm size 1768x2208");SystemClock.sleep(500);d.waitForIdle();shot(d,"wide");d.executeShellCommand("wm size reset");SystemClock.sleep(500);
   d.setOrientationLeft();SystemClock.sleep(500);d.waitForIdle();
   main.onActivity(a->{android.widget.ListView list=a.findViewById(R.id.task_list);assertTrue("Task viewport lost in landscape",list.getHeight()>GlassUi.dp(a,80));});shot(d,"landscape");d.setOrientationNatural();
  }finally{d.setOrientationNatural();d.unfreezeRotation();d.executeShellCommand("settings put system font_scale 1.0");d.executeShellCommand("wm size reset");}
  // UIAutomator waits for idle and can miss this deliberately short-lived overlay.
  // Copy its actual window after the first rendered confirmation frame, before auto-dismiss.
  java.util.concurrent.CountDownLatch copied=new java.util.concurrent.CountDownLatch(1);
  java.util.concurrent.atomic.AtomicReference<Throwable> failure=new java.util.concurrent.atomic.AtomicReference<>();
  try(ActivityScenario<CaptureActivity> capture=ActivityScenario.launch(new Intent(c,CaptureActivity.class).setAction(CaptureInput.SEND).setType("text/plain").putExtra(Intent.EXTRA_TEXT,"Созвониться с командой завтра"))){
   capture.onActivity(a->{
    android.view.View decor=a.getWindow().getDecorView();
    decor.getViewTreeObserver().addOnPreDrawListener(new android.view.ViewTreeObserver.OnPreDrawListener(){
     public boolean onPreDraw(){
      if(!hasSuccess(decor)||decor.getWidth()==0||decor.getHeight()==0)return true;
      decor.getViewTreeObserver().removeOnPreDrawListener(this);
      decor.postDelayed(()->{
       try{
        android.graphics.Bitmap bitmap=android.graphics.Bitmap.createBitmap(decor.getWidth(),decor.getHeight(),android.graphics.Bitmap.Config.ARGB_8888);
        android.view.PixelCopy.request(a.getWindow(),bitmap,result->{
         try{assertEquals("Confirmation window copy failed",android.view.PixelCopy.SUCCESS,result);java.io.File file=new java.io.File(c.getExternalFilesDir("qa"),"capture.png");try(java.io.FileOutputStream out=new java.io.FileOutputStream(file)){assertTrue(bitmap.compress(android.graphics.Bitmap.CompressFormat.PNG,100,out));}}
         catch(Throwable e){failure.set(e);}finally{bitmap.recycle();copied.countDown();}
        },new android.os.Handler(android.os.Looper.getMainLooper()));
       }catch(Throwable e){failure.set(e);copied.countDown();}
      },500);
      return true;
     }
    });decor.invalidate();
   });
   assertTrue("No rendered capture confirmation",copied.await(5,java.util.concurrent.TimeUnit.SECONDS));
   if(failure.get()!=null)throw new AssertionError("Capture screenshot failed",failure.get());
   d.executeShellCommand("cp "+new java.io.File(c.getExternalFilesDir("qa"),"capture.png").getAbsolutePath()+" /sdcard/Download/taskcapture-qa/capture.png");
  }
 }
 private static boolean hasSuccess(android.view.View view){if(view instanceof SuccessView)return true;if(view instanceof android.view.ViewGroup group)for(int i=0;i<group.getChildCount();i++)if(hasSuccess(group.getChildAt(i)))return true;return false;}
 private void shot(UiDevice d,String name)throws Exception{d.executeShellCommand("screencap -p /sdcard/Download/taskcapture-qa/"+name+".png");}
}
