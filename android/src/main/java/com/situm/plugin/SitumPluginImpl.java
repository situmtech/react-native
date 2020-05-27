package com.situm.plugin;

import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
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
    public void test() {
//        getPluginInstance().fetchBuildings(success, null);
    }

    @ReactMethod
    public void initSitumSDK() {
        SitumSdk.init(reactContext);
    }

    @Override
    @ReactMethod
    public void setApiKey(String email, String apiKey, Callback callback) {
        boolean isSuccess = SitumSdk.configuration().setApiKey(email, apiKey);

        WritableMap response = Arguments.createMap();
        response.putBoolean("success", isSuccess);

        callback.invoke(response);
    }

    @Override
    @ReactMethod
    public void setUserPass(String email, String password, Callback callback) {
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
    public void stopPositioning(Callback success, Callback error) {
        getPluginInstance().stopPositioning(success, error);
    }

    @Override
    @ReactMethod
    public void requestDirections(ReadableArray requestArray, Callback success, Callback error) {
        getPluginInstance().requestDirections(requestArray, success,error, getReactApplicationContext());
    }

    @Override
    @ReactMethod
    public void fetchPoiCategories(ReadableMap map) {
        Log.e(TAG, "fetchPoiCategories");
    }

    @Override
    @ReactMethod
    public void fetchPoiCategoryIconNormal(ReadableMap map) {
        Log.e(TAG, "fetchPoiCategoryIconNormal");
    }

    @Override
    @ReactMethod
    public void fetchPoiCategoryIconSelected(ReadableMap map) {
        Log.e(TAG, "fetchPoiCategoryIconSelected");
    }

    @Override
    @ReactMethod
    public void fetchIndoorPOIsFromBuilding(ReadableMap map) {
        Log.e(TAG, "fetchIndoorPOIsFromBuilding");
    }

    @Override
    @ReactMethod
    public void fetchOutdoorPOIsFromBuilding(ReadableMap map) {
        Log.e(TAG, "fetchOutdoorPOIsFromBuilding");
    }

    @Override
    @ReactMethod
    public void fetchEventsFromBuilding(ReadableMap map) {
        Log.e(TAG, "fetchEventsFromBuilding");
    }

    @Override
    @ReactMethod
    public void requestNavigationUpdates(String callbackId) {
        Log.e(TAG, "requestNavigationUpdates");
    }

    @Override
    @ReactMethod
    public void updateNavigationWithLocation(ReadableMap map) {
        Log.e(TAG, "updateNavigationWithLocation");
    }

    @Override
    @ReactMethod
    public void removeNavigationUpdates() {
        Log.e(TAG, "removeNavigationUpdates");
    }

    @Override
    @ReactMethod
    public void requestRealTimeUpdates(ReadableMap map) {
        Log.e(TAG, "requestRealTimeUpdates");
    }

    @Override
    @ReactMethod
    public void removeRealTimeUpdates() {
        Log.e(TAG, "removeRealTimeUpdates");
    }

    @Override
    @ReactMethod
    public void invalidateCache() {
        Log.e(TAG, "invalidateCache");
    }


}