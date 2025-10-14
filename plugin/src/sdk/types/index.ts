/* eslint-disable @typescript-eslint/no-explicit-any */

import type {
  AccessibilityMode,
  InternalCallType,
  LocationStatusName,
  SdkNavigationUpdateType,
} from "./constants";

/**
 * A Building object definition.
 */
export type Building = {
  /** The unique identifier of the resource */
  buildingIdentifier: string;
  /** The building name that is appropriate for display to the user. */
  name: string;
  /** The building address. */
  address: string;
  /** Compute corners of this building, without rotation, in earth coordinates. */
  bounds: Bounds;
  /** Compute corners of this building, with rotation, in earth coordinates. */
  boundsRotated: Bounds;
  /** Center of the building's base, as geographical coordinate. */
  center: Coordinate;
  /** Dimensions of building's base (height and width) in meters. */
  dimensions: Dimensions;
  /** Additional information about building, formatted with HTML. */
  infoHtml: string;
  /** The URL of building thumbnail image. */
  pictureThumbUrl: string;
  /** The URL of building image. */
  pictureUrl: string;
  /** Rotation angle of the building's base, relative to west-east axis. */
  rotation: number;
  /** Unique identifier of the owner user of the building. */
  userIdentifier: string;
  /** Map of custom fields, indexed by their name. */
  customFields: object;
};

/**
 * Full information of a building
 */
export type BuildingInfo = {
  /** Building basic information */
  building: Building;
  /** Array with the information of each floor */
  floors: Floor[];
  /** Array with the information of each indoor POI */
  indoorPOIs: Poi[];
  /** Array with the information of each outdoor POI */
  outdoorPOIs: Poi[];
  /** Array with the information of each geofence */
  geofences: Geofence[];
};

/**
 * Represents a rectangle bounds in a greographic 2D space.
 */
export type Bounds = {
  /** The coordinate of the north-east corner of the bound. */
  northEast: Coordinate;
  /** The coordinate of the north-west corner of the bound. */
  northWest: Coordinate;
  /** The coordinate of the south-east corner of the bound. */
  southEast: Coordinate;
  /** The coordinate of the south-west corner of the bound. */
  southWest: Coordinate;
};

/**
 * Define 2D dimensions of a rectangular area.
 */
export type Dimensions = {
  /** Width of rectangle in meters */
  width: number;
  /** Height of rectangle in meters */
  height: number;
};

/**
 * A structure that contains geographical coordinate.
 */
export type Coordinate = {
  /** Latitude in degrees */
  latitude: number;
  /** Longitude in degrees */
  longitude: number;
};

/**
 * A structure that contains cartesian coordinate.
 */
export type CartesianCoordinate = {
  /** Value of coordinate at x-axis */
  x: number;
  /** Value of coordinate at y-axis */
  y: number;
};

/**
 * Floor of a building.
 */
export type Floor = {
  /** Altitude of the floor above ground level, in meters */
  altitude: number;
  /** The identifier of building which this floor belongs */
  buildingIdentifier: string;
  /** The number of the floor */
  level: number;
  /** The name of the floor */
  name: string;
  /** The floor map image url */
  mapUrl: string;
  /** The scale of the floor image, in px/meters */
  scale: number;
  /** The unique identifier of the resource */
  floorIdentifier: string;
};

/**
 * Point of Interest, associated to a building, regardless of whether it's placed inside or outside the building.
 */
export type Poi = {
  /** The unique identifier of the resource */
  identifier: string;
  /** Identifier of building to which the POI belongs */
  buildingIdentifier: string;
  /** Cartesian coordinate of this position, relative to building {@link Bounds} */
  cartesianCoordinate: CartesianCoordinate;
  /** Geographical coordinate of this position */
  coordinate: Coordinate;
  /** If this POI is outside the building (isOutdoor == true), this field has no meaning */
  floorIdentifier: string;
  /** A name for the POI, appropriate for display to the user */
  poiName: string;
  /** {@link Point} where the point is located */
  position: Point;
  /** Whether the POI is placed outside the building or not */
  isIndoor: boolean;
  /** Whether the POI is placed outside the building or not */
  isOutdoor: boolean;
  /** Category of the POI */
  category: PoiCategory;
  /** Additional information about POI, in HTML */
  infoHtml: string;
  /** Map of custom fields, indexed by their name */
  customFields: object;
};

