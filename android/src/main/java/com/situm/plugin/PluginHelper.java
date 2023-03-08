package com.situm.plugin;

import android.content.Context;
import android.graphics.Bitmap;
import android.text.TextUtils;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.situm.plugin.utils.ReactNativeJson;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Polygon;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import androidx.annotation.NonNull;
import es.situm.sdk.SitumSdk;
import es.situm.sdk.communication.CommunicationManager;
import es.situm.sdk.directions.DirectionsRequest;
import es.situm.sdk.error.Error;
import es.situm.sdk.location.LocationListener;
import es.situm.sdk.location.LocationRequest;
import es.situm.sdk.location.LocationStatus;
import es.situm.sdk.model.cartography.Building;
import es.situm.sdk.model.cartography.BuildingInfo;
import es.situm.sdk.model.cartography.Floor;
import es.situm.sdk.model.cartography.Geofence;
import es.situm.sdk.model.cartography.Poi;
import es.situm.sdk.model.cartography.PoiCategory;
import es.situm.sdk.model.cartography.Point;
import es.situm.sdk.model.directions.Route;
import es.situm.sdk.model.location.Location;
import es.situm.sdk.model.navigation.NavigationProgress;
import es.situm.sdk.model.realtime.RealTimeData;
import es.situm.sdk.navigation.NavigationListener;
import es.situm.sdk.navigation.NavigationManager;
import es.situm.sdk.navigation.NavigationRequest;
import es.situm.sdk.realtime.RealTimeListener;
import es.situm.sdk.realtime.RealTimeManager;
import es.situm.sdk.realtime.RealTimeRequest;
import es.situm.sdk.utils.Handler;
import es.situm.sdk.v1.SitumEvent;
import es.situm.sdk.location.GeofenceListener;

import static com.situm.plugin.SitumPlugin.EVENT_LOCATION_CHANGED;
import static com.situm.plugin.SitumPlugin.EVENT_LOCATION_ERROR;
import static com.situm.plugin.SitumPlugin.EVENT_LOCATION_STATUS_CHANGED;
import static com.situm.plugin.SitumPlugin.EVENT_NAVIGATION_ERROR;
import static com.situm.plugin.SitumPlugin.EVENT_NAVIGATION_UPDATE;
import static com.situm.plugin.SitumPlugin.EVENT_REALTIME_ERROR;
import static com.situm.plugin.SitumPlugin.EVENT_REALTIME_UPDATE;
import static com.situm.plugin.SitumPlugin.EVENT_ENTER_GEOFENCES;
import static com.situm.plugin.SitumPlugin.EVENT_EXIT_GEOFENCES;
import static com.situm.plugin.utils.ReactNativeJson.convertJsonToArray;
import static com.situm.plugin.utils.ReactNativeJson.convertJsonToMap;
import static com.situm.plugin.utils.ReactNativeJson.convertMapToJson;

public class PluginHelper {

    private static final String TAG = "PluginHelper";

    private GeometryFactory geometryFactory = new GeometryFactory();

    private LocationListener locationListener;
    private LocationRequest locationRequest;
    private NavigationListener navigationListener;
    private NavigationRequest navigationRequest;

    private boolean emitEnterGeofences = false;
    private boolean emitExitGeofences = false;

    private volatile CommunicationManager cmInstance;

    private volatile NavigationManager nmInstance;
    private RealTimeListener realtimeListener;
    private volatile RealTimeManager rmInstance;

    private Route computedRoute;
    private Location computedLocation;
    private Map<Geofence, Polygon> geofencePolygonMap = new HashMap<>();

    private CommunicationManager getCommunicationManagerInstance() {
        if (cmInstance == null) { //Check for the first time
            synchronized (CommunicationManager.class) {   //Check for the second time.
                //if there is no instance available... create new one
                if (cmInstance == null) cmInstance = SitumSdk.communicationManager();
            }
        }
        return cmInstance;
    }

    public void setCommunicationManager(CommunicationManager communicationManager) {
        cmInstance = communicationManager;
    }

    private RealTimeManager getRealtimeManagerInstance() {
        if (rmInstance == null) {
            synchronized (RealTimeManager.class) {   //Check for the second time.
                //if there is no instance available... create new one
                if (rmInstance == null) rmInstance = SitumSdk.realtimeManager();
            }
        }
        return rmInstance;
    }

    private NavigationManager getNavigationManagerInstance() {
        if (nmInstance == null) { //Check for the first time
            synchronized (NavigationManager.class) {   //Check for the second time.
                //if there is no instance available... create new one
                if (nmInstance == null) nmInstance = SitumSdk.navigationManager();
            }
        }
        return nmInstance;
    }

    public void setNavigationManager(NavigationManager navigationManager) {
        nmInstance = navigationManager;
    }

