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
import java.io.*;
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
 @Test public void exportUriContainsReadGrantAndOnlyExportsAreShared()throws Exception{
  Class<?> files=feature("ExportFiles");
  File file=(File)files.getMethod("writeSnapshot",Context.class,String.class).invoke(null,c,"# TaskCapture\n\nКириллица 🐶");
  Intent send=(Intent)files.getMethod("shareIntent",Context.class,File.class,String.class).invoke(null,c,file,"text/markdown");
  assertEquals(Intent.ACTION_SEND,send.getAction());assertEquals("text/markdown",send.getType());
  assertTrue((send.getFlags()&Intent.FLAG_GRANT_READ_URI_PERMISSION)!=0);assertNotNull(send.getClipData());
  Uri uri=send.getParcelableExtra(Intent.EXTRA_STREAM);assertNotNull(uri);assertEquals("content",uri.getScheme());
  try(InputStream in=c.getContentResolver().openInputStream(uri)){assertEquals("# TaskCapture\n\nКириллица 🐶",new String(in.readAllBytes(),java.nio.charset.StandardCharsets.UTF_8));}
  try{files.getMethod("shareIntent",Context.class,File.class,String.class).invoke(null,c,c.getDatabasePath("tasks.db"),"text/markdown");fail("Database shared");}catch(InvocationTargetException e){assertTrue(e.getCause() instanceof IllegalArgumentException);}
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
 @Test public void focusedClipboardCaptureSurvivesRecreation()throws Exception{
  try(ActivityScenario<MainActivity> main=ActivityScenario.launch(MainActivity.class)){
   main.onActivity(a->a.getSystemService(ClipboardManager.class).setPrimaryClip(ClipData.newPlainText("fixture","Проверить список дел")));
   try(ActivityScenario<?> capture=ActivityScenario.launch(new Intent(c,feature("ClipboardActivity")))){
    waitForCaptured();capture.onActivity(a->assertTrue("Saved confirmation missing",containsView(a.getWindow().getDecorView(),SuccessView.class)));
    capture.recreate();try(TaskRepository r=new TaskRepository(c)){assertEquals(1,r.list().size());assertEquals("Проверить список дел",r.get(r.list().get(0).id).source);}
   }
  }
  waitUntilProcessed();
 }
 @Test public void quickSettingsTileCreatesTaskWithoutConfirmation()throws Exception{
  UiDevice d=UiDevice.getInstance(InstrumentationRegistry.getInstrumentation());String component=new ComponentName(c,feature("TaskTileService")).flattenToString();String oldTiles=d.executeShellCommand("settings get secure sysui_qs_tiles").trim();
  try(ActivityScenario<MainActivity> main=ActivityScenario.launch(MainActivity.class)){
   main.onActivity(a->a.getSystemService(ClipboardManager.class).setPrimaryClip(ClipData.newPlainText("fixture","Подготовить список покупок")));
   d.executeShellCommand("cmd statusbar set-tiles custom("+component+")");d.executeShellCommand("cmd statusbar expand-settings");
   assertTrue("TC tile did not bind visibly",d.wait(Until.hasObject(By.text("TC")),10000));d.findObject(By.text("TC")).click();
   waitForCaptured();
   try(TaskRepository r=new TaskRepository(c)){assertEquals(1,r.list().size());assertEquals("Подготовить список покупок",r.get(r.list().get(0).id).source);}
  }finally{d.executeShellCommand("cmd statusbar collapse");d.executeShellCommand("cmd statusbar set-tiles "+oldTiles);}
  waitUntilProcessed();
 }
 private void waitUntilProcessed(){
  long end=android.os.SystemClock.elapsedRealtime()+180000;
  while(android.os.SystemClock.elapsedRealtime()<end){try(TaskRepository r=new TaskRepository(c)){if(!r.list().isEmpty()){String state=r.list().get(0).state;if(state.equals("ready")||state.equals("error"))return;}}android.os.SystemClock.sleep(250);}
  fail("Worker did not settle after capture");
 }
 private void waitForCaptured(){long end=android.os.SystemClock.elapsedRealtime()+10000;while(android.os.SystemClock.elapsedRealtime()<end){try(TaskRepository r=new TaskRepository(c)){if(r.list().size()==1)return;}android.os.SystemClock.sleep(25);}fail("Clipboard task was not saved");}
 private static boolean containsView(android.view.View view,Class<?> type){if(type.isInstance(view))return true;if(view instanceof android.view.ViewGroup){android.view.ViewGroup group=(android.view.ViewGroup)view;for(int i=0;i<group.getChildCount();i++)if(containsView(group.getChildAt(i),type))return true;}return false;}
 @Test public void readingPositionSurvivesRecreation()throws Exception{
  try(TaskRepository r=new TaskRepository(c)){for(int i=0;i<30;i++){r.capture("Scroll fixture "+i,"scroll"+i);r.complete(r.claimNext(),new NormalizedTask("Scroll fixture "+i,"Описание"));}}
  try(ActivityScenario<MainActivity> main=ActivityScenario.launch(MainActivity.class)){
   main.onActivity(a->((android.widget.ListView)a.findViewById(R.id.task_list)).setSelectionFromTop(12,0));
   UiDevice.getInstance(InstrumentationRegistry.getInstrumentation()).waitForIdle();main.recreate();UiDevice.getInstance(InstrumentationRegistry.getInstrumentation()).waitForIdle();
   main.onActivity(a->assertEquals(12,((android.widget.ListView)a.findViewById(R.id.task_list)).getFirstVisiblePosition()));
  }
  String id;try(TaskRepository r=new TaskRepository(c)){id=r.capture("Длинный исходник\n".repeat(100),"long-scroll");r.complete(r.claimNext(),new NormalizedTask("Длинный исходник","Описание"));}
  try(ActivityScenario<TaskDetailActivity> detail=ActivityScenario.launch(new Intent(c,TaskDetailActivity.class).putExtra("id",id))){
   detail.onActivity(a->((android.widget.ScrollView)a.findViewById(R.id.detail_scroll)).scrollTo(0,500));
   UiDevice.getInstance(InstrumentationRegistry.getInstrumentation()).waitForIdle();detail.recreate();UiDevice.getInstance(InstrumentationRegistry.getInstrumentation()).waitForIdle();
   detail.onActivity(a->assertEquals(500,((android.widget.ScrollView)a.findViewById(R.id.detail_scroll)).getScrollY()));
  }
 }
 @Test public void shareFromDoneFilterReachesAnotherUidWithAllStatuses()throws Exception{
  try(TaskRepository r=new TaskRepository(c)){int i=0;for(String status:new String[]{"backlog","in_progress","done"}){String id=r.capture("Export fixture "+status,"share"+(i++));r.complete(r.claimNext(),new NormalizedTask("Export fixture "+status,"Описание"));r.setStatus(id,status);}}
  UiDevice d=UiDevice.getInstance(InstrumentationRegistry.getInstrumentation());
  try(ActivityScenario<MainActivity> main=ActivityScenario.launch(MainActivity.class)){
   UiObject2 rail=d.findObject(By.clazz(android.widget.HorizontalScrollView.class));rail.scroll(Direction.RIGHT,1f);
   d.findObject(By.desc("Фильтр: Выполнено")).click();d.findObject(By.desc("Экспорт всех задач")).click();
   assertTrue(d.wait(Until.hasObject(By.text("Поделиться .md")),5000));d.findObject(By.text("Поделиться .md")).click();
   assertTrue("Share receiver absent",d.wait(Until.hasObject(By.textContains("QA Markdown")),10000));d.findObject(By.textContains("QA Markdown")).click();
   assertTrue("URI grant failed across UID",d.wait(Until.hasObject(By.desc("Markdown получен")),10000));String md=d.findObject(By.desc("Markdown получен")).getText();
   for(String status:new String[]{"backlog","in_progress","done"})assertTrue("Filter omitted "+status,md.contains("Export fixture "+status));
   d.pressBack();
  }
 }
 @Test public void restoredDocumentSnapshotIsWrittenToSelectedUri()throws Exception{
  File snapshot=ExportFiles.writeSnapshot(c,"# TaskCapture\n\nСнимок до поворота 🐶");File destination=ExportFiles.writeSnapshot(c,"");
  Uri target=ExportFiles.shareIntent(c,destination,"text/markdown").getParcelableExtra(Intent.EXTRA_STREAM);
  java.util.concurrent.atomic.AtomicReference<ExportController> controller=new java.util.concurrent.atomic.AtomicReference<>();
  try(ActivityScenario<MainActivity> main=ActivityScenario.launch(MainActivity.class)){
   main.onActivity(a->{ExportController export=new ExportController(a);android.os.Bundle saved=new android.os.Bundle();saved.putString("export_snapshot",snapshot.getName());export.restore(saved);controller.set(export);assertTrue(export.onActivityResult(402,android.app.Activity.RESULT_OK,new Intent().setData(target)));});
   long end=android.os.SystemClock.elapsedRealtime()+5000;String content="";
   while(android.os.SystemClock.elapsedRealtime()<end){try(InputStream in=new FileInputStream(destination)){content=new String(in.readAllBytes(),java.nio.charset.StandardCharsets.UTF_8);}if(content.contains("Снимок до поворота"))break;android.os.SystemClock.sleep(100);}
   assertEquals("# TaskCapture\n\nСнимок до поворота 🐶",content);main.onActivity(a->controller.get().close());
  }
 }
}
