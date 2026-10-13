package com.trinetzet.taskcapture;
import android.content.*;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import java.util.*;
public final class TaskRepository implements AutoCloseable {
 private final TaskDatabase helper;
 public TaskRepository(Context c){helper=new TaskDatabase(c.getApplicationContext());}
 public String capture(String raw,String delivery){
  String text=CaptureInput.parse(CaptureInput.SEND,raw);
  if(delivery==null||delivery.isEmpty())throw new IllegalArgumentException("delivery");
  SQLiteDatabase db=helper.getWritableDatabase();db.beginTransaction();
  try {
   ContentValues v=new ContentValues();v.put("id",UUID.randomUUID().toString());v.put("delivery",delivery);
   int end=text.offsetByCodePoints(0,Math.min(100,text.codePointCount(0,text.length())));
   v.put("title",text.substring(0,end));v.put("description","");v.put("source",text);v.put("created",System.currentTimeMillis());
   db.insertWithOnConflict("tasks",null,v,SQLiteDatabase.CONFLICT_IGNORE);
   String id;
   try(Cursor cur=db.rawQuery("SELECT id FROM tasks WHERE delivery=?",new String[]{delivery})){
    if(!cur.moveToFirst())throw new IllegalStateException("capture_not_saved");id=cur.getString(0);
   }
   db.setTransactionSuccessful();return id;
  }finally{db.endTransaction();}
 }
 private Task read(Cursor c){return new Task(c.getString(0),c.getString(1),c.getString(2),c.getString(3),c.getString(4),c.getString(5),c.getLong(6),c.getString(7),c.getString(8));}
 public Task get(String id){
  try(Cursor c=helper.getReadableDatabase().rawQuery("SELECT id,title,description,source,state,error,created,claim,status FROM tasks WHERE id=?",new String[]{id})){return c.moveToFirst()?read(c):null;}
 }
 public List<Task> list(){
  List<Task> out=new ArrayList<>();
  try(Cursor c=helper.getReadableDatabase().rawQuery("SELECT id,title,description,'' AS source,state,error,created,claim,status FROM tasks ORDER BY created DESC,rowid DESC",null)){while(c.moveToNext())out.add(read(c));}
  return out;
 }
 // All callers belong to the same serialized unique WorkManager chain.
 public Task claimNext(){
  SQLiteDatabase db=helper.getWritableDatabase();db.beginTransaction();
  try {
   db.execSQL("UPDATE tasks SET state='pending',claim='' WHERE state='processing'");
   String id=null;
   try(Cursor c=db.rawQuery("SELECT id FROM tasks WHERE state='pending' ORDER BY created,rowid LIMIT 1",null)){if(c.moveToFirst())id=c.getString(0);}
   if(id==null){db.setTransactionSuccessful();return null;}
   db.execSQL("UPDATE tasks SET state='processing',attempts=attempts+1,error='',claim=? WHERE id=?",new Object[]{UUID.randomUUID().toString(),id});
   Task task=get(id);db.setTransactionSuccessful();return task;
  }finally{db.endTransaction();}
 }
 public void complete(Task task,NormalizedTask n){
  Task current=get(task.id);if(current==null||!ClaimGuard.allowed(task.claim,current.claim))return;
  ContentValues v=new ContentValues();v.put("title",n.title);v.put("description",n.description);v.put("state","ready");v.put("error","");
  helper.getWritableDatabase().update("tasks",v,"id=? AND state='processing' AND claim=?",new String[]{task.id,task.claim});
 }
 public void fail(Task task,String code){
  Task current=get(task.id);if(current==null||!ClaimGuard.allowed(task.claim,current.claim))return;
  ContentValues v=new ContentValues();v.put("state","error");v.put("error",code);
  helper.getWritableDatabase().update("tasks",v,"id=? AND state='processing' AND claim=?",new String[]{task.id,task.claim});
 }
 public void retry(String id){
  ContentValues v=new ContentValues();v.put("state","pending");v.put("error","");v.put("attempts",0);v.put("claim","");
  helper.getWritableDatabase().update("tasks",v,"id=? AND state='error'",new String[]{id});
 }
 public boolean setStatus(String id,String status){
  ContentValues v=new ContentValues();v.put("status",TaskStatus.requireValid(status));
  return helper.getWritableDatabase().update("tasks",v,"id=?",new String[]{id})==1;
 }
 public List<Task> exportSnapshot(){
  SQLiteDatabase db=helper.getReadableDatabase();db.beginTransactionNonExclusive();
  try{List<Task> out=new ArrayList<>();
   try(Cursor c=db.rawQuery("SELECT id,title,description,source,state,error,created,claim,status FROM tasks ORDER BY created DESC,rowid DESC",null)){while(c.moveToNext())out.add(read(c));}
   db.setTransactionSuccessful();return out;
  }finally{db.endTransaction();}
 }
 @Override public void close(){helper.close();}
}
