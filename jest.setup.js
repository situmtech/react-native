import {NativeModules} from 'react-native';

/* eslint-env jest */

// Mock the RNCSitumPlugin native module to allow us to unit test the JavaScript code
NativeModules.RNCSitumPlugin = {
  addListener: jest.fn(),
  removeListeners: jest.fn(),

  // setup SDK
  initSitumSDK: jest.fn(),
  setApiKey: jest.fn(),
  setUserPass: jest.fn(),
  setCacheMaxAge: jest.fn(),
  requestAuthorization: jest.fn(),

  // Buildings
  fetchBuildings: jest.fn(),
  fetchBuildingInfo: jest.fn(),
  fetchFloorsFromBuilding: jest.fn(),
  fetchMapFromFloor: jest.fn(),
  fetchGeofencesFromBuilding: jest.fn(),

  //positioning
  startPositioning: jest.fn(),
  startPositioningUpdates: jest.fn(),
  stopPositioning: jest.fn(),

  //directions, route
  requestDirections: jest.fn(),
};

// Reset the mocks before each test
global.beforeEach(() => {
  jest.resetAllMocks();
});
