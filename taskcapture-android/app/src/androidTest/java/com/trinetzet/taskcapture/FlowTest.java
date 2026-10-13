package com.trinetzet.taskcapture;
import android.content.*;
import android.os.SystemClock;
import android.content.pm.PackageManager;
import androidx.test.core.app.ApplicationProvider;
import androidx.test.platform.app.InstrumentationRegistry;
import androidx.test.uiautomator.*;
import org.junit.Test;
import static org.junit.Assert.*;
public class FlowTest {
 @Test public void offlineSelectedTextAndShareReachBacklog()throws Exception {
  Context c=ApplicationProvider.getApplicationContext();c.deleteDatabase("tasks.db");
  String[] permissions=c.getPackageManager().getPackageInfo(c.getPackageName(),PackageManager.GET_PERMISSIONS).requestedPermissions;
  if(permissions!=null)for(String p:permissions)assertNotEquals("android.permission.INTERNET",p);
  Intent selected=new Intent(CaptureInput.PROCESS).setClass(c,CaptureActivity.class).setType("text/plain").putExtra(Intent.EXTRA_PROCESS_TEXT,"Позвонить Кате и согласовать расписание занятий.").addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
  c.startActivity(selected);
  Task first=waitFor(c,1);assertEquals("ready",first.state);assertFalse(first.title.isEmpty());assertFalse(first.description.isEmpty());assertEquals("Позвонить Кате и согласовать расписание занятий.",first.source);
  Intent share=new Intent(CaptureInput.SEND).setClass(c,CaptureActivity.class).setType("text/plain").putExtra(Intent.EXTRA_TEXT,"Подготовить отчёт по проекту.").addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
  c.startActivity(share);Task second=waitFor(c,2);assertEquals("ready",second.state);
  c.startActivity(new Intent(c,MainActivity.class).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK));
  UiDevice device=UiDevice.getInstance(InstrumentationRegistry.getInstrumentation());
  assertTrue(device.wait(Until.hasObject(By.text("TaskCapture")),10000));
  assertTrue(device.wait(Until.hasObject(By.textContains("БЭКЛОГ · 2")),10000));
  try(TaskRepository repo=new TaskRepository(c)){assertEquals(2,repo.list().size());}
 }
 private Task waitFor(Context c,int expected){
  long until=SystemClock.elapsedRealtime()+480000;
  while(SystemClock.elapsedRealtime()<until){
   try(TaskRepository repo=new TaskRepository(c)){
    if(repo.list().size()==expected){
     Task t=repo.get(repo.list().get(0).id);assertNotEquals("Processing error code: "+t.error,"error",t.state);
     if(t.state.equals("ready"))return t;
    }
   }
   SystemClock.sleep(1000);
  }
  throw new AssertionError("Capture/inference did not complete within 480 seconds");
 }
}