    public void fetchBuildings(Callback success, Callback error) {
        try {
            getCommunicationManagerInstance().fetchBuildings(new Handler<Collection<Building>>() {
                public void onSuccess(Collection<Building> buildings) {
                    try {
                        Log.d(PluginHelper.TAG, "onSuccess: Buildings fetched successfully.");
                        JSONArray jsonArrayBuildings = new JSONArray();

                        for (Building building : buildings) {
                            Log.i(PluginHelper.TAG,
                                    "onSuccess: " + building.getIdentifier() + " - " + building.getName());
                            JSONObject jsonBuilding = SitumMapper.buildingToJsonObject(building);
                            jsonArrayBuildings.put(jsonBuilding);
                        }

                        if (buildings.isEmpty()) {
                            Log.e(PluginHelper.TAG, "onSuccess: you have no buildings. Create one in the Dashboard");
                        }

                        invokeCallback(success, convertJsonToArray(jsonArrayBuildings));
                    } catch (JSONException e) {
                        invokeCallback(error, e.getMessage());
                    }
                }

                @Override
                public void onFailure(Error e) {
                    Log.e(PluginHelper.TAG, "onFailure:" + e);
                    invokeCallback(error, e.getMessage());
                }
            });
        } catch (Exception e) {
            invokeCallback(error, e.getMessage());
        }
    }

    // building, floors, events, indoorPois, outdoorPois, ¿geofences? ¿Paths?
    public void fetchBuildingInfo(ReadableMap buildingMap, Callback success, Callback error) {
        try {
            JSONObject jsonBuilding = ReactNativeJson.convertMapToJson(buildingMap);
            Building building = SitumMapper.buildingJsonObjectToBuilding(jsonBuilding);

            getCommunicationManagerInstance().fetchBuildingInfo(building, new Handler<BuildingInfo>() {
                @Override
                public void onSuccess(BuildingInfo object) {
                    try {
                        Log.d(PluginHelper.TAG, "onSuccess: building info fetched successfully.");


                        JSONObject jsonObject = SitumMapper.buildingInfoToJsonObject(object); // Include geofences to parse ? This needs to be on sdk

                        invokeCallback(success, ReactNativeJson.convertJsonToMap(jsonObject));
                    } catch (JSONException e) {
                        invokeCallback(error, e.getMessage());
                    }
                }

                @Override
                public void onFailure(Error e) {
                    Log.e(PluginHelper.TAG, "onFailure:" + e);
                    invokeCallback(error, e.getMessage());
                }
            });

        } catch (Exception e) {
            Log.e(TAG, "Unexpected error in building info response", e.getCause());
            invokeCallback(error, e.getMessage());
        }
    }


    public void fetchFloorsFromBuilding(ReadableMap buildingMap, Callback success, Callback error) {
        try {
            JSONObject jsonBuilding = ReactNativeJson.convertMapToJson(buildingMap);
            Building building = SitumMapper.buildingJsonObjectToBuilding(jsonBuilding);

            getCommunicationManagerInstance().fetchFloorsFromBuilding(building, new Handler<Collection<Floor>>() {
                @Override
                public void onSuccess(Collection<Floor> floors) {
                    try {
                        Log.d(PluginHelper.TAG, "onSuccess: Floors fetched successfully.");
                        JSONArray jsonArrayFloors = new JSONArray();

                        for (Floor floor : floors) {
                            Log.i(PluginHelper.TAG, "onSuccess: " + floor.getIdentifier());
                            JSONObject jsonFloor = SitumMapper.floorToJsonObject(floor);
                            jsonArrayFloors.put(jsonFloor);
                        }
                        if (floors.isEmpty()) {
                            Log.e(PluginHelper.TAG, "onSuccess: you have no floors defined for this building");
                        }
                        invokeCallback(success, convertJsonToArray(jsonArrayFloors));
                    } catch (JSONException e) {
                        invokeCallback(error, e.getMessage());
                    }
                }

                @Override
                public void onFailure(Error e) {
                    Log.e(PluginHelper.TAG, "onFailure:" + e);
                    invokeCallback(error, e.getMessage());
                }
            });
        } catch (Exception e) {
            Log.e(TAG, "Unexpected error in floor response", e.getCause());
            invokeCallback(error, e.getMessage());
        }
    }

    public void fetchMapFromFloor(ReadableMap buildingMap, Callback success, Callback error) {
        try {
            JSONObject jsonFloor = ReactNativeJson.convertMapToJson(buildingMap);
            Floor floor = SitumMapper.floorJsonObjectToFloor(jsonFloor);

            getCommunicationManagerInstance().fetchMapFromFloor(floor, new Handler<Bitmap>() {
                @Override
                public void onSuccess(Bitmap bitmap) {
                    try {
                        Log.d(PluginHelper.TAG, "onSuccess: Map fetched successfully");
                        invokeCallback(success, SitumMapper.bitmapToString(bitmap).getString("data"));
                    } catch (JSONException e) {
                        invokeCallback(error, e.getMessage());
                    }
                }

                @Override
                public void onFailure(Error e) {
                    Log.e(PluginHelper.TAG, "onFailure: " + error);
                    invokeCallback(error, e.getMessage());
                }
            });
        } catch (Exception e) {
            Log.e(TAG, "Unexpected error in map download", e.getCause());
            invokeCallback(error, e.getMessage());
        }
    }

