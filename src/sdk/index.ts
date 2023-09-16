/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */

import { NativeEventEmitter, NativeModules, Platform } from "react-native";

import packageJson from "../../package.json";
import { logError } from "../utils/logError";
import type { SitumPluginInterface } from "./nativeInterface";
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
import {
  exceptionMiddleware,
  handleCallback,
  onError,
  onSuccess,
} from "./utils";

export type * from "./types";
export * from "./types/constants";

const LINKING_ERROR =
  `The package 'react-native' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: "" }) +
  "- You rebuilt the app after installing the package\n" +
  "- You are not using Expo managed workflow\n";

const RNCSitumPlugin =
  (NativeModules.RNCSitumPlugin as SitumPluginInterface) ||
  (new Proxy(
    {},
    {
      get() {
        throw new Error(LINKING_ERROR);
      },
    }
  ) as SitumPluginInterface);

const SitumPluginEventEmitter = new NativeEventEmitter(RNCSitumPlugin);

export default class SitumPlugin {
  private static positioningRunning = false;
  private static navigationRunning = false;
  private static realtimeSubscriptions = [];

  static positioningIsRunning = function (): boolean {
    return SitumPlugin.positioningRunning;
  };

  static navigationIsRunning = function (): boolean {
    return SitumPlugin.navigationRunning;
  };

  /**
   * Initializes {@link SitumPlugin}.
   *
   * This method must be called before invoking any other methods.
   * This method can be safely called many times as it will only initialise the SDK
   * if it is not already initialised.
   */
  static init = exceptionMiddleware()(() => {
    return new Promise<void>((resolve) => {
      RNCSitumPlugin.initSitumSDK();
      resolve();
    });
  });

  /**
   * Provides your API key to the Situm SDK.
   *
   * This key is generated for your application in the Dashboard.
   * Old credentials will be removed.
   *
   * @param apiKey user's apikey.
   */
  static setApiKey = exceptionMiddleware()((apiKey: string) => {
    return new Promise<void>(() => {
      RNCSitumPlugin.setApiKey("email@email.com", apiKey, (response) => {
        handleCallback(response, "Failed to set API key.");
      });
    });
  });

  /**
   * Provides user's email and password. This credentials will be used to obtain a
   * valid user token to authenticate the server request, when necessary. Token
   * obtaining is not necessary done when this method is executed. Old credentials
   * will be removed.
   *
   * @param email user's email.
   * @param password user's password.
   */
  static setUserPass = exceptionMiddleware()(
    (email: string, password: string) => {
      return new Promise<void>(() => {
        RNCSitumPlugin.setUserPass(email, password, (response) => {
          handleCallback(response, "Failed to set user credentials.");
        });
      });
    }
  );

  /**
   * Sets the API's base URL to retrieve the data.
   *
   * @param url user's email.
   */

  static setDashboardURL = exceptionMiddleware()((url: string) => {
    return new Promise<void>(() => {
      RNCSitumPlugin.setDashboardURL(url, (response: { success: boolean }) => {
        handleCallback(response, "Failed to set dashboard URL.");
      });
    });
  });

  /**
   * Set to true if you want the SDK to download the configuration from the Situm API
   * and use it by default. Right now it only affects the {@link LocationRequest}.
   * Default value is true from SDK version 2.83.5
   *
   * @param useRemoteConfig
   */
  static setUseRemoteConfig = exceptionMiddleware()(
    (useRemoteConfig: boolean) => {
      return new Promise<void>(() => {
        RNCSitumPlugin.setUseRemoteConfig(
          useRemoteConfig ? "true" : "false",
          (response: { success: boolean }) => {
            handleCallback(response, "Failed to set remote config");
          }
        );
      });
    }
  );

  private static _setMaxCacheAge = exceptionMiddleware()((cacheAge: number) => {
    return new Promise<void>(() => {
      RNCSitumPlugin.setCacheMaxAge(
        cacheAge,
        (response: { success: boolean }) => {
          handleCallback(response, "Failed to set cache max age");
        }
      );
    });
  });

  /**
   * Asynchronous helper functions that sets all the configuration options.
   *
   * @param options {@link ConfigurationOptions}
   */
  private static _setConfiguration = async (options: ConfigurationOptions) => {
    if (options.useRemoteConfig !== undefined) {
      await SitumPlugin.setUseRemoteConfig(options.useRemoteConfig).catch(
        (r) => {
          Promise.reject(r);
          return;
        }
      );
    }
    if (options.cacheMaxAge !== undefined) {
      await SitumPlugin._setMaxCacheAge(options.cacheMaxAge).catch((r) => {
        Promise.reject(r);
        return;
      });
    }
    // Handle other configuration options here as needed
    Promise.resolve();
  };

  /**
   * Sets the SDK {@link ConfigurationOptions}.
   *
   * @param options {@link ConfigurationOptions}
   */
  static setConfiguration = exceptionMiddleware()(
    (options: ConfigurationOptions) => {
      return new Promise<void>(() => {
        SitumPlugin._setConfiguration(options);
      });
    }
  );

  /**
   * Invalidate all the resources in the cache
   */
  static invalidateCache = exceptionMiddleware()(() => {
    return new Promise<void>((resolve) => {
      RNCSitumPlugin.invalidateCache();
      resolve();
    });
  });

  /**
   * Gets the list of versions for the current plugin and environment
   *
   */
  static sdkVersion = (): SdkVersion => {
    const versions: { react_native: string; ios?: string; android?: string } = {
      react_native: packageJson.version,
    };

    if (Platform.OS === "ios") {
      versions.ios = packageJson.sdkVersions.ios;
    } else {
      versions.android = packageJson.sdkVersions.android;
    }

    return versions;
  };

  /**
   * Returns the device identifier that has generated the location
   *
   */
  static getDeviceId = exceptionMiddleware()(() => {
    return new Promise<string>(() => {
      RNCSitumPlugin.getDeviceId(onSuccess);
    });
  });

  /**
   * Downloads all the {@link Building}s for the current user.
   */
  static fetchBuildings = exceptionMiddleware()(() => {
    return new Promise<Building[]>(() => {
      RNCSitumPlugin.fetchBuildings(onSuccess, onError);
    });
  });

  /**
   * Downloads all the building data for the selected building. This info includes
   * {@link Floor}, indoor and outdoor {@link Poi}s, events and paths. Also it download floor
   * maps and {@link PoiCategory} icons to local storage.
   *
   * @param building {@link Building}
   */
  static fetchBuildingInfo = exceptionMiddleware()((building: Building) => {
    return new Promise<BuildingInfo>(() => {
      RNCSitumPlugin.fetchBuildingInfo(building, onSuccess, onError);
    });
  });

  /**
   * (Experimental) Downloads the tiled-map of a certain building
   *
   * @param building {@link Building} whose tiles will be downloaded
   *
   * @returns
   */
  static fetchTilesFromBuilding = exceptionMiddleware()(
    (building: Building) => {
      // TODO: return type is string?
      return new Promise<string>(() => {
        RNCSitumPlugin.fetchTilesFromBuilding(building, onSuccess, onError);
      });
    }
  );

  /**
   * Downloads all the floors of a building
   *
   * @param building {@link Building}
   */
  static fetchFloorsFromBuilding = exceptionMiddleware()(
    (building: Building) => {
      return new Promise<Floor[]>(() => {
        RNCSitumPlugin.fetchFloorsFromBuilding(building, onSuccess, onError);
      });
    }
  );

  /**
   * Downloads the map image of a {@link Floor}
   *
   * @param floor {@link Floor}
   */
  static fetchMapFromFloor = exceptionMiddleware()((floor: Floor) => {
    // TODO: return type is string?
    return new Promise<string>(() => {
      RNCSitumPlugin.fetchMapFromFloor(floor, onSuccess, onError);
    });
  });

  /**
   * Get the geofences of a {@link Building}
   *
   * @param building {@link Building}
   */
  static fetchGeofencesFromBuilding = exceptionMiddleware()(
    (building: Building) => {
      return new Promise<Geofence[]>(() => {
        RNCSitumPlugin.fetchGeofencesFromBuilding(building, onSuccess, onError);
      });
    }
  );

  /**
   * Get all {@link PoiCategory}, download and cache their icons asynchronously.
   */
  static fetchPoiCategories = exceptionMiddleware()(() => {
    return new Promise<PoiCategory[]>(() => {
      RNCSitumPlugin.fetchPoiCategories(onSuccess, onError);
    });
  });

  /**
   * Get the normal {@link PoiIcon} for a category
   *
   * @param category {@link PoiCategory}. Not null.
   */
  static fetchPoiCategoryIconNormal = exceptionMiddleware()(
    (category: PoiCategory) => {
      return new Promise<PoiIcon>(() => {
        RNCSitumPlugin.fetchPoiCategoryIconNormal(category, onSuccess, onError);
      });
    }
  );

  /**
   * Get the selected {@link PoiIcon} for a {@link PoiCategory}
   *
   * @param category {@link PoiCategory}. Not null.
   */
  static fetchPoiCategoryIconSelected = exceptionMiddleware()(
    (category: PoiCategory) => {
      return new Promise<PoiIcon>(() => {
        RNCSitumPlugin.fetchPoiCategoryIconSelected(
          category,
          onSuccess,
          onError
        );
      });
    }
  );

  /**
   * Download the indoor {@link Poi}s of a {@link Building}
   *
   * @param building {@link Building}
   */
  static fetchIndoorPOIsFromBuilding = exceptionMiddleware()(
    (building: Building) => {
      return new Promise<Poi[]>(() => {
        RNCSitumPlugin.fetchIndoorPOIsFromBuilding(
          building,
          onSuccess,
          onError
        );
      });
    }
  );

  /**
   * Download the outdoor {@link Poi}s of a {@link Building}
   *
   * @param building {@link Building}
   */
  static fetchOutdoorPOIsFromBuilding = exceptionMiddleware()(
    (building: Building) => {
      return new Promise<Poi[]>(() => {
        RNCSitumPlugin.fetchOutdoorPOIsFromBuilding(
          building,
          onSuccess,
          onError
        );
      });
    }
  );

  /**
   * Starts positioning.
   *
   * @param locationRequest Positioning options to configure how positioning will behave
   */
  static requestLocationUpdates = exceptionMiddleware()(
    (locationRequest?: LocationRequest) => {
      return new Promise<void>((resolve, reject) => {
        if (!SitumPlugin.positioningIsRunning()) {
          RNCSitumPlugin.startPositioning(locationRequest || {});

          SitumPlugin.positioningRunning = true;

          SitumPlugin.onLocationUpdate(async (loc: Location) => {
            if (!SitumPlugin.navigationIsRunning()) return;

            SitumPlugin.updateNavigationWithLocation(loc)
              .then(resolve)
              .catch((e) => {
                console.error(`Situm > hook > Error on navigation update ${e}`);
                reject(e);
              });
          });
        } else {
          reject();
        }
      });
    }
  );

  /**
   * Stops positioning, removing all location updates
   */
  static removeLocationUpdates = exceptionMiddleware()(() => {
    return new Promise<void>((resolve, reject) => {
      if (SitumPlugin.positioningIsRunning()) {
        RNCSitumPlugin.stopPositioning((response) => {
          if (response.success) {
            SitumPlugin.positioningRunning = false;
            resolve();
          } else {
            reject();
          }
        });
      } else {
        // TODO: should add error
        reject();
      }
    });
  });

  /**
   * Calculates a route between two points. The result is provided
   * asynchronously using the callback.
   *
   * @param building {@link Building}
   * @param from {@link DirectionPoint} route origin
   * @param to {@link DirectionPoint} route destination
   * @param directionOptions {@link DirectionsOptions}
   */
  static requestDirections = exceptionMiddleware()(
    (
      building: Building,
      from: DirectionPoint,
      to: DirectionPoint,
      directionOptions?: DirectionsOptions
    ) => {
      return new Promise<Directions>(() => {
        const params = [
          building,
          from,
          to,
          // TODO: check if directionOptions undefined array should have 3 elements
          directionOptions,
        ];

        RNCSitumPlugin.requestDirections(params, onSuccess, onError);
      });
    }
  );

  /**
   * Set the navigation params, and the listener that receives the updated
   * navigation progress.
   *
   * Can only exist one navigation with one listener at a time. If this method was
   * previously invoked, but removeLocationUpdates() wasn't, removeLocationUpdates() is called internally.
   *
   * @param options {@link NavigationRequest}
   */
  static requestNavigationUpdates = exceptionMiddleware()(
    (options?: NavigationRequest) => {
      return new Promise<void>((resolve) => {
        RNCSitumPlugin.requestNavigationUpdates(options || {});
        SitumPlugin.navigationRunning = true;
        resolve();
      });
    }
  );

  /**
   * Informs NavigationManager object the change of the user's location
   *
   * @param location new {@link Location} of the user. If null, nothing is done
   */
  static updateNavigationWithLocation = exceptionMiddleware()(
    (location: Location) => {
      return new Promise<void>((resolve, reject) => {
        if (SitumPlugin.navigationIsRunning() === false) {
          // TODO: should be of error type?
          reject("No active navigation!!");
          return;
        }

        RNCSitumPlugin.updateNavigationWithLocation(
          location,
          // TODO: review maybe this causes oor fails
          // (response) => resolve(response),
          () => resolve(),
          onError
        );
      });
    }
  );

  /**
   * Removes all location updates. This removes the internal state of the manager,
   * including the listener provided in requestNavigationUpdates(NavigationRequest,
   * NavigationListener), so it won't receive more progress updates.
   *
   */
  static removeNavigationUpdates = exceptionMiddleware()(() => {
    return new Promise<void>((_, reject) => {
      if (SitumPlugin.navigationIsRunning() === true) {
        SitumPlugin.navigationRunning = false;
        RNCSitumPlugin.removeNavigationUpdates((reponse) => {
          handleCallback(reponse, "Failed to remove navigation updates");
        });
      } else {
        // TODO: should probably be error
        reject("Navigation updates were not active.");
      }
    });
  });

  /**
   * Requests a real time devices positions
   *
   * @param realtimeUpdates callback to use when new device positions are updated
   * @param error callback to use when an error on navigation udpates raises
   * @param options Represents the configuration for getting realtime devices positions in
   */

  static requestRealTimeUpdates = exceptionMiddleware()(
    (
      realtimeUpdates: (event: any) => void,
      error?: (event: any) => void,
      options?: any
    ) => {
      return new Promise<void>((resolve) => {
        RNCSitumPlugin.requestRealTimeUpdates(options || {});
        SitumPlugin.realtimeSubscriptions.push([
          SitumPluginEventEmitter.addListener(
            "realtimeUpdated",
            realtimeUpdates
          ),
          error
            ? SitumPluginEventEmitter.addListener(
                "realtimeError",
                error || logError
              )
            : null,
        ]);
        resolve();
      });
    }
  );

  /**
   * Removes all real time updates listners.
   *
   * @param _callback
   */
  static removeRealTimeUpdates = exceptionMiddleware()(
    (_callback?: Function) => {
      return new Promise<void>((resolve) => {
        SitumPlugin.realtimeSubscriptions = [];
        RNCSitumPlugin.removeRealTimeUpdates();
        resolve();
      });
    }
  );

  /**
   * Checks if a point is inside a {@link Geofence}
   *
   */
  static checkIfPointInsideGeofence = (
    request: any,
    callback?: (response: { isInsideGeofence: boolean; geofence: any }) => void
  ) => {
    RNCSitumPlugin.checkIfPointInsideGeofence(request, callback);
  };

  /**
   * Callback that notifies when the user enters a {@link Geofence}.
   *
   * In order to use correctly these callbacks you must know the following:
   *  - Positioning geofences (with trainer_metadata custom field) won't be notified.
   *  - These callbacks only work with indoor locations. Any outdoor location will
   *    produce a call to onExitedGeofences with the last positioned geofences as argument.
   *
   * @param callback the function called when the user enters a {@link Geofence}
   */
  static onEnterGeofences = (callback: (event: Geofence) => void) => {
    RNCSitumPlugin.onEnterGeofences();
    // Adopts SDK behavior (setter):
    SitumPluginEventEmitter.addListener("onEnterGeofences", callback);
  };

  /**
   * Callback that notifies when the user exits a {@link Geofence}.
   *
   * In order to use correctly these callbacks you must know the following:
   *  - Positioning geofences (with trainer_metadata custom field) won't be notified.
   *  - These callbacks only work with indoor locations. Any outdoor location will
   *    produce a call to onExitedGeofences with the last positioned geofences as argument.
   *
   * @param callback the function called when the user exits a {@link Geofence}
   */
  static onExitGeofences = (callback: (event: Geofence) => void) => {
    RNCSitumPlugin.onExitGeofences();
    SitumPluginEventEmitter.addListener("onExitGeofences", callback);
  };

  /**
   * Callback that notifies when the user {@link Location} changes.
   *
   * @param callback the function called when the user {@link Location} changes
   */
  static onLocationUpdate = (callback: (location: Location) => void) => {
    SitumPluginEventEmitter.addListener("locationChanged", callback);
  };

  /**
   * Callback that notifies when the user {@link LocationStatus} changes.
   *
   * @param callback the function called when the user {@link LocationStatus} changes
   */
  static onLocationStatus = (callback: (status: LocationStatus) => void) => {
    SitumPluginEventEmitter.addListener("statusChanged", callback);
  };

  /**
   * Callback that notifies when there is an error while the user is positioining.
   *
   * @param callback the function called when there is an error
   */
  static onLocationError = (callback: (status: Error) => void) => {
    SitumPluginEventEmitter.addListener("locationError", callback);
  };

  /**
   * Callback that notifies when the user stops positioning.
   *
   * @param callback the function called when the user stops positioning.
   */
  static onLocationStopped = (callback: () => void) => {
    SitumPluginEventEmitter.addListener("locationStopped", callback);
  };

  /**
   * Callback that notifies every navigation progress.
   *
   * @param callback the function called when there is a navigation progress.
   */
  static onNavigationProgress = (
    callback: (progress: NavigationProgress) => void
  ) => {
    SitumPluginEventEmitter.addListener(
      "navigationUpdated",
      (progress: NavigationProgress) => {
        if (progress.type === SdkNavigationUpdateType.PROGRESS) {
          callback(progress);
        }
      }
    );
  };

  /**
   * Callback that notifies when the user gets out of the current route
   *
   * @param callback the function called when the user gets out of the current route.
   */
  static onNavigationOutOfRoute = (callback: () => void) => {
    SitumPluginEventEmitter.addListener(
      "navigationUpdated",
      (progress: NavigationProgress) => {
        if (progress.type === SdkNavigationUpdateType.OUT_OF_ROUTE) {
          // TODO: maybe this causes the navigation to not work on oor?
          callback();
        }
      }
    );
  };

  /**
   * Callback that notifies when the user finishes the route.
   *
   * @param callback the function called when the user finishes the route.
   */
  static onNavigationFinished = (callback: () => void) => {
    SitumPluginEventEmitter.addListener(
      "navigationUpdated",
      (progress: NavigationProgress) => {
        if (progress.type === SdkNavigationUpdateType.FINISHED) {
          callback();
        }
      }
    );
  };

  /**
   * Callback that notifies when there is an error during navigation.
   *
   * @param callback the function called when there is an error during navigation.
   */
  static onNavigationError = (callback: (error: any) => void) => {
    SitumPluginEventEmitter.addListener("navigationError", callback);
  };
}
