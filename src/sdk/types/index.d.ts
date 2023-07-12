/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */

/** @name
 * Building
 * @description
 * A Building object definition
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

/** @name
 * Bounds
 * @description
 * Represents a rectangle bounds in a greographic 2D space.
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

/** @name
 * Dimensions
 * @description
 * Define 2D dimensions of a rectangular area.
 * @property {number} width - Width of rectangle in meters
 * @property {number} height - Height of rectangle in meters.
 */

export type Dimensions = {
  width: number;
  height: number;
};

/**
 * @name
 * Coordinate
 * @description
 * A structure that contains geographical coordinate.
 * @property {number} latitude - Latitude in degrees
 * @property {number} longitude - Longitude in degrees
 */

export type Coordinate = {
  latitude: number;
  longitude: number;
};

/**
 * @name
 * CartesianCoordinate
 * @description
 * A structure that contains cartesian coordinate.
 * @property {number} x - Value of coordinate at x-axis
 * @property {number} y - Value of coordinate at y-axis
 */

export type CartesianCoordinate = {
  x: number;
  y: number;
};

/**
 * @name
 * Floor
 * @description
 * Floor of a building.
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
 * @name
 * POI
 * @description
 * Point of Interest, associated to a building, regardless of whether it's place inside or outside the building.
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
 * @name
 * Geofence
 * @description
 * Point of Interest, associated to a building, regardless of whether it's place inside or outside the building.
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
};

/**
 * @name
 * PoiCategory
 * @description
 * Category of Point of Interest.
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
 * @name
 * Point
 * @description
 * Associate geographical coordinate (Location) with Building and Floor (Cartography) and cartesian coordinate relative to that building.
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
  isIndoor: boolean;
  isOutdoor: boolean;
};
export type DirectionPoint = {
  floorIdentifier: Floor["floorIdentifier"];
  buildingIdentifier: Building["buildingIdentifier"];
  coordinate: Coordinate;
};
/**
 * @name
 * Route
 * @description
 * Route between two points.
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
 * @name
 * RouteStep
 * @description
 * A fragment of a route, described by the initial point from and the last point to of the fragment, and some information about the step within the route.
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
 * @name
 * RouteSegment
 * @description
 * A fragment of a route, described by a floor identifier and a list of consecutive points from the same floor
 * @property {string} floorIdentifier - Identifier of the floor containing the points in this segment
 * @property {Point[]} points - Consecutive points in the same floor forming a path
 */

export type RouteSegment = {
  floorIdentifier: string;
  points: Point[];
};

/**
 * @name
 * Indication
 * @description
 * Represents the instruction that a user should follow when on a RouteStep to continue the route.
 * @property {number} distance - The distance between the origin and destination
 * @property {number} distanceToNextLevel - The number of levels between the origin and destination
 * @property {string} indicationType - The Indication.Action of the instruction as String
 * @property {number} orientation - The angle a user should change his direction in order to go from the origin to the destination.
 * @property {string} orientationType - The Indication.Orientation of the instruction as String
 * @property {number} stepIdxDestination - The index of the indication's step of destination.
 * @property {number} stepIdxOrigin - The index of the indication's step of origin
 * @property {boolean} neededLevelChange - If the user should change the level in order to arrive to destination
 */

export type Indication = {
  distance: number;
  distanceToNextLevel: number;
  indicationType: string;
  orientation: number;
  orientationType: string;
  stepIdxDestination: number;
  stepIdxOrigin: number;
  neededLevelChange: boolean;
};

/**
 * @name
 * NavigationProgress
 * @description
 * Provides information of the progress of a user while following a route.
 * @property {Point} closestPointInRoute - Closest point in the route from the user location provided . @deprecated Use closestLocationInRoute instead.
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
  closestPointInRoute: Point;
  closestLocationInRoute: Location;
  distanceToClosestPointInRoute: number;
  currentIndication: number;
  nextIndication: Indication;
  currentStepIndex: number;
  distanceToGoal: number;
  distanceToEndStep: number;
  timeToEndStep: number;
  timeToGoal: number;
  routeStep: RouteStep;
  points: Point[];
  segments: RouteSegment[];
};

/**
 * @name
 * SitumEvent
 * @description
 * An event: POI with radius, conversion area and asociated statistics. It is intended for usage in marketing apps.
 * @property {number} buildingIdentifier - The identifier of the building this floor belongs to. Deprecated, use trigger.center.buildingIdentifier instead
 * @property {number} identifier - Unique identifier of the SitumEvent.
 * @property {number} floorIdentifier - The identifier of the floor this event is located at. @deprecated, use trigger.center.floorIdentifier instead
 * @property {string} infoHtml - Information contained into the event, in HTML format.
 * @property {SitumConversionArea} conversionArea - Location where the event is located. @deprecated, use conversion instead
 * @property {Circle} conversion - Location where the event is located.
 * @property {Circle} trigger - Location where the event should be fired
 * @property {object} customFields - Key-value pairs that allow to extend and fully customize the information associated with the event.
 * @property {number} radius - Radius of the event associated area. @deprecated, use trigger.radius instead
 * @property {string} name - Name of the event
 * @property {number} x - Center of the event in the x-axis. @deprecated, use trigger.center.cartesianCoordinate.x instead
 * @property {number} y - Center of the event in the y-axis. @deprecated, use trigger.center.cartesianCoordinate.y instead
 */

