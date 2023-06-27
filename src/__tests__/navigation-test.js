/* eslint-disable @typescript-eslint/no-empty-function */
import { NativeModules } from "react-native";

import SitumPlugin from "..";

describe("Test Navigation functions", () => {
  afterEach(() => {
    SitumPlugin.removeNavigationUpdates();
  });
  it("should add navigation and error listener to the request navigation", () => {
    SitumPlugin.requestNavigationUpdates(
      () => {},
      () => {}
    );

    expect(NativeModules.RNCSitumPlugin.addListener.mock.calls[0][0]).toBe(
      "navigationUpdated"
    );
    expect(NativeModules.RNCSitumPlugin.addListener.mock.calls[1][0]).toBe(
      "navigationError"
    );
  });

  it("should pass location request options to request navigation", () => {
    const locationRequest = expect.any(Object);
    SitumPlugin.requestNavigationUpdates(
      () => {},
      () => {},
      locationRequest
    );

    expect(NativeModules.RNCSitumPlugin.addListener.mock.calls[0][0]).toBe(
      "navigationUpdated"
    );
    expect(NativeModules.RNCSitumPlugin.addListener.mock.calls[1][0]).toBe(
      "navigationError"
    );
    expect(
      NativeModules.RNCSitumPlugin.requestNavigationUpdates.mock.calls[0][0]
    ).toBe(locationRequest);
  });

  it("should call update location after request navigation", () => {
    SitumPlugin.requestNavigationUpdates(
      () => {},
      () => {},
      {}
    );

    const location = expect.any(Object);
    const success = () => {};
    SitumPlugin.updateNavigationWithLocation(location, success);

    expect(
      NativeModules.RNCSitumPlugin.requestNavigationUpdates.mock.calls.length
    ).toBe(1);

    expect(
      NativeModules.RNCSitumPlugin.updateNavigationWithLocation.mock.calls[0][0]
    ).toBe(location);
    expect(
      NativeModules.RNCSitumPlugin.updateNavigationWithLocation.mock.calls[0][1]
    ).toBe(success);
  });

  it("should call remove all navigation request", () => {
    SitumPlugin.removeNavigationUpdates();

    expect(
      NativeModules.RNCSitumPlugin.removeNavigationUpdates.mock.calls.length
    ).toBe(1);
  });
});
