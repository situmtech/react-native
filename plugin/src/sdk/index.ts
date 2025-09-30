/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */

import { NativeEventEmitter, NativeModules, Platform } from "react-native";

import { logError } from "../utils/logError";
import { DelegatedStateManager } from "./internaDelegatedState";
import type { SitumPluginInterface } from "./nativeInterface";
import {
  type Building,
  type BuildingInfo,
  type ConfigurationOptions,
  type Directions,
  type DirectionsOptions,
  type Error,
  ErrorCode,
  ErrorType,
  type Floor,
  type Geofence,
  InternalCall,
  type Location,
  type LocationRequest,
  type LocationStatus,
  type NavigationProgress,
  type NavigationRequest,
  type Poi,
  type PoiCategory,
  type PoiIcon,
  type Point,
  type Route,
  type SdkVersion,
  TextToSpeechMessage,
  type UserHelperOptions,
} from "./types";
import { InternalCallType, SdkNavigationUpdateType } from "./types/constants";
import {
  exceptionWrapper,
  locationErrorAdapter,
  locationStatusAdapter,
  promiseWrapper,
} from "./utils";

export * from "./types";
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
    },
  ) as SitumPluginInterface);

const SitumPluginEventEmitter = new NativeEventEmitter(RNCSitumPlugin);

// TODO: these do not act as state, not reliable
let positioningRunning = false;
let navigationRunning = false;
let realtimeSubscriptions = [];

// Internal method call (MapView) delegate:
let internalMethodCallMapDelegate = (_: InternalCall) => {
  // internalMethodCallMapDelegate is an empty function by default.
};

// TODO: For now, I am keeping this behavior as it was, but it seems like a candidate for refactoring.
const locationCallbackForNavigation = (loc: Location) => {
  if (!SitumPlugin.navigationIsRunning()) return;
  SitumPlugin.updateNavigationWithLocation(loc);
};

// Client callbacks:
/* eslint-disable @typescript-eslint/no-empty-function */

let locationCallback = (_: Location) => {};
let locationStatusCallback = (_: LocationStatus) => {};
let locationStoppedCallback = () => {};
let locationErrorCallback = (_: Error) => {};
let navigationStartedCallback = (_: Route) => {};
let navigationProgressCallback = (_: NavigationProgress) => {};
let navigationDestinationReachedCallback = (_: Route) => {};
let navigationOutOfRouteCallback = () => {};
let navigationFinishedCallback = () => {}; // Deprecated!
let navigationCancellationCallback = () => {};
let navigationErrorCallback = (_: any) => {};
let enterGeofencesCallback = (_: any) => {};
let exitGeofencesCallback = (_: any) => {};

/* eslint-enable @typescript-eslint/no-empty-function */

// Internal callbacks:
// These callback functions will be added as listeners to SitumPluginEventEmitter as soon as possible and will be
// listening events for all the plugin lifecycle. They will forward calls to both client callbacks and the MapView
// internal callback.

const _internalLocationCallback = (loc: Location) => {
  DelegatedStateManager.getInstance().updateLocation(loc);
  // MapView internal callback:
  internalMethodCallMapDelegate(
    new InternalCall(InternalCallType.LOCATION, loc),
  );
  // Navigation internal callback: TODO review this, seems to be different to other plugins and candidate for refactoring.
  locationCallbackForNavigation(loc);
  // Client callback:
  locationCallback(loc);
};

const _internalLocationStatusCallback = (status: LocationStatus) => {
  const mapViewStatusName = locationStatusAdapter(status.statusName);
  DelegatedStateManager.getInstance().updateStatus(mapViewStatusName);
  internalMethodCallMapDelegate(
    new InternalCall(InternalCallType.LOCATION_STATUS, mapViewStatusName),
  );
  // TODO: we are delegating different values to the internal and client callbacks. The viewer only understands
  // the states defined in LocationStatusName, but the integrator might be interested in any state from the SDK.
  locationStatusCallback?.(status);
};

const _internalLocationStoppedCallback = () => {
  internalMethodCallMapDelegate(
    new InternalCall(InternalCallType.LOCATION_STOPPED, undefined),
  );
  // TODO: this callback is used only in RN, delete!
  locationStoppedCallback?.();
};

