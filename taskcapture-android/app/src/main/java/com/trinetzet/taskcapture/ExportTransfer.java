package com.trinetzet.taskcapture;
import java.io.*;
public final class ExportTransfer {
 private ExportTransfer(){}
 public static void write(File snapshot,OutputStream destination)throws IOException{
  try(OutputStream out=destination;InputStream in=new FileInputStream(snapshot)){
   if(out==null)throw new IOException("export_destination");byte[] buffer=new byte[16384];int n;
   while((n=in.read(buffer))!=-1)out.write(buffer,0,n);out.flush();
  }
 }
}
