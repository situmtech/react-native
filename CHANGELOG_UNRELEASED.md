## Changelog

This version changes how the iOS SDK is installed: the plugin now gets it with Swift Package Manager (SPM) through React Native's `spm_dependency`, instead of the CocoaPods trunk, so your iOS project must use React Native 0.75 or later.

## Changed

- The iOS SDK is now installed with Swift Package Manager (SPM) through the plugin pod, so it keeps receiving updates after the CocoaPods trunk becomes read-only. You keep installing the plugin with `pod install`, without manually adding any package in Xcode.
- The plugin now requires React Native 0.75 or later on iOS, which provides `spm_dependency`.

## Fixed

- Fixed `npx expo prebuild` stopping with `ERR_UNSUPPORTED_DIR_IMPORT` in older Expo SDK versions, such as SDK 53, when `@situm/react-native` is listed in `plugins`.