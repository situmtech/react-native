/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */

import invariant from "invariant";
import { NativeEventEmitter, NativeModules, Platform } from "react-native";

import packageJson from "../../package.json";
import { logError } from "../utils/logError";
import type {
  Building,
  BuildingInfo,
  ConfigurationOptions,
  DirectionPoint,
  Directions,
  DirectionsOptions,
  Error,
  Floor,
  Geofence,
  Location,
  LocationRequest,
  LocationStatus,
  NavigationProgress,
  NavigationRequest,
  Poi,
  PoiCategory,
  PoiIcon,
  SdkVersion,
} from "./types";
import { SdkNavigationUpdateType } from "./types/constants";

export type * from "./types";
export * from "./types/constants";

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

let positioningIsRunning = false;
let navigationIsRunning = false;
let realtimeSubscriptions = [];

export default {
  /**
   * Initializes SDK.
   *
   * You have to call this function prior any call to other method.
   * This method can be safely called many times as it will only initialise the SDK
   * if it is not already initialised.
   */
  init: function (): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        RNCSitumPlugin.initSitumSDK();
        resolve();
      } catch (error) {
        reject({
          code: error.code || -1,
          message: error.message || "Unknown error during initialization.",
        } as Error);
      }
    });
  },

  /**
   * Provides your API key to the Situm SDK.
   *
   * This key is generated for your application in the Dashboard.
   * Old credentials will be removed.
   *
   * @param email user's email.
   * @param apiKey user's apikey.
   */
  setApiKey: function (apiKey: string): Promise<void> {
    return new Promise((resolve, reject) => {
      RNCSitumPlugin.setApiKey(
        "email@email.com",
        apiKey,
        (response: { success: boolean }) => {
          if (response.success) {
            resolve();
          } else {
            reject({
              code: -1,
              message: "Failed to set API key.",
            } as Error);
          }
        }
      );
    });
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
  setUserPass: function (email: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      RNCSitumPlugin.setUserPass(
        email,
        password,
        (response: { success: boolean }) => {
          if (response.success) {
            resolve();
          } else {
            reject({
              code: -1,
              message: "Failed to set user credentials.",
            } as Error);
          }
        }
      );
    });
  },

  setDashboardURL: function (url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      RNCSitumPlugin.setDashboardURL(url, (response: { success: boolean }) => {
        if (response.success) {
          resolve();
        } else {
          reject({
            code: -1,
            message: "Failed to set dashboard URL.",
          } as Error);
        }
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
  setUseRemoteConfig(useRemoteConfig: boolean): Promise<void> {
    return new Promise((resolve, reject) => {
      RNCSitumPlugin.setUseRemoteConfig(
        useRemoteConfig ? "true" : "false",
        (response) => {
          if (response && response.success) {
            resolve();
          } else {
            reject(new Error("Failed to set remote config"));
          }
        }
      );
    });
  },

  setConfiguration: function (options: ConfigurationOptions): Promise<void> {
    // Inline function to set remote config and return a promise
    const setRemoteConfig = (useRemote: boolean): Promise<void> => {
      return new Promise((configResolve, configReject) => {
        RNCSitumPlugin.setUseRemoteConfig(
          useRemote ? "true" : "false",
          (response) => {
            if (response && response.success) {
              configResolve();
            } else {
              configReject(new Error("Failed to set remote config"));
            }
          }
        );
      });
    };

    // Inline function to set cache max age and return a promise
    const setCacheMaxAge = (cacheAge: number): Promise<void> => {
      return new Promise((cacheResolve, cacheReject) => {
        RNCSitumPlugin.setCacheMaxAge(cacheAge, (response) => {
          if (response && response.success) {
            cacheResolve();
          } else {
            cacheReject(new Error("Failed to set cache max age"));
          }
        });
      });
    };

    return new Promise((resolve, reject) => {
      // Use an IIFE (Immediately Invoked Function Expression) to handle async operations
      (async () => {
        try {
          if (options.useRemoteConfig !== undefined) {
            await setRemoteConfig(options.useRemoteConfig);
          }

          if (options.cacheMaxAge !== undefined) {
            await setCacheMaxAge(options.cacheMaxAge);
          }

          // Handle other configuration options here as needed

          resolve();
        } catch (err: any) {
          reject(new Error("Failed to set configuration: " + err.message));
        }
      })();
    });
  },

  /**
   * Invalidate all the resources in the cache
   */
  invalidateCache: function (): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        RNCSitumPlugin.invalidateCache();
        resolve();
      } catch (error) {
        reject(new Error("Failed to invalidate cache: " + error.message));
      }
    });
  },

  /**
   * Gets the list of versions for the current plugin and environment
   *
   */
  sdkVersion: function (): SdkVersion {
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
   *
   */
  getDeviceId: function (): Promise<string> {
    return new Promise((resolve, _reject) => {
      RNCSitumPlugin.getDeviceId((response) => resolve(response));
    });
  },

  /**
   * Downloads all the buildings
   */
  fetchBuildings: function (): Promise<Building[]> {
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
   * Downloads all the building data for the selected building. This info includes
   * floors, indoor and outdoor POIs, events and paths. Also it download floor
   * maps and POI category icons to local storage.
   *
   * @param building
   */
  fetchBuildingInfo: function (building: Building): Promise<BuildingInfo> {
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

  /**
   * (Experimental) Downloads the tiled-map of a certain building
   * @param building Building whose tiles will be downloaded
   * @returns
   */
  fetchTilesFromBuilding: function (building: Building): Promise<string> {
    return new Promise((resolve, _reject) => {
      RNCSitumPlugin.fetchTilesFromBuilding(
        building,
        (response) => resolve(response),
        (error) => {
          logError(error);
          _reject(error);
        }
      );
    });
  },

  /**
   * Downloads all the floors of a building
   *
   * @param building
   * @param success function called on sucess, returns a list of Floor objects
   * @param error function called on failure, returns an error string
   */
  fetchFloorsFromBuilding: function (building: Building): Promise<Floor[]> {
    return new Promise((resolve, _reject) => {
      RNCSitumPlugin.fetchFloorsFromBuilding(
        building,
        (response) => {
          console.log(response);
          resolve(response);
        },
        (error) => {
          logError(error);
          throw error;
        }
      );
    });
  },

  /**
   * Downloads the map image of a floor
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
  fetchPoiCategoryIconNormal: function (category: any): Promise<PoiIcon> {
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
  fetchPoiCategoryIconSelected: function (category: any): Promise<PoiIcon> {
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
  fetchIndoorPOIsFromBuilding: function (building: any): Promise<Poi[]> {
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
  fetchOutdoorPOIsFromBuilding: function (building: any): Promise<Poi[]> {
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
   * Starts positioning.
   * @param locationRequest Positioning options to configure how positioning will behave.
   */
  requestLocationUpdates: function (
    locationRequest?: LocationRequest
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.positioningIsRunning()) {
        RNCSitumPlugin.startPositioning(locationRequest || {});

        positioningIsRunning = true;

        this.onLocationUpdate((loc: Location) => {
          if (!this.navigationIsRunning()) return;

          const updateNavigation = async () => {
            try {
              await this.updateNavigationWithLocation(loc);
              resolve();
            } catch (e) {
              console.error(`Situm > hook > Error on navigation update ${e}`);
              reject(e);
            }
          };
          updateNavigation();
        });
      } else {
        console.log("3");
        reject();
      }
    });
  },

  /**
   * Stops positioning, removing all location updates
   */
  removeLocationUpdates: function (): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.positioningIsRunning()) {
        RNCSitumPlugin.stopPositioning((response) => {
          console.log(response);
          if (response.success) {
            positioningIsRunning = false;
            resolve();
          } else {
            reject();
          }
        });
      } else {
        reject();
      }
    });
  },

  /**
   * Calculates a route between two points. The result is provided
   * asynchronously using the callback.
   *
   * @param directionParams
   */
  requestDirections: function (
    building: Building,
    from: DirectionPoint,
    to: DirectionPoint,
    directionOptions?: DirectionsOptions
  ): Promise<Directions> {
    return new Promise((resolve, reject) => {
      const params: (Building | DirectionPoint | DirectionsOptions)[] = [
        building,
        from,
        to,
      ];
      if (directionOptions) {
        params.push(directionOptions);
      }

      RNCSitumPlugin.requestDirections(
        params,
        (response) => resolve(response),
        (error) => {
          reject(error);
        }
      );
    });
  },

  positioningIsRunning: function (): boolean {
    return positioningIsRunning;
  },

  navigationIsRunning: function (): boolean {
    return navigationIsRunning;
  },

  /**
   * Set the navigation params, and the listener that receives the updated
   * navigation progress.
   *
   * Can only exist one navigation with one listener at a time. If this method was
   * previously invoked, but removeLocationUpdates() wasn't, removeLocationUpdates() is called internally.
   *
   * @param options
   */
  requestNavigationUpdates: function (
    options?: NavigationRequest
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        RNCSitumPlugin.requestNavigationUpdates(options || {});
        navigationIsRunning = true;
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  },

  /**
   * Informs NavigationManager object the change of the user's location
   *
   * @param location new Location of the user. If null, nothing is done
   * @param success callback to use when the navigation updates
   * @param error callback to use when an error on navigation udpates raises
   */
  updateNavigationWithLocation: function (location): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.navigationIsRunning() === false) {
        reject("No active navigation!!");
        return;
      }

      RNCSitumPlugin.updateNavigationWithLocation(
        location,
        // (response) => resolve(response),
        () => resolve(),
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
  removeNavigationUpdates: function (): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.navigationIsRunning() === true) {
        navigationIsRunning = false;
        RNCSitumPlugin.removeNavigationUpdates(
          (() => {
            resolve();
          }) ||
            ((error) => {
              logError(error);
              reject(error);
            })
        );
      } else {
        reject("Navigation updates were not active.");
      }
    });
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
  onEnterGeofences: function (callback: (event: Geofence) => void) {
    RNCSitumPlugin.onEnterGeofences();
    // Adopts SDK behavior (setter):

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
  onExitGeofences: function (callback: (event: Geofence) => void) {
    RNCSitumPlugin.onExitGeofences();

    SitumPluginEventEmitter.addListener("onExitGeofences", callback);
  },
  onLocationUpdate: function (callback: (location: Location) => void) {
    SitumPluginEventEmitter.addListener("locationChanged", callback);
  },

  onLocationStatus: function (callback: (status: LocationStatus) => void) {
    SitumPluginEventEmitter.addListener("statusChanged", callback);
  },

  onLocationError: function (callback: (status: Error) => void) {
    SitumPluginEventEmitter.addListener("locationError", callback);
  },

  onLocationStopped: function (callback: () => void) {
    SitumPluginEventEmitter.addListener("locationStopped", callback);
  },

  onNavigationProgress: function (
    callback: (progress: NavigationProgress) => void
  ) {
    const myCb = (progress: NavigationProgress) => {
      if (progress.type === SdkNavigationUpdateType.PROGRESS) {
        callback(progress);
      }
    };
    SitumPluginEventEmitter.addListener("navigationUpdated", myCb);
  },

  onNavigationOutOfRoute: function (callback: () => void) {
    const myCb = (progress: NavigationProgress) => {
      if (progress.type === SdkNavigationUpdateType.OUT_OF_ROUTE) {
        callback();
      }
    };
    SitumPluginEventEmitter.addListener("navigationUpdated", myCb);
  },

  onNavigationFinished: function (callback: () => void) {
    const myCb = (progress: NavigationProgress) => {
      if (progress.type === SdkNavigationUpdateType.FINISHED) {
        callback();
      }
    };
    SitumPluginEventEmitter.addListener("navigationUpdated", myCb);
  },

  onNavigationError: function (callback: (error: any) => void) {
    SitumPluginEventEmitter.addListener("navigationError", callback);
  },
};
