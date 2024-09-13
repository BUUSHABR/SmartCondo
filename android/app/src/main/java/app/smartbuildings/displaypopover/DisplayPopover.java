package app.smartbuildings;

import android.app.ActivityManager;
import android.app.AlertDialog;
import android.app.AppOpsManager;
import android.app.Application;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import app.smartbuildings.XiaomiUtilities;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import java.util.List;
import java.util.Locale;

public class DisplayPopover extends ReactContextBaseJavaModule {

  private static final int REQUEST_OVERLAY_PERMISSION = 123;
  private static final int REQUEST_BACKGROUND_POPUP_PERMISSION = 456;
  private Promise overlayPermissionPromise;
  private Promise backgroundPopupPermissionPromise;
  private boolean isDialogShowing = false;

  public DisplayPopover(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "DisplayPopover";
  }

  private void sendOverlayPermissionEvent(boolean isGranted) {
    getReactApplicationContext()
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit("OverlayPermissionEvent", isGranted);
  }

  private void sendBackgroundPopupPermissionEvent(boolean isGranted) {
    getReactApplicationContext()
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit("BackgroundPopupPermissionEvent", isGranted);
  }

  @ReactMethod
  public void requestOverlayPermission(final Promise promise) {
    if (isDialogShowing) {
      // If the dialog is already showing, don't show another one
      return;
    }
    final String packageName = getCurrentActivity().getPackageName();
    AlertDialog.Builder builder = new AlertDialog.Builder(getCurrentActivity());
    builder
      .setTitle("Overlay Permission Required")
      .setMessage(
        "Grant permission for the application to overlay on top of other apps."
      )
      .setPositiveButton(
        "Open Settings",
        new DialogInterface.OnClickListener() {
          @Override
          public void onClick(DialogInterface dialog, int which) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
              if (
                "xiaomi".equals(Build.MANUFACTURER.toLowerCase(Locale.ROOT))
              ) {
                Intent intent = new Intent(
                  "miui.intent.action.APP_PERM_EDITOR"
                );
                intent.setClassName(
                  "com.miui.securitycenter",
                  "com.miui.permcenter.permissions.PermissionsEditorActivity"
                );
                intent.addFlags(
                  Intent.FLAG_ACTIVITY_NEW_TASK |
                  Intent.FLAG_ACTIVITY_CLEAR_TASK
                );
                intent.putExtra("extra_pkgname", packageName);
                getCurrentActivity().startActivity(intent);
              } else {
                Intent overlaySettings = new Intent(
                  Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                  Uri.parse("package:" + packageName)
                );
                getCurrentActivity()
                  .startActivityForResult(
                    overlaySettings,
                    REQUEST_OVERLAY_PERMISSION
                  );
              }
            }
            isDialogShowing = false; // Set the flag to false when the dialog is dismissed
          }
        }
      )
      .setNegativeButton(
        "Cancel",
        new DialogInterface.OnClickListener() {
          @Override
          public void onClick(DialogInterface dialog, int which) {
            dialog.dismiss();
            promise.resolve(false); // Permission is not granted
            sendOverlayPermissionEvent(false); // Send overlay permission listener event
            isDialogShowing = false; // Set the flag to false when the dialog is dismissed
          }
        }
      )
      .setCancelable(false)
      .create()
      .show();

    overlayPermissionPromise = promise;
    isDialogShowing = true;
  }

  @ReactMethod
  public void requestBackgroundPopupPermission(final Promise promise) {
    final String packageName = getCurrentActivity().getPackageName();
    AlertDialog.Builder builder = new AlertDialog.Builder(getCurrentActivity());
    builder
      .setTitle("Background Popup Permission Required")
      .setMessage(
        "To display pop-up windows, please grant the necessary permission."
      )
      .setPositiveButton(
        "Open Settings",
        new DialogInterface.OnClickListener() {
          @Override
          public void onClick(DialogInterface dialog, int which) {
            Intent backgroundPopupPermissionIntent = new Intent(
              Settings.ACTION_APPLICATION_DETAILS_SETTINGS,
              Uri.fromParts("package", packageName, null)
            );
            getCurrentActivity()
              .startActivityForResult(
                backgroundPopupPermissionIntent,
                REQUEST_BACKGROUND_POPUP_PERMISSION
              );
          }
        }
      )
      .setNegativeButton(
        "Cancel",
        new DialogInterface.OnClickListener() {
          @Override
          public void onClick(DialogInterface dialog, int which) {
            dialog.dismiss();
            promise.resolve(false); // Permission is not granted
            sendBackgroundPopupPermissionEvent(false); // Send background popup permission listener event
          }
        }
      )
      .setCancelable(false)
      .create()
      .show();

    backgroundPopupPermissionPromise = promise;
  }

  @ReactMethod
  public void checkOverlayPermission(Promise promise) {
    boolean isXiaomi = XiaomiUtilities.isMIUI();
    boolean isGranted = XiaomiUtilities.isCustomPermissionGranted(
      getReactApplicationContext(),
      XiaomiUtilities.OP_BACKGROUND_START_ACTIVITY
    );
    boolean isShowOnLock = XiaomiUtilities.isCustomPermissionGranted(
      getReactApplicationContext(),
      XiaomiUtilities.OP_SHOW_WHEN_LOCKED
    );
    boolean displayPopupPermissionXiaomi = Settings.canDrawOverlays(
      getReactApplicationContext()
    );
    if (isXiaomi) {
      promise.resolve(
        isGranted && displayPopupPermissionXiaomi && isShowOnLock
      );
    } else {
      boolean displayPopupPermission = Settings.canDrawOverlays(
        getReactApplicationContext()
      );
      promise.resolve(displayPopupPermission);
    }
  }

  private boolean isAppRunningInBackground() {
    ActivityManager activityManager = (ActivityManager) getReactApplicationContext()
      .getSystemService(Context.ACTIVITY_SERVICE);
    if (activityManager != null) {
      List<ActivityManager.RunningAppProcessInfo> runningProcesses = activityManager.getRunningAppProcesses();
      if (runningProcesses != null) {
        String packageName = getReactApplicationContext().getPackageName();
        for (ActivityManager.RunningAppProcessInfo processInfo : runningProcesses) {
          if (processInfo.processName.equals(packageName)) {
            return (
              processInfo.importance !=
              ActivityManager.RunningAppProcessInfo.IMPORTANCE_FOREGROUND
            );
          }
        }
      }
    }
    return false;
  }

  @ReactMethod
  public void checkBackgroundPopupPermission(Promise promise) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
      if (Settings.canDrawOverlays(getReactApplicationContext())) {
        promise.resolve(true); // Background popup permission is granted
      } else {
        // Create an intent to open the background settings
        Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION);
        intent.addCategory(Intent.CATEGORY_DEFAULT);
        intent.setData(
          Uri.parse("package:" + getReactApplicationContext().getPackageName())
        );

        // Check if there are activities available to handle the intent
        if (
          intent.resolveActivity(
            getReactApplicationContext().getPackageManager()
          ) !=
          null
        ) {
          // Start the settings activity
          getReactApplicationContext().startActivity(intent);
        }

        promise.resolve(false); // Background popup permission is not granted
      }
    } else {
      promise.resolve(true); // Background popup permission is granted for pre-Q versions
    }
  }
}
