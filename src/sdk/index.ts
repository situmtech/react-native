/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import invariant from "invariant";
import { NativeEventEmitter, NativeModules, Platform } from "react-native";

import packageJson from "../../package.json";
import type {
  Building,
  DirectionPoint,
  DirectionsOptions,
  Floor,
  LocationRequestOptions,
} from "./types/index.d.ts";
import { logError } from "./utils";

const LINKING_ERROR =
  `The package 'situm-react-native-plugin' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: "" }) +
  "- You rebuilt the app after installing the package\n" +
  "- You are not using Expo managed workflow\n";

const RNCSitumPlugin = NativeModules.RNCSitumPlugin
  ? NativeModules.RNCSitumPlugin
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

const SitumPluginEventEmitter = new NativeEventEmitter(RNCSitumPlugin);

let positioningSubscriptions = [];
let navigationSubscriptions = [];
let realtimeSubscriptions = [];

export default {
  /**
   * Initializes SDK.
   *
   * You have to call this function prior any call to other method.
   * This method can be safely called many times as it will only initialise the SDK
   * if it is not already initialised.
   */
  initSitumSDK: function (): void {
    RNCSitumPlugin.initSitumSDK();
  },

  /**
   * Provides your API key to the Situm SDK.
   *
   * This key is generated for your application in the Dashboard.
   * Old credentials will be removed.
   *
   * @param email user's email.
   * @param apiKey user's apikey.
   * @param onSuccess callback to use when the function returns successfully
   */
  setApiKey: function (
    email: string,
    apiKey: string,
    onSuccess?: Function
  ): void {
    RNCSitumPlugin.setApiKey(email, apiKey, onSuccess);
  },

  /**
   * Provides user's email and password. This credentials will be used to obtain a
   * valid user token to authenticate the server request, when necessary. Token
   * obtaining is not necessary done when this method is executed. Old credentials
   * will be removed.
   *
   * @param email user's email.
   * @param password user's password.
   * @param onSuccess callback to use when the function returns successfully
   */
  setUserPass: function (
    email: string,
    password: string,
    onSuccess?: Function
  ): void {
    RNCSitumPlugin.setUserPass(email, password, onSuccess);
  },

  setDashboardURL: function (url: string, success: Function): void {
    RNCSitumPlugin.setDashboardURL(url, success);
  },

  /**
   * Set to true if you want the SDK to download the configuration from the Situm API
   * and use it by default. Right now it only affects the LocationRequest.
   * Default value is true from SDK version 2.83.5
   *
   * @param useRemoteConfig boolean
   * @param success function called on sucess
   */
  setUseRemoteConfig(useRemoteConfig: string, onSuccess?: Function): void {
    RNCSitumPlugin.setUseRemoteConfig(useRemoteConfig, onSuccess);
  },

  /**
   * Sets the maximum age of a cached response. If the cache response's age exceeds
   * maxAge, it will not be used and a network request will be made.
   *
   * @param cacheAge a non-negative integer
   * @param success function called on success
   */
  setCacheMaxAge: function (cacheAge: number, success?: Function): void {
    RNCSitumPlugin.setCacheMaxAge(cacheAge, success);
  },

  /**
   * Invalidate all the resources in the cache
   */
  invalidateCache: function (): void {
    RNCSitumPlugin.invalidateCache();
  },

  /**
   * Gets the list of versions for the current plugin and environment
   *
   * @param callback callback to use on success
   */
  sdkVersions: function (
    callback: (event: {
      ios?: string;
      android?: string;
      react_native: string;
    }) => void
  ): void {
    const versions: { react_native: string; ios?: string; android?: string } = {
      react_native: packageJson.version,
    };

    if (Platform.OS === "ios") {
      versions.ios = packageJson.sdkVersions.ios;
    } else {
      versions.android = packageJson.sdkVersions.android;
    }

    callback(versions);
  },

  /**
   * Returns the device identifier that has generated the location
   *
   * @param callback function called on sucess, returns the id of the current device
   */
  getDeviceId: function (callback: Function): void {
    RNCSitumPlugin.getDeviceId(callback);
  },

  /**
   * Request authorization for the provided authentication
   * and stores it internally for subsequent requests
   */
  requestAuthorization: function (): void {
    RNCSitumPlugin.requestAuthorization();
  },

  /**
   * Download all the buildings for the current user
   *
   * @param success function called on sucess, returns a list of Building objects
   * @param error function called on failure, returns an error string
   */
  fetchBuildings: function (success: Function, error?: Function): void {
    invariant(
      typeof success === "function",
      "Must provide a valid success callback."
    );

    RNCSitumPlugin.fetchBuildings(success, error || logError);
  },

  /**
   * Download all the building data for the selected building. This info includes
   * floors, indoor and outdoor POIs, events and paths. Also it download floor
   * maps and POI category icons to local storage.
   *
   * @param building
   * @param success function called on sucess, returns a list of Building objects
   * @param error function called on failure, returns an error string
   */
  fetchBuildingInfo: function (
    building: Building,
    success: Function,
    error?: Function
  ): void {
    invariant(
      typeof success === "function",
      "Must provide a valid success callback."
    );

    RNCSitumPlugin.fetchBuildingInfo(building, success, error || logError);
  },

  fetchTilesFromBuilding: function (
    building: Building,
    success: Function,
    error?: Function
  ) {
    invariant(
      typeof success === "function",
      "Must provide a valid success callback."
    );
    RNCSitumPlugin.fetchTilesFromBuilding(building, success, error || logError);
  },

  /**
   * Download all the floors of a building
   *
   * @param building
   * @param success function called on sucess, returns a list of Floor objects
   * @param error function called on failure, returns an error string
   */
  fetchFloorsFromBuilding: function (
    building: Building,
    success: Function,
    error?: Function
  ): void {
    invariant(
      typeof success === "function",
      "Must provide a valid success callback."
    );

    RNCSitumPlugin.fetchFloorsFromBuilding(
      building,
      success,
      error || logError
    );
  },

  /**
   * Download the map image of a floor
   *
   * @param floor the floor object. Not null.
   * @param success function called on sucess, returns a list of Map url objects
   * @param error function called on failure, returns an error string
   */
  fetchMapFromFloor: function (
    floor: Floor,
    success: Function,
    error?: Function
  ): void {
    invariant(
      typeof success === "function",
      "Must provide a valid success callback."
    );

    RNCSitumPlugin.fetchMapFromFloor(floor, success, error || logError);
  },

  /**
   * Get the geofences of a building
   *
   * @param building
   * @param success function called on sucess, returns a list of Building objects
   * @param error function called on failure, returns an error string
   */
  fetchGeofencesFromBuilding: function (
    building: Building,
    success: Function,
    error?: Function
  ): void {
    invariant(
      typeof success === "function",
      "Must provide a valid success callback."
    );

    RNCSitumPlugin.fetchGeofencesFromBuilding(
      building,
      success,
      error || logError
    );
  },

  /**
   * Get all POI categories, download and cache their icons asynchronously.
   *
   * @param success function called on sucess, returns a list of POI categories
   * @param error function called on failure, returns an error string
   */
  fetchPoiCategories: function (success: Function, error?: Function) {
    invariant(
      typeof success === "function",
      "Must provide a valid success callback."
    );

    RNCSitumPlugin.fetchPoiCategories(success, error || logError);
  },

  /**
   * Get the normal category icon for a category
   *
   * @param category the category. Not null.
   * @param success function called on sucess, returns the icon in normal state.
   * @param error function called on failure, returns an error string
   */
  fetchPoiCategoryIconNormal: function (
    category: any,
    success: Function,
    error?: Function
  ): void {
    invariant(
      typeof success === "function",
      "Must provide a valid success callback."
    );

    RNCSitumPlugin.fetchPoiCategoryIconNormal(
      category,
      success,
      error || logError
    );
  },

  /**
   * Get the selected category icon for a category
   *
   * @param category the category. Not null.
   * @param success function called on sucess, returns the icon in selected state.
   * @param error function called on failure, returns an error string
   */
  fetchPoiCategoryIconSelected: function (
    category: any,
    success: Function,
    error?: Function
  ): void {
    invariant(
      typeof success === "function",
      "Must provide a valid success callback."
    );

    RNCSitumPlugin.fetchPoiCategoryIconSelected(
      category,
      success,
      error || logError
    );
  },

  /**
   * Download the indoor POIs of a building
   *
   * @param building
   * @param success function called on sucess, returns a list of POI objects
   * @param error function called on failure, returns an error string
   */
  fetchIndoorPOIsFromBuilding: function (
    building: any,
    success: Function,
    error?: Function
  ): void {
    invariant(
      typeof success === "function",
      "Must provide a valid success callback."
    );

    RNCSitumPlugin.fetchIndoorPOIsFromBuilding(
      building,
      success,
      error || logError
    );
  },

  /**
   * Download the outdoor POIs of a building
   *
   * @param building
   * @param success function called on sucess, returns a list of POI objects
   * @param error function called on failure, returns an error string
   */
  fetchOutdoorPOIsFromBuilding: function (
    building: any,
    success: Function,
    error?: Function
  ): void {
    invariant(
      typeof success === "function",
      "Must provide a valid success callback."
    );

    RNCSitumPlugin.fetchOutdoorPOIsFromBuilding(
      building,
      success,
      error || logError
    );
  },

  /**
   * Download the events of a building
   *
   * @param building
   * @param success Callback to asynchronously receive the events of a building. Not null.
   * @param error function called on failure, returns an error string
   */
  fetchEventsFromBuilding: function (
    building: any,
    success: Function,
    error?: Function
  ): void {
    invariant(
      typeof success === "function",
      "Must provide a valid success callback."
    );

    RNCSitumPlugin.fetchEventsFromBuilding(
      building,
      success,
      error || logError
    );
  },

  /**
   * Starts positioning with the configuration specified by the LocationRequest;
   * computed geolocations, status codes and errors will be received through the LocationListener callbacks.
   * You may call this method more than once, with the following effect:
   *
   *  - If you provide a new LocationRequest instance, positioning will be re-started
   *    with the new positioning options specified by this new instance.
   *  - If you provide a new LocationListener, the former LocationListener will be
   *    replaced, therefore geolocations will be communicated to the new one.
   *  - If neither LocationRequest nor LocationListener change, nothing will happen.
   *    You may stop positioning at any time by calling the LocationManager.removeUpdates() method.
   *
   * @param location callback to use when location is udpated
   * @param status callback to use when the positioning status changes
   * @param error callback to use when error is raised
   * @param locationOptions hashmap with options
   *
   * @returns the id of the subscription
   */
  startPositioning: function (
    location: (event: any) => void,
    status: Function,
    error?: Function,
    options?: LocationRequestOptions
  ): void {
    this.requestAuthorization();
    return this.startPositioningUpdates(
      location,
      status,
      error || logError,
      options || {}
    );
  },

  startPositioningUpdates: function (
    location: (event: any) => void,
    status: (event: any) => void,
    error?: (event: any) => void,
    options?: LocationRequestOptions
  ): void {
    // Remove old positioning subscriptions:
    positioningSubscriptions.forEach((subscription) => subscription?.remove());
    positioningSubscriptions = [];

    positioningSubscriptions.push(
      SitumPluginEventEmitter.addListener("locationChanged", location),
      SitumPluginEventEmitter.addListener("statusChanged", status),
      error
        ? SitumPluginEventEmitter.addListener(
            "locationError",
            error || logError
          )
        : null
    );
    // Call native:
    RNCSitumPlugin.startPositioning(options || {});
  },

  /**
   * Stops positioning, removing all location updates
   *
   * @param callback the callback to use when the function successfully ends
   * @returns
   */
  stopPositioning: function (callback?: Function): void {
    RNCSitumPlugin.stopPositioning(callback || logError);
  },

  /**
   * Calculates a route between two points. The result is provided
   * asynchronously using the callback.
   *
   * @param directionParams
   * @param success function called on sucess, returns a Route object
   * @param error function called on failure, returns an error string
   */
  requestDirections: function (
    directionParams: [
      Building,
      DirectionPoint,
      DirectionPoint,
      DirectionsOptions
    ],
    success: Function,
    error?: Function
  ) {
    invariant(
      typeof success === "function",
      "Must provide a valid success callback."
    );

    RNCSitumPlugin.requestDirections(
      directionParams,
      success,
      error || logError
    );
  },

  /**
   * Set the navigation params, and the listener that receives the updated
   * navigation progress.
   *
   * Can only exist one navigation with one listener at a time. If this method was
   * previously invoked, but removeUpdates() wasn't, removeUpdates() is called internally.
   *
   * @param navigationUpdates
   * @param error function called on failure, returns an error string
   * @param options
   */
  requestNavigationUpdates: function (
    navigationUpdates: (event: any) => void,
    error?: (event: any) => void,
    options?: LocationRequestOptions
  ) {
    RNCSitumPlugin.requestNavigationUpdates(options || {});
    navigationSubscriptions.push(
      SitumPluginEventEmitter.addListener(
        "navigationUpdated",
        navigationUpdates
      )
    );
    navigationSubscriptions.push(
      error
        ? SitumPluginEventEmitter.addListener(
            "navigationError",
            error || logError
          )
        : null
    );
  },

  /**
   * Informs NavigationManager object the change of the user's location
   *
   * @param location new Location of the user. If null, nothing is done
   * @param success callback to use when the navigation updates
   * @param error callback to use when an error on navigation udpates raises
   */
  updateNavigationWithLocation: function (
    location,
    success: Function,
    error?: Function
  ) {
    if (navigationSubscriptions.length === 0) {
      error("No active navigation!!");
      return;
    }

    RNCSitumPlugin.updateNavigationWithLocation(
      location,
      success,
      error || logError
    );
  },

  /**
   * Removes all location updates. This removes the internal state of the manager,
   * including the listener provided in requestNavigationUpdates(NavigationRequest,
   * NavigationListener), so it won't receive more progress updates.
   *
   * @param callback
   */
  removeNavigationUpdates: function (callback?: Function) {
    for (let i = 0; i < navigationSubscriptions.length; i++) {
      navigationSubscriptions[i].remove();
    }

    navigationSubscriptions = [];
    RNCSitumPlugin.removeNavigationUpdates(callback || logError);
  },

  requestRealTimeUpdates: function (
    navigationUpdates: (event: any) => void,
    error?: (event: any) => void,
    options?: any
  ) {
    RNCSitumPlugin.requestRealTimeUpdates(options || {});
    realtimeSubscriptions.push([
      SitumPluginEventEmitter.addListener("realtimeUpdated", navigationUpdates),
      error
        ? SitumPluginEventEmitter.addListener(
            "realtimeError",
            error || logError
          )
        : null,
    ]);
  },

  /**
   * Requests a real time devices positions
   *
   * @param realtimeUpdates callback to use when new device positions are updated
   * @param error callback to use when an error on navigation udpates raises
   * @param options Represents the configuration for getting realtime devices positions in
   */
  removeRealTimeUpdates: function (_callback?: Function) {
    realtimeSubscriptions = [];
    RNCSitumPlugin.removeRealTimeUpdates();
  },

  checkIfPointInsideGeofence: function (request: any, callback?: Function) {
    invariant(
      typeof callback === "function",
      "Must provide a valid success callback."
    );

    RNCSitumPlugin.checkIfPointInsideGeofence(request, callback);
  },

  /**
   * Callback that notifies when the user enters a geofence.
   *
   * In order to use correctly these callbacks you must know the following:
   *  - Positioning geofences (with trainer_metadata custom field) won't be notified.
   *  - These callbacks only work with indoor locations. Any outdoor location will
   *    produce a call to onExitedGeofences with the last positioned geofences as argument.
   *
   * @param callback the function called when the user enters a geofence
   */
  onEnterGeofences: function (callback: (event: any) => void) {
    RNCSitumPlugin.onEnterGeofences();
    // Adopts SDK behavior (setter):
    SitumPluginEventEmitter.removeAllListeners("onEnterGeofences");
    SitumPluginEventEmitter.addListener("onEnterGeofences", callback);
  },

  /**
   * Callback that notifies when the user exits a geofence.
   *
   * In order to use correctly these callbacks you must know the following:
   *  - Positioning geofences (with trainer_metadata custom field) won't be notified.
   *  - These callbacks only work with indoor locations. Any outdoor location will
   *    produce a call to onExitedGeofences with the last positioned geofences as argument.
   *
   * @param callback the function called when the user exits a geofence
   */
  onExitGeofences: function (callback: (event: any) => void) {
    RNCSitumPlugin.onExitGeofences();
    SitumPluginEventEmitter.removeAllListeners("onExitGeofences");
    SitumPluginEventEmitter.addListener("onExitGeofences", callback);
  },
};
