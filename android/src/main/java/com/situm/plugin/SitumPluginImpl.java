/**
 *
 */
package com.situm.plugin;

import android.util.Log;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

import java.util.concurrent.TimeUnit;

import androidx.annotation.NonNull;
import es.situm.sdk.SitumSdk;

public class SitumPluginImpl extends ReactContextBaseJavaModule implements SitumPlugin {
    private static final String TAG = "SitumPlugin";
    private static final String PLUGIN_NAME = "SitumPlugin";
    private static ReactApplicationContext reactContext;
    private static volatile PluginHelper pluginInstance;
    protected Callback callback;
    private ResponseHelper responseHelper = new ResponseHelper();

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
        boolean isSucceess = SitumSdk.configuration().setApiKey(email, apiKey);
        this.callback = callback;

        responseHelper.cleanResponse();
        responseHelper.putBoolean("success", isSucceess);
        responseHelper.invokeResponse(this.callback);

        this.callback = null;
    }

    @Override
    @ReactMethod
    public void setUserPass(String email, String password, Callback callback) {
        boolean isSucceess = SitumSdk.configuration().setUserPass(email, password);
        this.callback = callback;

        responseHelper.cleanResponse();
        responseHelper.putBoolean("success", isSucceess);
        responseHelper.invokeResponse(this.callback);

        this.callback = null;
    }

    @Override
    @ReactMethod
    public void setCacheMaxAge(int cacheAge, Callback callback) {
        boolean isSucceess = SitumSdk.configuration().setCacheMaxAge(cacheAge, TimeUnit.SECONDS);
        this.callback = callback;

        responseHelper.cleanResponse();
        responseHelper.putBoolean("success", isSucceess);
        responseHelper.invokeResponse(this.callback);

        this.callback = null;
    }

    @Override
    @ReactMethod
    public void fetchBuildings() {
        Log.e(TAG, "fetchBuildings");
    }

    @Override
    @ReactMethod
    public void fetchBuildingInfo(ReadableMap map) {
        Log.e(TAG, "fetchBuildingInfo");
    }

    @Override
    @ReactMethod
    public void fetchGeofencesFromBuilding(ReadableMap map) {
        Log.e(TAG, "fetchGeofencesFromBuilding");
    }

    @Override
    @ReactMethod
    public void fetchFloorsFromBuilding(ReadableMap map) {
        Log.e(TAG, "fetchFloorsFromBuilding");
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
    public void fetchMapFromFloor(ReadableMap map) {
        Log.e(TAG, "fetchMapFromFloor");
    }

    @Override
    @ReactMethod
    public void startPositioning(String callbackId) {
        Log.e(TAG, "startPositioning");
    }

    @Override
    @ReactMethod
    public void stopPositioning(String callbackId) {
        Log.e(TAG, "stopPositioning");
    }

    @Override
    @ReactMethod
    public void requestDirections(String callbackId) {
        Log.e(TAG, "requestDirections");
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