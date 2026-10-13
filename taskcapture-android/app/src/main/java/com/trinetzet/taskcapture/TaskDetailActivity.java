package com.trinetzet.taskcapture;
import android.app.*;
import android.os.*;
import android.view.*;
import android.widget.*;
public class TaskDetailActivity extends Activity {
 private TaskRepository repo;private String id;private TextView title,description,status,processing,retry;private final Handler timer=new Handler(Looper.getMainLooper());
 private final Runnable refresh=new Runnable(){public void run(){reload();timer.postDelayed(this,2000);}};
 private int dp(float n){return GlassUi.dp(this,n);}
 @Override public void onCreate(Bundle saved){
  super.onCreate(saved);repo=new TaskRepository(this);id=getIntent().getStringExtra("id");Task task=repo.get(id);if(task==null){finish();return;}
  ScrollView scroll=new ScrollView(this);scroll.setFillViewport(true);scroll.setBackground(new GlassBackground());
  LinearLayout content=GlassUi.column(this,24);scroll.addView(content);
  TextView back=GlassUi.button(this,"←  Задачи",this::finish);LinearLayout.LayoutParams bp=new LinearLayout.LayoutParams(-2,-2);content.addView(back,bp);
  title=GlassUi.text(this,task.title,29);title.setTypeface(android.graphics.Typeface.create("sans-serif-light",0));title.setTextIsSelectable(true);content.addView(title,GlassUi.spaced(this,26));
  status=GlassUi.button(this,"",this::chooseStatus);status.setContentDescription("Изменить статус задачи");content.addView(status,GlassUi.spaced(this,20));
  LinearLayout body=GlassUi.column(this,22);body.setBackground(GlassUi.card(this));content.addView(body,GlassUi.spaced(this,20));
  description=GlassUi.text(this,"",18);description.setLineSpacing(dp(5),1);description.setTextIsSelectable(true);body.addView(description);
  processing=GlassUi.text(this,"",13);processing.setTextColor(GlassUi.MUTED);processing.setLineSpacing(dp(4),1);body.addView(processing,GlassUi.spaced(this,16));
  retry=GlassUi.button(this,"Повторить обработку",()->{try{repo.retry(id);QueueScheduler.enqueue(this);reload();}catch(Exception e){Toast.makeText(this,"Не удалось запустить обработку. Повторите позже.",Toast.LENGTH_LONG).show();}});body.addView(retry,GlassUi.spaced(this,16));
  TextView sourceLabel=GlassUi.text(this,"ИСХОДНЫЙ ТЕКСТ",11);sourceLabel.setLetterSpacing(.12f);sourceLabel.setTextColor(GlassUi.MUTED);content.addView(sourceLabel,GlassUi.spaced(this,28));
  LinearLayout sourceCard=GlassUi.column(this,20);sourceCard.setBackground(GlassUi.card(this));TextView source=GlassUi.text(this,task.source,15);source.setTextIsSelectable(true);source.setLineSpacing(dp(4),1);source.setTextColor(GlassUi.MUTED);sourceCard.addView(source);content.addView(sourceCard,GlassUi.spaced(this,12));
  if(task.source.codePointCount(0,task.source.length())>600){TextView note=GlassUi.text(this,"Модель обрабатывает первые 600 символов. Полный исходник сохранён.",12);note.setTextColor(GlassUi.MUTED);content.addView(note,GlassUi.spaced(this,14));}
  setContentView(scroll);Insets.apply(content);reload();GlassUi.animateEntrance(body);
 }
 private void chooseStatus(){
  Task task=repo.get(id);if(task==null)return;String[] values={"backlog","in_progress","done"};int checked=java.util.Arrays.asList(values).indexOf(task.status);
  new AlertDialog.Builder(this).setTitle("Статус задачи").setSingleChoiceItems(new String[]{"Бэклог","В работе","Выполнено"},checked,(dialog,which)->{
   try{repo.setStatus(id,values[which]);reload();status.performHapticFeedback(HapticFeedbackConstants.VIRTUAL_KEY);}catch(Exception e){Toast.makeText(this,"Не удалось изменить статус",Toast.LENGTH_LONG).show();}dialog.dismiss();
  }).setNegativeButton("Отмена",null).show();
 }
 private void reload(){
  try{Task task=repo.get(id);if(task==null)return;title.setText(task.title);
   description.setText(task.description.isEmpty()?"Текст сохранён. Описание появится после обработки.":task.description);
   status.setText(TaskStatus.label(task.status)+"  ⌄");
   processing.setText(MainActivity.stateLabel(task.state)+(task.state.equals("error")?"\nИсходник сохранён. Проверьте свободное место и память, затем повторите.":""));
   retry.setVisibility(task.state.equals("error")?View.VISIBLE:View.GONE);
  }catch(Exception e){Toast.makeText(this,"Не удалось прочитать задачу",Toast.LENGTH_SHORT).show();}
 }
 @Override protected void onResume(){super.onResume();timer.post(refresh);}
 @Override protected void onPause(){timer.removeCallbacks(refresh);super.onPause();}
 @Override protected void onDestroy(){repo.close();super.onDestroy();}
}
