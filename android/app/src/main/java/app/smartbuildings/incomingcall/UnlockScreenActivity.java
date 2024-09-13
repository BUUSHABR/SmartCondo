package app.smartbuildings;

import android.app.Activity;
import android.app.ActivityManager;
import android.app.ActivityManager.RunningAppProcessInfo;
import android.app.KeyguardManager;
import android.content.Context;
import android.content.Intent;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Vibrator;
import android.provider.Settings;
import android.util.Log;
import android.view.View;
import android.view.WindowManager;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import app.smartbuildings.IncomingCallModule;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.squareup.picasso.Picasso;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

public class UnlockScreenActivity
  extends AppCompatActivity
  implements UnlockScreenActivityInterface {

  private static final String TAG = "MessagingService";
  private TextView tvName;
  private TextView tvInfo;
  private ImageView ivAvatar;
  private Integer timeout = 0;
  private String uuid = "";
  static boolean active = false;
  private static Vibrator v = (Vibrator) IncomingCallModule.reactContext.getSystemService(
    Context.VIBRATOR_SERVICE
  );
  private long[] pattern = { 0, 1000, 800 };
  private static MediaPlayer player = MediaPlayer.create(
    IncomingCallModule.reactContext,
    Settings.System.DEFAULT_RINGTONE_URI
  );
  private static Activity fa;
  private Timer timer;
  private static UnlockScreenActivity instance;
  private String currentlyDisplayedUUID = null;

  private void cancelIntervalTimer() {
    ReactApplicationContext reactContext = IncomingCallModule.reactContext;
    IncomingCallModule incomingCallModule = reactContext.getNativeModule(
      IncomingCallModule.class
    );
    incomingCallModule.cancelIntervalTimer();
  }

  @Override
  public void onStart() {
    super.onStart();
    if (this.timeout > 0) {
      this.timer = new Timer();
      this.timer.schedule(
          new TimerTask() {
            @Override
            public void run() {
              dismissIncoming();
            }
          },
          timeout
        );
    }
    active = true;
  }

  @Override
  public void onStop() {
    super.onStop();
    active = false;
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    fa = this;
    instance = this;

    setContentView(R.layout.activity_call_incoming);

    tvName = findViewById(R.id.tvName);
    tvInfo = findViewById(R.id.tvInfo);
    ivAvatar = findViewById(R.id.ivAvatar);

    Bundle bundle = getIntent().getExtras();
    if (bundle != null) {
      if (bundle.containsKey("uuid")) {
        uuid = bundle.getString("uuid");
      }
      if (bundle.containsKey("name")) {
        String name = bundle.getString("name");
        tvName.setText(name);
      }
      if (bundle.containsKey("info")) {
        String info = bundle.getString("info");
        tvInfo.setText(info);
      }
      if (bundle.containsKey("avatar")) {
        String avatar = bundle.getString("avatar");
        if (avatar != null) {
          Picasso
            .get()
            .load(avatar)
            .transform(new CircleTransform())
            .into(ivAvatar);
        }
      }
      if (bundle.containsKey("timeout")) {
        this.timeout = bundle.getInt("timeout");
      } else this.timeout = 0;
    }

    getWindow()
      .addFlags(
        WindowManager.LayoutParams.FLAG_FULLSCREEN |
        WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON |
        WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON |
        WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED |
        WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD
      );

    v.vibrate(pattern, 0);
    player.start();

    AnimateImage acceptCallBtn = findViewById(R.id.ivAcceptCall);
    acceptCallBtn.setOnClickListener(
      new View.OnClickListener() {
        @Override
        public void onClick(View view) {
          try {
            v.cancel();
            player.stop();
            player.prepareAsync();
            acceptDialing();
          } catch (Exception e) {
            WritableMap params = Arguments.createMap();
            params.putString("message", e.getMessage());
            sendEvent("error", params);
            dismissDialing();
          }
        }
      }
    );

    AnimateImage rejectCallBtn = findViewById(R.id.ivDeclineCall);
    rejectCallBtn.setOnClickListener(
      new View.OnClickListener() {
        @Override
        public void onClick(View view) {
          v.cancel();
          player.stop();
          player.prepareAsync();
          dismissDialing();
        }
      }
    );
  }

  public static UnlockScreenActivity getInstance() {
    return instance;
  }

  @Override
  public void onBackPressed() {
    // Dont back
  }

  public void dismissIncoming() {
    v.cancel();
    player.stop();
    player.prepareAsync();
    dismissDialing();
  }

  private void acceptDialing() {
    WritableMap params = Arguments.createMap();
    params.putBoolean("accept", true);
    params.putString("uuid", uuid);
    if (currentlyDisplayedUUID != null && currentlyDisplayedUUID.equals(uuid)) {
      // If the UUID matches, return to avoid duplicate triggers
      return;
    }
    if (timer != null) {
      timer.cancel();
    }
    if (!IncomingCallModule.reactContext.hasCurrentActivity()) {
      params.putBoolean("isHeadless", true);
    }
    KeyguardManager mKeyguardManager = (KeyguardManager) getSystemService(
      Context.KEYGUARD_SERVICE
    );

    if (mKeyguardManager.isDeviceLocked()) {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        mKeyguardManager.requestDismissKeyguard(
          this,
          new KeyguardManager.KeyguardDismissCallback() {
            @Override
            public void onDismissSucceeded() {
              super.onDismissSucceeded();
            }
          }
        );
      }
    }
    cancelIntervalTimer();

    sendEvent("answerCall", params);
    currentlyDisplayedUUID = uuid;

    finish();
  }

  private void dismissDialing() {
    WritableMap params = Arguments.createMap();
    params.putBoolean("accept", false);
    params.putString("uuid", uuid);
    if (currentlyDisplayedUUID != null && currentlyDisplayedUUID.equals(uuid)) {
      // If the UUID matches, return to avoid duplicate triggers
      return;
    }
    if (timer != null) {
      timer.cancel();
    }
    if (!IncomingCallModule.reactContext.hasCurrentActivity()) {
      params.putBoolean("isHeadless", true);
    }
    cancelIntervalTimer();
    sendEvent("endCall", params);
    currentlyDisplayedUUID = uuid;

    finish();
  }

  @Override
  public void onConnected() {
    Log.d(TAG, "onConnected: ");
    runOnUiThread(
      new Runnable() {
        @Override
        public void run() {}
      }
    );
  }

  @Override
  public void onDisconnected() {
    Log.d(TAG, "onDisconnected: ");
  }

  @Override
  public void onConnectFailure() {
    Log.d(TAG, "onConnectFailure: ");
  }

  @Override
  public void onIncoming(ReadableMap params) {
    Log.d(TAG, "onIncoming: ");
  }

  private void sendEvent(String eventName, WritableMap params) {
    IncomingCallModule.reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit(eventName, params);
  }
}
