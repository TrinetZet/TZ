package com.trinetzet.taskcapture;
import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.widget.TextView;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
/** Test APK receiver runs under a separate UID and verifies the real chooser's URI grant. */
public final class MarkdownReceiver extends Activity {
 @Override public void onCreate(Bundle state){
  super.onCreate(state);TextView text=new TextView(this);
  try{Uri uri=getIntent().getParcelableExtra(Intent.EXTRA_STREAM);try(InputStream in=getContentResolver().openInputStream(uri)){text.setText(new String(in.readAllBytes(),StandardCharsets.UTF_8));text.setContentDescription("Markdown получен");}}
  catch(Exception e){text.setText(e.getClass().getSimpleName());text.setContentDescription("Ошибка чтения Markdown");}
  setContentView(text);
 }
}
