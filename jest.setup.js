import {NativeModules} from 'react-native';

/* eslint-env jest */

// Mock the RNCSitumPlugin native module to allow us to unit test the JavaScript code
NativeModules.RNCSitumPlugin = {
  initSitumSDK: jest.fn(),
  setApiKey: jest.fn(),
  setUserPass: jest.fn(),
  setCacheMaxAge: jest.fn(),
};

// Reset the mocks before each test
global.beforeEach(() => {
  jest.resetAllMocks();
});
