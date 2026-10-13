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
  c.startActivity(new Intent(CaptureInput.SEND).setClass(c,CaptureActivity.class).setType("text/plain").putExtra(Intent.EXTRA_TEXT,"Созвониться с командой завтра").addFlags(Intent.FLAG_ACTIVITY_NEW_TASK));
  assertTrue(d.wait(Until.hasObject(By.text("Добавлено в бэклог")),5000));shot(d,"capture");
 }
 private void shot(UiDevice d,String name)throws Exception{d.executeShellCommand("screencap -p /sdcard/Download/taskcapture-qa/"+name+".png");}
}
