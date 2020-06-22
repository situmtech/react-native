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
}

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
}

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
}

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
}

export type LocationRequestOptions = {
  buildingIdentifier?: string
  useWifi?: boolean;
  useBle?: boolean;
  useForegroundService?: number;
};


export interface SitumPluginStatic {

  initSitumSDK(): void;

  setApiKey(
    email: string,
    apiKey: string,
    callback?: (success: boolean) => void,
  ): void;

  setUserPass(
    email: string,
    password: string,
    callback?: (success: boolean) => void,
  ): void;

  setCacheMaxAge(cacheAge: number, callback?: (success: boolean) => void): void;

  fetchBuildings(
    success: (buildings: Array<Building>) => void,
    error?: (error: string) => void,
  ): void;

  fetchBuildingInfo(
    building: Building,
    success: (building: Building) => void,
    error?: (error: string) => void,
  ): void;

  fetchFloorsFromBuilding(
    building: Building,
    success: (floors: Array<Floor>) => void,
    error?: (error: string) => void,
  ): void;

  fetchMapFromFloor(floor: Floor, success: Function, error: Function): void;

  fetchGeofencesFromBuilding(
    building: Building,
    success: (geofence: Array<Geofence>) => void,
    error?: (error: string) => void,
  ): void;

  startPositioning(
    location: (location: Location) => void,
    status: Function,
    error?: Function,
    locationOptions: LocationRequestOptions,
  ): number;

  stopPositioning(
    subscriptionId: number,
    success: Function,
    error?: Function,
  ): void;
  
  requestDirections(
    directionParams: Array<any>,
    success: (route: Route) => void,
    error?: Function,
  ): void;

  invalidateCache(callback: Function): void;
}

declare let SitumPlugin: SitumPluginStatic;
export default SitumPlugin;
