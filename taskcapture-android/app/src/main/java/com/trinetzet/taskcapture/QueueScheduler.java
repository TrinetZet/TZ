package com.trinetzet.taskcapture;
import android.content.Context;
import androidx.work.*;
import java.util.concurrent.TimeUnit;
public final class QueueScheduler {
 public static void enqueue(Context c){
  OneTimeWorkRequest job=new OneTimeWorkRequest.Builder(ProcessingWorker.class)
   .setBackoffCriteria(BackoffPolicy.EXPONENTIAL,30,TimeUnit.SECONDS).build();
  WorkManager.getInstance(c).enqueueUniqueWork("taskcapture-processing",ExistingWorkPolicy.APPEND_OR_REPLACE,job);
 }
}
