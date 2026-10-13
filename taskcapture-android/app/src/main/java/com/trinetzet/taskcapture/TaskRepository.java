package com.trinetzet.taskcapture;
import android.content.Context;
import java.util.*;
public final class TaskRepository {
 public TaskRepository(Context c){}
 public String capture(String text,String delivery){return "stub";}
 public Task get(String id){return null;}
 public List<Task> list(){return Collections.emptyList();}
 public Task claimNext(){return null;}
 public void complete(String id,NormalizedTask n){}
 public void fail(String id,String code){}
 public void retry(String id){}
 public void close(){}
}