const _internalLocationErrorCallback = (error: Error) => {
  const adaptedError = locationErrorAdapter(error);
  DelegatedStateManager.getInstance().updateError(adaptedError);
  internalMethodCallMapDelegate(
    new InternalCall(InternalCallType.LOCATION_ERROR, adaptedError),
  );
  locationErrorCallback?.(adaptedError);
};

const _internalNavigationStartedCallback = (route: Route) => {
  internalMethodCallMapDelegate(
    new InternalCall(InternalCallType.NAVIGATION_START, route),
  );
  navigationStartedCallback?.(route);
};

const _internalNavigationProgressCallback = (progress: NavigationProgress) => {
  internalMethodCallMapDelegate(
    new InternalCall(InternalCallType.NAVIGATION_PROGRESS, progress),
  );
  navigationProgressCallback?.(progress);
};

const _internalNavigationDestinationReachedCallback = (route: Route) => {
  internalMethodCallMapDelegate(
    new InternalCall(InternalCallType.NAVIGATION_DESTINATION_REACHED, route),
  );
  navigationDestinationReachedCallback?.(route);
};

const _internalNavigationOutOfRouteCallback = () => {
  internalMethodCallMapDelegate(
    new InternalCall(InternalCallType.NAVIGATION_OUT_OF_ROUTE, undefined),
  );
  navigationOutOfRouteCallback?.();
};

const _internalNavigationFinishedCallback = () => {
  // Deprecated!
  internalMethodCallMapDelegate(
    new InternalCall(InternalCallType.NAVIGATION_CANCELLATION, undefined),
  );
  navigationFinishedCallback?.();
};

const _internalNavigationCancellationCallback = () => {
  internalMethodCallMapDelegate(
    new InternalCall(InternalCallType.NAVIGATION_CANCELLATION, undefined),
  );
  navigationCancellationCallback?.();
};

const _internalNavigationErrorCallback = (error: any) => {
  internalMethodCallMapDelegate(
    new InternalCall(InternalCallType.NAVIGATION_ERROR, error),
  );
  navigationErrorCallback?.(error);
};

const _internalEnterGeofencesCallback = (data: any) => {
  internalMethodCallMapDelegate(
    new InternalCall(InternalCallType.GEOFENCES_ENTER, data),
  );
  enterGeofencesCallback?.(data);
};

const _internalExitGeofencesCallback = (data: any) => {
  internalMethodCallMapDelegate(
    new InternalCall(InternalCallType.GEOFENCES_EXIT, data),
  );
  exitGeofencesCallback?.(data);
};

const _registerCallbacks = () => {
  const callbacksMap = {
    locationChanged: _internalLocationCallback,
    statusChanged: _internalLocationStatusCallback,
    locationStopped: _internalLocationStoppedCallback,
    locationError: _internalLocationErrorCallback,
    [SdkNavigationUpdateType.START]: _internalNavigationStartedCallback,
    [SdkNavigationUpdateType.PROGRESS]: _internalNavigationProgressCallback,
    [SdkNavigationUpdateType.DESTINATION_REACHED]:
      _internalNavigationDestinationReachedCallback,
    [SdkNavigationUpdateType.OUTSIDE_ROUTE]:
      _internalNavigationOutOfRouteCallback,
    [SdkNavigationUpdateType.FINISHED]: _internalNavigationFinishedCallback,
    [SdkNavigationUpdateType.CANCELLATION]:
      _internalNavigationCancellationCallback,
    [SdkNavigationUpdateType.ERROR]: _internalNavigationErrorCallback,
    onEnterGeofences: _internalEnterGeofencesCallback,
    onExitGeofences: _internalExitGeofencesCallback,
  };

  Object.entries(callbacksMap).forEach(([eventName, callback]) => {
    console.log("Event emitter add listener: ", eventName);
    SitumPluginEventEmitter.removeAllListeners(eventName);
    SitumPluginEventEmitter.addListener(eventName, callback);
    console.log("Event emitter add listener finished: ", eventName);
  });
};

// End Internal callbacks --

export default class SitumPlugin {
  /**
   * Whether the positioning is currently in execution.
   * @returns boolean
   */
  static positioningIsRunning: () => boolean = () => positioningRunning;

