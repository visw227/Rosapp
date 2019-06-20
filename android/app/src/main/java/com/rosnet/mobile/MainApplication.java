package com.rosnet.mobile;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.levelasquez.androidopensettings.AndroidOpenSettingsPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import com.google.firebase.FirebaseApp;
import com.microsoft.appcenter.reactnative.crashes.AppCenterReactNativeCrashesPackage;
import com.microsoft.appcenter.reactnative.analytics.AppCenterReactNativeAnalyticsPackage;
import com.microsoft.appcenter.reactnative.appcenter.AppCenterReactNativePackage;
import com.microsoft.appcenter.reactnative.push.AppCenterReactNativePushPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.rnfingerprint.FingerprintAuthPackage;
import com.rosnet.mobile.BuildConfig;
import com.rosnet.mobile.R;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.imagepicker.ImagePickerPackage; 
import com.microsoft.appcenter.push.Push;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }
    

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new AndroidOpenSettingsPackage(),
            new RNFirebasePackage(),
            new AppCenterReactNativeCrashesPackage(MainApplication.this, getResources().getString(R.string.appCenterCrashes_whenToSendCrashes)),
            new AppCenterReactNativeAnalyticsPackage(MainApplication.this, getResources().getString(R.string.appCenterAnalytics_whenToEnableAnalytics)),
            new AppCenterReactNativePackage(MainApplication.this),
            new AppCenterReactNativePushPackage(MainApplication.this),
            new VectorIconsPackage(),
            new FingerprintAuthPackage(),
            new RNGestureHandlerPackage(),
            new RNDeviceInfo(),
            new RNFirebaseMessagingPackage(),
              new RNFirebaseNotificationsPackage(),
            //new RNFirebaseBackgroundMessage(),
            new ImagePickerPackage() // <-- add this line 
            // OR if you want to customize dialog style 
            
      );
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
    Push.setSenderId("1016195815770");
    FirebaseApp.initializeApp(this);
    Push.enableFirebaseAnalytics(getApplicationContext());
    SoLoader.init(this, /* native exopackage */ false);
    
  }
}
