## [3.9.0] - Unreleased

### Added

-   New navigation engine. When [Map Viewer](https://situm.com/docs/built-in-wayfinding-ui/) is present, you can use the navigation of the Map Viewer instead of the SDK navigation. This type of navigation improves routes, indications and performance. To use it you need set [useViewerNavigation](https://developers.situm.com/sdk_documentation/react-native/typedoc/types/MapViewConfiguration.html#__type.useViewerNavigation) to true like this:

```typescript
    <MapView
        ...
        configuration={{
            buildingIdentifier: SITUM_BUILDING_ID,
            situmApiKey: SITUM_API_KEY,
            useViewerNavigation: true,
        }}
        ...
    />
```
