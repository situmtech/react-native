/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import invariant from "invariant";
import { NativeEventEmitter, NativeModules, Platform } from "react-native";

export type * from "./types";
export * from "./types/constants";

import packageJson from "../../package.json";
import { logError } from "../utils/logError";
import type {
  Building,
  DirectionPoint,
  DirectionsOptions,
  Floor,
  Geofence,
  LocationRequestOptions,
  NavigationRequest,
  PoiCategory,
} from "./types";

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
    password: string
  ): Promise<{ success: boolean }> {
    return new Promise((resolve, _reject) => {
      RNCSitumPlugin.setUserPass(
        email,
        password,
        (response: { success: boolean }) => {
          resolve(response);
        }
      );
    });
  },

  setDashboardURL: function (url: string): Promise<{ success: boolean }> {
    return new Promise((resolve, _reject) => {
      RNCSitumPlugin.setDashboardURL(url, (response: { success: boolean }) => {
        resolve(response);
      });
    });
  },

  /**
   * Set to true if you want the SDK to download the configuration from the Situm API
   * and use it by default. Right now it only affects the LocationRequest.
   * Default value is true from SDK version 2.83.5
   *
   * @param useRemoteConfig boolean
   */
  setUseRemoteConfig(useRemoteConfig: string): Promise<{ success: boolean }> {
    return new Promise((resolve, _reject) => {
      RNCSitumPlugin.setUseRemoteConfig(useRemoteConfig, (response) =>
        resolve(response)
      );
    });
  },

  /**
   * Sets the maximum age of a cached response. If the cache response's age exceeds
   * maxAge, it will not be used and a network request will be made.
   *
   * @param cacheAge a non-negative integer
   */
  setCacheMaxAge: function (cacheAge: number): Promise<{ success: boolean }> {
    return new Promise((resolve, _reject) => {
      RNCSitumPlugin.setCacheMaxAge(cacheAge, (response) => resolve(response));
    });
  },

  /**
   * Invalidate all the resources in the cache
   */
  invalidateCache: function (): Promise<{ success: boolean }> {
    return new Promise((resolve, _reject) => {
      RNCSitumPlugin.invalidateCache();
      resolve({ success: true });
    });
  },

  /**
   * Gets the list of versions for the current plugin and environment
   *
   * @param callback callback to use on success
   */
  sdkVersions: function () {
    const versions: { react_native: string; ios?: string; android?: string } = {
      react_native: packageJson.version,
    };

    if (Platform.OS === "ios") {
      versions.ios = packageJson.sdkVersions.ios;
    } else {
      versions.android = packageJson.sdkVersions.android;
    }

    return versions;
  },

  /**
   * Returns the device identifier that has generated the location
   */
  getDeviceId: function (): Promise<number> {
    return new Promise((resolve, _reject) => {
      RNCSitumPlugin.getDeviceId((response) => resolve(response));
    });
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
   */
  fetchBuildings: function (): Promise<unknown> {
    return new Promise((resolve, _reject) => {
      RNCSitumPlugin.fetchBuildings(
        (response) => resolve(response),
        (error) => {
          logError(error);
          throw error;
        }
      );
    });
  },

  /**
   * Download all the building data for the selected building. This info includes
   * floors, indoor and outdoor POIs, events and paths. Also it download floor
   * maps and POI category icons to local storage.
   *
   * @param building
   */
  fetchBuildingInfo: function (building: Building): Promise<unknown> {
    return new Promise((resolve, _reject) => {
      RNCSitumPlugin.fetchBuildingInfo(
        building,
        (response) => resolve(response),
        (error) => {
          logError(error);
          throw error;
        }
      );
    });
  },

  fetchTilesFromBuilding: function (building: Building): Promise<unknown> {
    return new Promise((resolve, _reject) => {
      RNCSitumPlugin.fetchTilesFromBuilding(
        building,
        (response) => resolve(response),
        (error) => {
          logError(error);
          throw error;
        }
      );
    });
  },

  /**
   * Download all the floors of a building
   *
   * @param building
   * @param success function called on sucess, returns a list of Floor objects
   * @param error function called on failure, returns an error string
   */
  fetchFloorsFromBuilding: function (building: Building): Promise<Floor[]> {
    return new Promise((resolve, _reject) => {
      RNCSitumPlugin.fetchFloorsFromBuilding(
        building,
        (response) => resolve(response),
        (error) => {
          logError(error);
          throw error;
        }
      );
    });
  },

  /**
   * Download the map image of a floor
   *
   * @param floor the floor object. Not null.
   */
  fetchMapFromFloor: function (floor: Floor): Promise<string> {
    return new Promise((resolve, _reject) => {
      RNCSitumPlugin.fetchMapFromFloor(
        floor,
        (response) => resolve(response),
        (error) => {
          logError(error);
          throw error;
        }
      );
    });
  },

  /**
   * Get the geofences of a building
   *
   * @param building
   * @param success function called on sucess, returns a list of Building objects
   * @param error function called on failure, returns an error string
   */
  fetchGeofencesFromBuilding: function (
    building: Building
  ): Promise<Geofence[]> {
    return new Promise((resolve, _reject) => {
      RNCSitumPlugin.fetchGeofencesFromBuilding(
        building,
        (response: Geofence[]) => resolve(response),
        (error) => {
          logError(error);
          throw error;
        }
      );
    });
  },

  /**
   * Get all POI categories, download and cache their icons asynchronously.
   */
  fetchPoiCategories: function (): Promise<PoiCategory[]> {
    return new Promise((resolve, reject) => {
      RNCSitumPlugin.fetchPoiCategories(
        (response) => resolve(response),
        (error) => {
          logError(error);
          reject(error);
        }
      );
    });
  },

  /**
   * Get the normal category icon for a category
   *
   * @param category the category. Not null.
   */
  fetchPoiCategoryIconNormal: function (category: any): Promise<unknown> {
    return new Promise((resolve, reject) => {
      RNCSitumPlugin.fetchPoiCategoryIconNormal(
        category,
        (response) => resolve(response),
        (error) => {
          logError(error);
          reject(error);
        }
      );
    });
  },

  /**
   * Get the selected category icon for a category
   *
   * @param category the category. Not null.
   */
  fetchPoiCategoryIconSelected: function (category: any): Promise<unknown> {
    return new Promise((resolve, reject) => {
      RNCSitumPlugin.fetchPoiCategoryIconSelected(
        category,
        (response) => resolve(response),
        (error) => {
          logError(error);
          reject(error);
        }
      );
    });
  },

  /**
   * Download the indoor POIs of a building
   *
   * @param building
   * @param success function called on sucess, returns a list of POI objects
   * @param error function called on failure, returns an error string
   */
  fetchIndoorPOIsFromBuilding: function (building: any): Promise<unknown> {
    return new Promise((resolve, reject) => {
      RNCSitumPlugin.fetchIndoorPOIsFromBuilding(
        building,
        (response) => resolve(response),
        (error) => {
          logError(error);
          reject(error);
        }
      );
    });
  },

  /**
   * Download the outdoor POIs of a building
   *
   * @param building
   */
  fetchOutdoorPOIsFromBuilding: function (building: any): Promise<unknown> {
    return new Promise((resolve, reject) => {
      RNCSitumPlugin.fetchOutdoorPOIsFromBuilding(
        building,
        (response) => resolve(response),
        (error) => {
          logError(error);
          reject(error);
        }
      );
    });
  },

  /**
   * Download the events of a building
   *
   * @param building
   */
  fetchEventsFromBuilding: function (building: any): Promise<unknown> {
    return new Promise((resolve, reject) => {
      RNCSitumPlugin.fetchEventsFromBuilding(
        building,
        (response) => resolve(response),
        (error) => {
          logError(error);
          reject(error);
        }
      );
    });
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
   */
  stopPositioning: function (): Promise<unknown> {
    return new Promise((resolve, reject) => {
      RNCSitumPlugin.stopPositioning(
        (response) => resolve(response),
        (error) => {
          logError(error);
          reject(error);
        }
      );
    });
  },

  /**
   * Calculates a route between two points. The result is provided
   * asynchronously using the callback.
   *
   * @param directionParams
   */
  requestDirections: function (
    directionParams: [
      Building,
      DirectionPoint,
      DirectionPoint,
      DirectionsOptions
    ]
  ) {
    return new Promise((resolve, reject) => {
      RNCSitumPlugin.requestDirections(
        directionParams,
        (response) => resolve(response),
        (error) => {
          logError(error);
          reject(error);
        }
      );
    });
  },

  /**
   * Set the navigation params, and the listener that receives the updated
   * navigation progress.
   *
   * Can only exist one navigation with one listener at a time. If this method was
   * previously invoked, but removeUpdates() wasn't, removeUpdates() is called internally.
   *
   * @param options
   */
  requestNavigationUpdates: function (options?: NavigationRequest) {
    return new Promise((resolve, reject) => {
      RNCSitumPlugin.requestNavigationUpdates(options || {});

      navigationSubscriptions.push(
        SitumPluginEventEmitter.addListener("navigationUpdated", (response) =>
          resolve(response)
        )
      );

      navigationSubscriptions.push(
        SitumPluginEventEmitter.addListener("navigationError", (error) => {
          logError(error);
          reject(error);
        })
      );
    });
  },

  /**
   * Informs NavigationManager object the change of the user's location
   *
   * @param location new Location of the user. If null, nothing is done
   * @param success callback to use when the navigation updates
   * @param error callback to use when an error on navigation udpates raises
   */
  updateNavigationWithLocation: function (location) {
    return new Promise((resolve, reject) => {
      if (navigationSubscriptions.length === 0) {
        reject("No active navigation!!");
        return;
      }

      RNCSitumPlugin.updateNavigationWithLocation(
        location,
        (response) => resolve(response),
        (error) => {
          logError(error);
          reject(error);
        }
      );
    });
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

  /**
   * Checks if a point is inside a geofence
   *
   */
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