    public void fetchGeofencesFromBuilding(ReadableMap buildingMap, Callback success, Callback error) {
        try {
            JSONObject jsonBuilding = ReactNativeJson.convertMapToJson(buildingMap);
            Building building = SitumMapper.buildingJsonObjectToBuilding(jsonBuilding);

            getCommunicationManagerInstance().fetchGeofencesFromBuilding(building, new Handler<List<Geofence>>() {
                @Override
                public void onSuccess(List<Geofence> geofences) {
                    try {
                        Log.d(PluginHelper.TAG, "onSuccess: Geofences fetched successfully.");
                        JSONArray jsonArrayGeofences = new JSONArray();

                        for (Geofence geofence : geofences) {
                            Log.i(PluginHelper.TAG, "onSuccess: " + geofence.getIdentifier());
                            JSONObject jsonoGeofence = SitumMapper.geofenceToJsonObject(geofence);
                            jsonArrayGeofences.put(jsonoGeofence);
                        }
                        if (geofences.isEmpty()) {
                            Log.e(PluginHelper.TAG, "onSuccess: you have no geofences defined for this building");
                        }
                        invokeCallback(success, convertJsonToArray(jsonArrayGeofences));

                        createAndAssignPolygonsToGeofences(geofences);
                    } catch (JSONException e) {
                        invokeCallback(error, e.getMessage());
                    }
                }

                @Override
                public void onFailure(Error e) {
                    Log.e(PluginHelper.TAG, "onFailure:" + e);
                    invokeCallback(error, e.getMessage());
                }
            });

        } catch (Exception e) {
            Log.e(TAG, "Unexpected error in building info response", e.getCause());
            invokeCallback(error, e.getMessage());
        }
    }


    public void startPositioning(final ReadableMap locationRequestMap, DeviceEventManagerModule.RCTDeviceEventEmitter eventEmitter) {
        try {
            JSONObject jsonRequst = ReactNativeJson.convertMapToJson(locationRequestMap);
            LocationRequest.Builder locationBuilder = new LocationRequest.Builder();
            SitumMapper.locationRequestJSONObjectToLocationRequest(jsonRequst, locationBuilder);
            LocationRequest locationRequest = locationBuilder.build();


            locationListener = new LocationListener() {
                public void onLocationChanged(Location location) {
                    try {
                        PluginHelper.this.computedLocation = location; // This is for testing purposes
                        Log.i(PluginHelper.TAG, "onLocationChanged() called with: location = [" + location + "]");
                        JSONObject jsonObject = SitumMapper.locationToJsonObject(location);
                        
                        eventEmitter.emit(EVENT_LOCATION_CHANGED, convertJsonToMap(jsonObject));
                        
                    } catch (JSONException e) {
                        eventEmitter.emit(EVENT_LOCATION_ERROR, e.getMessage());
                    }
                }

                public void onStatusChanged(@NonNull LocationStatus status) {
                    try {
                        Log.i(PluginHelper.TAG, "onStatusChanged() called with: status = [" + status + "]");
                        JSONObject jsonObject = SitumMapper.locationStatusToJsonObject(status);
                        eventEmitter.emit(EVENT_LOCATION_STATUS_CHANGED, convertJsonToMap(jsonObject));
                    } catch (JSONException e) {
                        eventEmitter.emit(EVENT_LOCATION_ERROR, e.getMessage());
                    }
                }

                public void onError(@NonNull Error error) {
                    Log.e(PluginHelper.TAG, "onError() called with: error = [" + error + "]");
                    locationListener = null;
                    eventEmitter.emit(EVENT_LOCATION_ERROR, error.getMessage());

                }
            };
            try {
                SitumSdk.locationManager().requestLocationUpdates(locationRequest, locationListener);
            } catch (Exception e) {
                Log.e(PluginHelper.TAG, "onError() called with: error = [" + e + "]");
            }
        } catch (Exception e) {
            Log.e(TAG, "Unexpected error building response", e.getCause());
            eventEmitter.emit(EVENT_LOCATION_ERROR, e.getMessage());
        }
    }

    public void stopPositioning(Callback callback) {

        if (locationListener != null) {
            try {
                SitumSdk.locationManager().removeUpdates(locationListener);
                locationListener = null;

                WritableMap map = Arguments.createMap();
                map.putBoolean("success", true);
                map.putString("message", "Stopped Successfully");
                invokeCallback(callback, map);

            } catch (Exception e) {
                invokeCallback(callback, e.getMessage());
            }
        } else {
            Log.i(TAG, "stopPositioning: location listener is not started.");

            WritableMap map = Arguments.createMap();
            map.putBoolean("success", true);
            map.putString("message", "Already disabled");

            invokeCallback(callback, map);

        }
    }

