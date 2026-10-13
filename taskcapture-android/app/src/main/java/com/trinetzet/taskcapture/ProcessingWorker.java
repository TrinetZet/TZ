package com.trinetzet.taskcapture;
import android.content.Context;
import androidx.annotation.NonNull;
import androidx.work.*;
public class ProcessingWorker extends Worker {
 public ProcessingWorker(@NonNull Context c,@NonNull WorkerParameters p){super(c,p);}
 @NonNull @Override public Result doWork(){
  try(TaskRepository repo=new TaskRepository(getApplicationContext())){
   Task task=repo.claimNext();if(task==null)return Result.success();
   try {
    if(isStopped())return Result.retry();
    String path=ModelInstaller.ensureInstalled(getApplicationContext()).getAbsolutePath();
    NormalizedTask result=NativeModel.extract(path,task.source);
    if(isStopped())return Result.retry();
    repo.complete(task.id,result);
   }catch(OutOfMemoryError e){repo.fail(task.id,"memory");}
    catch(LinkageError e){repo.fail(task.id,"runtime");}
    catch(Exception e){repo.fail(task.id,"model");}
   return Result.success();
  }catch(Exception e){return getRunAttemptCount()<3?Result.retry():Result.failure();}
 }
}
