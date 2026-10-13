package com.trinetzet.taskcapture;
public final class CaptureInput {
 public static final String PROCESS="android.intent.action.PROCESS_TEXT", SEND="android.intent.action.SEND";
 public static String parse(String action,CharSequence text) {
  if(!PROCESS.equals(action)&&!SEND.equals(action)) throw new IllegalArgumentException("Источник текста не поддерживается");
  if(text==null||text.toString().trim().isEmpty()) throw new IllegalArgumentException("Выделите непустой текст");
  if(text.length()>65536) throw new IllegalArgumentException("Выделите фрагмент короче 65 536 символов");
  return text.toString().trim();
 }
}
