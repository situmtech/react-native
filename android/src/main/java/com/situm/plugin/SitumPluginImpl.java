package com.situm.plugin;

import android.Manifest;
import android.os.Build;
import android.telecom.Call;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.PromiseImpl;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.modules.permissions.PermissionsModule;

import java.util.concurrent.TimeUnit;

import androidx.annotation.NonNull;
import es.situm.sdk.SitumSdk;

public class SitumPluginImpl extends ReactContextBaseJavaModule implements SitumPlugin {
    private static final String TAG = "SitumPlugin";
    private static final String PLUGIN_NAME = "RNCSitumPlugin";
    private static ReactApplicationContext reactContext;
    private static volatile PluginHelper pluginInstance;

    SitumPluginImpl(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    private static PluginHelper getPluginInstance() {
        if (pluginInstance == null) { //Check for the first time
            synchronized (PluginHelper.class) {   //Check for the second time.
                //if there is no instance available... create new one
                if (pluginInstance == null) pluginInstance = new PluginHelper();
            }
        }
        return pluginInstance;
    }

    @NonNull
    @Override
    public String getName() {
        return PLUGIN_NAME;
    }

    @ReactMethod
    public void initSitumSDK() {
        SitumSdk.init(reactContext);
    }

    @Override
    @ReactMethod
    public void setApiKey(String email, String apiKey, Callback callback) {
        if(email.isEmpty() || apiKey.isEmpty()) return;
        
        boolean isSuccess = SitumSdk.configuration().setApiKey(email, apiKey);

        WritableMap response = Arguments.createMap();
        response.putBoolean("success", isSuccess);

        callback.invoke(response);
    }

    @Override
    @ReactMethod
    public void setUseRemoteConfig(String useRemoteConfig, Callback callback) {
        SitumSdk.configuration().setUseRemoteConfig(useRemoteConfig.equalsIgnoreCase("true") ? true : false);
        if (callback != null) {
            WritableMap response = Arguments.createMap();
            response.putBoolean("success", true);
    
            callback.invoke(response);
        }
    }

    @Override
    @ReactMethod
    public void setUserPass(String email, String password, Callback callback) {
        if(email.isEmpty() || password.isEmpty()) return;
        
        boolean isSuccess = SitumSdk.configuration().setUserPass(email, password);

        WritableMap response = Arguments.createMap();
        response.putBoolean("success", isSuccess);

        callback.invoke(response);
    }

    @Override
    @ReactMethod
    public void setCacheMaxAge(int cacheAge, Callback callback) {
        boolean isSuccess = SitumSdk.configuration().setCacheMaxAge(cacheAge, TimeUnit.SECONDS);

        WritableMap response = Arguments.createMap();
        response.putBoolean("success", isSuccess);

        callback.invoke(response);

    }

    @Override
    @ReactMethod
    public void fetchBuildings(Callback success, Callback error) {
        getPluginInstance().fetchBuildings(success, error);
    }

    @Override
    @ReactMethod
    public void fetchBuildingInfo(ReadableMap map, Callback success, Callback error) {
        getPluginInstance().fetchBuildingInfo(map, success, error);
    }

    @Override
    @ReactMethod
    public void fetchFloorsFromBuilding(ReadableMap map, Callback success, Callback error) {
        getPluginInstance().fetchFloorsFromBuilding(map, success, error);
    }

    @Override
    @ReactMethod
    public void fetchMapFromFloor(ReadableMap map, Callback success, Callback error) {
        getPluginInstance().fetchMapFromFloor(map, success, error);
    }

    @Override
    @ReactMethod
    public void fetchGeofencesFromBuilding(ReadableMap map, Callback success, Callback error) {
        getPluginInstance().fetchGeofencesFromBuilding(map, success, error);
    }

    @Override
    @ReactMethod
    public void startPositioning(ReadableMap map) {
        getPluginInstance().startPositioning(map, getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class));
    }

    @Override
    @ReactMethod
    public void stopPositioning(Callback callback) {
        getPluginInstance().stopPositioning(callback);
    }

    @Override
    @ReactMethod
    public void requestDirections(ReadableArray requestArray, Callback success, Callback error) {
        getPluginInstance().requestDirections(requestArray, success, error, getReactApplicationContext());
    }

