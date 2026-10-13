package com.trinetzet.taskcapture;
import android.content.Context;
import androidx.test.core.app.ApplicationProvider;
import org.junit.*;
import static org.junit.Assert.*;
public class StorageTest {
 Context c; TaskRepository r;
 @Before public void setup(){c=ApplicationProvider.getApplicationContext();c.deleteDatabase("tasks.db");r=new TaskRepository(c);}
 @After public void close(){r.close();}
 @Test public void durableCaptureAndDuplicateDelivery(){
  String id=r.capture("Позвонить Кате 🐶","same");
  assertNotNull(r.get(id));
  assertEquals(id,r.capture("Позвонить Кате 🐶","same"));
  r.close();r=new TaskRepository(c);
  assertEquals(1,r.list().size());assertEquals("Позвонить Кате 🐶",r.get(id).source);
 }
 @Test public void failureRetainsSourceAndRetry(){
  String id=r.capture("Подготовить план","a");Task t=r.claimNext();assertNotNull(t);assertEquals(id,t.id);
  r.fail(t,"model");assertEquals("error",r.get(id).state);assertEquals("Подготовить план",r.get(id).source);
  r.retry(id);assertEquals("pending",r.get(id).state);
  Task retry=r.claimNext();assertNotNull(retry);r.complete(retry,new NormalizedTask("Подготовить план","Составить план"));
  assertEquals("ready",r.get(id).state);assertEquals("Подготовить план",r.get(id).source);
 }
 @Test public void staleClaimCannotOverwriteReplacement(){
  String id=r.capture("Проверить отчёт","owners");Task old=r.claimNext();Task replacement=r.claimNext();
  r.fail(old,"timeout");assertEquals("processing",r.get(id).state);
  r.complete(old,new NormalizedTask("Старый результат","Не сохранять"));assertEquals("processing",r.get(id).state);
  r.complete(replacement,new NormalizedTask("Проверить отчёт","Новая попытка"));assertEquals("ready",r.get(id).state);
 }
 @Test public void interruptedClaimIsRecoverable(){
  String id=r.capture("Проверить отчёт","b");assertNotNull(r.claimNext());
  r.close();r=new TaskRepository(c);assertEquals(id,r.claimNext().id);
 }
 @Test public void lateResultDoesNotOverwriteReadyTask(){
  String id=r.capture("Источник","c");
  r.complete(r.get(id),new NormalizedTask("Без claim","не сохранится"));
  assertNotNull(r.get(id));assertEquals("pending",r.get(id).state);
 }
}