/**
 * Point of Interest, associated to a building, regardless of whether it's placed inside or outside the building.
 */
export type Geofence = {
  /** The unique identifier of the resource */
  identifier: string;
  /** Identifier of building to which the POI belongs */
  buildingIdentifier: string;
  /** If this POI is outside the building (isOutdoor == true), this field has no meaning */
  floorIdentifier: string;
  /** A name for the geofence, appropriate for display to the user */
  name: string;
  /** Additional information about POI, in HTML */
  infoHtml: string;
  /** List of points of that define the area of the geofence */
  polygonPoints: Point[];
  /** Map of custom fields, indexed by their name */
  customFields: object;
};

/**
 * Category of Point of Interest.
 */
export type PoiCategory = {
  /** Unique code of the category */
  poiCategoryCode: string;
  /** The category name appropriate for display to the user */
  poiCategoryName: string;
  /** The selected icon url */
  icon_selected: string;
  /** The unselected icon url */
  icon_unselected: string;
  /** Whether the category is public or not */
  isPublic: boolean;
};

/**
 * Category of Point of Interest.
 */
export type PoiIcon = {
  /** Base64 POI icon image */
  data: string;
};

/**
 * Associate geographical coordinate (Location) with Building and Floor (Cartography) and cartesian coordinate relative to that building.
 */
export type Point = {
  /** Unique identifier for the building to which this point belongs */
  buildingIdentifier: string;
  /** Cartesian coordinate (in meters) relative to the Bounds of building's base */
  cartesianCoordinate: CartesianCoordinate;
  /** Geographic coordinate (latitude, longitude) of the point, regardless of whether it's placed inside or outside the building */
  coordinate: Coordinate;
  /** Floor identifier (inside the building) where this point is placed */
  floorIdentifier: string;
  /** If the POI is inside the building */
  isIndoor?: boolean;
  /** If the POI is outside the building */
  isOutdoor?: boolean;
};

/**
 * Route between two points.
 */
export type Route = {
  /** The destination Poi the user is currently navigating to */
  poiTo?: Poi;
  /** Ordered list of steps to go to the goal point */
  edges: RouteStep[];
  /** First step */
  firstStep: RouteStep;
  /** Point where the route starts */
  from: Point;
  /** Ordered list of instructions to go to the destination */
  indications: Indication;
  /** Last step */
  lastStep: RouteStep;
  /** A collection of points of the route (not ordered) */
  nodes: Point[];
  /** List of ordered points of the route */
  points: Point[];
  /** Last point and goal of the route */
  to: Point;
  /** Ordered list of steps to go to the goal point */
  steps: RouteStep[];
  /** List of segments formed by consecutive points and a floor identifier */
  segments: RouteSegment[];
};

/**
 * A fragment of a route, described by the initial point from and the last point to of the fragment, and some information about the step within the route.
 */
export type RouteStep = {
  /** Distance between from and to in meters */
  distance: number;
  /** Distance in meters between the start point of this step (from) and the last point in the route ('to' of the last step) */
  distanceToGoal: number;
  /** Start point of this step */
  from: Point;
  /** Position of this RouteStep in the list of steps (Route.steps) of the route to which it belongs */
  id: number;
  /** End point of this step */
  to: Point;
  /** Returns true if this is the first step in the route */
  isFirst: boolean;
  /** Returns true if this is the last step in the route */
  isLast: boolean;
};

/**
 * A fragment of a route, described by a floor identifier and a list of consecutive points from the same floor
 */
export type RouteSegment = {
  /** Identifier of the floor containing the points in this segment */
  floorIdentifier: string;
  /** Consecutive points in the same floor forming a path */
  points: Point[];
};

/**
 * Represents the instruction that a user should follow when on a RouteStep to continue the route.
 */
export type Indication = {
  /** The distance between the origin and destination */
  distance: number;
  /** The number of levels between the origin and destination */
  distanceToNextLevel: number;
  /** The Indication.Action of the instruction as String */
  indicationType: string;
  /** If the user should change the level in order to arrive at the destination */
  neededLevelChange: boolean;
  /** The angle a user should change his direction in order to go from the origin to the destination */
  orientation: number;
  /** The Indication.Orientation of the instruction as String */
  orientationType: string;
  /** The index of the indication's step of destination */
  stepIdxDestination: number;
  /** The index of the indication's step of origin */
  stepIdxOrigin: number;
};

