package com.trinetzet.taskcapture;
import android.app.Activity;
import android.os.*;
import android.graphics.Color;
import android.widget.*;
public class TaskDetailActivity extends Activity {
 private TaskRepository repo;private String id;private final Handler timer=new Handler(Looper.getMainLooper());
 private TextView title,desc,status;private Button retry;
 private final Runnable refresh=new Runnable(){public void run(){reload();timer.postDelayed(this,2000);}};
 TextView text(String value,int size,int color){TextView t=new TextView(this);t.setText(value);t.setTextSize(size);t.setTextColor(color);t.setTextIsSelectable(true);t.setPadding(0,16,0,16);return t;}
 @Override public void onCreate(Bundle state){
  super.onCreate(state);repo=new TaskRepository(this);id=getIntent().getStringExtra("id");Task task=repo.get(id);if(task==null){finish();return;}
  ScrollView scroll=new ScrollView(this);LinearLayout content=new LinearLayout(this);content.setOrientation(LinearLayout.VERTICAL);int pad=(int)(24*getResources().getDisplayMetrics().density);content.setPadding(pad,pad,pad,pad);scroll.addView(content);scroll.setBackgroundColor(Color.rgb(246,248,251));
  Button back=new Button(this);back.setText("← Бэклог");back.setOnClickListener(v->finish());content.addView(back);
  title=text(task.title,26,MainActivity.INK);title.setTypeface(null,1);content.addView(title);
  status=text("",14,MainActivity.TEAL);content.addView(status);
  desc=text(task.description,18,MainActivity.INK);content.addView(desc);
  retry=new Button(this);retry.setText("Повторить обработку");retry.setOnClickListener(v->{
   try{repo.retry(id);QueueScheduler.enqueue(this);reload();}catch(Exception e){Toast.makeText(this,"Не удалось запустить обработку. Перезапустите приложение.",Toast.LENGTH_LONG).show();}
  });content.addView(retry);
  content.addView(text("ИСХОДНЫЙ ТЕКСТ",12,MainActivity.MUTED));content.addView(text(task.source,16,MainActivity.MUTED));
  if(task.source.codePointCount(0,task.source.length())>600)content.addView(text("Модель обработает первые 600 символов. Полный исходник сохранён выше.",13,MainActivity.MUTED));
  setContentView(scroll);reload();
 }
 private void reload(){Task t=repo.get(id);if(t==null)return;title.setText(t.title);desc.setText(t.description);
  String message=MainActivity.stateLabel(t.state);
  if(t.state.equals("error"))message+="\nИсходник сохранён. Освободите место или память и повторите обработку.";
  status.setText(message);retry.setVisibility(t.state.equals("error")?android.view.View.VISIBLE:android.view.View.GONE);
 }
 @Override protected void onResume(){super.onResume();timer.post(refresh);}
 @Override protected void onPause(){timer.removeCallbacks(refresh);super.onPause();}
 @Override protected void onDestroy(){repo.close();super.onDestroy();}
}
