package com.trinetzet.taskcapture;
import java.nio.file.*;
import java.io.*;
public class ModelFilesTest {
 public static void main(String[] args)throws Exception{
  Path directory=Files.createTempDirectory("taskcapture-model");
  File stale=directory.resolve("model.partial").toFile();Files.write(stale.toPath(),new byte[]{1});
  ModelFiles.prepare(stale,400,()->stale.exists()?350:600);
  if(stale.exists())throw new AssertionError("Stale model copy was not removed");
  try{ModelFiles.prepare(stale,400,()->350);throw new AssertionError("Insufficient space accepted");}catch(IOException expected){}
  Files.delete(directory);System.out.println("ModelFiles: interrupted copy recovery and insufficient space passed");
 }
}
