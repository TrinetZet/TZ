package com.trinetzet.taskcapture;
import android.animation.ValueAnimator;
import android.content.Context;
import android.graphics.*;
import android.view.*;
import android.view.animation.DecelerateInterpolator;
import android.widget.*;
public final class SuccessView extends FrameLayout {
 private final LinearLayout card;private final Seal seal;private ValueAnimator animator;
 public SuccessView(Context context){
  super(context);setPadding(GlassUi.dp(context,24),0,GlassUi.dp(context,24),0);
  card=GlassUi.column(context,28);card.setGravity(Gravity.CENTER);card.setBackground(GlassUi.card(context));card.setElevation(GlassUi.dp(context,16));
  int width=Math.min(GlassUi.dp(context,340),context.getResources().getDisplayMetrics().widthPixels-GlassUi.dp(context,48));
  FrameLayout.LayoutParams params=new FrameLayout.LayoutParams(width,-2,Gravity.CENTER);addView(card,params);
  seal=new Seal(context);card.addView(seal,new LinearLayout.LayoutParams(GlassUi.dp(context,88),GlassUi.dp(context,88)));
  TextView title=GlassUi.text(context,"Добавлено в бэклог",21);title.setGravity(Gravity.CENTER);title.setTypeface(null,1);card.addView(title,GlassUi.spaced(context,20));
  TextView subtitle=GlassUi.text(context,"Текст сохранён",14);subtitle.setTextColor(GlassUi.MUTED);subtitle.setGravity(Gravity.CENTER);card.addView(subtitle,GlassUi.spaced(context,10));
  setContentDescription("Добавлено в бэклог. Текст сохранён");setAccessibilityLiveRegion(View.ACCESSIBILITY_LIVE_REGION_POLITE);
 }
 public void showSaved(Runnable onFinished){
  announceForAccessibility("Добавлено в бэклог");performHapticFeedback(HapticFeedbackConstants.CONFIRM);
  if(ValueAnimator.areAnimatorsEnabled()){
   card.setAlpha(0);card.setScaleX(.86f);card.setScaleY(.86f);card.animate().alpha(1).scaleX(1).scaleY(1).setDuration(480).setInterpolator(new DecelerateInterpolator(1.8f)).start();
   animator=ValueAnimator.ofFloat(0,1);animator.setDuration(850);animator.setInterpolator(new DecelerateInterpolator());animator.addUpdateListener(a->{seal.progress=(float)a.getAnimatedValue();seal.invalidate();});animator.start();
  }else{seal.progress=1;seal.invalidate();}
  postDelayed(onFinished,ValueAnimator.areAnimatorsEnabled()?1400:900);
 }
 @Override protected void onDetachedFromWindow(){if(animator!=null)animator.cancel();card.animate().cancel();super.onDetachedFromWindow();}
 private static final class Seal extends View {
  private final Paint paint=new Paint(Paint.ANTI_ALIAS_FLAG);private float progress;
  Seal(Context c){super(c);setImportantForAccessibility(View.IMPORTANT_FOR_ACCESSIBILITY_NO);}
  @Override protected void onDraw(Canvas c){
   float w=getWidth(),h=getHeight(),r=w*.39f;paint.setStyle(Paint.Style.FILL);
   paint.setShader(new RadialGradient(w*.35f,h*.2f,w*.8f,new int[]{0x80ffffff,0x224e5a70,0x10303a50},null,Shader.TileMode.CLAMP));c.drawCircle(w/2,h/2,r,paint);
   paint.setShader(null);paint.setStyle(Paint.Style.STROKE);paint.setStrokeWidth(w*.015f);paint.setColor(0x70ffffff);c.drawCircle(w/2,h/2,r,paint);
   paint.setColor(0x70ffffff);paint.setStrokeWidth(w*.01f);c.drawArc(new RectF(w*.04f,h*.04f,w*.96f,h*.96f),-110,360*progress,false,paint);
   Path path=new Path();path.moveTo(w*.31f,h*.5f);path.lineTo(w*.45f,h*.64f);path.lineTo(w*.7f,h*.36f);
   PathMeasure m=new PathMeasure(path,false);Path visible=new Path();m.getSegment(0,m.getLength()*Math.min(1,progress*1.5f),visible,true);
   paint.setColor(0xfff4f7ff);paint.setStrokeWidth(w*.047f);paint.setStrokeCap(Paint.Cap.ROUND);paint.setStrokeJoin(Paint.Join.ROUND);c.drawPath(visible,paint);
   if(progress<1){paint.setStyle(Paint.Style.FILL);paint.setColor((Math.round((1-progress)*120)<<24)|0xffffff);c.drawCircle(w*(.15f+progress*.7f),h*.18f,w*.075f,paint);}
  }
 }
}
