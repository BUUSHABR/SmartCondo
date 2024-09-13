package app.smartbuildings;
import android.os.Bundle;
import io.wazo.callkeep.RNCallKeepModule;
// import android.support.annotation.NonNull;
// import android.support.annotation.Nullable;
import com.facebook.react.ReactActivity;

// import com.reactnativenavigation.NavigationActivity;

public class MainActivity extends ReactActivity {
  @Override
  protected String getMainComponentName() {
    return "smartbuildings";  
  }

  @Override
protected void onCreate(Bundle savedInstanceState) {
  super.onCreate(null);
  }
  // @Override
  //   public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
  //       super.onRequestPermissionsResult(requestCode, permissions, grantResults);
  //       switch (requestCode) {
  //           case RNCallKeepModule.REQUEST_READ_PHONE_STATE:
  //               RNCallKeepModule.onRequestPermissionsResult(requestCode, permissions, grantResults);
  //               break;
  //       }
  //   }
}