  /**
   * Whether the navigation is currently in execution.
   * @returns boolean
   */
  static navigationIsRunning: () => boolean = () => navigationRunning;

  /**
   * Initializes {@link SitumPlugin}.
   *
   * This method must be called before invoking any other methods.
   * This method can be safely called many times as it will only initialise the SDK
   * if it is not already initialised.
   *
   * @returns void
   * @throws Exception
   */
  static init = () => {
    _registerCallbacks();
    return exceptionWrapper<void>(() => {
      RNCSitumPlugin.initSitumSDK();
    });
  };

  /**
   * Provides your API key to the Situm SDK.
   *
   * This key is generated for your application in the Dashboard.
   * Old credentials will be removed.
   *
   * @param apiKey user's apikey.
   *
   * @returns void
   * @throws Exception
   */
  static setApiKey = (apiKey: string) => {
    return exceptionWrapper<void>(({ onCallback }) => {
      RNCSitumPlugin.setApiKey("email@email.com", apiKey, (response) => {
        onCallback(response, "Failed to set API key.");
      });
    });
  };

  /**
   * Provides user's email and password. This credentials will be used to obtain a
   * valid user token to authenticate the server request, when necessary. Token
   * obtaining is not necessary done when this method is executed. Old credentials
   * will be removed.
   *
   * @param email user's email.
   * @param password user's password.
   *
   * @returns void
   * @throws Exception
   */
  static setUserPass = (email: string, password: string) => {
    return exceptionWrapper<void>(({ onCallback }) => {
      RNCSitumPlugin.setUserPass(email, password, (response) => {
        onCallback(response, "Failed to set user credentials.");
      });
    });
  };

  /**
   * Sets the API's base URL to retrieve the data.
   *
   * @param url user's email.
   *
   * @returns void
   * @throws Exception
   */

  static setDashboardURL = (url: string) => {
    return exceptionWrapper<void>(({ onCallback }) => {
      RNCSitumPlugin.setDashboardURL(url, (response: { success: boolean }) => {
        onCallback(response, "Failed to set dashboard URL.");
      });
    });
  };

  /**
   * Set to true if you want the SDK to download the configuration from the Situm API
   * and use it by default. Right now it only affects the {@link LocationRequest}.
   * Default value is true from SDK version 2.83.5
   *
   * @param useRemoteConfig
   *
   * @returns void
   * @throws Exception
   */
  static setUseRemoteConfig = (useRemoteConfig: boolean) => {
    return exceptionWrapper<void>(({ onCallback }) => {
      RNCSitumPlugin.setUseRemoteConfig(
        useRemoteConfig ? "true" : "false",
        (response) => {
          onCallback(response, "Failed to set remote config");
        },
      );
    });
  };

  /**
   * Sets the max seconds the cache is valid
   *
   * @returns void
   * @throws Exception
   */
  private static setMaxCacheAge = (cacheAge: number) => {
    return exceptionWrapper<void>(({ onCallback }) => {
      RNCSitumPlugin.setCacheMaxAge(cacheAge, (response) => {
        onCallback(response, "Failed to set cache max age");
      });
    });
  };

  /**
   * Sets the SDK {@link ConfigurationOptions}.
   *
   * @param options {@link ConfigurationOptions}
   *
   * @returns void
   * @throws Exception
   */
  static setConfiguration = (options: ConfigurationOptions) => {
    return exceptionWrapper<void>(() => {
      if (options.useRemoteConfig !== undefined) {
        SitumPlugin.setUseRemoteConfig(options.useRemoteConfig);
      }
      if (options.cacheMaxAge !== undefined) {
        SitumPlugin.setMaxCacheAge(options.cacheMaxAge);
      }

      // Handle rest of configuration options
    });
  };

  /**
   * Invalidate all the resources in the cache
   *
   * @returns void
   * @throws Exception
   */
  static invalidateCache = () => {
    return exceptionWrapper<void>(() => {
      RNCSitumPlugin.invalidateCache();
    });
  };

