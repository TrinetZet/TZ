package com.trinetzet.taskcapture;
import android.graphics.*;
import android.graphics.drawable.Drawable;
public final class GlassBackground extends Drawable {
 private final Paint paint=new Paint(Paint.ANTI_ALIAS_FLAG);
 @Override public void draw(Canvas c){
  paint.setColor(Color.WHITE);
  Rect b=getBounds();float w=b.width(),h=b.height();
  paint.setShader(new LinearGradient(0,0,w,h,new int[]{0xff202228,0xff0d0e12,0xff17191f},null,Shader.TileMode.CLAMP));c.drawRect(b,paint);
  glow(c,w*.13f,h*.08f,w*.95f,0x557c8291);
  glow(c,w*1.08f,h*.42f,w*.9f,0x334c5361);
  glow(c,w*.3f,h*.95f,w*.85f,0x22494f5a);
  paint.setShader(null);paint.setColor(0x04ffffff);
  for(int x=0;x<w;x+=7)for(int y=0;y<h;y+=7)if((x*13+y*7)%5==0)c.drawPoint(x,y,paint);
 }
 private void glow(Canvas c,float x,float y,float radius,int color){paint.setShader(new RadialGradient(x,y,Math.max(1,radius),new int[]{color,0x00000000},null,Shader.TileMode.CLAMP));c.drawCircle(x,y,radius,paint);}
 @Override public void setAlpha(int alpha){}
 @Override public void setColorFilter(ColorFilter filter){}
 @Override public int getOpacity(){return PixelFormat.OPAQUE;}
}
