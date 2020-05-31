package com.situm.plugin;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;

public interface SitumPlugin {
    String EVENT_LOCATION_CHANGED = "locationChanged";
    String EVENT_LOCATION_ERROR = "locationError";
    String EVENT_LOCATION_STATUS_CHANGED = "statusChanged";

    String EVENT_NAVIGATION_UPDATE = "navigationUpdated";
    String EVENT_NAVIGATION_ERROR = "navigationError";

    void initSitumSDK();

    void setApiKey(String email, String apiKey, Callback callback);

    void setUserPass(String email, String password, Callback callback);

    void setCacheMaxAge(int cacheAge, Callback callback);

    void fetchBuildings(Callback success, Callback error);

    void fetchBuildingInfo(ReadableMap map, Callback success, Callback error);

    void fetchFloorsFromBuilding(ReadableMap map, Callback success, Callback error);

    void fetchMapFromFloor(ReadableMap map, Callback success, Callback error);

    void fetchGeofencesFromBuilding(ReadableMap map, Callback success, Callback error);

    void startPositioning(ReadableMap map);

    void stopPositioning(Callback success, Callback error);

    void requestDirections(ReadableArray requestArray, Callback success, Callback error);

    void fetchPoiCategories(Callback success, Callback error);

    void fetchPoiCategoryIconNormal(ReadableMap map, Callback success, Callback error);

    void fetchPoiCategoryIconSelected(ReadableMap map, Callback success, Callback error);

    void fetchIndoorPOIsFromBuilding(ReadableMap map);

    void fetchOutdoorPOIsFromBuilding(ReadableMap map);

    void fetchEventsFromBuilding(ReadableMap map);

    void requestNavigationUpdates(ReadableMap map);

    void updateNavigationWithLocation(ReadableMap map, Callback success, Callback error);

    void removeNavigationUpdates(Callback callback);

    void requestRealTimeUpdates(ReadableMap map);

    void removeRealTimeUpdates();

    void invalidateCache();

    void requestAuthorization();

}
