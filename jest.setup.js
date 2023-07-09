import { NativeModules } from "react-native";

/* eslint-env jest */

// Mock the RNCSitumPlugin native module to allow us to unit test the JavaScript code
NativeModules.RNCSitumPlugin = {
  addListener: jest.fn(),
  removeListeners: jest.fn(),

  // Config SDK
  initSitumSDK: jest.fn(),
  setApiKey: jest.fn(),
  setUserPass: jest.fn(),
  setCacheMaxAge: jest.fn(),
  invalidateCache: jest.fn(),
  requestAuthorization: jest.fn(),

  // Buildings
  fetchBuildings: jest.fn(),
  fetchBuildingInfo: jest.fn(),
  fetchFloorsFromBuilding: jest.fn(),
  fetchMapFromFloor: jest.fn(),
  fetchGeofencesFromBuilding: jest.fn(),
  checkIfPointInsideGeofence: jest.fn(),
  fetchIndoorPOIsFromBuilding: jest.fn(),
  fetchOutdoorPOIsFromBuilding: jest.fn(),
  fetchEventsFromBuilding: jest.fn(),

  // Positioning
  startPositioning: jest.fn(),
  startPositioningUpdates: jest.fn(),
  stopPositioning: jest.fn(),

  // Directions, route
  requestDirections: jest.fn(),

  // POIs
  fetchPoiCategories: jest.fn(),
  fetchPoiCategoryIconNormal: jest.fn(),
  fetchPoiCategoryIconSelected: jest.fn(),

  // Navigations
  requestNavigationUpdates: jest.fn(),
  updateNavigationWithLocation: jest.fn(),
  removeNavigationUpdates: jest.fn(),

  // Realtime
  requestRealTimeUpdates: jest.fn(),
  removeRealTimeUpdates: jest.fn()
};

// Reset the mocks before each test
global.beforeEach(() => {
  jest.resetAllMocks();
});