    public void requestDirections(ReadableArray requestArray, Callback success, Callback error, ReactApplicationContext context) {
        try {
            JSONObject jsonBuilding = convertMapToJson(Objects.requireNonNull(requestArray.getMap(0)));
            JSONObject jsonFrom = convertMapToJson(Objects.requireNonNull(requestArray.getMap(1)));
            JSONObject jsonTo = convertMapToJson(Objects.requireNonNull(requestArray.getMap(2)));
            JSONObject jsonOptions = null;
            if (requestArray.size() >= 4) {
                jsonOptions = convertMapToJson(Objects.requireNonNull(requestArray.getMap(3)));
            }

            DirectionsRequest directionRequest = SitumMapper.jsonObjectToDirectionsRequest(jsonBuilding, jsonFrom, jsonTo, null);

            SitumSdk.directionsManager().requestDirections(directionRequest, new Handler<Route>() {
                @Override
                public void onSuccess(Route route) {
                    try {
                        PluginHelper.this.computedRoute = route;
                        JSONObject jsonRoute = SitumMapper.routeToJsonObject(route, context);
                        Log.i(TAG, "onSuccess: Route calculated successfully" + route);
                        invokeCallback(success, convertJsonToMap(jsonRoute));
                    } catch (JSONException e) {
                        invokeCallback(error, e.getMessage());
                    }
                }

                @Override
                public void onFailure(Error e) {
                    Log.e(TAG, "onError:" + e.getMessage());
                    invokeCallback(error, e.getMessage());
                }
            });
        } catch (Exception e) {
            e.printStackTrace();
            invokeCallback(error, e.getMessage());
        }
    }

    public void fetchPoiCategories(Callback success, Callback error) {
        getCommunicationManagerInstance().fetchPoiCategories(new Handler<Collection<PoiCategory>>() {
            @Override
            public void onSuccess(Collection<PoiCategory> poiCategories) {
                try {
                    Log.d(PluginHelper.TAG, "onSuccess: POI Categories fetched successfully.");
                    JSONArray jsonaPoiCategories = new JSONArray();
                    for (PoiCategory poiCategory : poiCategories) {
                        Log.i(PluginHelper.TAG, "onSuccess: " + poiCategory.getCode() + " - " + poiCategory.getName());
                        JSONObject jsonoPoiCategory = SitumMapper.poiCategoryToJsonObject(poiCategory);
                        jsonaPoiCategories.put(jsonoPoiCategory);
                    }
                    if (poiCategories.isEmpty()) {
                        Log.e(PluginHelper.TAG, "onSuccess: you have no categories defined for POIs");
                    }
                    invokeCallback(success, convertJsonToArray(jsonaPoiCategories));
                } catch (JSONException e) {
                    invokeCallback(error, e.getMessage());
                }
            }

            @Override
            public void onFailure(Error e) {
                Log.e(PluginHelper.TAG, "onFailure:" + e);
                invokeCallback(error, e.getMessage());
            }
        });
    }

    public void fetchPoiCategoryIconNormal(ReadableMap categoryMap, Callback success, Callback error) {
        try {
            JSONObject jsonoCategory = convertMapToJson(categoryMap);
            PoiCategory category = SitumMapper.poiCategoryFromJsonObject(jsonoCategory);
            getCommunicationManagerInstance().fetchPoiCategoryIconNormal(category, new Handler<Bitmap>() {
                @Override
                public void onSuccess(Bitmap bitmap) {
                    try {
                        Log.d(PluginHelper.TAG, "onSuccess: Poi icon fetched successfully");
                        JSONObject jsonoMap = SitumMapper.bitmapToString(bitmap);
                        invokeCallback(success, convertJsonToMap(jsonoMap));
                    } catch (JSONException e) {
                        invokeCallback(error, e.getMessage());

                    }
                }

                @Override
                public void onFailure(Error e) {
                    Log.e(PluginHelper.TAG, "onFailure: " + e);
                    invokeCallback(error, e.getMessage());

                }
            });
        } catch (Exception e) {
            Log.e(TAG, "Unexpected error in situm POI response", e.getCause());
            invokeCallback(error, e.getMessage());

        }
    }

