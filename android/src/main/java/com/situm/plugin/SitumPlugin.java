package com.situm.plugin;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReadableMap;

public interface SitumPlugin {
    void initSitumSDK();

    void setApiKey(String email, String apiKey, Callback callback);

    void setUserPass(String email, String password, Callback callback);

    void setCacheMaxAge(int cacheAge, Callback callback);

    void fetchBuildings();

    void fetchBuildingInfo(ReadableMap map);

    void fetchGeofencesFromBuilding(ReadableMap map);

    void fetchFloorsFromBuilding(ReadableMap map);

    void fetchPoiCategories(ReadableMap map);

    void fetchPoiCategoryIconNormal(ReadableMap map);

    void fetchPoiCategoryIconSelected(ReadableMap map);

    void fetchIndoorPOIsFromBuilding(ReadableMap map);

    void fetchOutdoorPOIsFromBuilding(ReadableMap map);

    void fetchEventsFromBuilding(ReadableMap map);

    void fetchMapFromFloor(ReadableMap map);

    void startPositioning(String callbackId);

    void stopPositioning(String callbackId);

    void requestDirections(String callbackId);

    void requestNavigationUpdates(String callbackId);

    void updateNavigationWithLocation(ReadableMap map);

    void removeNavigationUpdates();

    void requestRealTimeUpdates(ReadableMap map);

    void removeRealTimeUpdates();

    void invalidateCache();

}
