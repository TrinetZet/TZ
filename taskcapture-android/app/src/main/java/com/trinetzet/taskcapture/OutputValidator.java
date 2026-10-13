package com.trinetzet.taskcapture;
import org.json.JSONObject;
import org.json.JSONTokener;
public final class OutputValidator {
 public static NormalizedTask parse(String json) {
  try {
   if(json==null||json.length()>16384) throw new IllegalArgumentException();
   JSONTokener t=new JSONTokener(json);
   Object value=t.nextValue();
   if(!(value instanceof JSONObject)||t.nextClean()!=0) throw new IllegalArgumentException();
   JSONObject o=(JSONObject)value;
   if(o.length()!=2||!(o.get("title") instanceof String)||!(o.get("description") instanceof String)) throw new IllegalArgumentException();
   String title=o.getString("title").trim(),desc=o.getString("description").trim();
   if(title.isEmpty()||title.length()>160||desc.isEmpty()||desc.length()>4096)throw new IllegalArgumentException();
   return new NormalizedTask(title,desc);
  } catch(Exception e) {throw new IllegalArgumentException("Модель вернула некорректный результат. Повторите обработку.");}
 }
}
