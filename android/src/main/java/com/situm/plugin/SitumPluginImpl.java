/**
 *
 */
package com.situm.plugin;

import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

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
        Log.e(TAG, String.format("Email: %s", email));
    }

    @Override
    @ReactMethod
    public void setUserPass(String email, String password) {

    }

    @Override
    @ReactMethod
    public void setCacheMaxAge(int cacheAge) {

    }

    @Override
    @ReactMethod
    public void fetchBuildings() {

    }

    @Override
    @ReactMethod
    public void fetchBuildingInfo() {

    }

    @Override
    @ReactMethod
    public void fetchGeofencesFromBuilding() {

    }

    @Override
    @ReactMethod
    public void startPositioning() {

    }

    @Override
    @ReactMethod
    public void stopPositioning() {

    }

    @Override
    @ReactMethod
    public void fetchPoiCategories() {

    }

    @Override
    @ReactMethod
    public void fetchFloorsFromBuilding() {

    }

    @Override
    @ReactMethod
    public void fetchIndoorPOIsFromBuilding() {

    }

    @Override
    @ReactMethod
    public void fetchOutdoorPOIsFromBuilding() {

    }

    @Override
    @ReactMethod
    public void fetchEventsFromBuilding() {

    }

    @Override
    @ReactMethod
    public void fetchMapFromFloor() {

    }

    @Override
    @ReactMethod
    public void fetchPoiCategoryIconSelected() {

    }

    @Override
    @ReactMethod
    public void invalidateCache() {

    }

    @Override
    @ReactMethod
    public void requestDirections() {

    }

    @Override
    @ReactMethod
    public void requestNavigationUpdates() {

    }

    @Override
    @ReactMethod
    public void fetchPoiCategoryIconNormal() {

    }

    @Override
    @ReactMethod
    public void updateNavigationWithLocation() {

    }

    @Override
    @ReactMethod
    public void removeNavigationUpdates() {

    }

    @Override
    @ReactMethod
    public void requestRealTimeUpdates() {

    }

    @Override
    @ReactMethod
    public void removeRealTimeUpdates() {

    }

}