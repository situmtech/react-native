/* eslint-disable @typescript-eslint/no-explicit-any */

import type {
  AccessibilityMode,
  InternalCallType,
  LocationStatusName,
  SdkNavigationUpdateType,
} from "src/sdk";

/**
 * @name Building
 * @description A Building object definition
 *
 * @property {string} buildingIdentifier - The unique identifier of the resource
 * @property {string} name - The building name that is appropriate for display to the user.
 * @property {string} address - Te building address.
 * @property {Bounds} bounds - Compute corners of this building, without rotation, in earth coordinates.
 * @property {Bounds} boundsRotated - Compute corners of this building, with rotation, in earth coordinates.
 * @property {Coordinate} center - Center of the building's base, as geographical coordinate.
 * @property {Dimensions} Dimensions - Dimensions of building's base (height and width) in meters.
 * @property {string} infoHtml - Additional information about building, formatted with HTML
 * @property {string} pictureThumbUrl - The URL of building thumbnail image
 * @property {string} pictureUrl - The URL of building image
 * @property {number} rotation - Rotation angle of the building's base, relative to the west-east axis, increasing in counter-clockwise, being 0 the west-east axis.
 * @property {string} userIdentifier - Unique identifier of the owner user of the building
 * @property {object} customFields - Map of custom fields, indexed by their name.
 */
export type Building = {
  buildingIdentifier: string;
  name: string;
  address: string;
  bounds: Bounds;
  boundsRotated: Bounds;
  center: Coordinate;
  dimensions: Dimensions;
  infoHtml: string;
  pictureThumbUrl: string;
  pictureUrl: string;
  rotation: number;
  userIdentifier: string;
  customFields: object;
};

/**
 * @name BuildingInfo
 * @description Full information of a building
 *
 * @property {Building} building - Building basic information
 * @property {Floor[]} floors - Array with the information of each floor
 * @property {Poi[]} indoorPOIs - Array with the information of each indoor POI
 * @property {Poi[]} outdoorPOIs - Array with the information of each outdoor POI
 * @property {Geofence} geofences - Array with the information of each geofence
 */

export type BuildingInfo = {
  building: Building;
  floors: Floor[];
  indoorPOIs: Poi[];
  outdoorPOIs: Poi[];
  geofences: Geofence[];
};

/** @name Bounds
 * @description Represents a rectangle bounds in a greographic 2D space.
 *
 * @property {Coordinate} northEast - The coordinate of the north-east corner of the bound.
 * @property {Coordinate} northWest - The coordinate of the north-west corner of the bound.
 * @property {Coordinate} southEast - The coordinate of the south-east corner of the bound.
 * @property {Coordinate} southWest - The coordinate of the south-east corner of the bound.
 */
export type Bounds = {
  northEast: Coordinate;
  northWest: Coordinate;
  southEast: Coordinate;
  southWest: Coordinate;
};

/** @name Dimensions
 * @description Define 2D dimensions of a rectangular area.
 *
 * @property {number} width - Width of rectangle in meters
 * @property {number} height - Height of rectangle in meters.
 */
export type Dimensions = {
  width: number;
  height: number;
};

/**
 * @name Coordinate
 * @description A structure that contains geographical coordinate.
 *
 * @property {number} latitude - Latitude in degrees
 * @property {number} longitude - Longitude in degrees
 */
export type Coordinate = {
  latitude: number;
  longitude: number;
};

/**
 * @name CartesianCoordinate
 * @description A structure that contains cartesian coordinate.
 *
 * @property {number} x - Value of coordinate at x-axis
 * @property {number} y - Value of coordinate at y-axis
 */
export type CartesianCoordinate = {
  x: number;
  y: number;
};

/**
 * @name Floor
 * @description Floor of a building.
 *
 * @property {number} altitude - Altitude of the floor above ground level, in meters.
 * @property {string} buildingIdentifier - The identifier of building which this floor belongs.
 * @property {number} level - The number of the floor.
 * @property {string} name - The name of the floor
 * @property {string} mapUrl - The floor map image url
 * @property {number} scale - The scale of the floor image, in px/meters
 * @property {string} floorIdentifier - The unique identifier of the resource
 */
export type Floor = {
  altitude: number;
  buildingIdentifier: string;
  level: number;
  name: string;
  mapUrl: string;
  scale: number;
  floorIdentifier: string;
};

