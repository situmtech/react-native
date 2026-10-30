## Changelog

This version changes how the iOS SDK is installed: the plugin now gets it with Swift Package Manager (SPM) instead of the CocoaPods trunk, so your iOS project must use React Native 0.75 or later and build its pods as dynamic frameworks.

## Added

- Expo projects can automatically configure dynamic frameworks on iOS during prebuild. It also disables Expo precompiled modules, which would build the plugin as a static library, so builds take longer.

## Changed

- The iOS SDK is now installed with Swift Package Manager (SPM) through the plugin pod, so it keeps receiving updates after the CocoaPods trunk becomes read-only. You keep installing the plugin with `pod install`, without adding any package in Xcode.
- The plugin now requires React Native 0.75 or later and dynamic frameworks on iOS. In React Native CLI projects, add `use_frameworks! :linkage => :dynamic` to your `Podfile`, otherwise `pod install` stops with an error.