  /**
   * @deprecated
   * DEPRECATED: this method will not work anymore.
   *
   * Gets the list of versions for the current plugin and environment
   *
   * @returns void
   * @throws Exception
   */
  static sdkVersion = () => {
    return exceptionWrapper<SdkVersion>(({ onSuccess }) => {
      const versions: { react_native: string; ios?: string; android?: string } =
        {
          react_native: "",
          ios: "",
          android: "",
        };
      onSuccess(versions);
    });
  };

  /**
   * Returns the device identifier that has generated the location
   */
  static getDeviceId = () => {
    return promiseWrapper<string>(({ onSuccess, onError }) => {
      RNCSitumPlugin.getDeviceId((response) => {
        //@ts-ignore
        if (response?.deviceId) {
          // Resolve with the actual deviceId
          //@ts-ignore
          onSuccess(response.deviceId);
        } else {
          // Reject if deviceId is not available in the response
          onError({
            code: ErrorCode.UNKNOWN,
            message: "Couldn't get device ID",
            type: ErrorType.CRITICAL,
          });
        }
      });
    });
  };

  /**
   * Downloads all the {@link Building}s for the current user.
   */
  static fetchBuildings = () => {
    return promiseWrapper<Building[]>(({ onSuccess, onError }) => {
      RNCSitumPlugin.fetchBuildings(onSuccess, onError);
    });
  };

  /**
   * Downloads all the building data for the selected building. This info includes
   * {@link Floor}, indoor and outdoor {@link Poi}s, events and paths. Also it download floor
   * maps and {@link PoiCategory} icons to local storage.
   *
   * @param building {@link Building}
   */
  static fetchBuildingInfo = (building: Building) => {
    return promiseWrapper<BuildingInfo>(({ onSuccess, onError }) => {
      RNCSitumPlugin.fetchBuildingInfo(building, onSuccess, onError);
    });
  };

  /**
   * (Experimental) Downloads the tiled-map of a certain building
   *
   * @param building {@link Building} whose tiles will be downloaded
   */
  static fetchTilesFromBuilding = (building: Building) => {
    return promiseWrapper<any>(({ onSuccess, onError }) => {
      RNCSitumPlugin.fetchTilesFromBuilding(building, onSuccess, onError);
    });
  };

  /**
   * Downloads all the floors of a building
   *
   * @param building {@link Building}
   */
  static fetchFloorsFromBuilding = (building: Building) => {
    return promiseWrapper<Floor[]>(({ onSuccess, onError }) => {
      RNCSitumPlugin.fetchFloorsFromBuilding(building, onSuccess, onError);
    });
  };

  /**
   * Downloads the map image of a {@link Floor}
   *
   * @param floor {@link Floor}
   */
  static fetchMapFromFloor = (floor: Floor) => {
    return promiseWrapper<string>(({ onSuccess, onError }) => {
      RNCSitumPlugin.fetchMapFromFloor(floor, onSuccess, onError);
    });
  };

  /**
   * Get the geofences of a {@link Building}
   *
   * @param building {@link Building}
   */
  static fetchGeofencesFromBuilding = (building: Building) => {
    return promiseWrapper<Geofence[]>(({ onSuccess, onError }) => {
      RNCSitumPlugin.fetchGeofencesFromBuilding(building, onSuccess, onError);
    });
  };

  /**
   * Get all {@link PoiCategory}, download and cache their icons asynchronously.
   */
  static fetchPoiCategories = () => {
    return promiseWrapper<PoiCategory[]>(({ onSuccess, onError }) => {
      RNCSitumPlugin.fetchPoiCategories(onSuccess, onError);
    });
  };

  /**
   * Get the normal {@link PoiIcon} for a category
   *
   * @param category {@link PoiCategory}. Not null.
   */
  static fetchPoiCategoryIconNormal = (category: PoiCategory) => {
    return promiseWrapper<PoiIcon>(({ onSuccess, onError }) => {
      RNCSitumPlugin.fetchPoiCategoryIconNormal(category, onSuccess, onError);
    });
  };

  /**
   * Get the selected {@link PoiIcon} for a {@link PoiCategory}
   *
   * @param category {@link PoiCategory}. Not null.
   */
  static fetchPoiCategoryIconSelected = (category: PoiCategory) => {
    return promiseWrapper<PoiIcon>(({ onSuccess, onError }) => {
      RNCSitumPlugin.fetchPoiCategoryIconSelected(category, onSuccess, onError);
    });
  };

