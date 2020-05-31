import {PermissionsAndroid} from 'react-native';
import {RNCSitumPlugin, SitumPluginEventEmitter} from './nativeInterface';
import invariant from 'invariant';
import {logError, warning} from './utils';

let subscriptions = [];

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
  ) {
    this.requestAuthorization();
    return this.startPositioningUpdates(location, status, error, options);
  },

  startPositioningUpdates: function (
    location: Function,
    status: Function,
    error?: Function,
    options?: LocationRequestOptions,
  ): number {
    RNCSitumPlugin.startPositioning(options);
    const subscriptionId = subscriptions.length;
    subscriptions.push([
      SitumPluginEventEmitter.addListener('locationChanged', location),
      SitumPluginEventEmitter.addListener('statusChanged', status),
      error
        ? SitumPluginEventEmitter.addListener(
            'locationError',
            error || logError,
          )
        : null,
    ]);

    return subscriptionId;
  },

  stopPositioning: function (
    subscriptionId: number,
    success: Function,
    error?: Function,
  ) {
    const sub = subscriptions[subscriptionId];
    if (!sub) {
      // Silently exit when the watchID is invalid or already cleared
      // This is consistent with timers
      return;
    }

    sub[0].remove(); //locationChange
    sub[1].remove(); //statusChange
    const sub2 = sub[2];
    sub2 && sub2.remove(); //locationError if exists

    subscriptions[subscriptionId] = undefined;

    let noSubscriptions = true;
    for (let ii = 0; ii < subscriptions.length; ii++) {
      if (subscriptions[ii]) {
        noSubscriptions = false; // still valid subscriptions on other screens maybe
      }
    }
    if (noSubscriptions) {
      this.stopPositioningUpdates();
    }
  },

  stopPositioningUpdates: function (success: Function, error?: Function) {
    RNCSitumPlugin.stopPositioning(success, error || logError);
    for (let ii = 0; ii < subscriptions.length; ii++) {
      const sub = subscriptions[ii];
      if (sub) {
        warning(
          false,
          'Called stopPositioningUpdates with existing subscriptions.',
        );
        sub[0].remove();
        // array element refinements not yet enabled in Flow
        const sub1 = sub[1];
        sub1 && sub1.remove();
      }
    }
    subscriptions = [];
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

  invalidateCache: function (callback?: Function) {
    RNCSitumPlugin.invalidateCache(callback);
  },
};

module.exports = SitumPlugin;
