package com.trinetzet.taskcapture;
import android.content.Context;
import android.database.sqlite.*;
public final class TaskDatabase extends SQLiteOpenHelper {
 public TaskDatabase(Context c){super(c,"tasks.db",null,1);}
 @Override public void onCreate(SQLiteDatabase db){
  db.execSQL("CREATE TABLE tasks(id TEXT PRIMARY KEY,delivery TEXT NOT NULL UNIQUE,title TEXT NOT NULL,description TEXT NOT NULL,source TEXT NOT NULL,state TEXT NOT NULL DEFAULT 'pending',error TEXT NOT NULL DEFAULT '',created INTEGER NOT NULL,attempts INTEGER NOT NULL DEFAULT 0)");
  db.execSQL("CREATE INDEX queue_order ON tasks(state,created)");
 }
 @Override public void onUpgrade(SQLiteDatabase db,int oldVersion,int newVersion){throw new IllegalStateException("Unsupported database version");}
}
