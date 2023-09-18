/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  Directions,
  Location,
  NavigationProgress,
  Poi,
  Point,
} from "../../sdk/types";
import type {
  NavigateToPointPayload,
  NavigateToPoiPayload,
  Navigation,
} from "../types";

export const poiToPoint = (poi: Poi): Point => {
  return {
    floorIdentifier: poi.floorIdentifier,
    buildingIdentifier: poi.buildingIdentifier,
    cartesianCoordinate: poi.cartesianCoordinate,
    coordinate: poi.coordinate,
  };
};

export const locationToPoint = (location: Location): Point => {
  return {
    floorIdentifier: location.position.floorIdentifier,
    buildingIdentifier: location.position.buildingIdentifier,
    cartesianCoordinate: location.position.cartesianCoordinate,
    coordinate: location.position.coordinate,
  };
};

export const destinationToPoint = (destination: Point): Point => {
  return {
    buildingIdentifier: destination.buildingIdentifier,
    floorIdentifier: destination.floorIdentifier,
    cartesianCoordinate: destination.cartesianCoordinate,
    coordinate: destination.coordinate,
  };
};

const mapperWrapper = (type: string, payload: unknown) => {
  return JSON.stringify({ type, payload });
};

const ViewerMapper = {
  // Configuration
  followUser: (follow: boolean) => {
    return mapperWrapper("camera.follow_user", follow);
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
    return mapperWrapper("location_status.update", locationStatus);
  },
  // Directions
  route: (directions: Directions) => {
    return mapperWrapper("directions.update", directions);
  },
  routeToResult: (navigation: any): Navigation => {
    return {
      status: navigation.status,
      destination: {
        category: navigation?.destinationId ? "POI" : "COORDINATE",
        identifier: navigation?.destinationId,
        //name:, //TODO
        point: navigation.to
          ? destinationToPoint(navigation.to)
          : destinationToPoint(navigation.TO),
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
  navigationToResult: (navigation: NavigationProgress): Navigation => {
    return {
      status: navigation?.type,
    };
  },
};

export default ViewerMapper;
