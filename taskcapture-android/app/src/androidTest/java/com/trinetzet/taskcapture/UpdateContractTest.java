package com.trinetzet.taskcapture;
import android.content.*;
import android.database.sqlite.SQLiteDatabase;
import android.net.Uri;
import androidx.test.core.app.*;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.platform.app.InstrumentationRegistry;
import androidx.test.uiautomator.*;
import org.junit.*;
import org.junit.runner.RunWith;
import java.lang.reflect.*;
import java.util.*;
import static org.junit.Assert.*;
@RunWith(AndroidJUnit4.class) public class UpdateContractTest {
 Context c;
 @Before public void setup(){c=ApplicationProvider.getApplicationContext();c.deleteDatabase("tasks.db");}
 static Class<?> feature(String n){try{return Class.forName("com.trinetzet.taskcapture."+n);}catch(Exception e){throw new AssertionError("Missing feature: "+n,e);}}
 static String status(Task t)throws Exception{return (String)Task.class.getField("status").get(t);}
 static void set(TaskRepository r,String id,String s)throws Exception{TaskRepository.class.getMethod("setStatus",String.class,String.class).invoke(r,id,s);}
 @Test public void migratesVersionOneWithoutLosingSource()throws Exception{
  try(SQLiteDatabase db=c.openOrCreateDatabase("tasks.db",0,null)){
   db.execSQL("CREATE TABLE tasks(id TEXT PRIMARY KEY,delivery TEXT NOT NULL UNIQUE,title TEXT NOT NULL,description TEXT NOT NULL,source TEXT NOT NULL,state TEXT NOT NULL DEFAULT 'pending',error TEXT NOT NULL DEFAULT '',created INTEGER NOT NULL,attempts INTEGER NOT NULL DEFAULT 0,claim TEXT NOT NULL DEFAULT '')");
   db.execSQL("INSERT INTO tasks(id,delivery,title,description,source,created) VALUES('legacy','legacy','Кате','','Источник 🐶',1)");db.setVersion(1);
  }
  try(TaskRepository r=new TaskRepository(c)){assertEquals(1,r.list().size());assertEquals("Источник 🐶",r.get("legacy").source);assertEquals("backlog",status(r.get("legacy")));}
 }
 @Test public void userStatusSurvivesInferenceAndRestart()throws Exception{
  String id;
  try(TaskRepository r=new TaskRepository(c)){id=r.capture("Проверить отчёт","status");Task job=r.claimNext();set(r,id,"done");r.complete(job,new NormalizedTask("Отчёт","Проверить"));assertEquals("done",status(r.get(id)));set(r,id,"in_progress");}
  try(TaskRepository r=new TaskRepository(c)){assertEquals("in_progress",status(r.get(id)));set(r,id,"backlog");assertEquals("backlog",status(r.get(id)));}
 }
 @Test public void clipboardRejectsNonTextAndEmpty()throws Exception{
  Method read=feature("ClipboardCapture").getMethod("readClip",ClipData.class);
  for(ClipData clip:new ClipData[]{ClipData.newPlainText("","  "),ClipData.newRawUri("",Uri.parse("content://example/image")),ClipData.newPlainText("","x".repeat(65537))}){
   try{read.invoke(null,clip);fail("Invalid clipboard accepted");}catch(InvocationTargetException e){assertTrue(e.getCause() instanceof IllegalArgumentException);}
  }
  assertEquals("Позвонить Кате 🐶",read.invoke(null,ClipData.newPlainText(""," Позвонить Кате 🐶 ")));
 }
 @Test public void tileAndExportAreDeclared()throws Exception{
  assertNotNull(c.getPackageManager().getServiceInfo(new ComponentName(c,feature("TaskTileService")),0));
  assertEquals("android.permission.BIND_QUICK_SETTINGS_TILE",c.getPackageManager().getServiceInfo(new ComponentName(c,feature("TaskTileService")),0).permission);
  android.content.pm.ProviderInfo provider=c.getPackageManager().resolveContentProvider(c.getPackageName()+".exports",0);
  assertNotNull(provider);assertFalse(provider.exported);assertTrue(provider.grantUriPermissions);
 }
 @Test public void canCompleteAndRestoreFromInterface()throws Exception{
  String id;try(TaskRepository r=new TaskRepository(c)){id=r.capture("UI fixture task","ui");r.complete(r.claimNext(),new NormalizedTask("UI fixture task","Описание"));}
  UiDevice d=UiDevice.getInstance(InstrumentationRegistry.getInstrumentation());
  try(ActivityScenario<MainActivity> s=ActivityScenario.launch(MainActivity.class)){
   assertTrue(d.wait(Until.hasObject(By.desc("Завершить задачу: UI fixture task")),5000));
   d.findObject(By.desc("Завершить задачу: UI fixture task")).click();
   assertTrue(d.wait(Until.hasObject(By.desc("Вернуть в бэклог: UI fixture task")),5000));
   try(TaskRepository r=new TaskRepository(c)){assertEquals("done",status(r.get(id)));}
   d.findObject(By.desc("Вернуть в бэклог: UI fixture task")).click();
   try(TaskRepository r=new TaskRepository(c)){assertEquals("backlog",status(r.get(id)));}
  }
 }
}
