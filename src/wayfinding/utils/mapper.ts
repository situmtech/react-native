/* eslint-disable @typescript-eslint/no-explicit-any */
import { AccessibilityMode, LocationStatusName } from "../../sdk";
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
  MapViewDirectionsOptions,
  NavigateToCarPayload,
  NavigateToPointPayload,
  NavigateToPoiPayload,
  Navigation,
  OnNavigationResult,
  SearchFilter,
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
    bearingFrom: payload.bearingFrom?.radians || 0,
    accessibilityMode:
      payload.accessibilityMode || AccessibilityMode.CHOOSE_SHORTEST,
    minimizeFloorChanges: payload.minimizeFloorChanges || false,
    includedTags: payload.includedTags || [],
    excludedTags: payload.excludedTags || [],
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

const mapperWrapper = (type: string, payload?: unknown) => {
  return JSON.stringify({ type, payload: payload ?? {} });
};

const ViewerMapper = {
  // Configuration
  followUser: (follow: boolean) => {
    return mapperWrapper("camera.follow_user", { value: follow });
  },
  setLanguage: (lang: string) => {
    return mapperWrapper("ui.set_language", lang);
  },
  setFavoritePois: (poiIds: number[]) => {
    return mapperWrapper("ui.set_favorite_pois", poiIds);
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
  selectCar: () => {
    return mapperWrapper(`cartography.select_car`);
  },
  selectPoiCategory: (categoryId: number) => {
    return mapperWrapper(`cartography.select_poi_category`, {
      identifier: categoryId,
    });
  },
  setDirectionsOptions: (directionsOptions: MapViewDirectionsOptions) => {
    return mapperWrapper(`directions.set_options`, {
      includedTags: directionsOptions.includedTags,
      excludedTags: directionsOptions.excludedTags,
    });
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
    });
  },
  locationStatus: (locationStatus: LocationStatusName) => {
    return mapperWrapper("location.update_status", { status: locationStatus });
  },
  locationError: (errorCode: string) => {
    return mapperWrapper("location.update_status", { status: errorCode });
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
  navigateToCar: (params?: NavigateToCarPayload) => {
    return mapperWrapper(`navigation.to_car`, {
      type: params?.accessibilityMode,
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
  search: (searchFilter: SearchFilter) => {
    return mapperWrapper(`ui.set_search_filter`, {
      text: searchFilter.text,
      poiCategoryIdentifier: searchFilter.poiCategoryIdentifier,
    });
  },
};

export default ViewerMapper;
