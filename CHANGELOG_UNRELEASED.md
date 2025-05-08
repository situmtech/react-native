## Unreleased

### Added

- Added new methods to help users resolve permission and sensor-related issues within the app. With these new methods, the SDK can now automatically request the necessary permissions for positioning without the need to implement repetitive code:
  - `configureUserHelper(UserHelperOptions)`: Automatically detects and explains configuration problems (such as missing Location or Bluetooth permissions, or disabled sensors), and guides the user through the steps to fix them. Accepts a configuration object to customize the behavior.
  - `enableUserHelper()`: Shortcut to enable the user guidance with default settings (equivalent to `configureUserHelper({enabled: true})`).
  - `disableUserHelper()`: Shortcut to disable the user guidance (equivalent to `configureUserHelper({enabled: false})`).

### Changed

- The repository structure has been modified: starting from this version, we use Yarn workspaces and have moved the SDK source code from the root folder to the plugin directory.
- We also updated the example application to align it with the structure used in other Situm plugins.
- The development environment setup for this plugin has changed significantly with the adoption of workspaces and Yarn 4, but this change should not affect end users of the plugin.

### Fixed

- Fixed a crash in iOS when calling `fetchGeofences()` under some circumstances.
- Fixed an issue that prevented `navigateToPoi` from working correctly immediately after the `MapView` was loaded.
