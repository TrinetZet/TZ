package com.trinetzet.taskcapture;
import android.app.PendingIntent;
import android.content.Intent;
import android.os.Build;
import android.service.quicksettings.*;
public final class TaskTileService extends TileService {
 @Override public void onStartListening(){
  Tile tile=getQsTile();if(tile==null)return;tile.setLabel("TC");tile.setState(Tile.STATE_INACTIVE);
  if(Build.VERSION.SDK_INT>=29)tile.setSubtitle("Создать задачу");tile.updateTile();
 }
 @Override public void onClick(){super.onClick();if(isLocked())unlockAndRun(this::capture);else capture();}
 private void capture(){
  Intent intent=new Intent(this,ClipboardActivity.class).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
  if(Build.VERSION.SDK_INT>=34)startActivityAndCollapse(PendingIntent.getActivity(this,0,intent,PendingIntent.FLAG_CANCEL_CURRENT|PendingIntent.FLAG_IMMUTABLE));
  else startActivityAndCollapse(intent);
 }
}
