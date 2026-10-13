package com.trinetzet.taskcapture;
import android.animation.ValueAnimator;
import android.content.Context;
import android.content.res.ColorStateList;
import android.graphics.Typeface;
import android.graphics.drawable.*;
import android.view.*;
import android.view.animation.*;
import android.widget.*;
public final class GlassUi {
 public static final int TEXT=0xfff5f6fa,MUTED=0xffb6bbc6,FAINT=0xff848c9d;
 private GlassUi(){}
 public static int dp(Context c,float value){return Math.round(value*c.getResources().getDisplayMetrics().density);}
 public static TextView text(Context c,String value,float size){TextView v=new TextView(c);v.setText(value);v.setTextSize(size);v.setTextColor(TEXT);v.setFontFeatureSettings("kern");v.setIncludeFontPadding(false);v.setTypeface(Typeface.create("sans-serif",Typeface.NORMAL));return v;}
 public static Drawable card(Context c){return new GlassCardDrawable(dp(c,24),false);}
 public static Drawable surface(Context c,boolean selected){return new RippleDrawable(ColorStateList.valueOf(0x24ffffff),new GlassCardDrawable(dp(c,24),selected),null);}
 public static TextView button(Context c,String value,Runnable action){
  TextView v=text(c,value,14);v.setGravity(Gravity.CENTER);v.setTypeface(Typeface.create("sans-serif-medium",0));v.setPadding(dp(c,18),dp(c,14),dp(c,18),dp(c,14));v.setMinHeight(dp(c,48));v.setBackground(surface(c,false));v.setOnClickListener(view->{view.performHapticFeedback(HapticFeedbackConstants.VIRTUAL_KEY);action.run();});press(v);return v;
 }
 public static void press(View v){
  v.setOnTouchListener((view,event)->{
   if(ValueAnimator.areAnimatorsEnabled()){
    if(event.getActionMasked()==MotionEvent.ACTION_DOWN)view.animate().scaleX(.975f).scaleY(.975f).setDuration(100).start();
    else if(event.getActionMasked()==MotionEvent.ACTION_UP||event.getActionMasked()==MotionEvent.ACTION_CANCEL)view.animate().scaleX(1).scaleY(1).setInterpolator(new OvershootInterpolator(.8f)).setDuration(260).start();
   }return false;
  });
 }
 public static void animateEntrance(View view){
  if(!ValueAnimator.areAnimatorsEnabled())return;view.setAlpha(0);view.setTranslationY(dp(view.getContext(),14));view.animate().alpha(1).translationY(0).setDuration(420).setInterpolator(new DecelerateInterpolator(1.6f)).start();
 }
 public static LinearLayout column(Context c,int padding){LinearLayout v=new LinearLayout(c);v.setOrientation(LinearLayout.VERTICAL);int p=dp(c,padding);v.setPadding(p,p,p,p);return v;}
 public static LinearLayout.LayoutParams spaced(Context c,int top){LinearLayout.LayoutParams p=new LinearLayout.LayoutParams(-1,-2);p.topMargin=dp(c,top);return p;}
}