/**
 * Provides information of the progress of a user while following a route.
 */
export type NavigationProgress = {
  /** Closest location in the route from the user location provided */
  closestLocationInRoute: Location;
  /** The current indication */
  currentIndication: number;
  /** The index of the closest route step to the user, where closestLocationInRoute is */
  currentStepIndex: number;
  /** Distance between the real user location (provided to updateWithLocation(Location)) and the closest route location */
  distanceToClosestPointInRoute: number;
  /** The distance in meters to go from closestLocationInRoute to the end of the current step */
  distanceToEndStep: number;
  /** The distance in meters from closestLocationInRoute to route's goal point */
  distanceToGoal: number;
  /** The next indication */
  nextIndication: Indication;
  /** List of ordered points of the remaining route */
  points: Point[];
  /** The closest route step to the user, where closestLocationInRoute is */
  routeStep: RouteStep;
  /** List of segments formed by consecutive points and a floor identifier */
  segments: RouteSegment[];
  /** The estimated time to go from closestLocationInRoute to the end of the current route step, considering a speed of 1 meter/second */
  timeToEndStep: number;
  /** The estimated time to go from closestLocationInRoute to the goal/end of route, considering a speed of 1 meter/second */
  timeToGoal: number;
  type: SdkNavigationUpdateType;
};

/**
 * A data object that contains parameters for the location service, LocationManager.
 */
export type LocationRequest = {
  /** Tries to enable BLE if disabled while positioning. Will not work in modern Android versions */
  autoEnableBleDuringPositioning?: boolean;
  /** Beacon filters to be handled during scan time, otherwise only Situm beacons will be scanned */
  beaconFilters?: BeaconFilter[];
  /** Identifier of the building on which the positioning will be started */
  buildingIdentifier?: number;
  /** Default indoor provider. Possible values are INPHONE and SUPPORT */
  indoorProvider?: string;
  /** Default interval (in milliseconds) to notify location updates */
  interval?: number;
  /** Default motion mode. Possible values are BY_CAR, BY_FOOT, and RADIOMAX */
  motionMode?: string;
  /** Outdoor location options. Only used in an indoor/outdoor request */
  outdoorLocationOptions?: OutdoorLocationOptions;
  /** Default interval to send locations to the Realtime. Possible values are REALTIME, FAST, NORMAL, SLOW, and BATTERY_SAVER */
  realtimeUpdateInterval?: string;
  /** Default smallest displacement to notify location updates */
  smallestDisplacement?: number;
  /** Defines whether or not to use the barometer for indoor positioning */
  useBarometer?: boolean;
  /** Defines whether or not to use BLE for positioning */
  useBle?: boolean;
  /** Defines whether or not to use dead reckoning to get fast position updates using only the inertial sensors, between the server position updates */
  useDeadReckoning?: boolean;
  /** Defines whether or not to activate the foreground service */
  useForegroundService?: boolean;
  /** Used to configure the notification options for a foreground service */
  foregroundServiceNotificationOptions?: ForegroundServiceNotificationOptions;
  /** Defines whether or not to use GPS for indoor positioning */
  useGps?: boolean;
  /** Defines whether or not to use Wi-Fi for positioning */
  useWifi?: boolean;
};

/**
 * A data object that let you customize the Foreground Service Notification
 * that will be shown in the system's tray when the app is running as a
 * Foreground Service.
 * To be used with {@link LocationRequest}.
 * Only applies for Android.
 */
export type ForegroundServiceNotificationOptions = {
  /** Notification title */
  title?: string;
  /** Notification message */
  message?: string;
  /** Whether to show stop action */
  showStopAction?: boolean;
  /** Stop action text */
  stopActionText?: string;
  /** Action to perform when tapping the notification */
  tapAction?: ForegroundServiceNotificationsTapAction;
};

/**
 * Predefined actions performed when tapping the Situm Foreground Service Notification.
 */
