package com.trinetzet.taskcapture;
import android.content.*;
public final class ClipboardCapture {
 private ClipboardCapture(){}
 public static String read(ClipboardManager clipboard){return readClip(clipboard==null?null:clipboard.getPrimaryClip());}
 public static String readClip(ClipData clip){
  if(clip==null||clip.getItemCount()==0)throw new IllegalArgumentException("Буфер пуст. Сначала скопируйте текст.");
  CharSequence text=clip.getItemAt(0).getText();
  if(text==null)throw new IllegalArgumentException("В буфере нет текста. Скопируйте сообщение или его часть.");
  return CaptureInput.parse(CaptureInput.SEND,text);
 }
}
