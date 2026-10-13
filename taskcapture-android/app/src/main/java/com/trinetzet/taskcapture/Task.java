package com.trinetzet.taskcapture;
public final class Task {
 public final String id,title,description,source,state,error;public final long created;
 public Task(String id,String title,String description,String source,String state,String error,long created){
 this.id=id;this.title=title;this.description=description;this.source=source;this.state=state;this.error=error;this.created=created;
 }
}
