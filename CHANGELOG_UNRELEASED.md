### Added

- We have added `SitumProvider.apiDomain`. This parameter is useful only in certain scenarios where configuring the Situm's environment is neccessary.

### Changed

- We have simplified the autenthication process of our plugin. Use SitumProvider at the root of your app to initialize & set your `SitumProvider.apiKey`. Now this step will prevent you from calling `SitumPlugin.init()` and `SitumPlugin.setApiKey()` methods, and from specifying the `MapViewConfiguration.situmApiKey` to display our map.
- Example app: we have now simplified the authentication process in our example app, using the new `SitumProvider.apiKey`.
