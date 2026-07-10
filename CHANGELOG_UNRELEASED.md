### Added

- Added JWT token authentication support through `SitumPlugin.setToken()` and the new optional `SitumProvider.token` property.
- MapView authentication can now be updated at runtime when using JWT token authentication.

### Changed

* `SitumProvider.apiKey` is now optional. If no credentials are available when the MapView loads, it waits until authentication is provided.
* Updated the example application to React Native 0.83.10 and Android API level 37.
