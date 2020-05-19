/**
 *
 */
package com.situm.plugin;

import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

import androidx.annotation.NonNull;

public class SitumPluginImpl extends ReactContextBaseJavaModule implements SitumPlugin {
    private static final String TAG = "SitumPlugin";
    private static final String PLUGIN_NAME = "SitumPlugin";
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


//    public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) throws JSONException {
//        Log.d(TAG, "execute: " + action);
//        if (action.equalsIgnoreCase("setApiKey")) {
//            String email = args.getString(0);
//            String apiKey = args.getString(1);
//            es.situm.sdk.SitumSdk.configuration().setApiKey(email, apiKey);
//        } else if (action.equalsIgnoreCase("setUserPass")) {
//            String email = args.getString(0);
//            String password = args.getString(1);
//            es.situm.sdk.SitumSdk.configuration().setUserPass(email, password);
//        } else if (action.equalsIgnoreCase("setCacheMaxAge")) {
//            Integer cacheAge = args.getInt(0);
//            Log.d(TAG, "Setting cache max age to " + cacheAge + " seconds");
//            es.situm.sdk.SitumSdk.configuration().setCacheMaxAge(cacheAge, TimeUnit.SECONDS);
//        } else if (action.equalsIgnoreCase("fetchBuildings")) {
//            getPluginInstance().fetchBuildings(cordova, webView, args, callbackContext);
//        } else if (action.equalsIgnoreCase("fetchBuildingInfo")) {
//            getPluginInstance().fetchBuildingInfo(cordova, webView, args, callbackContext);
//        } else if (action.equalsIgnoreCase("fetchGeofencesFromBuilding")) {
//            getPluginInstance().fetchGeofencesFromBuilding(cordova, webView, args, callbackContext);
//        } else if (action.equalsIgnoreCase("startPositioning")) {
//            getPluginInstance().startPositioning(cordova, webView, args, callbackContext);
//        } else if (action.equalsIgnoreCase("stopPositioning")) {
//            getPluginInstance().stopPositioning(cordova, webView, args, callbackContext);
//        } else if (action.equalsIgnoreCase("fetchPoiCategories")) {
//            getPluginInstance().fetchPoiCategories(cordova, webView, args, callbackContext);
//        } else if (action.equalsIgnoreCase("fetchFloorsFromBuilding")) {
//            getPluginInstance().fetchFloorsFromBuilding(cordova, webView, args, callbackContext);
//        } else if (action.equalsIgnoreCase("fetchIndoorPOIsFromBuilding")) {
//            getPluginInstance().fetchIndoorPOIsFromBuilding(cordova, webView, args, callbackContext);
//        } else if (action.equalsIgnoreCase("fetchOutdoorPOIsFromBuilding")) {
//            getPluginInstance().fetchOutdoorPOIsFromBuilding(cordova, webView, args, callbackContext);
//        } else if (action.equalsIgnoreCase("fetchEventsFromBuilding")) {
//            getPluginInstance().fetchEventsFromBuilding(cordova, webView, args, callbackContext);
//        } else if (action.equalsIgnoreCase("fetchMapFromFloor")) {
//            getPluginInstance().fetchMapFromFloor(cordova, webView, args, callbackContext);
//        } else if (action.equalsIgnoreCase("fetchPoiCategoryIconNormal")) {
//            getPluginInstance().fetchPoiCategoryIconNormal(cordova, webView, args, callbackContext);
//        } else if (action.equalsIgnoreCase("fetchPoiCategoryIconSelected")) {
//            getPluginInstance().fetchPoiCategoryIconSelected(cordova, webView, args, callbackContext);
//        } else if (action.equalsIgnoreCase("invalidateCache")) {
//            getPluginInstance().invalidateCache(callbackContext);
//        } else if (action.equalsIgnoreCase("requestDirections")) {
//            getPluginInstance().requestDirections(cordova, webView, args, callbackContext);
//        } else if (action.equalsIgnoreCase("requestNavigationUpdates")) {
//            getPluginInstance().requestNavigationUpdates(cordova, webView, args, callbackContext);
//        } else if (action.equalsIgnoreCase("updateNavigationWithLocation")) {
//            getPluginInstance().updateNavigationWithLocation(cordova, webView, args, callbackContext);
//        } else if (action.equalsIgnoreCase("removeNavigationUpdates")) {
//            getPluginInstance().removeNavigationUpdates(cordova, webView, args, callbackContext);
//        } else if (action.equalsIgnoreCase("requestRealTimeUpdates")) {
//            getPluginInstance().requestRealTimeUpdates(cordova, webView, args, callbackContext);
//        } else if (action.equalsIgnoreCase("removeRealTimeUpdates")) {
//            getPluginInstance().removeRealTimeUpdates(cordova, webView, args, callbackContext);
//        } else {
//            getPluginInstance().returnDefaultResponse(callbackContext);
//        }
//        return true;
//    }

    @NonNull
    @Override
    public String getName() {
        return PLUGIN_NAME;
    }

    @Override
    @ReactMethod
    public void setApiKey(String email, String apiKey) {
        Log.e(TAG, "setApiKey");
    }

    @Override
    @ReactMethod
    public void setUserPass(String email, String password) {
        Log.e(TAG, "setUserPass");
    }

    @Override 
    @ReactMethod
    public void setCacheMaxAge(int cacheAge) {
        Log.e(TAG, "setCacheMaxAge");
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