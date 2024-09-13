package app.smartbuildings;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.WindowManager;
import androidx.annotation.Nullable;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import java.util.Timer;
import java.util.TimerTask;
@ReactModule(name = "IncomingCall")
public class IncomingCallModule extends ReactContextBaseJavaModule {

  public static ReactApplicationContext reactContext;
  public static Activity mainActivity;

  private static final String TAG = "RNIC:IncomingCallModule";
  private WritableMap headlessExtras;
  private String currentlyDisplayedUUID = null;
  private Timer intervalTimer;
  private Handler handler;

  public IncomingCallModule(ReactApplicationContext context) {
    super(context);
    reactContext = context;
    mainActivity = getCurrentActivity();
  }

  @Override
  public String getName() {
    return "IncomingCall";
  }

  private void sendEvent(String eventName, @Nullable WritableMap params) {
    if (reactContext != null) {
      reactContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
        .emit(eventName, params);
    }
  }

  public void cancelIntervalTimer() {
    if (intervalTimer != null) {
      intervalTimer.cancel();
      intervalTimer = null;
    }
  }

  @ReactMethod
  public void display(
    String uuid,
    String name,
    String avatar,
    String info,
    int timeout
  ) {
    if (UnlockScreenActivity.active) {
      return;
    }
    if (currentlyDisplayedUUID != null && currentlyDisplayedUUID.equals(uuid)) {
      // If the UUID matches, return to avoid duplicate triggers
      return;
    }
    if (reactContext != null) {
      Bundle bundle = new Bundle();
      bundle.putString("uuid", uuid);
      bundle.putString("name", name);
      bundle.putString("avatar", avatar);
      bundle.putString("info", info);
      bundle.putInt("timeout", timeout);
      Intent i = new Intent(reactContext, UnlockScreenActivity.class);
      i.addFlags(
        Intent.FLAG_ACTIVITY_NEW_TASK |
        Intent.FLAG_ACTIVITY_REORDER_TO_FRONT |
        Intent.FLAG_ACTIVITY_SINGLE_TOP
      );
      i.addFlags(
        WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED +
        WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD +
        WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
      );

      i.putExtras(bundle);

      WritableMap params = Arguments.createMap();
      params.putString("uuid", uuid);
      params.putString("name", name);
      params.putString("avatar", avatar);
      params.putString("info", info);
      params.putInt("timeout", timeout);
      intervalTimer = new Timer();
      intervalTimer.scheduleAtFixedRate(
        new TimerTask() {
          @Override
          public void run() {
            sendEvent("IntervalTick", null);
          }
        },
        0,
        2000
      );
      intervalTimer.schedule(
        new TimerTask() {
          @Override
          public void run() {
            handler.post(
              new Runnable() {
                public void run() {
                  // Clear the intervalTimer after 35 seconds
                  cancelIntervalTimer();
                }
              }
            );
          }
        },
        timeout + 30000
      );

      sendEvent("IncomingCallDisplay", params);
      currentlyDisplayedUUID = uuid;
      reactContext.startActivity(i);
    }
  }

  private Context getAppContext() {
    return this.reactContext.getApplicationContext();
  }

  @ReactMethod
  public void backToForeground() {
    Context context = getAppContext();
    String packageName = context.getApplicationContext().getPackageName();
    Intent focusIntent = context
      .getPackageManager()
      .getLaunchIntentForPackage(packageName)
      .cloneFilter();
    Activity activity = getCurrentActivity();
    boolean isOpened = activity != null;
    Log.d(
      TAG,
      "backToForeground, app isOpened ?" + (isOpened ? "true" : "false")
    );

    if (isOpened) {
      focusIntent.addFlags(Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
      activity.startActivity(focusIntent);
    }
  }

  @ReactMethod
  public void openAppFromHeadlessMode(String uuid) {
    Context context = getAppContext();
    String packageName = context.getApplicationContext().getPackageName();
    Intent focusIntent = context
      .getPackageManager()
      .getLaunchIntentForPackage(packageName)
      .cloneFilter();
    Activity activity = getCurrentActivity();
    boolean isOpened = activity != null;

    if (!isOpened) {
      focusIntent.addFlags(
        Intent.FLAG_ACTIVITY_NEW_TASK |
        WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON |
        WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED |
        WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD |
        WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
      );

      final WritableMap response = new WritableNativeMap();
      response.putBoolean("isHeadless", true);
      response.putString("uuid", uuid);

      this.headlessExtras = response;

      getReactApplicationContext().startActivity(focusIntent);
    }
  }

  @ReactMethod
  public void getExtrasFromHeadlessMode(Promise promise) {
    if (this.headlessExtras != null) {
      promise.resolve(this.headlessExtras);

      this.headlessExtras = null;

      return;
    }

    promise.resolve(null);
  }

  @ReactMethod
  public void endCall() {
    UnlockScreenActivity unlockScreenActivity = UnlockScreenActivity.getInstance();
    if (UnlockScreenActivity.active) {
      unlockScreenActivity.dismissIncoming();
    }
  }
}
