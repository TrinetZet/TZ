package com.trinetzet.taskcapture;
import java.text.SimpleDateFormat;
import java.util.*;
public final class MarkdownExporter {
 private MarkdownExporter(){}
 private static String date(long time){return new SimpleDateFormat("yyyy-MM-dd HH:mm Z",Locale.ROOT).format(new Date(time));}
 private static String html(String s){return s.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;");}
 private static String inline(String s){
  StringBuilder out=new StringBuilder();
  for(char c:html(s).replace('\r',' ').replace('\n',' ').toCharArray()){
   if("\\`*_{}[]()#+-.!|".indexOf(c)>=0)out.append('\\');out.append(c);
  }return out.toString();
 }
 private static void quote(StringBuilder out,String value){
  for(String line:html(value).replace("\r\n","\n").replace('\r','\n').split("\n",-1))out.append("> ").append(line).append('\n');
  out.append('\n');
 }
 public static String processingLabel(String state){switch(state){case "ready":return "Обработано";case "processing":return "Обрабатывается локально";case "error":return "Ошибка обработки";default:return "Ожидает обработки";}}
 public static String render(List<Task> tasks,long exportedAt){
  StringBuilder out=new StringBuilder("# TaskCapture\n\nЭкспорт: ").append(date(exportedAt)).append("\n\nВсего задач: ").append(tasks.size()).append("\n\n");
  for(String status:new String[]{TaskStatus.BACKLOG,TaskStatus.IN_PROGRESS,TaskStatus.DONE}){
   out.append("## ").append(TaskStatus.label(status)).append("\n\n");int count=0;
   for(Task t:tasks){if(!status.equals(t.status))continue;count++;
    out.append("- [").append(TaskStatus.DONE.equals(status)?'x':' ').append("] ").append(inline(t.title)).append("\n\n");
    out.append("**Создано:** ").append(date(t.created)).append("  \n**Статус:** ").append(TaskStatus.label(t.status)).append("  \n**Обработка:** ").append(processingLabel(t.state)).append("  \n**ID:** ").append(inline(t.id)).append("\n\n");
    if(!t.description.isEmpty()){out.append("**Описание**\n\n");quote(out,t.description);}
    out.append("**Исходный текст**\n\n");quote(out,t.source);
    if(!t.error.isEmpty())out.append("**Код ошибки:** ").append(inline(t.error)).append("\n\n");
    out.append("---\n\n");
   }
   if(count==0)out.append("Нет задач.\n\n");
  }return out.toString();
 }
}