export enum ForegroundServiceNotificationsTapAction {
  /**
   * Launch the app's main activity using the information returned by android.content.pm.PackageManager#getLaunchIntentForPackage(String).
   */
  LaunchApp = "LAUNCH_APP",
  /**
   * Launch the operating system settings screen for the current app.
   */
  LaunchSettings = "LAUNCH_SETTINGS",
  /**
   * Do nothing when tapping the notification.
   */
  DoNothing = "DO_NOTHING",
}

/**
 * A data object that contains the request for navigation.
 */
export type NavigationRequest = {
  /** Distance threshold to change the indication (meters) */
  distanceToChangeIndicationThreshold?: number;
  /** Distance threshold from when a floor change is considered reached (meters) */
  distanceToFloorChangeThreshold?: number;
  /** Distance threshold to consider reaching the goal (meters) */
  distanceToGoalThreshold?: number;
  /** Maximum distance to ignore the first indication when navigating (meters) */
  distanceToIgnoreFirstIndication?: number;
  /** Ignore low-quality locations */
  ignoreLowQualityLocations?: boolean;
  /** Interval between indications (milliseconds) */
  indicationsInterval?: number;
  /** Distance threshold to consider being outside the route (meters) */
  outsideRouteThreshold?: number;
  /** Step to round indications (meters) */
  roundIndicationsStep?: number;
  /** Time to wait until the first indication is returned (milliseconds) */
  timeToFirstIndication?: number;
  /** Time to ignore the locations received during navigation, when the next indication is a floor change,
   * if the locations are on a wrong floor (not in origin or destination floors) (milliseconds) */
  timeToIgnoreUnexpectedFloorChanges?: number;
};

/**
 * A data object that contains the request for directions.
 */
export type DirectionsRequest = {
  buildingIdentifier: string;
  /** Current user's position as the starting point of the route */
  from: Point | Location;
  /** Point to, where the route should end */
  to: Point | Poi;
} & DirectionsOptions;

/**
 * A data object that contains the directions options.
 */
export type DirectionsOptions = {
  /** Defines whether or not the route should be calculated minimizing the floor changes even if the result is longer */
  minimizeFloorChanges?: boolean;
  /** Defines the accessibility mode of the route. Possible values are: CHOOSE_SHORTEST, ONLY_NOT_ACCESSIBLE_FLOOR_CHANGES, ONLY_ACCESSIBLE */
  accessibilityMode?: AccessibilityMode;
  /** Current user's orientation in degrees */
  startingAngle?: number;
  bearingFrom?: number;
  /**
   * List of tags that you want to use when calculating a route. Only the tags added here will be used.
   * If there are other tags in the graph they won't be used. The edges without a tag will be used.
   * If you don't set nothing all the graph will be used to calculate the route.
   * @see https://situm.com/docs/cartography-management/#tags
   */
  includedTags?: string[];
  /**
   * List of tags that you want your route to avoid. If you exclude a tag the route will never pass through an edge that have this tag.
   * If the route can only be generated passing through an edge with this tag the route calculation will fail.
   * @see https://situm.com/docs/cartography-management/#tags
   */
  excludedTags?: string[];
};

/**
 * Outdoor location options are only used in indoor-outdoor mode (Only available for Android)
 */
export type OutdoorLocationOptions = {
  /** Environment detection continuous mode (true) or burst mode (false) */
  continuousMode?: boolean;
  userDefinedThreshold?: boolean;
  /** Interval to scan for GPS and detect the environment (in seconds) */
  burstInterval?: number;
  averageSnrThreshold?: number;
};

/**
 * Represents a BLE filter. Now the only field is the BLE proximity UUID
 */
export type BeaconFilter = {
  /** Assigns the proximity UUID */
  uuid: string;
};

/**
 * A data object that contains the parameters to process realtime data of the users.
 */
export type RealTimeRequest = {
  /** Building object */
  building: Building;
  /** Interval in milliseconds (minimum is 3000ms) */
  pollTime: number;
};

/**
 * A data object that contains information of the location of users in realtime.
 */
export type RealTimeData = {
  /** Array of location objects */
  locations: Location[];
};

/**
 * Represents the version information of the SDK and its compatibility with different platforms.
 * @deprecated This type will be removed in future versions.
 */