  /**
   * Download the indoor {@link Poi}s of a {@link Building}
   *
   * @param building {@link Building}
   */
  static fetchIndoorPOIsFromBuilding = (building: Building) => {
    return promiseWrapper<Poi[]>(({ onSuccess, onError }) => {
      RNCSitumPlugin.fetchIndoorPOIsFromBuilding(building, onSuccess, onError);
    });
  };

  /**
   * Download the outdoor {@link Poi}s of a {@link Building}
   *
   * @param building {@link Building}
   */
  static fetchOutdoorPOIsFromBuilding = (building: Building) => {
    return promiseWrapper<Poi[]>(({ onSuccess, onError }) => {
      RNCSitumPlugin.fetchOutdoorPOIsFromBuilding(building, onSuccess, onError);
    });
  };

  /**
   * Starts positioning.
   *
   * @param {LocationRequest} locationRequest Positioning options to configure how positioning will behave
   */
  static requestLocationUpdates = (locationRequest?: LocationRequest) => {
    return exceptionWrapper<void>(() => {
      if (SitumPlugin.positioningIsRunning()) return;

      RNCSitumPlugin.startPositioning(locationRequest || {});

      positioningRunning = true;
    });
  };

  /**
   * Stops positioning, removing all location updates
   */
  static removeLocationUpdates = () => {
    return exceptionWrapper<void>(() => {
      if (!SitumPlugin.positioningIsRunning()) return;

      RNCSitumPlugin.stopPositioning((response) => {
        if (response.success) {
          positioningRunning = false;
        } else {
          throw "Situm > hook > Could not stop positioning";
        }
      });
    });
  };

  /**
   * Calculates a route between two points. The result is provided
   * asynchronously using the callback.
   *
   * @param building {@link Building}
   * @param from {@link Point} route origin
   * @param to {@link Point} route destination
   * @param directionOptions {@link DirectionsOptions}
   */
  static requestDirections = (
    building: Building,
    from: Point | Location,
    to: Point | Poi,
    directionOptions?: DirectionsOptions,
  ) => {
    return promiseWrapper<Directions>(({ onSuccess, onError }) => {
      const params = [building, from, to, directionOptions || {}];
      RNCSitumPlugin.requestDirections(params, onSuccess, onError);
    });
  };

  /**
   * Set the navigation params, and the listener that receives the updated
   * navigation progress.
   *
   * Can only exist one navigation with one listener at a time. If this method was
   * previously invoked, but removeLocationUpdates() wasn't, removeLocationUpdates()
   * is called internally.
   *
   * @param options {@link NavigationRequest}
   */
  static requestNavigationUpdates = (options?: NavigationRequest) => {
    return exceptionWrapper<void>(() => {
      RNCSitumPlugin.requestNavigationUpdates(options || {});
      navigationRunning = true;
    });
  };

  /**
   * Informs NavigationManager object the change of the user's location
   *
   * @param location new {@link Location} of the user. If null, nothing is done
   */
  static updateNavigationWithLocation = (location: Location) => {
    return exceptionWrapper<void>(({ onSuccess, onError }) => {
      if (!SitumPlugin.navigationIsRunning()) {
        throw "Situm > hook > No active navigation";
      }

      RNCSitumPlugin.updateNavigationWithLocation(location, onSuccess, onError);
    });
  };

  /**
   * Removes all location updates. This removes the internal state of the manager,
   * including the listener provided in requestNavigationUpdates(NavigationRequest,
   * NavigationListener), so it won't receive more progress updates.
   *
   */
  static removeNavigationUpdates = () => {
    return promiseWrapper<void>(({ onCallback }) => {
      if (!SitumPlugin.navigationIsRunning()) return;

      navigationRunning = false;
      RNCSitumPlugin.removeNavigationUpdates((response) => {
        onCallback(response, "Failed to remove navigation updates");
      });
    });
  };

  /**
   * Requests a real time devices positions
   *
   * @param realtimeUpdates callback to use when new device positions are updated
   * @param error callback to use when an error on navigation udpates raises
   * @param options Represents the configuration for getting realtime devices positions in
   */