    public void fetchPoiCategoryIconSelected(ReadableMap categoryMap, Callback success, Callback error) {
        try {
            JSONObject jsonoCategory = convertMapToJson(categoryMap);
            PoiCategory category = SitumMapper.poiCategoryFromJsonObject(jsonoCategory);
            getCommunicationManagerInstance().fetchPoiCategoryIconSelected(category, new Handler<Bitmap>() {
                @Override
                public void onSuccess(Bitmap bitmap) {
                    try {
                        Log.d(PluginHelper.TAG, "onSuccess: Poi icon fetched successfully");
                        JSONObject jsonoMap = SitumMapper.bitmapToString(bitmap);
                        invokeCallback(success, convertJsonToMap(jsonoMap));
                    } catch (JSONException e) {
                        invokeCallback(error, e.getMessage());

                    }
                }

                @Override
                public void onFailure(Error e) {
                    Log.e(PluginHelper.TAG, "onFailure: " + e);
                    invokeCallback(error, e.getMessage());

                }
            });
        } catch (Exception e) {
            Log.e(TAG, "Unexpected error in situm POI response", e.getCause());
            invokeCallback(error, e.getMessage());
        }
    }

    public void requestNavigationUpdates(ReadableMap options, DeviceEventManagerModule.RCTDeviceEventEmitter eventEmitter, Context context) {
        // 1) Parse and check arguments

        if (this.computedRoute == null) {
            Log.d(TAG, "Situm >> There is not an stored route so you are not allowed to navigate");
            eventEmitter.emit(EVENT_NAVIGATION_ERROR, "Compute a valid route with requestDirections before trying to navigate within a route");
            return;
        }
        // try??
        Route route = this.computedRoute; // args.getJSONObject(0); // Retrieve route from arguments, we do this since Route object has internal properties that we do not want to expose
        // 2) Build Navigation Arguments
        // 2.1) Build Navigation Request
        Log.d(TAG, "requestNavigationUpdates executed: passed route: " + route);
        NavigationRequest.Builder builder = new NavigationRequest.Builder().route(route);

        try {
            JSONObject navigationJSONOptions = convertMapToJson(options);

            if (navigationJSONOptions.has(SitumMapper.DISTANCE_TO_IGNORE_FIRST_INDICATION)) {
                Double distanceToIgnoreFirstIndication = navigationJSONOptions.getDouble(SitumMapper.DISTANCE_TO_IGNORE_FIRST_INDICATION);
                builder.distanceToIgnoreFirstIndication(distanceToIgnoreFirstIndication);
            }

            if (navigationJSONOptions.has(SitumMapper.OUTSIDE_ROUTE_THRESHOLD)) {
                Double outsideRouteThreshold = navigationJSONOptions.getDouble(SitumMapper.OUTSIDE_ROUTE_THRESHOLD);
                builder.outsideRouteThreshold(outsideRouteThreshold);
            }

            if (navigationJSONOptions.has(SitumMapper.DISTANCE_TO_GOAL_THRESHOLD)) {
                Double distanceToGoalThreshold = navigationJSONOptions.getDouble(SitumMapper.DISTANCE_TO_GOAL_THRESHOLD);
                builder.distanceToGoalThreshold(distanceToGoalThreshold);
            }

            if (navigationJSONOptions.has(SitumMapper.DISTANCE_TO_CHANGE_FLOOR_THRESHOLD)) {
                Double distanceToChangeFloorThreshold = navigationJSONOptions.getDouble(SitumMapper.DISTANCE_TO_CHANGE_FLOOR_THRESHOLD);
                builder.distanceToChangeFloorThreshold(distanceToChangeFloorThreshold);
            }

            if (navigationJSONOptions.has(SitumMapper.DISTANCE_TO_CHANGE_INDICATION_THRESHOLD)) {
                Double distanceToChangeIndicationThreshold = navigationJSONOptions.getDouble(SitumMapper.DISTANCE_TO_CHANGE_INDICATION_THRESHOLD);
                builder.distanceToChangeIndicationThreshold(distanceToChangeIndicationThreshold);
            }

            if (navigationJSONOptions.has(SitumMapper.INDICATIONS_INTERVAL)) {
                Long indicationsInterval = navigationJSONOptions.getLong(SitumMapper.INDICATIONS_INTERVAL);
                builder.indicationsInterval(indicationsInterval);
            }

            if (navigationJSONOptions.has(SitumMapper.TIME_TO_FIRST_INDICATION)) {
                Long timeToFirstIndication = navigationJSONOptions.getLong(SitumMapper.TIME_TO_FIRST_INDICATION);
                builder.timeToFirstIndication(timeToFirstIndication);
            }

            if (navigationJSONOptions.has(SitumMapper.ROUND_INDICATION_STEP)) {
                Integer roundIndicationsStep = navigationJSONOptions.getInt(SitumMapper.ROUND_INDICATION_STEP);
                builder.roundIndicationsStep(roundIndicationsStep);
            }

            if (navigationJSONOptions.has(SitumMapper.TIME_TO_IGNORE_UNEXPECTED_FLOOR_CHANGES)) {
                Integer timeToIgnoreUnexpectedFloorChanges = navigationJSONOptions.getInt(SitumMapper.TIME_TO_IGNORE_UNEXPECTED_FLOOR_CHANGES);
                builder.timeToIgnoreUnexpectedFloorChanges(timeToIgnoreUnexpectedFloorChanges);
            }

            if (navigationJSONOptions.has(SitumMapper.IGNORE_LOW_QUALITY_LOCATIONS)) {
                Boolean ignoreLowQualityLocations = navigationJSONOptions.getBoolean(SitumMapper.IGNORE_LOW_QUALITY_LOCATIONS);
                builder.ignoreLowQualityLocations(ignoreLowQualityLocations);
            }

        } catch (Exception e) {
            //TODO: handle exception
            Log.d(TAG, "Situm >> Unable to retrieve navigation options. Applying default ones");
        }

        navigationRequest = builder.build();

        // 2.2) Build Navigation Callback
        navigationListener = new NavigationListener() {
            public void onProgress(NavigationProgress progress) {
                Log.d(TAG, "On progress received: " + progress);
                try {
                    JSONObject jsonProgress = SitumMapper.navigationProgressToJsonObject(progress, context);
                    try {
                        jsonProgress.put("type", "progress");
                    } catch (JSONException e) {
                        Log.e(TAG, "error inserting type in navigation progress");
                    }
                    eventEmitter.emit(EVENT_NAVIGATION_UPDATE, convertJsonToMap(jsonProgress));

                } catch (Exception e) {
                    Log.d(TAG, "On Error parsing progress: " + progress);
                    eventEmitter.emit(EVENT_NAVIGATION_ERROR, e.getMessage());
                }
            }

            ;

            public void onDestinationReached() {
                Log.d(TAG, "On destination reached: ");
                JSONObject jsonResult = new JSONObject();
                try {
                    jsonResult.put("type", "destinationReached");
                    jsonResult.put("message", "Destination reached");
                    eventEmitter.emit(EVENT_NAVIGATION_UPDATE, convertJsonToMap(jsonResult));
                } catch (JSONException e) {
                    Log.e(TAG, "error inserting type in destination reached");
                }

            }

            ;

            public void onUserOutsideRoute() {
                Log.d(TAG, "On user outside route: ");
                JSONObject jsonResult = new JSONObject();
                try {
                    jsonResult.put("type", "userOutsideRoute");
                    jsonResult.put("message", "User outside route");
                    eventEmitter.emit(EVENT_NAVIGATION_UPDATE, convertJsonToMap(jsonResult));

                } catch (JSONException e) {
                    Log.e(TAG, "error inserting type in user outside route");
                }

            }
        };

        getNavigationManagerInstance().requestNavigationUpdates(navigationRequest, navigationListener);

    }

