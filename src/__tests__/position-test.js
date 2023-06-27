/* eslint-disable no-undef */

import { NativeModules } from 'react-native';
import SitumPlugin from '..';
import { logError } from '../sdk/utils';

jest.mock('../sdk/utils', () => {
  return {
    logError: jest.fn(),
  };
});

describe('Test Positioning functions', () => {
  afterEach(() => {
    SitumPlugin.stopPositioningUpdates();
  });
  it('should add location and status listener to the start positioning', () => {
    const subId = SitumPlugin.startPositioningUpdates(
      () => { },
      () => { },
    );

    expect(subId).toEqual(0);

    expect(NativeModules.RNCSitumPlugin.addListener.mock.calls[0][0]).toBe(
      'locationChanged',
    );
    expect(NativeModules.RNCSitumPlugin.addListener.mock.calls[1][0]).toBe(
      'statusChanged',
    );
  });

  it('should add error listener to the start positioning', () => {
    const subId = SitumPlugin.startPositioningUpdates(
      () => { },
      () => { },
      () => { },
    );

    expect(subId).toEqual(0);
    expect(NativeModules.RNCSitumPlugin.addListener.mock.calls[0][0]).toBe(
      'locationChanged',
    );
    expect(NativeModules.RNCSitumPlugin.addListener.mock.calls[1][0]).toBe(
      'statusChanged',
    );
    expect(NativeModules.RNCSitumPlugin.addListener.mock.calls[2][0]).toBe(
      'locationError',
    );
  });

  it('should clear all listeners associated with a subscriptionID', () => {
    const subId = SitumPlugin.startPositioningUpdates(
      () => { },
      () => { },
    );
    SitumPlugin.stopPositioning(subId, () => { });

    expect(NativeModules.RNCSitumPlugin.stopPositioning.mock.calls.length).toBe(
      1,
    );
  });

  it('should correctly assess if all listeners have been cleared', () => {
    const subId = SitumPlugin.startPositioningUpdates(
      () => { },
      () => { },
    );
    SitumPlugin.startPositioningUpdates(
      () => { },
      () => { },
    );
    SitumPlugin.stopPositioning(subId, () => { });
    expect(NativeModules.RNCSitumPlugin.stopPositioning.mock.calls.length).toBe(
      0,
    );
  });

  it('should not fail if the subID one wants to clear does not exist', () => {
    SitumPlugin.startPositioningUpdates(
      () => { },
      () => { },
    );
    SitumPlugin.stopPositioning(17, () => { });
    expect(NativeModules.RNCSitumPlugin.stopPositioning.mock.calls.length).toBe(
      0,
    );
  });

  it('should stop positioning and warn about removing existing subscriptions', () => {
    const mockWarningCallback = jest.fn();
    logError.mockImplementation(mockWarningCallback);

    SitumPlugin.startPositioningUpdates(
      () => { },
      () => { },
    );
    SitumPlugin.stopPositioningUpdates();

    expect(NativeModules.RNCSitumPlugin.stopPositioning.mock.calls.length).toBe(
      1,
    );
    expect(mockWarningCallback.mock.calls.length).toBeGreaterThanOrEqual(1);
  });
});
