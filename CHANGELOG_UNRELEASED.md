## Unreleased

### Changed

-   BREAKING CHANGE: removed the `requestPermission` method to eliminate the dependency on `react-native-permissions`. To continue using the `requestPermission` method without significant modifications in your project, you can integrate it directly as shown in the example application from the repository:
    1. Copy the file `example/src/examples/Utils/requestPermission.tsx`.
    2. Modify the imports accordingly.
-   It is no longer necessary to specify the Situm repository in your `build.gradle` file. This plugin
    has already set it up for you.
