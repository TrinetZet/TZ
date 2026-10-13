package com.trinetzet.taskcapture;
import android.app.Activity;
import android.os.*;
import android.content.Intent;
import android.graphics.Color;
import android.view.*;
import android.widget.*;
import java.util.*;
public class MainActivity extends Activity {
 private final Handler timer=new Handler(Looper.getMainLooper());
 private TaskRepository repo;private TextView counter;private ListView list;private List<Task> tasks=new ArrayList<>();
 private final Runnable refresh=new Runnable(){public void run(){reload();timer.postDelayed(this,2000);}};
 static final int INK=Color.rgb(20,31,49),MUTED=Color.rgb(103,117,139),TEAL=Color.rgb(0,125,110);
 static String stateLabel(String s){switch(s){case "ready":return "В бэклоге";case "processing":return "Обрабатывается локально…";case "error":return "Ошибка обработки";default:return "Ожидает обработки";}}
 int dp(int n){return (int)(n*getResources().getDisplayMetrics().density);}
 TextView label(String s,int size,int color){TextView t=new TextView(this);t.setText(s);t.setTextSize(size);t.setTextColor(color);return t;}
 @Override public void onCreate(Bundle saved){
  super.onCreate(saved);repo=new TaskRepository(this);
  LinearLayout root=new LinearLayout(this);root.setOrientation(LinearLayout.VERTICAL);root.setPadding(dp(24),dp(28),dp(24),dp(12));root.setBackgroundColor(Color.rgb(246,248,251));
  TextView name=label("TaskCapture",30,INK);name.setTypeface(null,1);root.addView(name);
  TextView help=label("Выделите текст → «Создать задачу»\nВсё обрабатывается на этом устройстве.",15,MUTED);help.setPadding(0,dp(12),0,dp(24));root.addView(help);
  counter=label("БЭКЛОГ",13,TEAL);counter.setTypeface(null,1);root.addView(counter);
  list=new ListView(this);list.setDivider(null);list.setDividerHeight(dp(10));list.setPadding(0,dp(16),0,0);list.setClipToPadding(false);
  TextView empty=label("Пока задач нет\n\nВыделите текст в другом приложении и откройте меню ⋮.\n\nЕсли пункта нет: «Поделиться» → TaskCapture.",17,MUTED);
  empty.setPadding(0,dp(32),0,0);root.addView(empty);root.addView(list,new LinearLayout.LayoutParams(-1,0,1));list.setEmptyView(empty);
  list.setOnItemClickListener((p,v,pos,id)->startActivity(new Intent(this,TaskDetailActivity.class).putExtra("id",tasks.get(pos).id)));
  setContentView(root);Insets.apply(root);reload();
  int waiting=0;for(Task t:tasks)if(t.state.equals("pending")||t.state.equals("processing"))waiting++;
  for(int i=0;i<waiting;i++)try{QueueScheduler.enqueue(this);}catch(Exception ignored){break;}
 }
 private void reload(){
  try {int position=list.getFirstVisiblePosition();int offset=list.getChildAt(0)==null?0:list.getChildAt(0).getTop();tasks=repo.list();counter.setText("БЭКЛОГ · "+tasks.size());
   list.setAdapter(new BaseAdapter(){
    public int getCount(){return tasks.size();}public Object getItem(int p){return tasks.get(p);}public long getItemId(int p){return p;}
    public View getView(int pos,View old,ViewGroup parent){
     Task t=tasks.get(pos);LinearLayout card=new LinearLayout(MainActivity.this);card.setOrientation(LinearLayout.VERTICAL);card.setPadding(dp(18),dp(16),dp(18),dp(16));card.setBackgroundResource(com.trinetzet.taskcapture.R.drawable.card);
     TextView title=label(t.title,18,INK);title.setTypeface(null,1);title.setMaxLines(3);card.addView(title);
     TextView status=label(stateLabel(t.state),13,t.state.equals("error")?Color.rgb(170,52,52):TEAL);status.setPadding(0,dp(8),0,0);card.addView(status);return card;
    }
   });
   list.setSelectionFromTop(position,offset);
  }catch(Exception e){counter.setText("Не удалось прочитать бэклог. Перезапустите приложение.");}
 }
 @Override protected void onResume(){super.onResume();timer.post(refresh);}
 @Override protected void onPause(){timer.removeCallbacks(refresh);super.onPause();}
 @Override protected void onDestroy(){repo.close();super.onDestroy();}
}