  static requestRealTimeUpdates = (
    realtimeUpdates: (event: any) => void,
    error?: (event: any) => void,
    options?: any,
  ) => {
    return exceptionWrapper<void>(() => {
      RNCSitumPlugin.requestRealTimeUpdates(options || {});
      realtimeSubscriptions.push([
        SitumPluginEventEmitter.addListener("realtimeUpdated", realtimeUpdates),
        error
          ? SitumPluginEventEmitter.addListener(
              "realtimeError",
              error || logError,
            )
          : null,
      ]);
    });
  };

  /**
   * Removes all real time updates listners.
   *
   * @param _callback
   */
  static removeRealTimeUpdates = (_callback?: Function) => {
    return exceptionWrapper<void>(() => {
      realtimeSubscriptions = [];
      RNCSitumPlugin.removeRealTimeUpdates();
    });
  };

  /**
   * Checks if a point is inside a {@link Geofence}
   *
   */
  static checkIfPointInsideGeofence = (
    request: any,
    callback?: (response: { isInsideGeofence: boolean; geofence: any }) => void,
  ) => {
    const noop = () => {}; // eslint-disable-line @typescript-eslint/no-empty-function
    RNCSitumPlugin.checkIfPointInsideGeofence(request, callback || noop);
  };

  /**
   * Automatically assists users in resolving app-related permission and sensor issues.
   *
   * This method tells the native SDKs to present a user interface that explains detected
   * configuration issues and guides users through the required steps to resolve them,
   * following best practices for runtime permission requests.
   *
   * Issues addressed include:
   * - Missing permissions for Location or Bluetooth.
   * - Disabled Location or Bluetooth sensors.
   *
   * Use the <code>userHelperOptions</code> parameter to configure the available options.
   * Call {@link enableUserHelper} as a shortcut to enable the user helper with default configuration.
   * Call {@link disableUserHelper} as a shortcut to disable the user helper.
   *
   * @param {UserHelperOptions} userHelperOptions - Options for the user helper.
   */
  static configureUserHelper = (userHelperOptions: UserHelperOptions) => {
    _registerCallbacks();
    return exceptionWrapper<void>(({ onSuccess, onError }) => {
      RNCSitumPlugin.configureUserHelper(userHelperOptions, onSuccess, onError);
    });
  };

  /**
   * Enables the user helper.
   *
   * Shortcut for {@link configureUserHelper} with <code>{enabled: true}</code>.
   */
  static enableUserHelper = () => {
    SitumPlugin.configureUserHelper({ enabled: true, colorScheme: undefined });
  };

  /**
   * Disables the user helper.
   *
   * Shortcut for {@link configureUserHelper} with <code>{enabled: false}</code>.
   *
   */
  static disableUserHelper = () => {
    SitumPlugin.configureUserHelper({ enabled: false, colorScheme: undefined });
  };

  /**
   * INTERNAL METHOD.
   *
   * Update SDK with the viewer navigation states.
   * Do not use this method as it is intended for internal use
   * by the map viewer module.
   *
   * @param externalNavigation
   */
  static updateNavigationState = (externalNavigation: Map<string, any>) => {
    return exceptionWrapper<void>(() => {
      RNCSitumPlugin.updateNavigationState(externalNavigation);
    });
  };

  /**
   * INTERNAL METHOD.
   *
   * Validate if the mapView internal settings have been properly configured
   * Do not use this method as it is intended for internal use
   * by the map viewer module.
   *
   * @param validateMapViewProjectSettings
   */
  static validateMapViewProjectSettings = () => {
    if (Platform.OS === "ios") {
      return exceptionWrapper<void>(() => {
        RNCSitumPlugin.validateMapViewProjectSettings();
      });
    }
  };

  /**
   * INTERNAL METHOD.
   *
   * Set a native MethodCall delegate. Do not use this method as it is intended for internal use by the map viewer module.
   * @param callback
   */
  static internalSetMethodCallMapDelegate = (
    callback: (internalCall: InternalCall) => void,
  ) => {
    internalMethodCallMapDelegate = callback;
    const lastValues = DelegatedStateManager.getInstance().getValues();
    // Forward last received values as soon as possible:
    if (lastValues.location) {
      internalMethodCallMapDelegate(
        new InternalCall(InternalCallType.LOCATION, lastValues.location),
      );
    }
    if (lastValues.status) {
      internalMethodCallMapDelegate(
        new InternalCall(InternalCallType.LOCATION_STATUS, lastValues.status),
      );
    }
    if (lastValues.error) {
      internalMethodCallMapDelegate(
        new InternalCall(InternalCallType.LOCATION_ERROR, lastValues.error),
      );
    }
  };