export type SitumEvent = {
  buildingIdentifier: number;
  identifier: number;
  floorIdentifier: number;
  infoHtml: string;
  conversionArea: SitumConversionArea;
  conversion: Circle;
  trigget: Circle;
  customFields: object;
  radius: number;
  name: string;
  x: number;
  y: number;
};

/**
 * @name
 * SitumConversionArea
 * @description
 * A rectangular area of a floor defining the conversion area of an event
 * @property {number} floorIdentifier - The identifier of the floor the SitumConversionArea is located at.
 * @property {object} topLeft - Top-left corner
 * @property {object} topRight - Top-right corner
 * @property {object} bottomLeft - Bottom-left corner
 * @property {object} bottomRight - Bottom-right corner
 */

export type SitumConversionArea = {
  floorIdentifier: number;
  topLeft: object;
  topRight: object;
  bottomLeft: object;
  bottomRight: object;
};

/**
 * @name
 * Circle
 * @description
 * A circular area
 * @property {Point} center - The center of the circle
 * @property {number} radius - The radius of the circle
 */

export type Circle = {
  center: Point;
  radius: number;
};

/**
 * @name
 * LocationOptions
 * @description
 * A data object that contains parameters for the location service, LocationManager.
 * @property {number} buildingIdentifier - Identifier of the building on which the positioning will be started
 * @property {number} interval - Default interval (in milliseconds) to notify location updates
 * @property {string} indoorProvider - Default indoor provider. Possible values are INPHONE and SUPPORT
 * @property {boolean} useBle - Defines whether or not to use BLE for positioning
 * @property {boolean} useWifi - Defines whether or not to use Wi-Fi for positioning
 * @property {boolean} useGps - Defines whether or not to use the GPS for indoor positioning
 * @property {boolean} useBarometer - Defines whether or not to use barometer for indoor positioning
 * @property {string} motionMode - Default motion mode. Possible values are BY_CAR, BY_FOOT and RADIOMAX
 * @property {boolean} useForegroundService - Defines whether or not to activate the {@link http://developers.situm.es/pages/android/using_situm_sdk_background.html foreground service}
 * @property {boolean} useDeadReckoning - Defines whether ot not to use dead reckoning to get fast position updates using only the inertial sensors, between the server position updates.
 * @property {OutdoorLocationOptions} outdoorLocationOptions - Outdoor location options. Only used in an indoor/outdoor request
 * @property {BeaconFilter[]} beaconFilters - Deprecated - Beacon filters to be handled during scan time, otherwise only Situm beacons will be scanned. Can be invoked multiple times to add as much beacon filters as you want. The SitumSDK now does it automatically
 * @property {number} smallestDisplacement - Default smallest displacement to nofiy location updates
 * @property {string} realtimeUpdateInterval - Default interval to send locations to the Realtime. Possible values are REALTIME, FAST, NORMAL, SLOW and BATTERY_SAVER
 * @property {boolean} autoEnableBleDuringPositioning - Set if the BLE should be re-enabled during positioning if the ble is used. Android only
 */

export type LocationRequestOptions = {
  buildingIdentifier: number;
  interval: number;
  indoorProvider: string;
  useBle: boolean;
  useWifi: boolean;
  useGps: boolean;
  useBarometer: boolean;
  motionMode: string;
  useForegroundService: boolean;
  useDeadReckoning: boolean;
  outdoorLocationOptions: OutdoorLocationOptions;
  beaconFilters: BeaconFilter[];
  smallestDisplacement: number;
  realtimeUpdateInterval: string;
  autoEnableBleDuringPositioning: boolean;
};

