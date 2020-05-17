package com.situmreactnativeplugin;

import com.facebook.react.bridge.ReactMethod;

public interface SitumPlugin {
    void setApiKey(String email, String apiKey);

    void setUserPass(String email, String password);

    void setCacheMaxAge(int cacheAge);

    void fetchBuildings();

    void fetchBuildingInfo();

    void fetchGeofencesFromBuilding();

    void startPositioning();

    void stopPositioning();

    void fetchPoiCategories();

    void fetchFloorsFromBuilding();

    void fetchIndoorPOIsFromBuilding();

    void fetchOutdoorPOIsFromBuilding();

    void fetchEventsFromBuilding();

    void fetchMapFromFloor();

    void fetchPoiCategoryIconSelected();

    void invalidateCache();

    void requestDirections();

    void requestNavigationUpdates();

    void fetchPoiCategoryIconNormal();

    void updateNavigationWithLocation();

    void removeNavigationUpdates();

    void requestRealTimeUpdates();

    void removeRealTimeUpdates();

}