    public void updateNavigationWithLocation(ReadableMap locationMap, Callback success, Callback error) {
        try {
            // 1) Check for location arguments
            JSONObject jsonLocation = convertMapToJson(locationMap);

            // 2) Create a Location Object from argument
            Location actualLocation = SitumMapper.jsonLocationObjectToLocation(jsonLocation); // Location Objet from JSON
            // Location actualLocation = PluginHelper.computedLocation;
            Log.i(TAG, "UpdateNavigation with Location: " + actualLocation);

            // 3) Connect interfaces
            getNavigationManagerInstance().updateWithLocation(actualLocation);
            invokeCallback(success, "Navigation updated");
        } catch (Exception e) {
            e.printStackTrace();
            invokeCallback(error, e.getMessage());
        }
    }

    public void removeNavigationUpdates(Callback callback) {
        Log.i(TAG, "Remove navigation updates");
        boolean success = getNavigationManagerInstance().removeUpdates();
        WritableMap map = Arguments.createMap();
        map.putBoolean("success", success);
        invokeCallback(callback, map);
    }

    public void fetchIndoorPOIsFromBuilding(ReadableMap buildingMap, Callback success, Callback error) {
        try {
            JSONObject jsonoBuilding = convertMapToJson(buildingMap);
            Building building = SitumMapper.buildingJsonObjectToBuilding(jsonoBuilding);
            getCommunicationManagerInstance().fetchIndoorPOIsFromBuilding(building, new HashMap<String, Object>(),
                    new Handler<Collection<Poi>>() {
                        @Override
                        public void onSuccess(Collection<Poi> pois) {
                            try {
                                Log.d(PluginHelper.TAG, "onSuccess: Pois fetched successfully.");
                                JSONArray jsonaPois = new JSONArray();

                                for (Poi poi : pois) {
                                    Log.i(PluginHelper.TAG,
                                            "onSuccess: " + poi.getIdentifier() + " - " + poi.getName() + "-" + poi.getCustomFields());

                                    Log.d(PluginHelper.TAG, "Some log that should appear");
                                    JSONObject jsonoPoi = SitumMapper.poiToJsonObject(poi);
                                    jsonaPois.put(jsonoPoi);
                                }
                                if (pois.isEmpty()) {
                                    Log.e(PluginHelper.TAG,
                                            "onSuccess: you have no indoor pois defined for this building");
                                }
                                invokeCallback(success, convertJsonToArray(jsonaPois));
                            } catch (JSONException e) {
                                invokeCallback(error, e.getMessage());
                            }
                        }

                        @Override
                        public void onFailure(Error e) {
                            Log.e(PluginHelper.TAG, "onFailure:" + e);
                            invokeCallback(error, e.getMessage());
                        }
                    });
        } catch (Exception e) {
            Log.e(TAG, "Unexpected error in poi response", e.getCause());
            invokeCallback(error, e.getMessage());
        }
    }

