package com.trinetzet.taskcapture;
import android.app.Activity;
import android.os.Bundle;
import android.content.Intent;
import android.widget.Toast;
import java.util.UUID;
public class CaptureActivity extends Activity {
 private String delivery;
 @Override protected void onCreate(Bundle state){
  super.onCreate(state);
  delivery=state==null?UUID.randomUUID().toString():state.getString("delivery",UUID.randomUUID().toString());
  try {
   Intent i=getIntent();
   CharSequence selected=CaptureInput.PROCESS.equals(i.getAction())?i.getCharSequenceExtra(Intent.EXTRA_PROCESS_TEXT):i.getCharSequenceExtra(Intent.EXTRA_TEXT);
   String text=CaptureInput.parse(i.getAction(),selected);
   try(TaskRepository repo=new TaskRepository(this)){repo.capture(text,delivery);}
   try{QueueScheduler.enqueue(this);}catch(Exception e){/* Text is durable; opening backlog reschedules. */}
   Toast.makeText(this,"Задача добавлена в бэклог",Toast.LENGTH_SHORT).show();
  }catch(Exception e){
   String message=e instanceof IllegalArgumentException?e.getMessage():"Не удалось сохранить задачу. Освободите место и повторите.";
   Toast.makeText(this,message,Toast.LENGTH_LONG).show();
  }
  finish();
 }
 @Override protected void onSaveInstanceState(Bundle out){out.putString("delivery",delivery);super.onSaveInstanceState(out);}
}
