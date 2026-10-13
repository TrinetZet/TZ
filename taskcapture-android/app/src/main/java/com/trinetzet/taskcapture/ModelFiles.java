package com.trinetzet.taskcapture;
import java.io.*;
import java.util.function.LongSupplier;
public final class ModelFiles {
 public static void prepare(File temp,long required,LongSupplier available)throws IOException {
  if(temp.exists()&&!temp.delete())throw new IOException("stale_model_cleanup");
  if(available.getAsLong()<required)throw new IOException("not_enough_space");
 }
}
