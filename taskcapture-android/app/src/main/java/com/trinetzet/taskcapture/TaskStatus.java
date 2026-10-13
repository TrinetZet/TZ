package com.trinetzet.taskcapture;
public final class TaskStatus {
 private TaskStatus(){}
 public static final String BACKLOG="backlog", IN_PROGRESS="in_progress", DONE="done";
 public static String requireValid(String value){
  if(BACKLOG.equals(value)||IN_PROGRESS.equals(value)||DONE.equals(value))return value;
  throw new IllegalArgumentException("Неизвестный статус задачи");
 }
 public static String label(String value){switch(requireValid(value)){case IN_PROGRESS:return "В работе";case DONE:return "Выполнено";default:return "Бэклог";}}
}
