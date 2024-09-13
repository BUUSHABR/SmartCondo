package app.smartbuildings;

import android.annotation.SuppressLint;
import android.annotation.TargetApi;
import android.app.AppOpsManager;
import android.content.Context;
import android.content.Intent;
import android.text.TextUtils;
import android.util.Log;
import java.lang.reflect.Method;

public class XiaomiUtilities {

  // custom permissions

  public static final int OP_BACKGROUND_START_ACTIVITY = 10021;
	public static final int OP_SHOW_WHEN_LOCKED = 10020;
  public static boolean isMIUI() {
    return !TextUtils.isEmpty(getSystemProperty("ro.miui.ui.version.name"));
  }

  @SuppressLint("PrivateApi")
  private static String getSystemProperty(String key) {
    try {
      Class props = Class.forName("android.os.SystemProperties");
      return (String) props.getMethod("get", String.class).invoke(null, key);
    } catch (Exception ignore) {}
    return null;
  }

  @SuppressWarnings("JavaReflectionMemberAccess")
  @TargetApi(19)
  public static boolean isCustomPermissionGranted(
    Context context,
    int permission
  ) {
    try {
      AppOpsManager mgr = (AppOpsManager) context.getSystemService(
        Context.APP_OPS_SERVICE
      );
      Method m =
        AppOpsManager.class.getMethod(
            "checkOpNoThrow",
            int.class,
            int.class,
            String.class
          );
      int result = (int) m.invoke(
        mgr,
        permission,
        android.os.Process.myUid(),
        context.getPackageName()
      );
      return result == AppOpsManager.MODE_ALLOWED;
    } catch (Exception e) {}
    return true;
  }

  public static Intent getPermissionManagerIntent(Context context) {
    Intent intent = new Intent("miui.intent.action.APP_PERM_EDITOR");
    intent.putExtra("extra_package_uid", android.os.Process.myUid());
    intent.putExtra("extra_pkgname", context.getPackageName());
    intent.putExtra("extra_package_name", context.getPackageName());
    return intent;
  }
}