/**
 * @name POI
 * @description Point of Interest, associated to a building, regardless of whether it's place inside or outside the building.
 *
 * @property {string} identifier - The unique identifier of the resource
 * @property {string} buildingIdentifier - Identifier of building to which the POI belongs.
 * @property {CartesianCoordinate} cartesianCoordinate - Cartesian coordinate of this position, relative to building {@link Bounds}.
 * @property {Coordinate} coordinate - Geographical coordinate of this position
 * @property {string} floorIdentifier - If this POI is outside the building (isOutdoor == true), this field has no meaning.
 * @property {string} poiName - A name for the POI, appropriate for display to the user.
 * @property {Point} position - {@link Point} where the point is located.
 * @property {boolean} isIndoor - Whether the POI is placed outside the building or not.
 * @property {boolean} isOutdoor - Whether the POI is placed outside the building or not.
 * @property {PoiCategory} category - Category of the POI
 * @property {string} infoHtml - Additional information about POI, in HTML
 * @property {object} customFields - Map of custom fields, indexed by their name.
 */
export type Poi = {
  identifier: string;
  buildingIdentifier: string;
  cartesianCoordinate: CartesianCoordinate;
  coordinate: Coordinate;
  floorIdentifier: string;
  poiName: string;
  position: Point;
  isIndoor: boolean;
  isOutdoor: boolean;
  category: PoiCategory;
  infoHtml: string;
  customFields: object;
};

/**
 * @name Geofence
 * @description Point of Interest, associated to a building, regardless of whether it's place inside or outside the building.
 *
 * @property {string} identifier - The unique identifier of the resource
 * @property {string} buildingIdentifier - Identifier of building to which the POI belongs.
 * @property {string} floorIdentifier - If this POI is outside the building (isOutdoor == true), this field has no meaning.
 * @property {string} name - A name for the geofence, appropriate for display to the user.
 * @property {string} infoHtml - Additional information about POI, in HTML
 * @property {Point[]} polygonPoints - List of points of that define the area of the geofence
 * @property {object} customFields - Map of custom fields, indexed by their name.
 */
export type Geofence = {
  identifier: string;
  buildingIdentifier: string;
  floorIdentifier: string;
  infoHtml: string;
  polygonPoints: Point[];
  customFields: object;
  name: string;
};

/**
 * @name PoiCategory
 * @description Category of Point of Interest.
 *
 * @property {string} poiCategoryCode - Unique code of the category
 * @property {string} poiCategoryName - The category name appropriate for display to the user
 * @property {string} icon_selected - The selected icon url
 * @property {string} icon_unselected - The unselected icon url
 * @property {boolean} public - Whether the category is public or not
 */
export type PoiCategory = {
  poiCategoryCode: string;
  poiCategoryName: string;
  icon_selected: string;
  icon_unselected: string;
  isPublic: boolean;
};

/**
 * @name PoiIcon
 * @description Category of Point of Interest.
 *
 * @property {string} data - Base64 POI icon image
 */
export type PoiIcon = {
  data: string;
};

/**
 * @name Point
 * @description Associate geographical coordinate (Location) with Building and Floor (Cartography) and cartesian coordinate relative to that building.
 *
 * @property {string} buildingIdentifier - Unique identifier for the building to which this point belongs
 * @property {CartesianCoordinate} cartesianCoordinate - Cartesian coordinate (in meters) relative to the Bounds of building's base.
 * @property {Coordinate} coordinate - Geographic coordinate (latitude, longitude) of the point, regardless of whether it's placed inside or outside the building.
 * @property {string} floorIdentifier - Floor identifier (inside the building) where this point is placed.
 * @property {boolean} isIndoor - If the POI is inside the building.
 * @property {boolean} idOutdoor - If the POI is outside the building.
 */
export type Point = {
  buildingIdentifier: string;
  cartesianCoordinate: CartesianCoordinate;
  coordinate: Coordinate;
  floorIdentifier: string;
  isIndoor?: boolean;
  isOutdoor?: boolean;
};

/**
 * @name Route
 * @description Route between two points.
 *
 * @property {Poi} poiTo - The destination Poi the user is currently navigating to.
 * @property {RouteStep[]} edges - Ordered list of steps to go to the goal point
 * @property {RouteStep} firstStep - First step
 * @property {Point} from - Point where the route starts.
 * @property {Indication} indications - Ordered list of instructions to go to the destination
 * @property {RouteStep} lastStep - Last step
 * @property {Point[]} nodes - A collection of points of the route (not ordered)
 * @property {Point[]} points - List of ordered points of the route
 * @property {Point} to - Last point and goal of the route.
 * @property {RouteStep[]} steps - Ordered list of steps to go to the goal point
 * @property {RouteSegment[]} segments - List of segments formed by consecutive points and a floor identifier
 */
