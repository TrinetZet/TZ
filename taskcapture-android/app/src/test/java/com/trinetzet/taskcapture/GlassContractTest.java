package com.trinetzet.taskcapture;
import java.lang.reflect.*;
import java.util.*;
public class GlassContractTest {
 static Class<?> required(String name){try{return Class.forName("com.trinetzet.taskcapture."+name);}catch(ClassNotFoundException e){throw new AssertionError("Missing feature: "+name,e);}}
 static void check(boolean b,String message){if(!b)throw new AssertionError(message);}
 public static void main(String[] args)throws Exception {
  Class<?> statuses=required("TaskStatus");
  Method valid=statuses.getMethod("requireValid",String.class);
  for(String s:new String[]{"backlog","in_progress","done"})check(valid.invoke(null,s).equals(s),"Valid status rejected");
  try{valid.invoke(null,"ready");throw new AssertionError("Processing state accepted as task status");}catch(InvocationTargetException e){check(e.getCause() instanceof IllegalArgumentException,"Wrong validation error");}
  Class<?> exporter=required("MarkdownExporter");
  Constructor<Task> constructor=Task.class.getConstructor(String.class,String.class,String.class,String.class,String.class,String.class,long.class,String.class,String.class);
  List<Task> tasks=new ArrayList<>();
  tasks.add(constructor.newInstance("a","# План [x]","","Первая строка 🐶\n# Исходник\n```","pending","",0L,"","backlog"));
  tasks.add(constructor.newInstance("b","Отчёт","Описание","Оригинал","error","model",1L,"","in_progress"));
  tasks.add(constructor.newInstance("c","Позвонить Кате","Готово","Звонок","ready","",2L,"","done"));
  Method render=exporter.getMethod("render",List.class,long.class);
  String md=(String)render.invoke(null,tasks,0L);
  for(String s:new String[]{"Бэклог","В работе","Выполнено","Отчёт","Позвонить Кате","Первая строка 🐶","Исходник","Оригинал","Звонок","[x]"})check(md.contains(s),"Export missing: "+s);
  check(!md.contains("\n# Исходник"),"Source injected heading");
  check(md.contains("> # Исходник"),"Source lines not quoted");
  check(((String)render.invoke(null,Collections.emptyList(),0L)).startsWith("# TaskCapture"),"Empty export invalid");
  System.out.println("Glass contracts: statuses and all-status Markdown passed");
 }
}
