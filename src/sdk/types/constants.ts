export enum NavigationStatus {
  START = "start",
  STOP = "stop",
  OUT_OF_ROUTE = "outOfRoute",
  UPDATE = "update",
}

export enum NavigationUpdateType {
  PROGRESS = "PROGRESS",
  OUT_OF_ROUTE = "OUT_OF_ROUTE",
  DESTINATION_REACHED = "DESTINATION_REACHED",
  CANCELLED = "CANCELLED",
}

export enum SdkNavigationUpdateType {
  START = "onNavigationStart",
  PROGRESS = "onNavigationProgress",
  FINISHED = "onNavigationFinished",
  DESTINATION_REACHED = "onNavigationDestinationReached",
  OUTSIDE_ROUTE = "onUserOutsideRoute",
  CANCELLATION = "onNavigationCancellation",
  ERROR = "onNavigationError",
}

export enum LocationStatusName {
  STARTING = "STARTING",
  // CALCULATING: removed! The viewer will process STARTING status, not CALCULATING.
  // We want to send the last (valid) known status to the viewer as soon as it is
  // loaded. If we overwrite the STARTING status with CALCULATING, the viewer will not
  // proccess it and it won't show the "positioning..." UI.
  USER_NOT_IN_BUILDING = "USER_NOT_IN_BUILDING",
  STOPPED = "STOPPED",
}

/**
 * Available accessibility modes used in the {@link DirectionsRequest}.
 *
 * @property CHOOSE_SHORTEST The route should choose the best route, without taking into account if it is accessible or not.
 * This option is the default so you don't have to do anything in order to use it
 * @property ONLY_ACCESSIBLE The route should always use accessible nodes.
 * @property ONLY_NOT_ACCESSIBLE_FLOOR_CHANGES The route should never use accessible floor changes (use this to force routes not to use lifts).
 */
export enum AccessibilityMode {
  CHOOSE_SHORTEST = "CHOOSE_SHORTEST",
  ONLY_ACCESSIBLE = "ONLY_ACCESSIBLE",
  ONLY_NOT_ACCESSIBLE_FLOOR_CHANGES = "ONLY_NOT_ACCESSIBLE_FLOOR_CHANGES",
}

export enum InternalCallType {
  LOCATION = "LOCATION",
  LOCATION_STATUS = "LOCATION_STATUS",
  LOCATION_ERROR = "LOCATION_ERROR",
  LOCATION_STOPPED = "LOCATION_STOPPED", // TODO: Exists only in RN, delete!
  NAVIGATION_START = "NAVIGATION_START",
  NAVIGATION_DESTINATION_REACHED = "NAVIGATION_DESTINATION_REACHED",
  NAVIGATION_PROGRESS = "NAVIGATION_PROGRESS",
  NAVIGATION_OUT_OF_ROUTE = "NAVIGATION_OUT_OF_ROUTE",
  NAVIGATION_CANCELLATION = "NAVIGATION_CANCELLATION",
  NAVIGATION_ERROR = "NAVIGATION_ERROR",
  GEOFENCES_ENTER = "GEOFENCES_ENTER",
  GEOFENCES_EXIT = "GEOFENCES_EXIT",
}

export const CURRENT_USER_LOCATION_ID = -1;
export const CUSTOM_DESTINATION_LOCATION_ID = -2;