export type SdkVersion = {
  /** The version of React Native used in the SDK */
  react_native: string;
  /** The specific version of the Situm SDK for the iOS platform */
  ios?: string;
  /** The specific version of the Situm SDK for the Android platform */
  android?: string;
};

/**
 * Configuration options for initializing the SDK or other modules.
 */
export type ConfigurationOptions = {
  /** Determines whether to use Remote Configuration settings */
  useRemoteConfig?: boolean;
  /** The maximum age of the cache in seconds */
  cacheMaxAge?: number;
};

/**
 * Represents a location with various attributes including position, accuracy, and bearing.
 */
export interface Location {
  /** The position information of the location */
  position?: Position;
  /** The accuracy of the location information in meters */
  accuracy?: number;
  /** Bearing information including degrees and degreesClockwise */
  bearing?: {
    degrees: number;
    degreesClockwise: number;
  };
  /** Indicates if bearing information is available */
  hasBearing?: boolean;
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
 * Represents the status of a location, including a name and a numeric code.
 */
export interface LocationStatus {
  /** The name of the location status */
  statusName: LocationStatusName;
  /** The numeric code representing the location status */
  statusCode: number;
}

/**
 * Enumeration of error types to categorize the severity of errors.
 */
export enum ErrorType {
  /** Represents critical errors that will cause the system not to work (e.g. positioning will be stopped) */
  CRITICAL = "CRITICAL",
  /** Represents non-critical errors that are less severe */
  NON_CRITICAL = "NON_CRITICAL",
}

/**
 * Enumeration of error codes provided by Situm SDK.
 */
export enum ErrorCode {
  /** Indicates that location permissions were not granted by the user */
  LOCATION_PERMISSION_DENIED = "LOCATION_PERMISSION_DENIED",
  /** Indicates that Bluetooth permissions were not granted */
  BLUETOOTH_PERMISSION_DENIED = "BLUETOOTH_PERMISSION_DENIED",
  /** Indicates that Bluetooth is disabled on the device */
  BLUETOOTH_DISABLED = "BLUETOOTH_DISABLED",
  /** Indicates that the location services are disabled on the device */
  LOCATION_DISABLED = "LOCATION_DISABLED",
  /** Indicates that the precise location has been turned off on the device */
  REDUCED_ACCURACY = "REDUCED_ACCURACY",
  /** Represents an unknown error or an error that does not fit other categories */
  UNKNOWN = "UNKNOWN",
}

/**
 * Represents an error with a specific code, message, and type.
 */
export interface Error {
  /** The specific error code associated with this error */
  code: ErrorCode;
  /** A descriptive message providing more details about the error */
  message: string;
  /** The type of the error indicating its severity (critical or non-critical) */
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

/**
 * Color scheme for the user helper UI.
 */
export type UserHelperColorScheme = {
  /**
   * Primary color for the user helper UI. Use a 6-digit HEX color code in the form #RRGGBB (e.g. #ff5733).
   *  Do not use 8-digit formats like #AARRGGBB or #RRGGBBAA.
   */
  primaryColor: string;
  /**
   * Secondary color for the user helper UI. Use HEX color code (e.g. "#ff5733")
   * Do not use 8-digit formats like #AARRGGBB or #RRGGBBAA.
   */
  secondaryColor: string;
};

/**
 * Configuration options for the user helper.
 */
export type UserHelperOptions = {
  /** Whether the user helper is enabled. Equivalent to the underlying native SitumSdk.userHelperManager#autoManage(true) */
  enabled: boolean;
  /** Color scheme for the user helper UI */
  colorScheme: UserHelperColorScheme | undefined;
};

/**
 * This class represents the object that contains the message passed from
 * the viewer to the application. This message represents the requirement to
 * read aloud a text with some parameters like language, volume, etc.
 */
export type TextToSpeechMessage = {
  /** A String message that will be read aloud using TTS */
  text: string;
  /** A String that represents the language code, i.e. es-ES */
  lang: string | undefined;
  /** A decimal number that represents the volume from 0.0 to 1.0 */
  volume: number | undefined;
  /** A decimal number that represents the speech pitch from 0.0 to 1.0 */
  pitch: number | undefined;
  /** A decimal number that represents the speech rate from 0.0 to 1.0 */
  rate: number | undefined;
};
