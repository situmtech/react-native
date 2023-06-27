import { RNCSitumPlugin, SitumPluginEventEmitter } from './nativeInterface';
import invariant from 'invariant';
import { logError } from './utils';
import packageJson from '../../package.json';
import { Platform } from 'react-native';

let positioningSubscriptions = [];
let navigationSubscriptions = [];
let realtimeSubscriptions = [];

const SitumPlugin = {
  initSitumSDK: function () {
    RNCSitumPlugin.initSitumSDK();
  },

  setApiKey: function (email: string, apiKey: string, success?: Function) {
    RNCSitumPlugin.setApiKey(email, apiKey, success);
  },

  setUserPass: function (email: string, password: string, success?: Function) {
    RNCSitumPlugin.setUserPass(email, password, success);
  },

  setDashboardURL: function (url: string, success: Function) {
    RNCSitumPlugin.setDashboardURL(url, success);
  },

  setUseRemoteConfig(useRemoteConfig: string, success?: Function) {
    RNCSitumPlugin.setUseRemoteConfig(useRemoteConfig, success);
  },

  setCacheMaxAge: function (cacheAge: number, success?: Function) {
    RNCSitumPlugin.setCacheMaxAge(cacheAge, success);
  },

  fetchBuildings: function (success: Function, error?: Function) {
    invariant(
      typeof success === 'function',
      'Must provide a valid success callback.',
    );

    RNCSitumPlugin.fetchBuildings(success, error || logError);
  },

  fetchBuildingInfo: function (
    building: Building,
    success: Function,
    error?: Function,
  ) {
    invariant(
      typeof success === 'function',
      'Must provide a valid success callback.',
    );

    RNCSitumPlugin.fetchBuildingInfo(building, success, error || logError);
  },

  fetchTilesFromBuilding: function (
    building: Building,
    success: Function,
    error?: Function,
  ) {
    invariant(
      typeof success === 'function',
      'Must provide a valid success callback.',
    );
    RNCSitumPlugin.fetchTilesFromBuilding(building, success, error || logError);
  },

  fetchFloorsFromBuilding: function (
    building: Building,
    success: Function,
    error?: Function,
  ) {
    invariant(
      typeof success === 'function',
      'Must provide a valid success callback.',
    );

    RNCSitumPlugin.fetchFloorsFromBuilding(
      building,
      success,
      error || logError,
    );
  },

  fetchMapFromFloor: function (
    floor: Floor,
    success: Function,
    error?: Function,
  ) {
    invariant(
      typeof success === 'function',
      'Must provide a valid success callback.',
    );

    RNCSitumPlugin.fetchMapFromFloor(floor, success, error || logError);
  },

  fetchGeofencesFromBuilding: function (
    building: Building,
    success: Function,
    error?: Function,
  ) {
    invariant(
      typeof success === 'function',
      'Must provide a valid success callback.',
    );

    RNCSitumPlugin.fetchGeofencesFromBuilding(
      building,
      success,
      error || logError,
    );
  },

  requestAuthorization: function () {
    RNCSitumPlugin.requestAuthorization();
  },

  startPositioning: function (
    location: Function,
    status: Function,
    error?: Function,
    options?: LocationRequestOptions,
  ): void {
    this.requestAuthorization();
    return this.startPositioningUpdates(
      location,
      status,
      error || logError,
      options || {},
    );
  },

  startPositioningUpdates: function (
    location: Function,
    status: Function,
    error?: Function,
    options?: LocationRequestOptions,
  ) {
    // Remove old positioning subscriptions:
    positioningSubscriptions.forEach(subscription => subscription?.remove());
    positioningSubscriptions = [];

    positioningSubscriptions.push(
      SitumPluginEventEmitter.addListener('locationChanged', location),
      SitumPluginEventEmitter.addListener('statusChanged', status),
      error
        ? SitumPluginEventEmitter.addListener(
          'locationError',
          error || logError,
        )
        : null,
    );
    // Call native:
    RNCSitumPlugin.startPositioning(options || {});
  },

  stopPositioning: function (callback?: Function) {
    RNCSitumPlugin.stopPositioning(callback || logError);
  },

  requestDirections: function (
    directionParams: Array,
    success: Function,
    error?: Function,
  ) {
    invariant(
      typeof success === 'function',
      'Must provide a valid success callback.',
    );

    RNCSitumPlugin.requestDirections(
      directionParams,
      success,
      error || logError,
    );
  },

  fetchPoiCategories: function (success: Function, error?: Function) {
    invariant(
      typeof success === 'function',
      'Must provide a valid success callback.',
    );

    RNCSitumPlugin.fetchPoiCategories(success, error || logError);
  },

  fetchPoiCategoryIconNormal: function (
    category: any,
    success: Function,
    error?: Function,
  ) {
    invariant(
      typeof success === 'function',
      'Must provide a valid success callback.',
    );

    RNCSitumPlugin.fetchPoiCategoryIconNormal(
      category,
      success,
      error || logError,
    );
  },

  fetchPoiCategoryIconSelected: function (
    category: any,
    success: Function,
    error?: Function,
  ) {
    invariant(
      typeof success === 'function',
      'Must provide a valid success callback.',
    );

    RNCSitumPlugin.fetchPoiCategoryIconSelected(
      category,
      success,
      error || logError,
    );
  },

  requestNavigationUpdates: function (
    navigationUpdates: Function,
    error?: Function,
    options?: LocationRequestOptions,
  ) {
    RNCSitumPlugin.requestNavigationUpdates(options || {});
    navigationSubscriptions.push(
      SitumPluginEventEmitter.addListener(
        'navigationUpdated',
        navigationUpdates,
      ),
    );
    navigationSubscriptions.push(
      error
        ? SitumPluginEventEmitter.addListener(
          'navigationError',
          error || logError,
        )
        : null,
    );
  },

  updateNavigationWithLocation: function (
    location,
    success: Function,
    error?: Function,
  ) {
    if (navigationSubscriptions.length === 0) {
      error('No active navigation!!');
      return;
    }

    RNCSitumPlugin.updateNavigationWithLocation(
      location,
      success,
      error || logError,
    );
  },

  removeNavigationUpdates: function (callback?: Function) {
    for (let i = 0; i < navigationSubscriptions.length; i++) {
      navigationSubscriptions[i].remove();
    }

    navigationSubscriptions = [];
    RNCSitumPlugin.removeNavigationUpdates(callback || logError);
  },

  fetchIndoorPOIsFromBuilding: function (
    building: any,
    success: Function,
    error?: Function,
  ) {
    invariant(
      typeof success === 'function',
      'Must provide a valid success callback.',
    );

    RNCSitumPlugin.fetchIndoorPOIsFromBuilding(
      building,
      success,
      error || logError,
    );
  },

  fetchOutdoorPOIsFromBuilding: function (
    building: any,
    success: Function,
    error?: Function,
  ) {
    invariant(
      typeof success === 'function',
      'Must provide a valid success callback.',
    );

    RNCSitumPlugin.fetchOutdoorPOIsFromBuilding(
      building,
      success,
      error || logError,
    );
  },

  fetchEventsFromBuilding: function (
    building: any,
    success: Function,
    error?: Function,
  ) {
    invariant(
      typeof success === 'function',
      'Must provide a valid success callback.',
    );

    RNCSitumPlugin.fetchEventsFromBuilding(
      building,
      success,
      error || logError,
    );
  },

  requestRealTimeUpdates: function (
    navigationUpdates: Function,
    error?: Function,
    options?: any,
  ) {
    RNCSitumPlugin.requestRealTimeUpdates(options || {});
    realtimeSubscriptions.push([
      SitumPluginEventEmitter.addListener('realtimeUpdated', navigationUpdates),
      error
        ? SitumPluginEventEmitter.addListener(
          'realtimeError',
          error || logError,
        )
        : null,
    ]);
  },

  removeRealTimeUpdates: function (callback?: Function) {
    realtimeSubscriptions = [];
    RNCSitumPlugin.removeRealTimeUpdates();
  },

  checkIfPointInsideGeofence: function (request: any, callback?: Function) {
    invariant(
      typeof callback === 'function',
      'Must provide a valid success callback.',
    );

    RNCSitumPlugin.checkIfPointInsideGeofence(request, callback);
  },

  invalidateCache: function () {
    RNCSitumPlugin.invalidateCache();
  },

  sdkVersions: function (callback: Function) {
    var versions = {
      react_native: packageJson.version,
    };

    if (Platform.OS === 'ios') {
      versions.ios = packageJson.sdkVersions.ios;
    } else {
      versions.android = packageJson.sdkVersions.android;
    }

    callback(versions);
  },

  getDeviceId: function (callback: Function) {
    RNCSitumPlugin.getDeviceId(callback);
  },

  onEnterGeofences: function (callback: Function) {
    RNCSitumPlugin.onEnterGeofences();
    // Adopts SDK behavior (setter):
    SitumPluginEventEmitter.removeAllListeners('onEnterGeofences');
    SitumPluginEventEmitter.addListener('onEnterGeofences', callback);
  },

  onExitGeofences: function (callback: Function) {
    RNCSitumPlugin.onExitGeofences();
    SitumPluginEventEmitter.removeAllListeners('onExitGeofences');
    SitumPluginEventEmitter.addListener('onExitGeofences', callback);
  },
};

module.exports = SitumPlugin;