export type Route = {
  poiTo?: Poi;
  edges: RouteStep[];
  firstStep: RouteStep;
  from: Point;
  indications: Indication;
  lastStep: RouteStep;
  nodes: Point[];
  points: Point[];
  to: Point;
  steps: RouteStep[];
  segments: RouteSegment[];
};

/**
 * @name RouteStep
 * @description A fragment of a route, described by the initial point from and the last point to of the fragment, and some information about the step within the route.
 *
 * @property {number} distance - Distance between from and to in meters.
 * @property {number} distanceToGoal - Distance in meters between the start point of this step (from) and the last point in the route ('to' of the last step).
 * @property {Point} from - Start point of this step.
 * @property {number} id - Position of this RouteStep in the list of steps (Route.steps) of the route to which it belongs.
 * @property {Point} to - End point of this step.
 * @property {boolean} isFirst - Returns true if this is the first step in the route.
 * @property {boolean} isLast - Returns true if this is the last step in the route.
 */
export type RouteStep = {
  distance: number;
  distanceToGoal: number;
  from: Point;
  id: number;
  to: Point;
  isFirst: boolean;
  isLast: boolean;
};

/**
 * @name RouteSegment
 * @description A fragment of a route, described by a floor identifier and a list of consecutive points from the same floor
 *
 * @property {string} floorIdentifier - Identifier of the floor containing the points in this segment
 * @property {Point[]} points - Consecutive points in the same floor forming a path
 */
export type RouteSegment = {
  floorIdentifier: string;
  points: Point[];
};

/**
 * @name Indication
 * @description Represents the instruction that a user should follow when on a RouteStep to continue the route.
 *
 * @property {number} distance - The distance between the origin and destination
 * @property {number} distanceToNextLevel - The number of levels between the origin and destination
 * @property {string} indicationType - The Indication.Action of the instruction as String
 * @property {number} orientation - The angle a user should change his direction in order to go from the origin to the destination.
 * @property {string} orientationType - The Indication.Orientation of the instruction as String
 * @property {number} stepIdxDestination - The index of the indication's step of destination.
 * @property {number} stepIdxOrigin - The index of the indication's step of origin
 * @property {boolean} neededLevelChange - If the user should change the level in order to arrive at the destination.
 */
export type Indication = {
  distance: number;
  distanceToNextLevel: number;
  indicationType: string;
  neededLevelChange: boolean;
  orientation: number;
  orientationType: string;
  stepIdxDestination: number;
  stepIdxOrigin: number;
};

/**
 * @name NavigationProgress
 * @description Provides information of the progress of a user while following a route.
 *
 * @property {Location} closestLocationInRoute - Closest location in the route from the user location provided .
 * @property {number} distanceToClosestPointInRoute - Distance between the real user location (provided to updateWithLocation(Location)) and the closest route location.
 * @property {Indication} currentIndication - The current indication.
 * @property {Indication} nextIndication - The next indication.
 * @property {number} currentStepIndex - The index of the closest route step to the user, where closestLocationInRoute is.
 * @property {number} distanceToGoal -  The distance in meters from closestLocationInRoute to route's goal point.
 * @property {number} distanceToEndStep - The distance in meters to go from closestLocationInRoute to the end of the current step.
 * @property {number} timeToEndStep - The estimated time to go from closestLocationInRoute to the end of the current route step,  considering a speed of 1 meter/second.
 * @property {number} timeToGoal - The estimated time to go from closestLocationInRoute to the goal/end of route, considering a speed of 1 meter/second.
 * @property {RouteStep} routeStep - The closest route step to the user, where closestLocationInRoute is.
 * @property {Point[]} points - List of ordered points of the remaining route
 * @property {RouteSegment[]} segments - List of segments formed by consecutive points and a floor identifier
 */
export type NavigationProgress = {
  closestLocationInRoute: Location;
  currentIndication: number;
  currentStepIndex: number;
  distanceToClosestPointInRoute: number;
  distanceToEndStep: number;
  distanceToGoal: number;
  nextIndication: Indication;
  points: Point[];
  routeStep: RouteStep;
  segments: RouteSegment[];
  timeToEndStep: number;
  timeToGoal: number;
  type: SdkNavigationUpdateType;
};

