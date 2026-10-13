package com.trinetzet.taskcapture;
import android.app.*;
import android.os.*;
import android.content.*;
import android.graphics.*;
import android.graphics.drawable.Icon;
import android.view.*;
import android.widget.*;
import java.util.*;
public class MainActivity extends Activity {
 private final Handler timer=new Handler(Looper.getMainLooper());
 private TaskRepository repo;private ExportController exports;private TextView counter,empty;private ListView list;
 private final Rows adapter=new Rows();private final List<Task> visible=new ArrayList<>();private List<Task> all=new ArrayList<>();
 private final List<TextView> chips=new ArrayList<>();private final Set<String> revealed=new HashSet<>();
 private String filter="all",fingerprint="";
 private final Runnable refresh=new Runnable(){public void run(){reload(false);timer.postDelayed(this,2000);}};
 static String stateLabel(String s){return MarkdownExporter.processingLabel(s);}
 private int dp(float n){return GlassUi.dp(this,n);}
 @Override public void onCreate(Bundle saved){
  super.onCreate(saved);repo=new TaskRepository(this);exports=new ExportController(this);exports.restore(saved);
  if(saved!=null)filter=saved.getString("filter","all");
  boolean compact=getResources().getConfiguration().screenHeightDp<520;
  LinearLayout root=GlassUi.column(this,24);root.setPadding(dp(compact?18:22),dp(compact?10:22),dp(compact?18:22),dp(compact?8:14));root.setBackground(new GlassBackground());
  LinearLayout header=new LinearLayout(this);header.setGravity(Gravity.CENTER_VERTICAL);
  TextView name=GlassUi.text(this,"TaskCapture",31);name.setTypeface(Typeface.create("sans-serif-light",0));name.setLetterSpacing(-.035f);name.setMaxLines(1);name.setAutoSizeTextTypeUniformWithConfiguration(20,31,1,android.util.TypedValue.COMPLEX_UNIT_SP);
  header.addView(name,new LinearLayout.LayoutParams(0,-2,1));
  if(compact){TextView tc=GlassUi.button(this,"TC",this::showTileHelp);tc.setContentDescription("Добавить TC в шторку");LinearLayout.LayoutParams tp=new LinearLayout.LayoutParams(-2,-2);tp.rightMargin=dp(8);header.addView(tc,tp);}
  TextView export=GlassUi.button(this,compact?"↑":"↑  Экспорт",exports::showOptions);export.setContentDescription("Экспорт всех задач");header.addView(export);
  root.addView(header);
  TextView subtitle=GlassUi.text(this,"Локальный бэклог",13);subtitle.setTextColor(GlassUi.MUTED);subtitle.setLetterSpacing(.06f);if(!compact)root.addView(subtitle,GlassUi.spaced(this,9));
  counter=GlassUi.text(this,"",26);counter.setTypeface(Typeface.create("sans-serif-light",0));counter.setId(R.id.task_counter);root.addView(counter,GlassUi.spaced(this,26));if(compact)counter.setVisibility(View.GONE);
  HorizontalScrollView filters=new HorizontalScrollView(this);filters.setHorizontalScrollBarEnabled(false);filters.setClipToPadding(false);
  LinearLayout rail=new LinearLayout(this);rail.setPadding(0,0,dp(4),0);
  String[] values={"all","backlog","in_progress","done"};
  for(String value:values){
   TextView chip=GlassUi.button(this,"",()->{filter=value;fingerprint="";reload(true);});
   chip.setTag(value);chip.setPadding(dp(16),dp(13),dp(16),dp(13));chips.add(chip);
   LinearLayout.LayoutParams p=new LinearLayout.LayoutParams(-2,-2);p.rightMargin=dp(7);rail.addView(chip,p);
  }
  filters.addView(rail);root.addView(filters,GlassUi.spaced(this,compact?8:16));
  FrameLayout content=new FrameLayout(this);root.addView(content,new LinearLayout.LayoutParams(-1,0,1));
  list=new ListView(this);list.setId(R.id.task_list);list.setDivider(null);list.setDividerHeight(dp(12));list.setPadding(0,dp(compact?10:18),0,dp(14));list.setClipToPadding(false);list.setSelector(android.R.color.transparent);list.setAdapter(adapter);
  content.addView(list,new FrameLayout.LayoutParams(-1,-1));
  empty=GlassUi.text(this,"",17);empty.setGravity(Gravity.CENTER);empty.setTextColor(GlassUi.MUTED);empty.setLineSpacing(dp(7),1);empty.setPadding(dp(18),dp(24),dp(18),dp(24));content.addView(empty,new FrameLayout.LayoutParams(-1,-1));list.setEmptyView(empty);
  if(!compact){TextView tile=GlassUi.button(this,"＋  TC в шторке",this::showTileHelp);tile.setContentDescription("Добавить TC в шторку");root.addView(tile);
   TextView hint=GlassUi.text(this,"Скопируйте текст → нажмите TC",12);hint.setGravity(Gravity.CENTER);hint.setTextColor(GlassUi.MUTED);root.addView(hint,GlassUi.spaced(this,10));}
  setContentView(root);Insets.apply(root);reload(false);
  int waiting=0;for(Task t:all)if(t.state.equals("pending")||t.state.equals("processing"))waiting++;
  for(int i=0;i<waiting;i++)try{QueueScheduler.enqueue(this);}catch(Exception ignored){break;}
 }
 private void showTileHelp(){
  new AlertDialog.Builder(this).setTitle("TC в шторке")
   .setMessage("1. Скопируйте текст в любом приложении.\n2. Откройте шторку и нажмите TC.\n3. Задача сразу появится в бэклоге.\n\nЕсли плитки нет: откройте редактирование быстрых кнопок в шторке и добавьте TC.")
   .setPositiveButton(Build.VERSION.SDK_INT>=33?"Добавить плитку":"Понятно",(d,w)->{
    if(Build.VERSION.SDK_INT>=33)try{
     getSystemService(StatusBarManager.class).requestAddTileService(new ComponentName(this,TaskTileService.class),"TC",Icon.createWithResource(this,R.drawable.tile_icon),getMainExecutor(),result->{
      if(result==StatusBarManager.TILE_ADD_REQUEST_RESULT_TILE_ADDED||result==StatusBarManager.TILE_ADD_REQUEST_RESULT_TILE_ALREADY_ADDED)Toast.makeText(this,"Плитка TC готова",Toast.LENGTH_SHORT).show();
      else Toast.makeText(this,"Плитку можно добавить вручную через редактирование шторки",Toast.LENGTH_LONG).show();
     });
    }catch(Exception e){Toast.makeText(this,"Добавьте TC вручную через редактирование шторки",Toast.LENGTH_LONG).show();}
   }).setNegativeButton("Закрыть",null).show();
 }
 private void reload(boolean filterChanged){
  try{
   List<Task> next=repo.list();StringBuilder signature=new StringBuilder(filter);
   int done=0;for(Task t:next){signature.append(t.id).append('\0').append(t.title).append('\0').append(t.description).append('\0').append(t.status).append('\0').append(t.state).append('\0').append(t.error).append('\0');if(t.status.equals("done"))done++;}
   all=next;counter.setText(next.size()+" задач  ·  "+done+" выполнено");counter.setContentDescription("Всего задач: "+next.size()+". Выполнено: "+done);
   for(TextView chip:chips){String value=(String)chip.getTag();int count=0;for(Task t:next)if(value.equals("all")||value.equals(t.status))count++;
    String name=value.equals("all")?"Все":TaskStatus.label(value);chip.setText(name+"  "+count);chip.setContentDescription("Фильтр: "+name);chip.setSelected(filter.equals(value));chip.setBackground(GlassUi.surface(this,filter.equals(value)));chip.setTextColor(filter.equals(value)?GlassUi.TEXT:GlassUi.MUTED);
   }
   empty.setText(next.isEmpty()?"Пока здесь тихо\n\nСкопируйте текст и нажмите TC в шторке.\n\nТакже можно выделить текст → «Создать задачу» или «Поделиться» → TaskCapture Glass.":"В этом статусе пока нет задач");
   if(signature.toString().equals(fingerprint))return;fingerprint=signature.toString();
   int position=list.getFirstVisiblePosition(),top=list.getChildAt(0)==null?0:list.getChildAt(0).getTop();
   visible.clear();for(Task t:next)if(filter.equals("all")||filter.equals(t.status))visible.add(t);
   adapter.notifyDataSetChanged();list.setSelectionFromTop(filterChanged?0:position,filterChanged?0:top);
   if(filterChanged)GlassUi.animateEntrance(list);
  }catch(Exception e){counter.setText("Не удалось прочитать задачи");}
 }
 private void changeStatus(Task task){
  try{if(!repo.setStatus(task.id,task.status.equals("done")?"backlog":"done"))throw new IllegalStateException();reload(false);}
  catch(Exception e){Toast.makeText(this,"Не удалось изменить статус. Повторите.",Toast.LENGTH_LONG).show();}
 }
 private final class Rows extends BaseAdapter {
  public int getCount(){return visible.size();}public Object getItem(int p){return visible.get(p);}public long getItemId(int p){return visible.get(p).id.hashCode();}
  public View getView(int p,View recycled,ViewGroup parent){
   Row holder;
   if(recycled==null){
    LinearLayout card=new LinearLayout(MainActivity.this);card.setGravity(Gravity.CENTER_VERTICAL);card.setPadding(dp(18),dp(19),dp(12),dp(19));card.setBackground(GlassUi.surface(MainActivity.this,false));GlassUi.press(card);
    LinearLayout copy=GlassUi.column(MainActivity.this,0);card.addView(copy,new LinearLayout.LayoutParams(0,-2,1));
    TextView title=GlassUi.text(MainActivity.this,"",18);title.setTypeface(Typeface.create("sans-serif-medium",0));title.setMaxLines(3);title.setEllipsize(android.text.TextUtils.TruncateAt.END);copy.addView(title);
    TextView description=GlassUi.text(MainActivity.this,"",13);description.setTextColor(GlassUi.MUTED);description.setMaxLines(2);description.setEllipsize(android.text.TextUtils.TruncateAt.END);copy.addView(description,GlassUi.spaced(MainActivity.this,7));
    TextView state=GlassUi.text(MainActivity.this,"",12);state.setTextColor(GlassUi.MUTED);copy.addView(state,GlassUi.spaced(MainActivity.this,11));
    TextView mark=GlassUi.button(MainActivity.this,"",()->{});mark.setTextSize(21);mark.setPadding(0,0,0,0);LinearLayout.LayoutParams mp=new LinearLayout.LayoutParams(dp(48),dp(48));mp.leftMargin=dp(12);card.addView(mark,mp);
    holder=new Row(card,title,description,state,mark);card.setTag(holder);
   }else holder=(Row)recycled.getTag();
   Task task=visible.get(p);boolean done=task.status.equals("done");
   holder.title.setText(task.title);holder.title.setAlpha(done?.6f:1);holder.title.setPaintFlags(done?holder.title.getPaintFlags()|Paint.STRIKE_THRU_TEXT_FLAG:holder.title.getPaintFlags()&~Paint.STRIKE_THRU_TEXT_FLAG);
   holder.description.setText(task.description);holder.description.setVisibility(task.description.isEmpty()?View.GONE:View.VISIBLE);
   String processing=task.state.equals("ready")?"":("  ·  "+stateLabel(task.state));holder.state.setText(TaskStatus.label(task.status)+processing);
   holder.mark.setText(done?"✓":"○");holder.mark.setBackground(GlassUi.surface(MainActivity.this,done));holder.mark.setContentDescription((done?"Вернуть в бэклог: ":"Завершить задачу: ")+task.title);
   holder.mark.setOnClickListener(v->{v.performHapticFeedback(HapticFeedbackConstants.VIRTUAL_KEY);changeStatus(task);});
   holder.card.setOnClickListener(v->startActivity(new Intent(MainActivity.this,TaskDetailActivity.class).putExtra("id",task.id)));
   if(revealed.add(task.id))GlassUi.animateEntrance(holder.card);
   return holder.card;
  }
 }
 private static final class Row {
  final LinearLayout card;final TextView title,description,state,mark;
  Row(LinearLayout c,TextView t,TextView d,TextView s,TextView m){card=c;title=t;description=d;state=s;mark=m;}
 }
 @Override protected void onSaveInstanceState(Bundle state){state.putString("filter",filter);exports.saveState(state);super.onSaveInstanceState(state);}
 @Override protected void onActivityResult(int request,int result,Intent data){if(!exports.onActivityResult(request,result,data))super.onActivityResult(request,result,data);}
 @Override protected void onResume(){super.onResume();timer.post(refresh);}
 @Override protected void onPause(){timer.removeCallbacks(refresh);super.onPause();}
 @Override protected void onDestroy(){exports.close();repo.close();super.onDestroy();}
}
