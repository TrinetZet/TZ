package com.trinetzet.taskcapture;
import android.app.*;
import android.content.*;
import android.net.Uri;
import android.os.Bundle;
import android.widget.Toast;
import java.io.*;
import java.util.concurrent.*;
public final class ExportController {
 private static final int SAVE_REQUEST=402;
 private final Activity activity;private final Context app;
 private final ExecutorService executor=Executors.newSingleThreadExecutor();
 private File pending;private boolean busy,closed;
 public ExportController(Activity a){activity=a;app=a.getApplicationContext();}
 public void restore(Bundle state){
  if(state==null)return;String name=state.getString("export_snapshot");
  if(name!=null&&name.matches("TaskCapture-[a-f0-9-]{36}\\.md")){
   File file=new File(new File(app.getCacheDir(),"exports"),name);if(file.isFile())pending=file;
  }
 }
 public void saveState(Bundle state){if(pending!=null)state.putString("export_snapshot",pending.getName());}
 public void close(){closed=true;executor.shutdown();}
 private void message(String text){if(!closed)Toast.makeText(activity,text,Toast.LENGTH_LONG).show();}
 public void showOptions(){
  if(busy){message("Экспорт готовится…");return;}
  new AlertDialog.Builder(activity).setTitle("Экспорт всех задач")
   .setItems(new String[]{"Поделиться .md","Сохранить .md"},(d,which)->prepare(which==0)).setNegativeButton("Отмена",null).show();
 }
 private void prepare(boolean share){
  busy=true;message("Готовлю Markdown со всеми задачами…");
  executor.execute(()->{
   File file=null;try(TaskRepository repo=new TaskRepository(app)){file=ExportFiles.writeSnapshot(app,MarkdownExporter.render(repo.exportSnapshot(),System.currentTimeMillis()));}catch(Exception ignored){}
   File snapshot=file;activity.runOnUiThread(()->{
    busy=false;if(closed||activity.isFinishing())return;
    if(snapshot==null){message("Не удалось подготовить файл. Проверьте свободное место.");return;}
    if(share)share(snapshot);else{
     pending=snapshot;
     Intent intent=new Intent(Intent.ACTION_CREATE_DOCUMENT).addCategory(Intent.CATEGORY_OPENABLE).setType("text/markdown").putExtra(Intent.EXTRA_TITLE,"TaskCapture-"+new java.text.SimpleDateFormat("yyyy-MM-dd",java.util.Locale.ROOT).format(new java.util.Date())+".md");
     try{activity.startActivityForResult(intent,SAVE_REQUEST);}catch(ActivityNotFoundException e){message("Выбор места сохранения недоступен. Используйте «Поделиться».");}
    }
   });
  });
 }
 private void share(File file){
  Intent send=ExportFiles.shareIntent(activity,file,"text/markdown");
  if(activity.getPackageManager().queryIntentActivities(send,0).isEmpty())send.setType("text/plain");
  try{activity.startActivity(Intent.createChooser(send,"Отправить задачи"));}catch(ActivityNotFoundException e){message("Нет приложений для отправки файла. Используйте «Сохранить .md».");}
 }
 public boolean onActivityResult(int request,int result,Intent data){
  if(request!=SAVE_REQUEST)return false;
  if(result!=Activity.RESULT_OK){pending=null;return true;}
  File snapshot=pending;pending=null;Uri uri=data==null?null:data.getData();
  if(snapshot==null||uri==null){message("Не удалось сохранить файл. Повторите экспорт.");return true;}
  busy=true;executor.execute(()->{
   boolean ok=false;
   try(InputStream in=new FileInputStream(snapshot);OutputStream out=app.getContentResolver().openOutputStream(uri,"wt")){
    if(out==null)throw new IOException("export_destination");byte[] buffer=new byte[16384];int n;while((n=in.read(buffer))!=-1)out.write(buffer,0,n);out.flush();ok=true;
   }catch(Exception ignored){}
   boolean saved=ok;activity.runOnUiThread(()->{busy=false;message(saved?"Markdown сохранён":"Не удалось сохранить файл. Проверьте место и доступ к папке.");});
  });return true;
 }
}
