package com.trinetzet.taskcapture;
import android.content.*;
import android.net.Uri;
import androidx.core.content.FileProvider;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.UUID;
public final class ExportFiles {
 private ExportFiles(){}
 public static File writeSnapshot(Context context,String markdown)throws IOException{
  File dir=new File(context.getCacheDir(),"exports");
  if(!dir.isDirectory()&&!dir.mkdirs())throw new IOException("export_directory");
  File[] old=dir.listFiles();long cutoff=System.currentTimeMillis()-7L*24*60*60*1000;
  if(old!=null)for(File f:old)if(f.isFile()&&f.lastModified()<cutoff)f.delete();
  File file=new File(dir,"TaskCapture-"+UUID.randomUUID()+".md");
  try(FileOutputStream out=new FileOutputStream(file)){out.write(markdown.getBytes(StandardCharsets.UTF_8));out.getFD().sync();}
  catch(IOException e){file.delete();throw e;}return file;
 }
 public static Intent shareIntent(Context c,File file,String mime){
  Uri uri=FileProvider.getUriForFile(c,c.getPackageName()+".exports",file);
  Intent intent=new Intent(Intent.ACTION_SEND).setType(mime).putExtra(Intent.EXTRA_STREAM,uri).addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
  intent.setClipData(ClipData.newRawUri("TaskCapture Markdown",uri));return intent;
 }
}