  /**
   * INTERNAL METHOD.
   *
   * Internal method that handles the required logic to speak aloud MapView messages.
   *
   * @param message
   */
  static speakAloudText = (message: TextToSpeechMessage) => {
    return exceptionWrapper<void>(() => {
      RNCSitumPlugin.speakAloudText(message);
    });
  };

  //-----------------------------------------------------------------------------//
  //-----------------------------GEOFENCES CALLBACKS-----------------------------//
  //-----------------------------------------------------------------------------//

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
    enterGeofencesCallback = callback;
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
    exitGeofencesCallback = callback;
  };

  //-----------------------------------------------------------------------------//
  //-----------------------------LOCATION CALLBACKS------------------------------//
  //-----------------------------------------------------------------------------//

  /**
   * Callback that notifies when the user {@link Location} changes.
   *
   * @param callback the function called when the user {@link Location} changes
   */
  static onLocationUpdate = (callback: (location: Location) => void) => {
    locationCallback = callback;
  };

  /**
   * Callback that notifies when the user {@link LocationStatus} changes.
   *
   * @param callback the function called when the user {@link LocationStatus} changes
   */
  static onLocationStatus = (callback: (status: LocationStatus) => void) => {
    locationStatusCallback = callback;
  };

  /**
   * Callback that notifies when there is an error while the user is positioining.
   *
   * @param callback the function called when there is an error
   */
  static onLocationError = (callback: (error: Error) => void) => {
    locationErrorCallback = callback;
  };

  /**
   * Callback that notifies when the user stops positioning.
   *
   * @param callback the function called when the user stops positioning.
   */
  static onLocationStopped = (callback: () => void) => {
    locationStoppedCallback = callback;
  };

  //-----------------------------------------------------------------------------//
  //-----------------------------NAVIGATION CALLBACKS----------------------------//
  //-----------------------------------------------------------------------------//

  /**
   * Callback that notifies when navigation starts.
   *
   * @param callback a function that returns the initial {@link Route} by parameters.
   */
  static onNavigationStart = (callback: (route: Route) => void) => {
    navigationStartedCallback = callback;
  };

  /**
   * Callback that notifies every progress the user makes while navigating.
   *
   * @param callback a function that returns the {@link NavigationProgress} by parameters.
   */
  static onNavigationProgress = (
    callback: (progress: NavigationProgress) => void,
  ) => {
    navigationProgressCallback = callback;
  };

  /**
   * Callback that notifies when the user reaches the destination POI.
   *
   * @param callback a function that returns the completed {@link Route} by parameters.
   */
  static onNavigationDestinationReached = (
    callback: (route: Route) => void,
  ) => {
    navigationDestinationReachedCallback = callback;
  };

  /**
   * Callback that notifies when the user gets out of the current route.
   *
   * @param callback the function called when the user gets out of the current route.
   */
  static onNavigationOutOfRoute = (callback: () => void) => {
    navigationOutOfRouteCallback = callback;
  };

  /**
   * @deprecated
   * DEPRECATED: Use instead onNavigationCancellation()
   * and onNavigationDestinationReached() to determine why did the navigation end.
   *
   * Callback that notifies when the user finishes the route.
   *
   * @param callback the function called when the user finishes the route.
   */
  static onNavigationFinished = (callback: () => void) => {
    navigationFinishedCallback = callback;
  };

  /**
   * Callback that notifies when the user does cancel the navigation.
   *
   * @param callback the function called when the user cancels the navigation.
   */
  static onNavigationCancellation = (callback: () => void) => {
    navigationCancellationCallback = callback;
  };

  /**
   * Callback that notifies when there is an error during navigation.
   *
   * @param callback the function called when there is an error during navigation.
   */
  static onNavigationError = (callback: (error: any) => void) => {
    navigationErrorCallback = callback;
  };
}
