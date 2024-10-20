// with credit to
// https://saurav-raj-ash.medium.com/harnessing-headless-js-in-react-native-for-continuous-location-tracking-085e4f32a892

package com.thejeffcooper.hassmic;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.ServiceInfo;
import android.media.AudioAttributes;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.os.PowerManager;
import android.util.Log;

import androidx.annotation.RequiresApi;
import androidx.core.app.NotificationCompat;
import androidx.core.content.ContextCompat;

import androidx.media3.common.MediaItem;
import androidx.media3.exoplayer.ExoPlayer;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.io.IOException;
import java.util.HashSet;
import java.util.Set;
import javax.annotation.Nullable;

public class BackgroundTaskService extends Service {
  public static final String PLAY_SPEECH_ACTION = "com.thejeffcooper.hassmic.INTENT_PLAY_SOUND";

  public static final String EVENT_PLAY_SPEECH_START = "hassmic.SpeechStart";
  public static final String EVENT_PLAY_SPEECH_STOP = "hassmic.SpeechStop";

  public static final String URL_KEY = "URL";

  private static final int SERVICE_NOTIFICATION_ID = 100001;
  private static final String CHANNEL_ID = "BACKGROUND_LISTEN";

  private Handler handler = new Handler();
  private ExoPlayer exo;

  private Runnable runnableCode = new Runnable() {
    @Override
    public void run() {

      Context context = getApplicationContext();

      // Start BackgroundEventService
      Intent myIntent = new Intent(context, BackgroundEventService.class);
      context.startService(myIntent);

      // Acquire wake lock
      HeadlessJsTaskService.acquireWakeLockNow(context);

      // start the exoplayer
      exo = new ExoPlayer.Builder(context).build();
    }
  };

  @Override
  public IBinder onBind(Intent intent) {
    return null;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    IntentFilter filter = new IntentFilter(PLAY_SPEECH_ACTION);
    ContextCompat.registerReceiver(getApplicationContext(), brec, filter, ContextCompat.RECEIVER_EXPORTED);
    Log.d("HassmicBackgroundTaskService", "Registered receiver for " + brec.toString());
  }

  private final BroadcastReceiver brec = new BroadcastReceiver() {
    @Override
    public void onReceive(Context context, Intent intent) {
      String action = intent.getAction();
      if(action.equals(PLAY_SPEECH_ACTION)) {
        String url = intent.getStringExtra(URL_KEY);
        Log.d("HassmicBackgroundTaskService", "Playing " + url);
        MediaItem i = MediaItem.fromUri(url);
        exo.setMediaItem(i);
        exo.prepare();
        exo.play();
      }
    }
  };

  @Override
  public void onDestroy() {
    super.onDestroy();
    Log.d("HassmicBackgroundTaskService", "Destroying service");
    exo.release();
    this.handler.removeCallbacks(this.runnableCode); // Stop runnable execution
    getApplicationContext().unregisterReceiver(brec);
    stopForeground(STOP_FOREGROUND_REMOVE);
  }

  @Override
  public int onStartCommand(Intent intent, int flags, int startId) {
    Log.d("HassmicBackgroundTaskService", "Starting service");
    this.handler.post(this.runnableCode); // Start runnable execution

    // Create notification for foreground service
    Intent notificationIntent = new Intent(this, MainActivity.class);
    PendingIntent contentIntent = PendingIntent.getActivity(this, 0, notificationIntent, PendingIntent.FLAG_CANCEL_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      createChannel();
      Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
        .setContentIntent(contentIntent)
        .setTicker("HassMic Active") // Informative ticker text
        .setContentTitle("HassMic") // Your app's name
        .setContentText("HassMic is Running") // Explain what's happening
        .setSmallIcon(R.mipmap.ic_launcher)
        .setOngoing(true)
        .build();

      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
        startForeground(SERVICE_NOTIFICATION_ID, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_MICROPHONE | ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK);
      } else {
        startForeground(SERVICE_NOTIFICATION_ID, notification);
      }
    }
    return START_STICKY_COMPATIBILITY;
  }

  @RequiresApi(Build.VERSION_CODES.O)
  private void createChannel() {
    String description = "Background Notifications";
    int importance = NotificationManager.IMPORTANCE_DEFAULT;
    NotificationChannel channel = new NotificationChannel(CHANNEL_ID, "background_notifications", importance);
    channel.setDescription(description);
    NotificationManager notificationManager =
      (NotificationManager) getApplicationContext().getSystemService(NOTIFICATION_SERVICE);

    notificationManager.createNotificationChannel(channel);
  }
}
