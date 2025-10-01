package com.situm.plugin;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

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
        getPluginInstance().setContext(context);
        registerLifecycleListener(context);
    }

    private static PluginHelper getPluginInstance() {
        if (pluginInstance == null) { // Check for the first time
            synchronized (PluginHelper.class) { // Check for the second time.
                // if there is no instance available... create new one
                if (pluginInstance == null)
                    pluginInstance = new PluginHelper();
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
        getPluginInstance().onSdkInitialized(
            getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class),
            getReactApplicationContext()
        );
    }

    // Required for rn built in EventEmitter Calls.
    @ReactMethod
    public void addListener(String eventName) {

    }

    @ReactMethod
    public void removeListeners(Integer count) {

    }

    @Override
    @ReactMethod
    public void setApiKey(String email, String apiKey, Callback callback) {
        if (email.isEmpty() || apiKey.isEmpty())
            return;

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
        if (email.isEmpty() || password.isEmpty())
            return;

        boolean isSuccess = SitumSdk.configuration().setUserPass(email, password);

        WritableMap response = Arguments.createMap();
        response.putBoolean("success", isSuccess);

        callback.invoke(response);
    }

    @Override
    @ReactMethod
    public void setDashboardURL(String url, Callback callback) {
        boolean success = false;

        if (url != null && !url.isEmpty()) {
            success = true;
            SitumSdk.configuration().setDashboardURL(url);
        }

        if (callback != null) {
            WritableMap response = Arguments.createMap();
            response.putBoolean("success", success);
            callback.invoke(response);
        }
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
    public void fetchTilesFromBuilding(ReadableMap map, Callback success, Callback error) {
        getPluginInstance().fetchTilesFromBuilding(map, success, error);
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
        getPluginInstance().startPositioning(map,
                getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class));
    }

    @Override
    @ReactMethod
    public void stopPositioning(Callback callback) {
       getPluginInstance().stopPositioning(callback, getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class));
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
        getPluginInstance().requestNavigationUpdates(options,
                getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class),
                getReactApplicationContext());
    }

    @Override
    @ReactMethod
    public void updateNavigationWithLocation(ReadableMap map, Callback success, Callback error) {
        getPluginInstance().updateNavigationWithLocation(map, success, error);
    }

    @Override
    @ReactMethod
    public void updateNavigationState(ReadableMap map) {
        getPluginInstance().updateNavigationState(map);
    }

    @Override
    @ReactMethod
    public void removeNavigationUpdates(Callback callback) {
        getPluginInstance().removeNavigationUpdates(callback);
    }

    @Override
    @ReactMethod
    public void requestRealTimeUpdates(ReadableMap map) {
        getPluginInstance().requestRealTimeUpdates(map,
                getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class));
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
    public void onEnterGeofences() {
        getPluginInstance().onEnterGeofences(
                getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class));
    }

    @Override
    @ReactMethod
    public void onExitGeofences() {
        getPluginInstance().onExitGeofences(
                getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class));
    }

    @Override
    @ReactMethod
    public void configureUserHelper(ReadableMap map, Callback success, Callback error) {
        getPluginInstance().configureUserHelper(map, success, error);
    }

    @Override
    @ReactMethod
    public void speakAloudText(ReadableMap map) {
        getPluginInstance().speakAloudText(map);
    }

    //--------------------------------------------------------------------------------------------//
    //                                    PRIVATE METHODS                                         //
    //--------------------------------------------------------------------------------------------//

    private void registerLifecycleListener(ReactApplicationContext context) {
        context.addLifecycleEventListener(new LifecycleEventListener() {
            @Override
            public void onHostResume() {
                getPluginInstance().onHostResume();
            }

            @Override
            public void onHostPause() {
                getPluginInstance().onHostPause();
            }

            @Override
            public void onHostDestroy() {
                // Do nothing
            }
        });
    }
}
