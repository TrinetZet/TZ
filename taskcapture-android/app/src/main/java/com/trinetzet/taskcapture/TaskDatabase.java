package com.trinetzet.taskcapture;
import android.content.Context;
import android.database.sqlite.*;
public final class TaskDatabase extends SQLiteOpenHelper {
 public TaskDatabase(Context c){super(c,"tasks.db",null,2);}
 @Override public void onCreate(SQLiteDatabase db){
  db.execSQL("CREATE TABLE tasks(id TEXT PRIMARY KEY,delivery TEXT NOT NULL UNIQUE,title TEXT NOT NULL,description TEXT NOT NULL,source TEXT NOT NULL,state TEXT NOT NULL DEFAULT 'pending',error TEXT NOT NULL DEFAULT '',created INTEGER NOT NULL,attempts INTEGER NOT NULL DEFAULT 0,claim TEXT NOT NULL DEFAULT '',status TEXT NOT NULL DEFAULT 'backlog')");
  db.execSQL("CREATE INDEX queue_order ON tasks(state,created)");
 }
 @Override public void onUpgrade(SQLiteDatabase db,int oldVersion,int newVersion){if(oldVersion<2)db.execSQL("ALTER TABLE tasks ADD COLUMN status TEXT NOT NULL DEFAULT 'backlog'");}
}
