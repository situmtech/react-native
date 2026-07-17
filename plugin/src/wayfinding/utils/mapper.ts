/* eslint-disable @typescript-eslint/no-explicit-any */
import { SitumAuth } from "../../sdk/authStore";
import { LocationStatusName } from "../../sdk";
import type {
  Location,
  NavigationProgress,
  Point,
} from "../../sdk/types";
import type {
  CartographySelectionOptions,
  MapViewDirectionsOptions,
  NavigateToCarPayload,
  NavigateToPointPayload,
  NavigateToPoiPayload,
  OnNavigationResult,
  SearchFilter,
  ViewerConfigItem,
  ShareLiveLocationSessionPayload,
} from "../types";

export const createPoint = (payload: any): Point => {
  return {
    buildingIdentifier: payload.buildingIdentifier,
    floorIdentifier: payload.floorIdentifier,
    cartesianCoordinate: payload.cartesianCoordinate,
    coordinate: payload.coordinate,
  };
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
  selectFloor: (
    floorIdentifier: number,
    options?: CartographySelectionOptions,
  ) => {
    return mapperWrapper(`cartography.select_floor`, {
      identifier: floorIdentifier,
      options,
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
  navigateToPoi: (navigate: NavigateToPoiPayload) => {
    return mapperWrapper(`navigation.start`, {
      navigationTo: navigate?.identifier,
      type: navigate.accessibilityMode,
    });
  },
  navigateToCar: (params?: NavigateToCarPayload) => {
    return mapperWrapper(`navigation.start.to_car`, {
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
  setConfigItems: (configItems: ViewerConfigItem[]) => {
    return mapperWrapper(`app.set_config_item`, configItems);
  },
  // Share Live Lovation
  setShareLiveLocationSession: (session: ShareLiveLocationSessionPayload) => {
    return mapperWrapper(
      "share_location.set_shared_session_identifier",
      session,
    );
  },
  // Auth
  setAuth: (auth: SitumAuth) => {
    return mapperWrapper(
      "app.set_auth",
      auth.type === "jwt"
        ? { jwt: auth.value }
        : { apikey: auth.value }
    )
  },
};

export default ViewerMapper;
