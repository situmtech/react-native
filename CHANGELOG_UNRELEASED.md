### Added

- Added JWT token authentication support through `SitumPlugin.setToken()` and the new optional `SitumProvider.token` property.
- MapView authentication can now be updated at runtime when using JWT token authentication.
- The most recently updated credential becomes the active authentication method, regardless of whether it is added through a `SitumPlugin` method or via a `SitumProvider` prop.

### Changed

- `SitumProvider.apiKey` is now optional. If no credentials are available when the MapView loads, it waits until authentication is provided.
- Updated the example application React Native from 0.79.1 to 0.83.10 to fix an issue that prevented the app from compiling on iOS.
- Updated Android example application targetSdkVersion from 35 to 37.
- Aligned the `react-native-webview` versions in the plugin's `peerDependencies` and the example app so that changes to `react-native-webview` are picked up during testing.

### Removed

- Removed routing and navigation bridge between MapView and native SDK as the MapView now always uses its own routing and navigation library.

### Fixed

- AccessibilityMode documentation now mentions DirectionsOptions instead of DirectionsRequest.
- Fixed removeNavigationUpdates never resolving when navigation was not running.
- Fixed navigationRunning remaining active after reaching the destination.
- Added workaround to TS regression at react-native-webview (https://github.com/react-native-webview/react-native-webview/issues/3977).
