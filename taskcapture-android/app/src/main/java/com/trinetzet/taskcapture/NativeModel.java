package com.trinetzet.taskcapture;
import java.nio.charset.StandardCharsets;
public final class NativeModel {
 static {System.loadLibrary("taskcapture");}
 private static native byte[] run(byte[] path,byte[] prompt);
 public static synchronized NormalizedTask extract(String path,String text) {
  byte[] bytes=run(path.getBytes(StandardCharsets.UTF_8),PromptBuilder.build(text).getBytes(StandardCharsets.UTF_8));
  if(bytes==null)throw new IllegalStateException("local_inference_failed");
  return OutputValidator.parse(new String(bytes,StandardCharsets.UTF_8));
 }
}
