package com.trinetzet.taskcapture;
// This non-exported entry is reachable only through our own tile PendingIntent.
public final class ClipboardActivity extends CaptureActivity {
 @Override protected boolean readsClipboard(){return true;}
}
