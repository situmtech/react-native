### Added

- Added a new callback `onInternalMapViewMessageCallback` invoked with every MapView message.
  It is used internally — no action is required on your side.

### Changed

- Made WebView message handling more robust with guarded JSON parsing and default fallbacks for
  type and payload. This is also an internal change that requires no action on your side.
- Now the MapView receives the `deviceId` from the underlying SDK.
