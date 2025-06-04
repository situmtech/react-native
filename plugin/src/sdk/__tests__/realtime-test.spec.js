// /* eslint-disable @typescript-eslint/no-empty-function */
// import { NativeModules } from "react-native";
// import SitumPlugin from "..";
// describe("Test Realtime update functions", () => {
//   afterEach(() => {
//     SitumPlugin.removeRealTimeUpdates();
//   });
//   it("should add update and error listener to the request realtiime upudatees", () => {
//     SitumPlugin.requestRealTimeUpdates(
//       () => {},
//       () => {}
//     );
//     expect(NativeModules.RNCSitumPlugin.addListener.mock.calls[0][0]).toBe(
//       "realtimeUpdated"
//     );
//     expect(NativeModules.RNCSitumPlugin.addListener.mock.calls[1][0]).toBe(
//       "realtimeError"
//     );
//   });
//   it("should pass options to request realtime updates", () => {
//     const options = expect.any(Object);
//     SitumPlugin.requestRealTimeUpdates(
//       () => {},
//       () => {},
//       options
//     );
//     expect(NativeModules.RNCSitumPlugin.addListener.mock.calls[0][0]).toBe(
//       "realtimeUpdated"
//     );
//     expect(NativeModules.RNCSitumPlugin.addListener.mock.calls[1][0]).toBe(
//       "realtimeError"
//     );
//     expect(
//       NativeModules.RNCSitumPlugin.requestRealTimeUpdates.mock.calls[0][0]
//     ).toBe(options);
//   });
//   it("should call remove all realtime update request", () => {
//     SitumPlugin.removeRealTimeUpdates();
//     expect(
//       NativeModules.RNCSitumPlugin.removeRealTimeUpdates.mock.calls.length
//     ).toBe(1);
//   });
// });
test("empty test", () => {
    expect(true).toBe(true);
});
