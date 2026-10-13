package com.trinetzet.taskcapture;
import android.content.Context;
import java.io.*;
import java.security.*;
public final class ModelInstaller {
 public static final long SIZE=396705472L;
 public static final String HASH="ac2d97712095a558e31573f62f466a3f9d93990898b0ec79d7c974c1780d524a";
 private static String hash(File file)throws Exception {
  MessageDigest d=MessageDigest.getInstance("SHA-256");byte[] buf=new byte[1024*1024];
  try(InputStream in=new FileInputStream(file)){int n;while((n=in.read(buf))!=-1)d.update(buf,0,n);}
  StringBuilder hex=new StringBuilder();for(byte b:d.digest())hex.append(String.format("%02x",b&255));return hex.toString();
 }
 public static synchronized File ensureInstalled(Context context)throws Exception {
  File target=new File(context.getFilesDir(),"model.gguf");
  if(target.exists()&&target.length()==SIZE&&HASH.equals(hash(target)))return target;
  if(context.getFilesDir().getUsableSpace()<SIZE+32*1024*1024)throw new IOException("not_enough_space");
  File temp=new File(context.getFilesDir(),"model.partial");
  try {
   try(InputStream in=context.getAssets().open("model.gguf");FileOutputStream out=new FileOutputStream(temp)){
    byte[] buf=new byte[1024*1024];int n;while((n=in.read(buf))!=-1)out.write(buf,0,n);out.getFD().sync();
   }
   if(temp.length()!=SIZE||!HASH.equals(hash(temp)))throw new IOException("model_hash");
   if(!temp.renameTo(target))throw new IOException("model_install");
   return target;
  }finally {if(temp.exists())temp.delete();}
 }
}