/**
 * @name LocationRequest
 * @description A data object that contains parameters for the location service, LocationManager.
 *
 * @property {number} buildingIdentifier - Identifier of the building on which the positioning will be started
 * @property {number} interval - Default interval (in milliseconds) to notify location updates
 * @property {string} indoorProvider - Default indoor provider. Possible values are INPHONE and SUPPORT
 * @property {boolean} useBle - Defines whether or not to use BLE for positioning
 * @property {boolean} useWifi - Defines whether or not to use Wi-Fi for positioning
 * @property {boolean} useGps - Defines whether or not to use GPS for indoor positioning
 * @property {boolean} useBarometer - Defines whether or not to use the barometer for indoor positioning
 * @property {string} motionMode - Default motion mode. Possible values are BY_CAR, BY_FOOT, and RADIOMAX
 * @property {boolean} useForegroundService - Defines whether or not to activate the {@link http://developers.situm.es/pages/android/using_situm_sdk_background.html foreground service}
 * @property {boolean} useDeadReckoning - Defines whether or not to use dead reckoning to get fast position updates using only the inertial sensors, between the server position updates.
 * @property {OutdoorLocationOptions} outdoorLocationOptions - Outdoor location options. Only used in an indoor/outdoor request
 * @property {BeaconFilter[]} beaconFilters - Deprecated - Beacon filters to be handled during scan time, otherwise only Situm beacons will be scanned. Can be invoked multiple times to add as much beacon filters as you want. The SitumSDK now does it automatically
 * @property {number} smallestDisplacement - Default smallest displacement to notify location updates
 * @property {string} realtimeUpdateInterval - Default interval to send locations to the Realtime. Possible values are REALTIME, FAST, NORMAL, SLOW, and BATTERY_SAVER
 * @property {ForegroundServiceNotificationOptions} foregroundServiceNotificationOptions - Used to configure the notification options for a foreground service, allowing the definition of the title, message, stop button, button text, and the {@link ForegroundServiceNotificationsTapAction}.
 */
export type LocationRequest = {
  autoEnableBleDuringPositioning?: boolean;
  beaconFilters?: BeaconFilter[];
  buildingIdentifier?: number;
  indoorProvider?: string;
  interval?: number;
  motionMode?: string;
  outdoorLocationOptions?: OutdoorLocationOptions;
  realtimeUpdateInterval?: string;
  smallestDisplacement?: number;
  useBarometer?: boolean;
  useBle?: boolean;
  useDeadReckoning?: boolean;
  useForegroundService?: boolean;
  foregroundServiceNotificationOptions?: ForegroundServiceNotificationOptions;
  useGps?: boolean;
  useWifi?: boolean;
};

/**
 * A data object that let you customize the Foreground Service Notification
 * that will be shown in the system's tray when the app is running as a
 * Foreground Service.
 * To be used with {@link LocationRequest}.
 * Only applies for Android.
 * @property {ForegroundServiceNotificationOptions} foregroundServiceNotificationOptions
 */
export type ForegroundServiceNotificationOptions = {
  title?: string;
  message?: string;
  showStopAction?: boolean;
  stopActionText?: string;
  tapAction?: ForegroundServiceNotificationsTapAction;
};

/**
 * @name ForegroundServiceNotificationsTapAction
 * @description Predefined actions performed when tapping the Situm Foreground Service Notification.
 */
export enum ForegroundServiceNotificationsTapAction {
  /**
   * Launch the app's main activity using the information returned by android.content.pm.PackageManager#getLaunchIntentForPackage(String).
   */
  LaunchApp = "LAUNCH_APP",

  /**
   *  Launch the operating system settings screen for the current app.
   */
  LaunchSettings = "LAUNCH_SETTINGS",

  /**
   * Do nothing when tapping the notification.
   */
  DoNothing = "DO_NOTHING",
}

/**
 * @name NavigationRequest
 * @description A data object that contains the request for navigation.
 *
 * @property {number} distanceToGoalThreshold - Distance threshold to consider reaching the goal (meters).
 * @property {number} distanceToIgnoreFirstIndication - Maximum distance to ignore the first indication when navigating (meters).
 * @property {number} distanceToFloorChangeThreshold - Distance threshold from when a floor change is considered reached (meters).
 * @property {number} distanceToChangeIndicationThreshold - Distance threshold to change the indication (meters).
 * @property {boolean} ignoreLowQualityLocations - Ignore low-quality locations.
 * @property {number} indicationsInterval - Interval between indications (milliseconds).
 * @property {number} outsideRouteThreshold - Distance threshold to consider being outside the route (meters).
 * @property {number} roundIndicationsStep - Step to round indications (meters).
 * @property {number} timeToFirstIndication - Time to wait until the first indication is returned (milliseconds).
 * @property {number} timeToIgnoreUnexpectedFloorChanges - Time to ignore the locations received during navigation, when the next indication is a floor change,
 *                                                         if the locations are on a wrong floor (not in origin or destination floors) (milliseconds).
 */
