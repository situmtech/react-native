## Unreleased

### Changed

- We have simplified the autenthication process of our plugin. Use SitumProvider at the root of your app to initialize & set your apiKey. Now this step will prevent you from calling SitumPlugin.init() and setApiKey() methods, and from specifying the MapViewConfiguration.situmApiKey to display our map.