    public void fetchOutdoorPOIsFromBuilding(ReadableMap buildingMap, Callback success, Callback error) {
        try {
            JSONObject jsonoBuilding = convertMapToJson(buildingMap);
            Building building = SitumMapper.buildingJsonObjectToBuilding(jsonoBuilding);
            getCommunicationManagerInstance().fetchOutdoorPOIsFromBuilding(building, new HashMap<String, Object>(),
                    new Handler<Collection<Poi>>() {
                        @Override
                        public void onSuccess(Collection<Poi> pois) {
                            try {
                                Log.d(PluginHelper.TAG, "onSuccess: Floors fetched successfully.");
                                JSONArray jsonaPois = new JSONArray();

                                for (Poi poi : pois) {
                                    Log.i(PluginHelper.TAG,
                                            "onSuccess: " + poi.getIdentifier() + " - " + poi.getName());
                                    JSONObject jsonoPoi = SitumMapper.poiToJsonObject(poi);
                                    jsonaPois.put(jsonoPoi);
                                }
                                if (pois.isEmpty()) {
                                    Log.e(PluginHelper.TAG,
                                            "onSuccess: you have no outdoor pois defined for this building");
                                }
                                invokeCallback(success, convertJsonToArray(jsonaPois));
                            } catch (JSONException e) {
                                invokeCallback(error, e.getMessage());
                            }
                        }

                        @Override
                        public void onFailure(Error e) {
                            Log.e(PluginHelper.TAG, "onFailure:" + e);
                            invokeCallback(error, e.getMessage());
                        }
                    });
        } catch (Exception e) {
            Log.e(TAG, "Unexpected error in poi response", e.getCause());
            invokeCallback(error, e.getMessage());
        }
    }

    public void fetchEventsFromBuilding(ReadableMap buildingMap, Callback success, Callback error) {
        try {
            JSONObject jsonoBuilding = convertMapToJson(buildingMap);
            Building building = SitumMapper.buildingJsonObjectToBuilding(jsonoBuilding);
            getCommunicationManagerInstance().fetchEventsFromBuilding(building, new HashMap<String, Object>(),
                    new Handler<Collection<SitumEvent>>() {
                        @Override
                        public void onSuccess(Collection<SitumEvent> situmEvents) {
                            try {
                                Log.d(PluginHelper.TAG, "onSuccess: Floors fetched successfully.");
                                JSONArray jsonaEvents = new JSONArray();
                                for (SitumEvent situmEvent : situmEvents) {
                                    Log.i(PluginHelper.TAG,
                                            "onSuccess: " + situmEvent.getId() + " - " + situmEvent.getName());
                                    JSONObject jsonoSitumEvent = SitumMapper.situmEventToJsonObject(situmEvent);
                                    jsonaEvents.put(jsonoSitumEvent);
                                }
                                if (situmEvents.isEmpty()) {
                                    Log.e(PluginHelper.TAG, "onSuccess: you have no events defined for this building");
                                }
                                invokeCallback(success, convertJsonToArray(jsonaEvents));
                            } catch (JSONException e) {
                                invokeCallback(error, e.getMessage());
                            }
                        }

                        @Override
                        public void onFailure(Error e) {
                            Log.e(PluginHelper.TAG, "onFailure:" + e);
                            invokeCallback(error, e.getMessage());
                        }
                    });
        } catch (Exception e) {
            Log.e(TAG, "Unexpected error in poi response", e.getCause());
            invokeCallback(error, e.getMessage());
        }
    }


    public void requestRealTimeUpdates(ReadableMap options, DeviceEventManagerModule.RCTDeviceEventEmitter eventEmitter) {
        try {
            // Convert request to native
            JSONObject jsonRequest = convertMapToJson(options);
            RealTimeRequest request = SitumMapper.jsonObjectRealtimeRequest(jsonRequest);
            // Call

            realtimeListener = new RealTimeListener() {

                @Override
                public void onUserLocations(RealTimeData realTimeData) {
                    Log.d(TAG, "Success retrieving realtime data" + realTimeData);

                    try {
                        // Parse information
                        JSONObject jsonResult = SitumMapper.realtimeDataToJson(realTimeData);

                        eventEmitter.emit(EVENT_REALTIME_UPDATE,convertJsonToMap(jsonResult));
                    } catch (Exception e) {
                        Log.d(TAG, "Error  exception realtime data" + e);
                        eventEmitter.emit(EVENT_REALTIME_ERROR, e.getMessage());
                    }


                }

                @Override
                public void onError(Error e) {
                    Log.e(TAG, "Error request realtime data" + e);
                    eventEmitter.emit(EVENT_REALTIME_ERROR, e.getMessage());
                }

            };
            try {
                getRealtimeManagerInstance().requestRealTimeUpdates(request, realtimeListener);
            } catch (Exception e) {
                Log.e(PluginHelper.TAG, "onError() called with: error = [" + e + "]");
            }
        } catch (Exception e) {
            Log.d(TAG, "exception: " + e);

            e.printStackTrace();
            eventEmitter.emit(EVENT_REALTIME_ERROR, e.getMessage());
        }
    }

