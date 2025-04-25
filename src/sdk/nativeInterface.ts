import {
  NativeEventEmitter,
  type NativeModule,
  NativeModules,
} from "react-native";

import type {
  Building,
  BuildingInfo,
  Directions,
  DirectionsOptions,
  Error,
  Floor,
  Geofence,
  Location,
  LocationRequest,
  NavigationRequest,
  Poi,
  PoiCategory,
  PoiIcon,
  Point,
  UserHelperOptions,
} from "./types";

interface CartographyAPI {
  fetchBuildings: (
    onSuccess: (response: Building[]) => void,
    onError: (error: Error) => void
  ) => void;
  fetchBuildingInfo: (
    bluilding: Building,
    onSuccess: (response: BuildingInfo) => void,
    onError: (error: Error) => void
  ) => void;
  fetchTilesFromBuilding: (
    building: Building,
    onSuccess: (response: string) => void,
    onError: (error: Error) => void
  ) => void;
  fetchFloorsFromBuilding: (
    building: Building,
    onSuccess: (response: Floor[]) => void,
    onError: (error: Error) => void
  ) => void;
  fetchMapFromFloor: (
    floor: Floor,
    onSuccess: (response: string) => void,
    onError: (error: Error) => void
  ) => void;
  fetchGeofencesFromBuilding: (
    building: Building,
    onSuccess: (response: Geofence[]) => void,
    onError: (error: Error) => void
  ) => void;
  fetchPoiCategories: (
    onSuccess: (response: PoiCategory[]) => void,
    onError: (error: Error) => void
  ) => void;
  fetchPoiCategoryIconNormal: (
    category: PoiCategory,
    onSuccess: (response: PoiIcon) => void,
    onError: (error: Error) => void
  ) => void;
  fetchPoiCategoryIconSelected: (
    category: PoiCategory,
    onSuccess: (response: PoiIcon) => void,
    onError: (error: Error) => void
  ) => void;
  fetchIndoorPOIsFromBuilding: (
    building: Building,
    onSuccess: (response: Poi[]) => void,
    onError: (error: Error) => void
  ) => void;
  fetchOutdoorPOIsFromBuilding: (
    building: Building,
    onSuccess: (response: Poi[]) => void,
    onError: (error: Error) => void
  ) => void;
  checkIfPointInsideGeofence: (
    request: any,
    callback: (response: { isInsideGeofence: boolean; geofence: any }) => void
  ) => void;
  onEnterGeofences: () => void;
  onExitGeofences: () => void;
}

interface LocationAPI {
  startPositioning: (locationRequest?: LocationRequest) => void;
  stopPositioning: (callback: (response: { success: boolean }) => void) => void;
}

interface NavigationAPI {
  updateNavigationWithLocation: (
    location: Location,
    onSuccess: (response: void) => void,
    onError: (error: Error) => void
  ) => void;
  updateNavigationState: (externalNavigation: Map<string, any>) => void;
}

interface DirectionsAPI {
  requestDirections: (
    directionsParameters: (
      | Building
      | (Point | Location | Poi)
      | DirectionsOptions
    )[],
    onSuccess: (response: Directions) => void,
    onError: (error: Error) => void
  ) => void;
  requestNavigationUpdates: (navigationOptions: NavigationRequest) => void;
  removeNavigationUpdates: (
    callback: (response: { success: boolean }) => void
  ) => void;
}

export interface SitumPluginInterface
  extends NativeModule,
    CartographyAPI,
    LocationAPI,
    NavigationAPI,
    DirectionsAPI {
  initSitumSDK: () => void;
  setApiKey: (
    email: string,
    apiKey: string,
    callback: (response: { success: boolean }) => void
  ) => void;
  setUserPass: (
    email: string,
    password: string,
    callback: (response: { success: boolean }) => void
  ) => void;
  setDashboardURL: (
    url: string,
    callback: (response: { success: boolean }) => void
  ) => void;
  setUseRemoteConfig: (
    useRemoteConfig: string,
    callback: (response: { success: boolean }) => void
  ) => void;
  setCacheMaxAge: (
    cacheAge: number,
    callback: (response: { success: boolean }) => void
  ) => void;
  invalidateCache: () => void;
  getDeviceId: (callback: (response: string) => void) => void;
  requestRealTimeUpdates: (options: any) => void;
  removeRealTimeUpdates: () => void;
  validateMapViewProjectSettings: () => void;
  configureUserHelper: (
    userHelperOptions: UserHelperOptions,
    success: (response: any) => void,
    error: (response: any) => void
  ) => void;
}

const { RNCSitumPlugin } = NativeModules;

if (!RNCSitumPlugin) {
  throw new Error("react-native-situm-plugin: NativeModule is null");
}

let nativeEventEmitter = null;

module.exports = {
  RNCSitumPlugin,
  get SitumPluginEventEmitter() {
    if (!nativeEventEmitter) {
      nativeEventEmitter = new NativeEventEmitter(RNCSitumPlugin);
    }
    return nativeEventEmitter;
  },
};