export type NavigationRequest = {
  distanceToChangeIndicationThreshold?: number;
  distanceToFloorChangeThreshold?: number;
  distanceToGoalThreshold?: number;
  distanceToIgnoreFirstIndication?: number;
  ignoreLowQualityLocations?: boolean;
  indicationsInterval?: number;
  outsideRouteThreshold?: number;
  roundIndicationsStep?: number;
  timeToFirstIndication?: number;
  timeToIgnoreUnexpectedFloorChanges?: number;
};

/**
 * @name DirectionsRequest
 * @description A data object that contains the request for directions.
 *
 * @property {Building} positioningBuilding
 * @property {Point|Location} from - Current user's position as the starting point of the route.
 * @property {Point|Poi} to - Point to, where the route should end.
 * @property {DirectionsOptions} options - Options that can be added to the request.
 */
export type DirectionsRequest = {
  buildingIdentifier: string;
  from: Point | Location;
  to: Point | Poi;
} & DirectionsOptions;

/**
 * @name DirectionsOptions
 * @description A data object that contains the directions options.
 *
 * @property {boolean} minimizeFloorChanges - Defines wheter or not the route should be calculated minimizing the floor changes even if the result is longer.
 * @property {string} accessibilityMode - Defines the accessibility mode of the route. Possible values are: CHOOSE_SHORTEST, ONLY_NOT_ACCESSIBLE_FLOOR_CHANGES, ONLY_ACCESSIBLE
 * @property {number} startingAngle - Current user's orientation in degrees.
 * @property {String[]} includedTags List of tags that you want to use when calculating a route. Only the tags added here will be used. If there are other tags in the graph they won't be used. The edges without a tag will be used. If you don't set nothing all the graph will be used to calculate the route. You can learn more about this topic on https://situm.com/docs/cartography-management/#tags
 * @property {String[]} excludedTags List of tags that you want your route to avoid. If you exclude a tag the route will never pass through an edge that have this tag. If the route can only be generated passing through an edge with this tag the route calculation will fail. You can learn more about this topic on https://situm.com/docs/cartography-management/#tags.
 */
export type DirectionsOptions = {
  minimizeFloorChanges?: boolean;
  accessibilityMode?: AccessibilityMode;
  // startingAngle = bearingFrom
  startingAngle?: number;
  bearingFrom?: number;
  includedTags?: string[];
  excludedTags?: string[];
};

/**
 * @name OutdoorLocationOptions
 * @description Outdoor location options are only used in indoor-outdoor mode (Only available for Android)
 *
 * @property {boolean} continuousMode - Environment detection continuous mode (true) or burst mode (false).
 * @property {boolean} userDefinedThreshold
 * @property {number} burstInterval - Interval to scan for GPS and detect the environment (in seconds).
 * @property {number} averageSnrThreshold
 */
export type OutdoorLocationOptions = {
  continuousMode?: boolean;
  userDefinedThreshold?: boolean;
  burstInterval?: number;
  averageSnrThreshold?: number;
};

/**
 * @name BeaconFilter
 * @description Represents a BLE filter. Now the only field is the BLE proximity UUID
 *
 * @property {string} uuid - Assigns the proximity UUID
 */
export type BeaconFilter = {
  uuid: string;
};

/**
 * @name RealTimeRequest
 * @description A data object that contains the parameters to process realtime data of the users.
 *
 * @property {Building} building object
 * @property {int} pollTime - Interval in milliseconds (minimum is 3000ms).
 */
export type RealTimeRequest = {
  building: Building;
  pollTime: number;
};

/**
 * @name RealTimeData
 * @description A data object that contains information of the location of users in realtime.
 *
 * @property {Array<Location>} locations object
 */
export type RealTimeData = {
  locations: Location[];
};

