/* eslint-disable @typescript-eslint/no-explicit-any */
import { AccessibilityMode } from "../../sdk";
import type {
  Directions,
  DirectionsRequest,
  Location,
  NavigationProgress,
  NavigationRequest,
  Point,
} from "../../sdk/types";
import type {
  DirectionsMessage,
  NavigateToPointPayload,
  NavigateToPoiPayload,
  Navigation,
  OnNavigationResult,
} from "../types";

export const createPoint = (payload: any): Point => {
  return {
    buildingIdentifier: payload.buildingIdentifier,
    floorIdentifier: payload.floorIdentifier,
    cartesianCoordinate: payload.cartesianCoordinate,
    coordinate: payload.coordinate,
  };
};

export const createDirectionsMessage = (payload: any): DirectionsMessage => {
  return {
    buildingIdentifier: payload.buildingIdentifier,
    originIdentifier: (payload.originIdentifier || -1).toString(),
    originCategory: payload.originCategory,
    destinationIdentifier: (payload.destinationIdentifier || -1).toString(),
    destinationCategory: payload.destinationCategory,
    identifier: (payload.identifier || "").toString(),
  };
};

export const createDirectionsRequest = (payload: any): DirectionsRequest => {
  return {
    buildingIdentifier: payload.from.buildingIdentifier,
    to: createPoint(payload.to),
    from: createPoint(payload.from),
    bearingFrom: payload.bearingFrom || 0,
    accessibilityMode:
      payload.accessibilityMode || AccessibilityMode.CHOOSE_SHORTEST,
    minimizeFloorChanges: payload.minimizeFloorChanges || false,
  };
};

export const createNavigationRequest = (payload: any): NavigationRequest => {
  const navigationRequest = {
    distanceToGoalThreshold: payload.distanceToGoalThreshold,
    outsideRouteThreshold: payload.outsideRouteThreshold,
    distanceToIgnoreFirstIndication: payload.distanceToIgnoreFirstIndication,
    distanceToFloorChangeThreshold: payload.distanceToFloorChangeThreshold,
    distanceToChangeIndicationThreshold:
      payload.distanceToChangeIndicationThreshold,
    indicationsInterval: payload.indicationsInterval,
    timeToFirstIndication: payload.timeToFirstIndication,
    roundIndicationsStep: payload.roundIndicationsStep,
    timeToIgnoreUnexpectedFloorChanges:
      payload.timeToIgnoreUnexpectedFloorChanges,
    ignoreLowQualityLocations: payload.ignoreLowQualityLocations,
  };

  return Object.fromEntries(
    Object.entries(navigationRequest || {}).filter(
      ([_, value]) => value !== undefined
    )
  );
};

const mapperWrapper = (type: string, payload: unknown) => {
  return JSON.stringify({ type, payload });
};

const ViewerMapper = {
  // Configuration
  followUser: (follow: boolean) => {
    return mapperWrapper("camera.follow_user", { value: follow });
  },
  setLanguage: (lang: string) => {
    return mapperWrapper("ui.set_language", lang);
  },
  initialConfiguration: (style: any) => {
    return mapperWrapper("ui.initial_configuration", {
      ...(style && {
        style: style,
      }),
    });
  },
  // Cartography
  selectPoi: (poiId: number | null) => {
    return mapperWrapper(`cartography.select_poi`, { identifier: poiId });
  },
  // Location
  location: (location: Location) => {
    return mapperWrapper("location.update", {
      ...(location.position && {
        latitude: location.position.coordinate.latitude,
        longitude: location.position.coordinate.longitude,
        x: location.position.cartesianCoordinate.x,
        y: location.position.cartesianCoordinate.y,
        buildingId: location.position.buildingIdentifier,
        floorId: location.position.floorIdentifier,
        bearing: location.bearing?.degreesClockwise,
        isIndoor: location.position.isIndoor,
        isOutdoor: location.position.isOutdoor,
        accuracy: location.accuracy,
        hasBearing: location.hasBearing,
      }),
      status: location.status,
    });
  },
  locationStatus: (locationStatus: Location["status"]) => {
    return mapperWrapper("location.update_status", { status: locationStatus });
  },
  // Directions
  route: (directions: Directions) => {
    return mapperWrapper("directions.update", directions);
  },
  routeToResult: (route: any): OnNavigationResult => {
    return {
      navigation: {
        status: route.status,
        destination: {
          category: route?.destinationId ? "POI" : "COORDINATE",
          identifier: route?.destinationId,
          //name:, //TODO
          point: route.to ? createPoint(route.to) : createPoint(route.TO),
        },
      },
    };
  },
  // Navigation
  navigation: (navigation: Navigation) => {
    return mapperWrapper(`navigation.${navigation.status}`, navigation);
  },
  navigateToPoi: (navigate: NavigateToPoiPayload) => {
    return mapperWrapper(`navigation.start`, {
      navigationTo: navigate?.identifier,
      type: navigate.accessibilityMode,
    });
  },
  navigateToPoint: ({
    lat,
    lng,
    floorIdentifier,
    navigationName,
    accessibilityMode,
  }: NavigateToPointPayload) => {
    return mapperWrapper(`navigation.start`, {
      lat,
      lng,
      floorIdentifier,
      navigationName,
      type: accessibilityMode,
    });
  },
  cancelNavigation: () => {
    return mapperWrapper(`navigation.cancel`, {});
  },
  navigationToResult: (navigation: NavigationProgress): OnNavigationResult => {
    return {
      navigation: {
        status: navigation?.type,
      },
    };
  },
};

export default ViewerMapper;
