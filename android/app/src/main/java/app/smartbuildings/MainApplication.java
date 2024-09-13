package app.smartbuildings;

import android.app.Application;
import android.content.Context;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;


// import com.reactnativenavigation.NavigationApplication;
// import com.reactnativenavigation.react.NavigationPackage;
import cl.json.RNSharePackage;
import cl.json.RNSharePackage;
import com.horcrux.svg.SvgPackage;
import com.actionsheet.ActionSheetPackage;
import com.reactnativecommunity.checkbox.ReactCheckBoxPackage;
import com.robinpowered.react.ScreenBrightness.ScreenBrightnessPackage;
import org.pweitz.reactnative.locationswitch.LocationSwitchPackage;
import com.robinpowered.react.ScreenBrightness.ScreenBrightnessPackage;
import io.wazo.callkeep.RNCallKeepPackage;
import org.capslock.RNDeviceBrightness.RNDeviceBrightness;
import com.twiliorn.library.TwilioPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
// import com.reactnativenavigation.react.NavigationReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import java.lang.reflect.InvocationTargetException;
import java.util.List;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import app.smartbuildings.opensettings.*;
import com.facebook.react.bridge.JSIModulePackage;
import com.swmansion.reanimated.ReanimatedJSIModulePackage;



public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
  new ReactNativeHost(this) {
        // @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        // @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
            packages.add(new OpenSettingsPackage());
            packages.add(new MyAppPackage());

          return packages;
        }
          // @Override 
  protected JSIModulePackage getJSIModulePackage() { 
    return new ReanimatedJSIModulePackage();
   }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);

    
    initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
  }

  /**
   * Loads Flipper in React Native templates. Call this in the onCreate method with something like
   * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
   *
   * @param context
   * @param reactInstanceManager
   */
  private static void initializeFlipper(
      Context context, ReactInstanceManager reactInstanceManager) {
    if (BuildConfig.DEBUG) {
      try {
        Class<?> aClass = Class.forName("app.smartbuildings.ReactNativeFlipper");
        aClass
            .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
            .invoke(null, context, reactInstanceManager);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}