/**
 * @name
 * LocationRequest
 * @description
 * A data object that contains parameters for the location service, LocationManager.
 * @type {array}
 * @property {Building} building 0 - Building on which the positioning will be started
 * @property {LocationOptions} locationOptions 1 - Location options.
 */

export type LocationRequest = {
  building: Building;
  locationOptions: LocationRequestOptions;
};

/**
 * @name
 * NavigationRequest
 * @description
 * A data object that contains parameters for the navigation service, NavigationManager.
 * @property {number} distanceToChangeIndicationThreshold - Distance threshold from when the next indication is considered reached.
 * @property {number} distanceToFloorChangeThreshold - Distance threshold from when a floor change is considered reached.
 * @property {number} distanceToGoalThreshold - Distance threshold from when the goal is considered reached.
 * @property {number} distanceToIgnoreFirstIndication - Maximum distance to ignore the first indication when navigating a route (Only available for Android).
 * @property {number} ignoreLowQualityLocations - Set if low quality locations should be ignored. (Only available for Android).
 * @property {number} indicationsInterval - Time to wait between indications.
 * @property {number} outsideRouteThreshold - Set the distance to consider the use is outside of the route. A type=userOutsideRoute will be sent trough the NavigationListener .
 * @property {number} roundIndicationsStep - Step that will be used to round indications distance.
 * @property {number} timeToFirstIndication - Time to wait until the first indication is returned.
 * @property {number} timeToIgnoreUnexpectedFloorChanges - Time (in millis) to ignore the locations received during navigation, when the next indication is a floor change, if the locations are in a wrong floor (not in origin or destination floors).
 */

export type NavigationRequest = {
  distanceToIgnoreFirstIndication: number;
  ignoreLowQualityLocations: number;
  distanceToGoalThreshold: number;
  outsideRouteThreshold: number;
  distanceToFloorChangeThreshold: number;
  distanceToChangeIndicationThreshold: number;
  indicationsInterval: number;
  timeToFirstIndication: number;
  roundIndicationsStep: number;
  timeToIgnoreUnexpectedFloorChanges: number;
};

/**
 * @name
 * DirectionsRequest
 * @description
 * A data object that contains the request for directions.
 * @property {Building} positioningBuilding
 * @property {Point|Location} from - Current user's position as the starting point of the route.
 * @property {Point|POI} to - Point to, where the route should end.
 * @property {DirectionsOptions} options - Options that can be added to the request.
 */

export type DirectionsRequest = {
  positioningBuilding: Building;
  from: Point | Location;
  to: Point | Poi;
  options: DirectionsOptions;
};

/**
 * @name
 * DirectionsOptions
 * @description
 * A data object that contains the directions options.
 * @property {boolean} minimizeFloorChanges - Defines wheter or not the route should be calculated minimizing the floor changes even if the result is longer.
 * @property {boolean} accessibleRoute - Deprecated, use accessibilityMode. Defines wheter or not the route has to be suitable for wheel chairs (true) or not (false).
 * @property {boolean} accessible - Deprecated, use accessibilityMode. Defines wheter or not the route has to be suitable for wheel chairs (true) or not (false).
 * @property {string} accessibilityMode - Defines the accessibility mode of the route. Possible values are: CHOOSE_SHORTEST, ONLY_NOT_ACCESSIBLE_FLOOR_CHANGES, ONLY_ACCESSIBLE
 * @property {number} startingAngle - Current user's orientation in degrees.
 */

export type DirectionsOptions = {
  minimizeFloorChanges: boolean;
  accessibleRoute: boolean;
  accessible: boolean;
  assebilityMode: string;
  startingAngle: number;
};

/**
 * @name
 * OutdoorLocationOptions
 * @description
 * Outdoor location options are only used in indoor-outdoor mode (Only available for Android)
 * @property {boolean} continuousMode - Environment detection continuous mode (true) or burst mode (false).
 * @property {boolean} userDefinedThreshold
 * @property {number} burstInterval - Interval to scan for GPS and detect the environment (in seconds).
 * @property {number} averageSnrThreshold
 */

export type OutdoorLocationOptions = {
  continuousMode: boolean;
  userDefinedThreshold: boolean;
  burstInterval: number;
  averageSnrThreshold: number;
};

/**
 * @name
 * BeaconFilter
 * @description
 * Represents a BLE filter. Now the only field is the BLE proximity UUID
 * @property {string} uuid - Assigns the proximity UUID
 */

export type BeaconFilter = {
  uuid: string;
};

/**
 * @name
 * RealTimeRequest
 * @description
 * A data object that contains the parameters to process realtime data of the users.
 * @property {Building} building object
 * @property {int} pollTime - Interval in milliseconds (minimum is 3000ms).
 */

