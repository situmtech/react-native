/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  DirectionPoint,
  Directions,
  Location,
  NavigationProgress,
} from "../../sdk/types";
import type {
  Destination,
  NavigateToPointPayload,
  NavigateToPoiPayload,
  Navigation,
} from "../types";

const mapperWrapper = (type: string, payload: unknown) => {
  return JSON.stringify({ type, payload });
};

const Mapper = {
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
        point: {
          buildingIdentifier:
            navigation.to.buildingIdentifier ||
            navigation.TO.buildingIdentifier,
          floorIdentifier:
            navigation.to.floorIdentifier || navigation.TO.floorIdentifier,
          coordinate: {
            latitude:
              navigation.to.coordinate.latitude ||
              navigation.TO.coordinate.latitude,
            longitude:
              navigation.to.coordinate.longitude ||
              navigation.TO.coordinate.longitude,
          },
        } as DirectionPoint,
      } as Destination,
    } as Navigation;
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

export default Mapper;
