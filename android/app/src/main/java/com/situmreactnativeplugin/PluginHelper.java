package com.situmreactnativeplugin;

import es.situm.sdk.SitumSdk;
import es.situm.sdk.communication.CommunicationManager;
import es.situm.sdk.location.LocationListener;
import es.situm.sdk.location.LocationRequest;
import es.situm.sdk.model.directions.Route;
import es.situm.sdk.model.location.Location;
import es.situm.sdk.navigation.NavigationListener;
import es.situm.sdk.navigation.NavigationManager;
import es.situm.sdk.navigation.NavigationRequest;
import es.situm.sdk.realtime.RealTimeListener;
import es.situm.sdk.realtime.RealTimeManager;

public class PluginHelper {

    private static final String TAG = "PluginHelper";

    private LocationListener locationListener;
    private LocationRequest locationRequest;
    private NavigationListener navigationListener;
    private NavigationRequest navigationRequest;

    private volatile CommunicationManager cmInstance;

    private volatile NavigationManager nmInstance;
    private RealTimeListener realtimeListener;
    private volatile RealTimeManager rmInstance;

    private Route computedRoute;
    private Location computedLocation;

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
/*
    public void fetchBuildings(CordovaInterface cordova, CordovaWebView webView, JSONArray args,
            final CallbackContext callbackContext) {
        try {
           getCommunicationManagerInstance().fetchBuildings(new Handler<Collection<Building>>() {
                public void onSuccess(Collection<Building> buildings) {
                    try {
                        Log.d(PluginHelper.TAG, "onSuccess: Buildings fetched successfully.");
                        JSONArray jsonaBuildings = new JSONArray();

                        for (Building building : buildings) {
                            Log.i(PluginHelper.TAG,
                                    "onSuccess: " + building.getIdentifier() + " - " + building.getName());
                            JSONObject jsonoBuilding = SitumMapper.buildingToJsonObject(building);
                            jsonaBuildings.put(jsonoBuilding);
                        }
                        if (buildings.isEmpty()) {
                            Log.e(PluginHelper.TAG, "onSuccess: you have no buildings. Create one in the Dashboard");
                        }
                        callbackContext.sendPluginResult(new PluginResult(Status.OK, jsonaBuildings));
                    } catch (JSONException e) {
                        callbackContext.sendPluginResult(new PluginResult(Status.ERROR, e.getMessage()));
                    }
                }

                public void onFailure(Error error) {
                    Log.e(PluginHelper.TAG, "onFailure:" + error);
                    callbackContext.sendPluginResult(new PluginResult(Status.ERROR, error.getMessage()));
                }
            });
        } catch (Exception e) {
            callbackContext.sendPluginResult(new PluginResult(Status.ERROR, e.getMessage()));
        }
    }

    // building, floors, events, indoorPois, outdoorPois, ¿geofences? ¿Paths?
    public void fetchBuildingInfo(CordovaInterface cordova, CordovaWebView webView, JSONArray args,
            final CallbackContext callbackContext) 
    {
        try {
            JSONObject jsonoBuilding = args.getJSONObject(0);
            Building building = SitumMapper.buildingJsonObjectToBuilding(jsonoBuilding);

            getCommunicationManagerInstance().fetchBuildingInfo(building, new Handler<BuildingInfo>() {
                @Override
                public void onSuccess(BuildingInfo object) {
                    try {
                        Log.d(PluginHelper.TAG, "onSuccess: building info fetched successfully.");
                        
                        
                        JSONObject jsonObject = SitumMapper.buildingInfoToJsonObject(object); // Include geofences to parse ? This needs to be on sdk

                        callbackContext.sendPluginResult(new PluginResult(Status.OK, jsonObject));
                    } catch (JSONException e) {
                        callbackContext.sendPluginResult(new PluginResult(Status.ERROR, e.getMessage()));
                    }
                }

                @Override
                public void onFailure(Error error) {
                    Log.e(PluginHelper.TAG, "onFailure:" + error);
                    callbackContext.sendPluginResult(new PluginResult(Status.ERROR, error.getMessage()));
                }
            });

        } catch (Exception e) {
            Log.e(TAG, "Unexpected error in building info response", e.getCause());
            callbackContext.sendPluginResult(new PluginResult(Status.ERROR, e.getMessage()));
        }
    }

    public void fetchGeofencesFromBuilding(CordovaInterface cordova, CordovaWebView webView, JSONArray args,
            final CallbackContext callbackContext) 
    {
        try {
            JSONObject jsonoBuilding = args.getJSONObject(0);
            Building building = SitumMapper.buildingJsonObjectToBuilding(jsonoBuilding);

            getCommunicationManagerInstance().fetchGeofencesFromBuilding(building, new Handler<List<Geofence>>() {
                @Override
                public void onSuccess(List<Geofence> geofences) {
                    try {
                        Log.d(PluginHelper.TAG, "onSuccess: Geofences fetched successfully.");
                        JSONArray jsonaGeofences = new JSONArray();

                        for (Geofence geofence : geofences) {
                            Log.i(PluginHelper.TAG, "onSuccess: " + geofence.getIdentifier());
                            JSONObject jsonoGeofence = SitumMapper.geofenceToJsonObject(geofence);
                            jsonaGeofences.put(jsonoGeofence);
                        }
                        if (geofences.isEmpty()) {
                            Log.e(PluginHelper.TAG, "onSuccess: you have no geofences defined for this building");
                        }
                        callbackContext.sendPluginResult(new PluginResult(Status.OK, jsonaGeofences));
                    } catch (JSONException e) {
                        callbackContext.sendPluginResult(new PluginResult(Status.ERROR, e.getMessage()));
                    }
                }

                @Override
                public void onFailure(Error error) {
                    Log.e(PluginHelper.TAG, "onFailure:" + error);
                    callbackContext.sendPluginResult(new PluginResult(Status.ERROR, error.getMessage()));
                }
            });

        } catch (Exception e) {
            Log.e(TAG, "Unexpected error in building info response", e.getCause());
            callbackContext.sendPluginResult(new PluginResult(Status.ERROR, e.getMessage()));
        }
    }

    public void fetchFloorsFromBuilding(CordovaInterface cordova, CordovaWebView webView, JSONArray args,
            final CallbackContext callbackContext) {
        try {
            JSONObject jsonoBuilding = args.getJSONObject(0);
            Building building = SitumMapper.buildingJsonObjectToBuilding(jsonoBuilding);
            getCommunicationManagerInstance().fetchFloorsFromBuilding(building, new Handler<Collection<Floor>>() {
                @Override
                public void onSuccess(Collection<Floor> floors) {
                    try {
                        Log.d(PluginHelper.TAG, "onSuccess: Floors fetched successfully.");
                        
                        // TODO 19/11/19:     jo.put(FLOORS, arrayFromFloors(buildingInfo.getFloors()));
                        JSONArray jsonaFloors = new JSONArray();

                        for (Floor floor : floors) {
                            Log.i(PluginHelper.TAG, "onSuccess: " + floor.getIdentifier());
                            JSONObject jsonoFloor = SitumMapper.floorToJsonObject(floor);
                            jsonaFloors.put(jsonoFloor);
                        }
                        if (floors.isEmpty()) {
                            Log.e(PluginHelper.TAG, "onSuccess: you have no floors defined for this building");
                        }
                        callbackContext.sendPluginResult(new PluginResult(Status.OK, jsonaFloors));
                    } catch (JSONException e) {
                        callbackContext.sendPluginResult(new PluginResult(Status.ERROR, e.getMessage()));
                    }
                }

                @Override
                public void onFailure(Error error) {
                    Log.e(PluginHelper.TAG, "onFailure:" + error);
                    callbackContext.sendPluginResult(new PluginResult(Status.ERROR, error.getMessage()));
                }
            });
        } catch (Exception e) {
            Log.e(TAG, "Unexpected error in floor response", e.getCause());
            callbackContext.sendPluginResult(new PluginResult(Status.ERROR, e.getMessage()));
        }
    }

    public void fetchIndoorPOIsFromBuilding(CordovaInterface cordova, CordovaWebView webView, JSONArray args,
            final CallbackContext callbackContext) {
        try {
            JSONObject jsonoBuilding = args.getJSONObject(0);
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
                                callbackContext.sendPluginResult(new PluginResult(Status.OK, jsonaPois));
                            } catch (JSONException e) {
                                callbackContext.sendPluginResult(new PluginResult(Status.ERROR, e.getMessage()));
                            }
                        }

                        @Override
                        public void onFailure(Error error) {
                            Log.e(PluginHelper.TAG, "onFailure:" + error);
                            callbackContext.sendPluginResult(new PluginResult(Status.ERROR, error.getMessage()));
                        }
                    });
        } catch (Exception e) {
            Log.e(TAG, "Unexpected error in poi response", e.getCause());
            callbackContext.sendPluginResult(new PluginResult(Status.ERROR, e.getMessage()));
        }
    }

    public void fetchOutdoorPOIsFromBuilding(CordovaInterface cordova, CordovaWebView webView, JSONArray args,
            final CallbackContext callbackContext) {
        try {
            JSONObject jsonoBuilding = args.getJSONObject(0);
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
                                callbackContext.sendPluginResult(new PluginResult(Status.OK, jsonaPois));
                            } catch (JSONException e) {
                                callbackContext.sendPluginResult(new PluginResult(Status.ERROR, e.getMessage()));
                            }
                        }

                        @Override
                        public void onFailure(Error error) {
                            Log.e(PluginHelper.TAG, "onFailure:" + error);
                            callbackContext.sendPluginResult(new PluginResult(Status.ERROR, error.getMessage()));
                        }
                    });
        } catch (Exception e) {
            Log.e(TAG, "Unexpected error in poi response", e.getCause());
            callbackContext.sendPluginResult(new PluginResult(Status.ERROR, e.getMessage()));
        }
    }

    public void fetchPoiCategories(CordovaInterface cordova, CordovaWebView webView, JSONArray args,
            final CallbackContext callbackContext) {
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
                    callbackContext.sendPluginResult(new PluginResult(Status.OK, jsonaPoiCategories));
                } catch (JSONException e) {
                    callbackContext.sendPluginResult(new PluginResult(Status.ERROR, e.getMessage()));
                }
            }

            @Override
            public void onFailure(Error error) {
                Log.e(PluginHelper.TAG, "onFailure:" + error);
                callbackContext.sendPluginResult(new PluginResult(Status.ERROR, error.getMessage()));
            }
        });
    }

    public void fetchPoiCategoryIconNormal(CordovaInterface cordova, CordovaWebView webView, JSONArray args,
            final CallbackContext callbackContext) {
        try {
            JSONObject jsonoCategory = args.getJSONObject(0);
            PoiCategory category = SitumMapper.poiCategoryFromJsonObject(jsonoCategory);
            getCommunicationManagerInstance().fetchPoiCategoryIconNormal(category, new Handler<Bitmap>() {
                @Override
                public void onSuccess(Bitmap bitmap) {
                    try {
                        Log.d(PluginHelper.TAG, "onSuccess: Poi icon fetched successfully");
                        JSONObject jsonoMap = SitumMapper.bitmapToString(bitmap);
                        callbackContext.sendPluginResult(new PluginResult(Status.OK, jsonoMap));
                    } catch (JSONException e) {
                        callbackContext.sendPluginResult(new PluginResult(Status.ERROR, e.getMessage()));
                    }
                }

                @Override
                public void onFailure(Error error) {
                    Log.e(PluginHelper.TAG, "onFailure: " + error);
                    callbackContext.sendPluginResult(new PluginResult(Status.ERROR, error.getMessage()));
                }
            });
        } catch (Exception e) {
            Log.e(TAG, "Unexpected error in situm POI response", e.getCause());
            callbackContext.sendPluginResult(new PluginResult(Status.ERROR, e.getMessage()));
        }
    }

    public void fetchPoiCategoryIconSelected(CordovaInterface cordova, CordovaWebView webView, JSONArray args,
            final CallbackContext callbackContext) {
        try {
            JSONObject jsonoCategory = args.getJSONObject(0);
            PoiCategory category = SitumMapper.poiCategoryFromJsonObject(jsonoCategory);
            getCommunicationManagerInstance().fetchPoiCategoryIconSelected(category, new Handler<Bitmap>() {
                @Override
                public void onSuccess(Bitmap bitmap) {
                    try {
                        Log.d(PluginHelper.TAG, "onSuccess: Poi icon fetched successfully");
                        JSONObject jsonoMap = SitumMapper.bitmapToString(bitmap);
                        callbackContext.sendPluginResult(new PluginResult(Status.OK, jsonoMap));
                    } catch (JSONException e) {
                        callbackContext.sendPluginResult(new PluginResult(Status.ERROR, e.getMessage()));
                    }
                }

                @Override
                public void onFailure(Error error) {
                    Log.e(PluginHelper.TAG, "onFailure: " + error);
                    callbackContext.sendPluginResult(new PluginResult(Status.ERROR, error.getMessage()));
                }
            });
        } catch (Exception e) {
            Log.e(TAG, "Unexpected error in situm POI response", e.getCause());
            callbackContext.sendPluginResult(new PluginResult(Status.ERROR, e.getMessage()));
        }
    }

    public void fetchEventsFromBuilding(CordovaInterface cordova, CordovaWebView webView, JSONArray args,
            final CallbackContext callbackContext) {
        try {
            JSONObject jsonoBuilding = args.getJSONObject(0);
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
                                callbackContext.sendPluginResult(new PluginResult(Status.OK, jsonaEvents));
                            } catch (JSONException e) {
                                callbackContext.sendPluginResult(new PluginResult(Status.ERROR, e.getMessage()));
                            }
                        }

                        @Override
                        public void onFailure(Error error) {
                            Log.e(PluginHelper.TAG, "onFailure:" + error);
                            callbackContext.sendPluginResult(new PluginResult(Status.ERROR, error.getMessage()));
                        }
                    });
        } catch (Exception e) {
            Log.e(TAG, "Unexpected error in situm event response", e.getCause());
            callbackContext.sendPluginResult(new PluginResult(Status.ERROR, e.getMessage()));
        }
    }

    public void fetchMapFromFloor(CordovaInterface cordova, CordovaWebView webView, final JSONArray args,
            final CallbackContext callbackContext) {
        try {
            JSONObject jsonoFloor = args.getJSONObject(0);
            Floor floor = SitumMapper.floorJsonObjectToFloor(jsonoFloor);
            getCommunicationManagerInstance().fetchMapFromFloor(floor, new Handler<Bitmap>() {
                @Override
                public void onSuccess(Bitmap bitmap) {
                    try {
                        Log.d(PluginHelper.TAG, "onSuccess: Map fetched successfully");
                        JSONObject jsonoMap = SitumMapper.bitmapToString(bitmap);
                        callbackContext.sendPluginResult(new PluginResult(Status.OK, jsonoMap));
                    } catch (JSONException e) {
                        callbackContext.sendPluginResult(new PluginResult(Status.ERROR, e.getMessage()));
                    }
                }

                @Override
                public void onFailure(Error error) {
                    Log.e(PluginHelper.TAG, "onFailure: " + error);
                    callbackContext.sendPluginResult(new PluginResult(Status.ERROR, error.getMessage()));
                }
            });
        } catch (Exception e) {
            Log.e(TAG, "Unexpected error in map download", e.getCause());
            callbackContext.sendPluginResult(new PluginResult(Status.ERROR, e.getMessage()));
        }
    }

    public void startPositioning(final CordovaInterface cordova, CordovaWebView webView, JSONArray args,
            final CallbackContext callbackContext) {
        try {
            JSONObject jsonoBuilding = args.getJSONObject(0);
            String sBuildingName = jsonoBuilding.getString(SitumMapper.BUILDING_NAME);
            LocationRequest locationRequest = SitumMapper.locationRequestJSONObjectToLocationRequest(args);

            Log.i(TAG, "startPositioning: starting positioning in " + sBuildingName);
            locationListener = new LocationListener() {
                public void onLocationChanged(Location location) {
                    try {
                        PluginHelper.this.computedLocation = location; // This is for testing purposes
                        Log.i(PluginHelper.TAG, "onLocationChanged() called with: location = [" + location + "]");
                        JSONObject jsonObject = SitumMapper.locationToJsonObject(location);
                        PluginResult result = new PluginResult(Status.OK, jsonObject);
                        result.setKeepCallback(true);
                        callbackContext.sendPluginResult(result);
                    } catch (JSONException e) {
                        callbackContext.sendPluginResult(new PluginResult(Status.ERROR, e.getMessage()));
                    }
                }

                public void onStatusChanged(@NonNull LocationStatus status) {
                    try {
                        Log.i(PluginHelper.TAG, "onStatusChanged() called with: status = [" + status + "]");
                        JSONObject jsonObject = SitumMapper.locationStatusToJsonObject(status);
                        PluginResult result = new PluginResult(Status.OK, jsonObject);
                        result.setKeepCallback(true);
                        callbackContext.sendPluginResult(result);
                    } catch (JSONException e) {
                        callbackContext.sendPluginResult(new PluginResult(Status.ERROR, e.getMessage()));
                    }
                }

                public void onError(@NonNull Error error) {
                    Log.e(PluginHelper.TAG, "onError() called with: error = [" + error + "]");
                    locationListener = null;
                    PluginResult result = new PluginResult(Status.ERROR, error.getMessage());
                    result.setKeepCallback(true);
                    callbackContext.sendPluginResult(result);
                    switch (error.getCode()) {
                    case 8001:
                        requestLocationPermission(cordova);
                        return;
                    case 8002:
                        showLocationSettings(cordova);
                        return;
                    default:
                        return;
                    }
                }
            };
            try {
                SitumSdk.locationManager().requestLocationUpdates(locationRequest, locationListener);
            } catch (Exception e) {
                Log.e(PluginHelper.TAG, "onError() called with: error = [" + e + "]");
            }
        } catch (Exception e) {
            Log.e(TAG, "Unexpected error building response", e.getCause());
            callbackContext.sendPluginResult(new PluginResult(Status.ERROR, e.getMessage()));
        }
    }

    public void stopPositioning(CordovaInterface cordova, CordovaWebView webView, JSONArray args,
            CallbackContext callbackContext) {
        if (locationListener != null) {
            try {
                SitumSdk.locationManager().removeUpdates(locationListener);
                locationListener = null;
                callbackContext.sendPluginResult(new PluginResult(Status.OK, "Success"));
            } catch (Exception e) {
                callbackContext.sendPluginResult(new PluginResult(Status.ERROR, e.getMessage()));
            }
        } else {
            Log.i(TAG, "stopPositioning: location listener is not started.");
            callbackContext.sendPluginResult(new PluginResult(Status.OK, "Allready disabled"));
        }
    }

    private void showLocationSettings(CordovaInterface cordova) {
        Toast.makeText(cordova.getActivity(), "You must enable location", Toast.LENGTH_LONG).show();
        cordova.getActivity().startActivityForResult(new Intent("android.settings.LOCATION_SOURCE_SETTINGS"), 0);
    }

    private void requestLocationPermission(CordovaInterface cordova) {
        ActivityCompat.requestPermissions(cordova.getActivity(),
                new String[] { "android.permission.ACCESS_COARSE_LOCATION" }, 0);
    }

    public void returnDefaultResponse(CallbackContext callbackContext) {
        String message = "Error function name not found";
        Log.e(TAG, message);
        callbackContext.sendPluginResult(new PluginResult(Status.OK, message));
    }

    public void invalidateCache(CallbackContext callbackContext) {
        getCommunicationManagerInstance().invalidateCache();
        callbackContext.sendPluginResult(new PluginResult(Status.OK, "Cache invalidated"));
    }

    public void requestNavigationUpdates(final CordovaInterface cordova,
     CordovaWebView webView, 
     JSONArray args,
     final CallbackContext callbackContext) {
            // 1) Parse and check arguments

            if (this.computedRoute == null) {
                Log.d(TAG, "Situm >> There is not an stored route so you are not allowed to navigate");
                callbackContext.sendPluginResult(new PluginResult(Status.ERROR, "Compute a valid route with requestDirections before trying to navigate within a route"));
                return;
            }
            // try??
            Route route = this.computedRoute; // args.getJSONObject(0); // Retrieve route from arguments, we do this since Route object has internal properties that we do not want to expose
            // 2) Build Navigation Arguments
            // 2.1) Build Navigation Request
            Log.d(TAG,"requestNavigationUpdates executed: passed route: " +  route);
            NavigationRequest.Builder builder = new NavigationRequest.Builder().route(route);

            try {
                JSONObject navigationJSONOptions = args.getJSONObject(0); // Route should be the first parameter

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
            navigationListener = new NavigationListener()   {
                public void onProgress(NavigationProgress progress) {
                    Log.d(TAG, "On progress received: " + progress);
                    try {
                        JSONObject jsonProgress = SitumMapper.navigationProgressToJsonObject(progress, cordova.getActivity());
                        try {
                            jsonProgress.put("type", "progress");
                        } catch (JSONException e) {
                            Log.e(TAG, "error inserting type in navigation progress");
                        }
                        PluginResult result = new PluginResult(Status.OK, jsonProgress ); // TODO: Change this to return an object with valid information
                        result.setKeepCallback(true);
                        callbackContext.sendPluginResult(result);        
    
                    } catch (Exception e) {
                        //TODO: handle exception
                        Log.d(TAG, "On Error parsing progress: " + progress);
                        PluginResult result = new PluginResult(Status.ERROR, e.getMessage());
                        result.setKeepCallback(true);
                        callbackContext.sendPluginResult(result);
                    }
                };

                public void onDestinationReached() {
                    Log.d(TAG, "On destination reached: ");
                    JSONObject jsonResult = new JSONObject();
                    try {
                        jsonResult.put("type", "destinationReached");
                        jsonResult.put("message", "Destination reached");
                        } catch (JSONException e) {
                        Log.e(TAG, "error inserting type in destination reached");
                    }
                    PluginResult result = new PluginResult(Status.OK,jsonResult);
                    result.setKeepCallback(true);
                    callbackContext.sendPluginResult(result);        
                };

                public void onUserOutsideRoute() {
                    Log.d(TAG, "On user outside route: " );
                    JSONObject jsonResult = new JSONObject();
                    try {
                        jsonResult.put("type", "userOutsideRoute");
                        jsonResult.put("message", "User outside route");
                    } catch (JSONException e) {
                        Log.e(TAG, "error inserting type in user outside route");
                    }
                    PluginResult result = new PluginResult(Status.OK,jsonResult);
                    result.setKeepCallback(true);
                    callbackContext.sendPluginResult(result);        
                }
            };
            
            // 3)  Connect interfaces and connect callback back to js
            getNavigationManagerInstance().requestNavigationUpdates(navigationRequest, navigationListener); // Be carefull with exceptions

            PluginResult result = new PluginResult(Status.OK, "Requested navigation successfully"); // TODO: Change this to return an object with valid information
            result.setKeepCallback(true);
            callbackContext.sendPluginResult(result);

    }

    public void requestRealTimeUpdates(final CordovaInterface cordova,
     CordovaWebView webView, 
     JSONArray args,
     final CallbackContext callbackContext) { 
        try {
            // Convert request to native
            JSONObject jsonRequest = args.getJSONObject(0);

            RealTimeRequest request = SitumMapper.jsonObjectRealtimeRequest(jsonRequest);
            // Call

            realtimeListener = new RealTimeListener() {
                
                @Override
                public void onUserLocations(RealTimeData realTimeData) {
                    Log.d(TAG, "Success retrieving realtime data" + realTimeData);

                    try {
                        // Parse information
                        JSONObject jsonResult = SitumMapper.realtimeDataToJson(realTimeData);

                        // Send it back to (removing user information)
                        PluginResult result = new PluginResult(Status.OK,jsonResult);
                        result.setKeepCallback(true);
                        callbackContext.sendPluginResult(result);        
                    } catch (Exception e) {
                        Log.d(TAG, "Error  exception realtime data" + e);
                    }
                    
                    
                }

                @Override
                public void onError(Error error) {
                    Log.e(TAG, "Error request realtime data" + error);
                    PluginResult result = new PluginResult(Status.ERROR, error.getMessage());
                    result.setKeepCallback(true);
                    callbackContext.sendPluginResult(result);
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
            callbackContext.sendPluginResult(new PluginResult(Status.ERROR, e.getMessage()));
        }
     }

     public void removeRealTimeUpdates(CordovaInterface cordova,
    CordovaWebView webView, 
    JSONArray args,
    final CallbackContext callbackContext) {
        // 
        Log.i(TAG, "Remove realtime updates");
        getRealtimeManagerInstance().removeRealTimeUpdates(); // TODO: Incorporate sending a result to the exterior
    }

    // Initialize Navigation Component 

    public void updateNavigationWithLocation(CordovaInterface cordova,
    CordovaWebView webView, 
    JSONArray args,
    final CallbackContext callbackContext) {
        try {
            // 1) Check for location arguments
            JSONObject jsonLocation = args.getJSONObject(0); // What if json is not specified?

            // 2) Create a Location Object from argument
            Location actualLocation = SitumMapper.jsonLocationObjectToLocation(jsonLocation); // Location Objet from JSON
                // Location actualLocation = PluginHelper.computedLocation;
            Log.i(TAG, "UpdateNavigation with Location: " + actualLocation);

            // 3) Connect interfaces
            getNavigationManagerInstance().updateWithLocation(actualLocation); 
            callbackContext.sendPluginResult(new PluginResult(Status.OK, "Navigation updated"));
        } catch (Exception e) {
            e.printStackTrace();
            callbackContext.sendPluginResult(new PluginResult(Status.ERROR, e.getMessage()));
        }
    }

    public void removeNavigationUpdates(CordovaInterface cordova,
    CordovaWebView webView, 
    JSONArray args,
    final CallbackContext callbackContext) {
        // 
        Log.i(TAG, "Remove navigation updates");
        getNavigationManagerInstance().removeUpdates(); // TODO: Incorporate sending a result to the exterior
    }

    public void requestDirections(final CordovaInterface cordova, CordovaWebView webView, JSONArray args,
            final CallbackContext callbackContext) {
        try {
            JSONObject jsonoBuilding = args.getJSONObject(0);
            JSONObject jsonoFrom = args.getJSONObject(1);
            JSONObject jsonoTo = args.getJSONObject(2);
            JSONObject jsonoOptions = null;
            if (args.length() >= 4) {
                jsonoOptions = args.getJSONObject(3);
            }
            DirectionsRequest directionRequest =
                    SitumMapper.jsonObjectToDirectionsRequest(jsonoBuilding, jsonoFrom, jsonoTo, jsonoOptions);
            SitumSdk.directionsManager().requestDirections(directionRequest, new Handler<Route>() {
                @Override
                public void onSuccess(Route route) {
                    try {
                        PluginHelper.this.computedRoute = route;
                        JSONObject jsonoRoute = SitumMapper.routeToJsonObject(route, cordova.getActivity());
                        Log.i(TAG, "onSuccess: Route calculated successfully" + route);
                        callbackContext.sendPluginResult(new PluginResult(Status.OK, jsonoRoute));
                    } catch (JSONException e) {
                        callbackContext.sendPluginResult(new PluginResult(Status.ERROR, e.getMessage()));
                    }
                }

                @Override
                public void onFailure(Error error) {
                    Log.e(TAG, "onError:" + error.getMessage());
                    callbackContext.sendPluginResult(new PluginResult(Status.ERROR, error.getMessage()));
                }
            });
        } catch (Exception e) {
            e.printStackTrace();
            callbackContext.sendPluginResult(new PluginResult(Status.ERROR, e.getMessage()));
        }
    }*/
}