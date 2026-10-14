package com.trinetzet.taskcapture;
import android.graphics.*;
import android.graphics.drawable.Drawable;
public final class GlassCardDrawable extends Drawable {
 private final Paint p=new Paint(Paint.ANTI_ALIAS_FLAG);private final float radius;private final boolean selected;
 public GlassCardDrawable(float radius,boolean selected){this.radius=radius;this.selected=selected;}
 @Override public void draw(Canvas c){
  p.setColor(Color.WHITE);
  RectF r=new RectF(getBounds());r.inset(1,1);float h=Math.max(1,r.height());
  p.setStyle(Paint.Style.FILL);
  p.setShader(new LinearGradient(r.left,r.top,r.right,r.bottom,new int[]{selected?0x668a8f9b:0x405b606d,selected?0x44434a58:0x24323844,0x18303a4c},new float[]{0,.46f,1},Shader.TileMode.CLAMP));c.drawRoundRect(r,radius,radius,p);
  int save=c.save();Path clip=new Path();clip.addRoundRect(r,radius,radius,Path.Direction.CW);c.clipPath(clip);
  p.setShader(new RadialGradient(r.left+r.width()*.1f,r.top-h*.35f,Math.max(r.width(),h)*.85f,new int[]{0x32ffffff,0x00ffffff},null,Shader.TileMode.CLAMP));c.drawRect(r,p);
  p.setShader(new LinearGradient(r.left,r.top,r.right,r.bottom,new int[]{0x1affffff,0x02ffffff,0x00ffffff},new float[]{0,.3f,1},Shader.TileMode.CLAMP));c.drawOval(r.left-r.width()*.3f,r.top-h*1.8f,r.right+r.width()*.2f,r.top+h*.32f,p);c.restoreToCount(save);
  p.setShader(new LinearGradient(0,r.top,0,r.bottom,new int[]{0x80ffffff,0x14ffffff,0x30ffffff},new float[]{0,.5f,1},Shader.TileMode.CLAMP));p.setStyle(Paint.Style.STROKE);p.setStrokeWidth(1.2f);c.drawRoundRect(r,radius,radius,p);
  r.inset(1.2f,1.2f);p.setShader(null);p.setColor(0x09ffffff);p.setStrokeWidth(.7f);c.drawRoundRect(r,Math.max(0,radius-1),Math.max(0,radius-1),p);p.setStyle(Paint.Style.FILL);
 }
 @Override public void setAlpha(int alpha){p.setAlpha(alpha);invalidateSelf();}
 @Override public void setColorFilter(ColorFilter filter){p.setColorFilter(filter);invalidateSelf();}
 @Override public int getOpacity(){return PixelFormat.TRANSLUCENT;}
}