export type RealTimeRequest = {
  building: Building;
  pollTime: number;
};

/**
 * @name
 * RealTimeData
 * @description
 * A data object that contains information of the location of users in realtime.
 * @property {Array<Location>} locations object
 */

export type RealTimeData = {
  locations: Location[];
};

export interface Location {
  position?: Position;
  accuracy?: number;
  bearing?: {
    degrees: number;
    degreesClockwise: number;
  };
  hasBearing?: boolean;
  status: LocationStatusName;
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
export interface LocationStatus {
  statusName: LocationStatusName;
  statusCode: number;
}

export enum LocationStatusName {
  STARTING = "STARTING",
  CALCULATING = "CALCULATING",
  // This status will always be sent to mapviewer-web, in case we recieve
  // a location from SDK.
  POSITIONING = "POSITIONING",
  USER_NOT_IN_BUILDING = "USER_NOT_IN_BUILDING",
  STOPPED = "STOPPED",
}

export interface SDKError {
  code?: number;
  message: string;
}

export interface SDKNavigation {
  //closestPositionInRoute: any;
  currentIndication?: any;
  //currentStepIndex:number;
  //distanceToEndStep: number;
  distanceToGoal?: number;
  //nextIndication: any;
  points?: any;
  routeStep?: any;
  segments?: any;
  route?: Directions;
  //timeToEndStep: number;
  //timeToGoal: number;
  type?: NavigationUpdateType;
  status: NavigationStatus;
}

export enum NavigationStatus {
  START = "start",
  STOP = "stop",
  UPDATE = "update",
}

export enum NavigationUpdateType {
  progress = "PROGRESS",
  userOutsideRoute = "OUT_OF_ROUTE",
  destinationReached = "DESTINATION_REACHED",
}

export type NavigateToPoiType = {
  navigationTo: number;
  type?: string;
};

export interface SitumPluginStatic {
  initSitumSDK(): void;

  setApiKey(
    email: string,
    apiKey: string,
    callback?: (success: boolean) => void
  ): void;

  setUserPass(
    email: string,
    password: string,
    callback?: (success: boolean) => void
  ): void;

  setCacheMaxAge(cacheAge: number, callback?: (success: boolean) => void): void;

  fetchBuildings(
    success: (buildings: Array<Building>) => void,
    error?: (error: string) => void
  ): void;

  fetchBuildingInfo(
    building: Building,
    success: (building: Building) => void,
    error?: (error: string) => void
  ): void;

  fetchFloorsFromBuilding(
    building: Building,
    success: (floors: Array<Floor>) => void,
    error?: (error: string) => void
  ): void;

  fetchMapFromFloor(floor: Floor, success: Function, error: Function): void;

  fetchGeofencesFromBuilding(
    building: Building,
    success: (geofence: Array<Geofence>) => void,
    error?: (error: string) => void
  ): void;

  startPositioning(
    location: (location: Location) => void,
    status: Function,
    error?: Function,
    locationOptions: LocationRequestOptions
  ): void;

  stopPositioning(success: Function, error?: Function): void;

  requestDirections(
    directionParams: Array<any>,
    success: (route: Route) => void,
    error?: Function
  ): void;

  fetchPoiCategories(success: Function, error?: Function): void;

  fetchPoiCategoryIconNormal(
    category: PoiCategory,
    success: Function,
    error?: Function
  ): void;

  fetchPoiCategoryIconSelected(
    category: PoiCategory,
    success: Function,
    error?: Function
  ): void;

  requestNavigationUpdates(
    navigationUpdates: Function,
    error?: Function,
    options?: LocationOptions
  ): void;

  updateNavigationWithLocation(
    location,
    success: Function,
    error?: Function
  ): void;

  removeNavigationUpdates(callback?: Function): void;

  fetchIndoorPOIsFromBuilding(
    building: Building,
    success: Function,
    error?: Function
  ): void;

  fetchOutdoorPOIsFromBuilding(
    building: Building,
    success: Function,
    error?: Function
  ): void;

  fetchEventsFromBuilding(
    building: Building,
    success: Function,
    error?: Function
  ): void;

  requestRealTimeUpdates(
    navigationUpdates: Function,
    error?: Function,
    request?: RealTimeRequest
  ): void;

  removeRealTimeUpdates(callback?: Function): void;

  checkIfPointInsideGeofence(request: any, callback?: Function): void;

  invalidateCache(callback: Function): void;
}

declare let SitumPlugin: SitumPluginStatic;
export default SitumPlugin;