    public void removeRealTimeUpdates() {
        Log.i(TAG, "Remove realtime updates");
        getRealtimeManagerInstance().removeRealTimeUpdates();
    }

    public void checkIfPointIsInsideGeoFence(ReadableMap map, Callback callback) {
        if (geofencePolygonMap.isEmpty()) {
            return;
        }

        try {
            String floorId = null;
            if (map.hasKey("floorIdentifier")) {
                floorId = map.getString("floorIdentifier");
            }
            ReadableMap latLngMap = map.getMap("coordinate");
            org.locationtech.jts.geom.Point point = geometryFactory.createPoint(new Coordinate(latLngMap.getDouble("latitude"), latLngMap.getDouble("longitude")));

            Geofence geofence = null;

            for (Map.Entry<Geofence, Polygon> entry : geofencePolygonMap.entrySet()) {
                if (!TextUtils.isEmpty(floorId) && !entry.getKey().getFloorIdentifier().equals(floorId)) {
                    continue;
                }
                if (point.within(entry.getValue())) {
                    geofence = entry.getKey();
                    Log.i(TAG, "The point is inside the geofence: " + entry.getKey().getName());
                }
            }

            WritableMap responseMap = Arguments.createMap();
            responseMap.putBoolean("isInsideGeofence", geofence != null);
            if (geofence != null) {
                WritableMap geofenceMap = Arguments.createMap();
                geofenceMap.putString("name", geofence.getName());
                geofenceMap.putString("identifier", geofence.getIdentifier());

                responseMap.putMap("geofence", geofenceMap);
            }

            invokeCallback(callback, responseMap);

        } catch (Exception e) {
            WritableMap error = Arguments.createMap();
            error.putString("error", e.getMessage());
            invokeCallback(callback, error);
        }
    }

    public void invalidateCache() {
        geofencePolygonMap = new HashMap<>();
        getCommunicationManagerInstance().invalidateCache();
    }

    private void createAndAssignPolygonsToGeofences(List<Geofence> geofences) {
        if (geofences.isEmpty()) {
            return;
        }
        for (Geofence geofence : geofences) {
            List<Coordinate> jtsCoordinates = new ArrayList<>();
            for (Point point : geofence.getPolygonPoints()) {
                Coordinate coordinate = new Coordinate(point.getCoordinate().getLatitude(), point.getCoordinate().getLongitude());
                jtsCoordinates.add(coordinate);
            }
            if (!jtsCoordinates.isEmpty()) {
                Polygon polygon = geometryFactory.createPolygon(jtsCoordinates.toArray(new Coordinate[0]));
                geofencePolygonMap.put(geofence, polygon);
            }
        }
    }


    private void invokeCallback(Callback callback, Object args) {
        if (callback != null) {
            callback.invoke(args);
        }
    }

    public void onEnterGeofences(DeviceEventManagerModule.RCTDeviceEventEmitter eventEmitter) {
        emitEnterGeofences = true;
        createAndSetGeofenceListener(eventEmitter);
    }

    public void onExitGeofences(DeviceEventManagerModule.RCTDeviceEventEmitter eventEmitter) {
        emitExitGeofences = true;
        createAndSetGeofenceListener(eventEmitter);
    }

    private void createAndSetGeofenceListener(DeviceEventManagerModule.RCTDeviceEventEmitter eventEmitter) {
        GeofenceListener geofenceListener = new GeofenceListener() {
            public void onEnteredGeofences(List<Geofence> enteredGeofences) {
                if (emitEnterGeofences) {
                    emitGeofences(EVENT_ENTER_GEOFENCES, enteredGeofences);
                }
            }

            public void onExitedGeofences(List<Geofence> exitedGeofences) {
                if (emitExitGeofences) {
                    emitGeofences(EVENT_EXIT_GEOFENCES, exitedGeofences);
                }
            }

            private void emitGeofences(String event, List<Geofence> geofences) {
                eventEmitter.emit(event, SitumMapper.mapList(geofences));
            }
        };
        SitumSdk.locationManager().setGeofenceListener(geofenceListener);
    }
}