/**
 * @name SdkVersion
 * @description Represents the version information of the SDK and its compatibility with different platforms.
 *
 * @type
 * @property {string} react_native - The version of React Native used in the SDK.
 * @property {string} [ios] - Optional. The specific version of the Situm SDK for the iOS platform.
 * @property {string} [android] - Optional. The specific version of the Situm SDK for the Android platform.
 */
export type SdkVersion = {
  react_native: string;
  ios?: string;
  android?: string;
};

/**
 * @name ConfigurationOptions
 * @description Configuration options for initializing the SDK or other modules.
 *
 * @type
 * @property {boolean} [useRemoteConfig] - Optional. Determines whether to use Remote Configuration settings.
 * @property {number} [cacheMaxAge] - Optional. The maximum age of the cache in seconds.
 */
export type ConfigurationOptions = {
  useRemoteConfig?: boolean;
  cacheMaxAge?: number;
};

/**
 * @name Location
 * @description Represents a location with various attributes including position, accuracy, and bearing.
 *
 * @interface
 * @property {Position} [position] - Optional. The position information of the location.
 * @property {number} [accuracy] - Optional. The accuracy of the location information in meters.
 * @property {Object} [bearing] - Optional. Bearing information including degrees and degreesClockwise.
 * @property {boolean} [hasBearing] - Optional. Indicates if bearing information is available.
 */
export interface Location {
  position?: Position;
  accuracy?: number;
  bearing?: {
    degrees: number;
    degreesClockwise: number;
  };
  hasBearing?: boolean;
  timestamp?: number;
}

export interface Position {
  coordinate: {
    latitude: number;
    longitude: number;
  };
  cartesianCoordinate: {
    x: number;
    y: number;
  };
  isIndoor?: boolean;
  isOutdoor?: boolean;
  buildingIdentifier?: string;
  floorIdentifier?: string;
}

/**
 * @name LocationStatus
 * @description Represents the status of a location, including a name and a numeric code.
 *
 * @interface
 * @property {LocationStatusName} statusName - The name of the location status.
 * @property {number} statusCode - The numeric code representing the location status.
 */
export interface LocationStatus {
  statusName: LocationStatusName;
  statusCode: number;
}

/**
 * @name ErrorType
 * @description Enumeration of error types to categorize the severity of errors.
 *
 * @enum {string}
 * @property {string} CRITICAL - Represents critical errors that will cause the system not to work (e.g. positioning will be stopped).
 * @property {string} NON_CRITICAL - Represents non-critical errors that are less severe.
 */
export enum ErrorType {
  CRITICAL = "CRITICAL",
  NON_CRITICAL = "NON_CRITICAL",
}

/**
 * @name ErrorCode
 * @description Enumeration of error codes provided by Situm SDK.
 *
 * @enum {string}
 * @property {string} LOCATION_PERMISSION_DENIED - Indicates that location permissions were not granted by the user.
 * @property {string} BLUETOOTH_PERMISSION_DENIED - Indicates that Bluetooth permissions were not granted.
 * @property {string} BLUETOOTH_DISABLED - Indicates that Bluetooth is disabled on the device.
 * @property {string} LOCATION_DISABLED - Indicates that the location services are disabled on the device.
 * @property {string} REDUCED_ACCURACY - Indicates that the precise location has been turned off on the device.
 * @property {string} UNKNOWN - Represents an unknown error or an error that does not fit other categories.
 */
export enum ErrorCode {
  LOCATION_PERMISSION_DENIED = "LOCATION_PERMISSION_DENIED",
  BLUETOOTH_PERMISSION_DENIED = "BLUETOOTH_PERMISSION_DENIED",
  BLUETOOTH_DISABLED = "BLUETOOTH_DISABLED",
  LOCATION_DISABLED = "LOCATION_DISABLED",
  REDUCED_ACCURACY = "REDUCED_ACCURACY",
  UNKNOWN = "UNKNOWN",
}

/**
 * @name Error
 * @description Represents an error with a specific code, message, and type.
 *
 * @interface
 * @property {ErrorCode} code - The specific error code associated with this error.
 * @property {string} message - A descriptive message providing more details about the error.
 * @property {ErrorType} type - The type of the error indicating its severity (critical or non-critical).
 */
export interface Error {
  code: ErrorCode;
  message: string;
  type: ErrorType;
}

// TODO: add types
export type Directions = any;

export class InternalCall<T = any> {
  readonly type: InternalCallType;
  readonly data: T;

  constructor(type: InternalCallType, data: T) {
    this.type = type;
    this.data = data;
  }

  get<T>(): T {
    return this.data as unknown as T;
  }
}
