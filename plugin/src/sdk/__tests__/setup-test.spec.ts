// import { NativeModules } from "react-native";

// import SitumPlugin from "..";

// describe("Test Setup SDK", () => {
//   it("should initialise native SitumSDK", () => {
//     SitumPlugin.initSitumSDK();
//     expect(NativeModules.RNCSitumPlugin.initSitumSDK.mock.calls.length).toEqual(
//       1
//     );
//   });

//   it("should param 'email' and 'apiKey' in setApiKey be string", () => {
//     const email = expect.any(String);
//     const apiKey = expect.any(String);

//     SitumPlugin.setApiKey(email, apiKey);
//     //first arugment of first call
//     expect(
//       NativeModules.RNCSitumPlugin.setApiKey.mock.calls[0][0]
//     ).toStrictEqual(expect.any(String));
//     //second arugment of first call
//     expect(
//       NativeModules.RNCSitumPlugin.setApiKey.mock.calls[0][1]
//     ).toStrictEqual(expect.any(String));
//   });

//   it("should param 'email' and 'password' in setUserPass be string", () => {
//     const email = expect.any(String);
//     const pass = expect.any(String);

//     SitumPlugin.setUserPass(email, pass);
//     //first arugment of first call
//     expect(
//       NativeModules.RNCSitumPlugin.setUserPass.mock.calls[0][0]
//     ).toStrictEqual(expect.any(String));
//     //second arugment of first call
//     expect(
//       NativeModules.RNCSitumPlugin.setUserPass.mock.calls[0][1]
//     ).toStrictEqual(expect.any(String));
//   });

//   it("should param 'maxCacheAge' in setCacheMaxAge be number", () => {
//     const maxCacheAge = expect.any(Number);

//     SitumPlugin.setCacheMaxAge(maxCacheAge);
//     //first arugment of first call
//     expect(
//       NativeModules.RNCSitumPlugin.setCacheMaxAge.mock.calls[0][0]
//     ).toStrictEqual(expect.any(Number));
//   });

//   it("should request permissions/authorization for location requests", () => {
//     SitumPlugin.requestAuthorization();
//     expect(
//       NativeModules.RNCSitumPlugin.requestAuthorization.mock.calls.length
//     ).toEqual(1);
//   });

//   it("should call invalidate cache", () => {
//     SitumPlugin.invalidateCache();
//     expect(
//       NativeModules.RNCSitumPlugin.invalidateCache.mock.calls.length
//     ).toEqual(1);
//   });
// });

test("empty test", () => {
  expect(true).toBe(true);
});
