## [3.10.0] - 31-07-2024

### Added

-   New navigation engine. When [Map Viewer](https://situm.com/docs/built-in-wayfinding-ui/) is present, you can use the navigation of the Map Viewer instead of the SDK navigation. This type of navigation improves routes, indications and performance.
-   New [mapViewRef.selectCar](https://developers.situm.com/sdk_documentation/react-native/typedoc/interfaces/MapViewRef.html#selectCar) and [mapViewRef.navigateToCar()](https://developers.situm.com/sdk_documentation/react-native/typedoc/interfaces/MapViewRef.html#navigateToCar) to be able to perform actions over the saved find my car point.
-   New [onNavigationStart()](https://developers.situm.com/sdk_documentation/react-native/typedoc/classes/default.html#onNavigationStart), [onNavigationDestinationReached()](https://developers.situm.com/sdk_documentation/react-native/typedoc/classes/default.html#onNavigationDestinationReached), [onNavigationCancelled()](https://developers.situm.com/sdk_documentation/react-native/typedoc/classes/default.html#onNavigationCancelled) callbacks for SitumPlugin class.

-   New function to select a floor in the map given its ID and optionally if it must fit the camera to his size or not. [mapViewRef.selectFloor]
