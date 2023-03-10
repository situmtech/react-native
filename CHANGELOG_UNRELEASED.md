# [Unreleased]

##### Added

- Added the necessary configuration to execute our getting started in example/ with `npm`. Now code changes in our plugin won't require to re-install dependencies every time.
- Added RequestPermissions.tsx as an example on how to request the positioning permissions.

##### Changed

- "Start positioning" button now does restart positioning (with a delay 3 seconds to re-restart the positioning)
- Exiting Positioning.tsx or RemoteConfig.tsx will stop the current positioning session.
