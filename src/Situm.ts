class Situm {
  setAPiKey: (email: string, apiKey: string) => {};
  setUserPass: (email: string, password: string) => {};
  setCacheMaxAge: (cacheAge: number, password: string) => {};
  fetchBuildingInfo: (dict: any) => {};
  fetchBuildings: (dict: any) => {};
  fetchGeofencesFromBuilding: (dict: any) => {};
  fetchFloorsFromBuilding: (dict: any) => {};
  fetchIndoorPOIsFromBuilding: (dict: any) => {};
  fetchEventsFromBuilding: (dict: any) => {};
  fetchPoiCategories: (dict: any) => {};
  fetchPoiCategoryIconNormal: (dict: any) => {};
  fetchPoiCategoryIconSelected: (dict: any) => {};
  fetchMapFromFloor: (dict: any) => {};
  startPositioning: (callbackId: string) => {};
  stopPositioning: (callbackId: string) => {};
  requestDirections: (callbackId: string) => {};
  requestNavigationUpdates: (callbackId: string) => {};
  removeNavigationUpdates: () => {};
  updateNavigationWithLocation: (dict: any) => {};
  requestRealTimeUpdates: (dict: any) => {};
  removeRealTimeUpdates: () => {};
  invalidateCache: () => {};
}

import {NativeModules} from 'react-native';
export = NativeModules.SitumPlugin;