    @Override
    @ReactMethod
    public void fetchPoiCategories(Callback success, Callback error) {
        getPluginInstance().fetchPoiCategories(success, error);
    }

    @Override
    @ReactMethod
    public void fetchPoiCategoryIconNormal(ReadableMap map, Callback success, Callback error) {
        getPluginInstance().fetchPoiCategoryIconNormal(map, success, error);
    }

    @Override
    @ReactMethod
    public void fetchPoiCategoryIconSelected(ReadableMap map, Callback success, Callback error) {
        getPluginInstance().fetchPoiCategoryIconSelected(map, success, error);
    }

    @Override
    @ReactMethod
    public void fetchIndoorPOIsFromBuilding(ReadableMap map, Callback success, Callback error) {
        getPluginInstance().fetchIndoorPOIsFromBuilding(map, success, error);
    }

    @Override
    @ReactMethod
    public void fetchOutdoorPOIsFromBuilding(ReadableMap map, Callback success, Callback error) {
        getPluginInstance().fetchOutdoorPOIsFromBuilding(map, success, error);
    }

    @Override
    @ReactMethod
    public void fetchEventsFromBuilding(ReadableMap map, Callback success, Callback error) {
        getPluginInstance().fetchEventsFromBuilding(map, success, error);
    }

    @Override
    @ReactMethod
    public void requestNavigationUpdates(ReadableMap options) {
        getPluginInstance().requestNavigationUpdates(options, getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class), getReactApplicationContext());
    }

    @Override
    @ReactMethod
    public void updateNavigationWithLocation(ReadableMap map, Callback success, Callback error) {
        getPluginInstance().updateNavigationWithLocation(map, success, error);
    }

    @Override
    @ReactMethod
    public void removeNavigationUpdates(Callback callback) {
        getPluginInstance().removeNavigationUpdates(callback);
    }

    @Override
    @ReactMethod
    public void requestRealTimeUpdates(ReadableMap map) {
        getPluginInstance().requestRealTimeUpdates(map, getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class));
    }

    @Override
    @ReactMethod
    public void removeRealTimeUpdates() {
        getPluginInstance().removeRealTimeUpdates();
    }

    @Override
    @ReactMethod
    public void checkIfPointInsideGeofence(ReadableMap map, Callback callback) {
        getPluginInstance().checkIfPointIsInsideGeoFence(map, callback);
    }

    @Override
    @ReactMethod
    public void invalidateCache() {
        getPluginInstance().invalidateCache();
    }

    @Override
    @ReactMethod
    public void getDeviceId(Callback callback) {
        WritableMap response = Arguments.createMap();
        response.putDouble("deviceId", SitumSdk.getDeviceID());

        callback.invoke(response);
    }
    
    @Override
    @ReactMethod
    public void requestAuthorization() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            final PermissionsModule perms = getReactApplicationContext().getNativeModule(PermissionsModule.class);

            final Callback onPermissionGranted = new Callback() {
                @Override
                public void invoke(Object... args) {
                    String result = (String) args[0];
                    if (!result.equals("granted")) {
                        Log.e(TAG, "Location permission was not granted.");
                    }
                }
            };

            final Callback onPermissionDenied = new Callback() {
                @Override
                public void invoke(Object... args) {
                    Log.e(TAG, "Failed to request location permission.");
                }
            };

            Callback onPermissionCheckFailed = new Callback() {
                @Override
                public void invoke(Object... args) {

                    Log.e(TAG, "Failed to check location permission.");
                }
            };

            Callback onPermissionChecked = new Callback() {
                @Override
                public void invoke(Object... args) {
                    boolean hasPermission = (boolean) args[0];

                    if (!hasPermission) {
                        perms.requestPermission(Manifest.permission.ACCESS_FINE_LOCATION, new PromiseImpl(onPermissionGranted, onPermissionDenied));
                    }
                }
            };

            perms.checkPermission(Manifest.permission.ACCESS_FINE_LOCATION, new PromiseImpl(onPermissionChecked, onPermissionCheckFailed));
        }
    }


}