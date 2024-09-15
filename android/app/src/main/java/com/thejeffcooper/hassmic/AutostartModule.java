package com.thejeffcooper.hassmic;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Map;
import java.util.HashMap;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;


//class BootReceiver extends BroadcastReceiver {
public class AutostartModule extends BroadcastReceiver {
  @Override
   public void onReceive(Context context, Intent intent) {
     if (Intent.ACTION_BOOT_COMPLETED.equals(intent.getAction())) {
       Intent activityIntent = new Intent(context, MainActivity.class);
       context.startActivity(activityIntent);
     }
   }
}

//public class AutostartModule extends ReactContextBaseJavaModule {
//   AutostartModule(ReactApplicationContext context) {
//       super(context);
//       context.registerReceiver(new BootReceiver(), new IntentFilter("android.intent.action.BOOT_COMPLETED"));
//   }
//
//   public String getName() {
//     return "AutostartModule";
//   }
//}
