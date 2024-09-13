package app.smartbuildings.opensettings;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.AppOpsManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.PowerManager;
import android.os.PowerManager.WakeLock;
import android.app.KeyguardManager;
import android.provider.Settings;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

import android.bluetooth.BluetoothAdapter;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import android.text.TextUtils;
import android.util.Log;

import androidx.core.app.ActivityCompat;

import com.facebook.react.bridge.ReactMethod;

import java.util.List;
import java.util.Locale;

import app.smartbuildings.AutoStartHelper;
import app.smartbuildings.Autostart;
import app.smartbuildings.MainActivity;


public class OpenSettingsModule extends ReactContextBaseJavaModule {
    private static final String TAG = "OpenSettings";
    private static final String POWER_WAKE_LOCK = "OpenSettings:PowerWakeLock";
    public static ReactApplicationContext reactContext;
    private WakeLock wakeLock;



    @Override
    public String getName() {
        /**
         * return the string name of the NativeModule which represents this class in JavaScript
         * In JS access this module through React.NativeModules.OpenSettings
         */
        return "OpenSettings";
    }

    @ReactMethod
    public void openBluetoothSettings(Callback cb) {

        Activity currentActivity = getCurrentActivity();

        if (currentActivity == null) {
            cb.invoke(false);
            return;
        }

        try {
            currentActivity.startActivity(new Intent(android.provider.Settings.ACTION_BLUETOOTH_SETTINGS
            ));
            cb.invoke(true);
        } catch (Exception e) {
            cb.invoke(e.getMessage());
        }
    }

    @ReactMethod
    public void openLocationSettings(Callback cb) {
        Activity currentActivity = getCurrentActivity();

        if (currentActivity == null) {
            cb.invoke(false);
            return;
        }

        try {
            currentActivity.startActivity(new Intent(android.provider.Settings.ACTION_LOCATION_SOURCE_SETTINGS
            ));
            cb.invoke(true);
        } catch (Exception e) {
            cb.invoke(e.getMessage());
        }
    }


    @ReactMethod
    public void openApp(Callback cb) {
        try {
            Intent intent = new Intent(getReactApplicationContext(), MainActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
            getReactApplicationContext().startActivity(intent);

            // Check if the app has the "Display pop-up windows" permission enabled
            if (!Settings.canDrawOverlays(getReactApplicationContext())) {
                // Prompt the user to grant the permission
                Intent overlayIntent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:" + getReactApplicationContext().getPackageName()));
                overlayIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                getReactApplicationContext().startActivity(overlayIntent);
            }

            // Acquire wakelock to wake up the device
            PowerManager powerManager = (PowerManager) getReactApplicationContext().getSystemService(Context.POWER_SERVICE);
            wakeLock = powerManager.newWakeLock(
                    PowerManager.PARTIAL_WAKE_LOCK | PowerManager.ACQUIRE_CAUSES_WAKEUP,
                    POWER_WAKE_LOCK
            );
            wakeLock.acquire();

            // Unlock the device's screen
            KeyguardManager keyguardManager = (KeyguardManager) getReactApplicationContext().getSystemService(Context.KEYGUARD_SERVICE);
            KeyguardManager.KeyguardLock keyguardLock = keyguardManager.newKeyguardLock(TAG);
            keyguardLock.disableKeyguard();

            // Release the wakelock and invoke the callback after a delay
            final WakeLock finalWakeLock = wakeLock;
            getReactApplicationContext().runOnUiQueueThread(new Runnable() {
                @Override
                public void run() {
                    try {
                        Thread.sleep(2000); // Delay for 2 seconds (adjust as needed)
                        finalWakeLock.release();
                        cb.invoke(true);
                    } catch (InterruptedException e) {
                        Log.e(TAG, "Failed to release wakelock: " + e.getMessage());
                        cb.invoke(false);
                    }
                }
            });
        } catch (Exception e) {
            Log.e(TAG, "Failed to open the app: " + e.getMessage());
            cb.invoke(e.getMessage());
        }
    }


    @ReactMethod
    public void allowBackgroundProcess(Callback cb) {
 
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                if ("xiaomi".equals(Build.MANUFACTURER.toLowerCase(Locale.ROOT))) {
                    final Intent intent = new Intent("miui.intent.action.APP_PERM_EDITOR");
                    intent.setClassName("com.miui.securitycenter",
                            "com.miui.permcenter.permissions.PermissionsEditorActivity");
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                    intent.putExtra("extra_pkgname", reactContext.getPackageName());
                    reactContext.startActivity(intent);
                } else {
                    Intent overlaySettings = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:" + reactContext.getPackageName()));
                    reactContext.startActivityForResult(overlaySettings, 1234, null);
                   
                }

            // }
        }


    }

    @ReactMethod
    public void addAutoStartup(Callback cb) {

        try {
            AutoStartHelper.getInstance().getAutoStartPermission(reactContext);
            cb.invoke(true);

        } catch (Exception e) {
            Log.e("exc", String.valueOf(e));
            cb.invoke(e.getMessage());


        }

        // try {
        //     Log.d("TAG", "autoStartUp: ");
        //     Intent intent = new Intent();
        //     String manufacturer = android.os.Build.MANUFACTURER;
        //     if ("xiaomi".equalsIgnoreCase(manufacturer)) {
        //         intent.setComponent(new ComponentName("com.miui.securitycenter", "com.miui.permcenter.autostart.AutoStartManagementActivity"));
        //     } else if ("oppo".equalsIgnoreCase(manufacturer)) {
        //         intent.setComponent(new ComponentName("com.coloros.safecenter", "com.coloros.safecenter.permission.startup.StartupAppListActivity"));
        //     } else if ("vivo".equalsIgnoreCase(manufacturer)) {
        //         intent.setComponent(new ComponentName("com.vivo.permissionmanager", "com.vivo.permissionmanager.activity.BgStartUpManagerActivity"));
        //     } else if ("Letv".equalsIgnoreCase(manufacturer)) {
        //         intent.setComponent(new ComponentName("com.letv.android.letvsafe", "com.letv.android.letvsafe.AutobootManageActivity"));
        //     } else if ("Honor".equalsIgnoreCase(manufacturer)) {
        //         intent.setComponent(new ComponentName("com.huawei.systemmanager", "com.huawei.systemmanager.optimize.process.ProtectActivity"));
        //     }

        //     List<ResolveInfo> list =reactContext.getPackageManager().queryIntentActivities(intent, PackageManager.MATCH_DEFAULT_ONLY);
        //     if  (list.size() > 0) {
        //         reactContext.startActivity(intent);
        //     }
        // } catch (Exception e) {
        //     Log.e("exc" , String.valueOf(e));
        // }
    }

    @ReactMethod
    public static boolean hasSelfPermissionForXiaomi(Context reactContext, String permission) {
        Log.d("TAG", "hasSelfPermissionForXiaomi:");

        AppOpsManager appOpsManager = (AppOpsManager) reactContext.getSystemService(Context.APP_OPS_SERVICE);
        String op = AppOpsManager.permissionToOp(permission);   
        if (!TextUtils.isEmpty(op)) {
            int checkOp = appOpsManager.checkOp(op, reactContext.getApplicationInfo().uid, reactContext.getPackageName());
            return checkOp == AppOpsManager.MODE_ALLOWED && ActivityCompat.checkSelfPermission(reactContext, permission) == PackageManager.PERMISSION_GRANTED;
        }
        return true;
    }


    public OpenSettingsModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;

    }
}
