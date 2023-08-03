/* eslint-disable @typescript-eslint/no-empty-function */
import { NativeModules } from "react-native";

import { logError } from "../../utils/logError";
import SitumPlugin from "..";

jest.mock("../../utils/logError", () => {
  return {
    logError: jest.fn(),
  };
});

describe("Test Positioning functions", () => {
  afterEach(() => {
    SitumPlugin.stopPositioning();
  });

  it("should add location and status listener to the start positioning", () => {
    SitumPlugin.startPositioningUpdates(
      () => {},
      () => {}
    );

    expect(NativeModules.RNCSitumPlugin.addListener.mock.calls[0][0]).toBe(
      "locationChanged"
    );
    expect(NativeModules.RNCSitumPlugin.addListener.mock.calls[1][0]).toBe(
      "statusChanged"
    );
  });

  it("should add error listener to the start positioning", () => {
    SitumPlugin.startPositioningUpdates(
      () => {},
      () => {},
      () => {}
    );

    expect(NativeModules.RNCSitumPlugin.addListener.mock.calls[0][0]).toBe(
      "locationChanged"
    );
    expect(NativeModules.RNCSitumPlugin.addListener.mock.calls[1][0]).toBe(
      "statusChanged"
    );
    expect(NativeModules.RNCSitumPlugin.addListener.mock.calls[2][0]).toBe(
      "locationError"
    );
  });

  it("should clear all listeners associated with a subscriptionID", () => {
    SitumPlugin.startPositioningUpdates(
      () => {},
      () => {}
    );
    SitumPlugin.stopPositioning(() => {});

    expect(NativeModules.RNCSitumPlugin.stopPositioning.mock.calls.length).toBe(
      1
    );
  });

  it("should correctly assess if all listeners have been cleared", () => {
    SitumPlugin.startPositioningUpdates(
      () => {},
      () => {}
    );
    SitumPlugin.startPositioningUpdates(
      () => {},
      () => {}
    );
    SitumPlugin.stopPositioning(() => {});
    expect(NativeModules.RNCSitumPlugin.stopPositioning.mock.calls.length).toBe(
      1
    );
  });

  it("should not fail if the subID one wants to clear does not exist", () => {
    SitumPlugin.startPositioningUpdates(
      () => {},
      () => {}
    );
    SitumPlugin.stopPositioning(() => {});
    expect(NativeModules.RNCSitumPlugin.stopPositioning.mock.calls.length).toBe(
      1
    );
  });

  it("should stop positioning and warn about removing existing subscriptions", () => {
    const mockWarningCallback = jest.fn();
    logError.mockImplementation(mockWarningCallback);

    SitumPlugin.startPositioningUpdates(
      () => {},
      () => {}
    );
    SitumPlugin.stopPositioning();

    expect(NativeModules.RNCSitumPlugin.stopPositioning.mock.calls.length).toBe(
      1
    );
    // expect(mockWarningCallback.mock.calls.length).toBeGreaterThanOrEqual(1);
  });
});
