import { NativeModules } from "react-native";

import SitumPlugin from "..";

describe("Test Directions / Routes functions", () => {
  it("should fetch route between two points and pass it to given callback", () => {
    const params = expect.any(Array);
    const success = () => {
      // no op
    };
    const error = () => {
      // no op
    };

    SitumPlugin.requestDirections(params, success, error);

    expect(
      NativeModules.RNCSitumPlugin.requestDirections.mock.calls.length
    ).toEqual(1);

    expect(
      NativeModules.RNCSitumPlugin.requestDirections.mock.calls[0][0]
    ).toBe(params);
    expect(
      NativeModules.RNCSitumPlugin.requestDirections.mock.calls[0][1]
    ).toBe(success);

    expect(
      NativeModules.RNCSitumPlugin.requestDirections.mock.calls[0][2]
    ).toBe(error);
  });
});
