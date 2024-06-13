<p align="center"> <img width="233" src="https://situm.com/wp-content/themes/situm/img/logo-situm.svg" style="margin-bottom:1rem" /> <h1 align="center">Situm React Native SDK sample app</h1> </p>

<div align="center" style="text-align:center">

A sample React-Native application to start learning the power of [Situm's React Native SDK Plugin](../README.md).

</div>

<div align="center" style="text-align:center">

[![npm](https://img.shields.io/npm/dm/react-native-situm-plugin.svg)](https://www.npmjs.com/package/react-native-situm-plugin) [![npm](https://img.shields.io/npm/v/react-native-situm-plugin.svg)](https://www.npmjs.com/package/react-native-situm-plugin) [![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/)

</div>

## Getting Started

<div align="center" style="display: flex; gap: 1rem;">
    <img src="./docs/assets/home_preview.jpg" width="33%" alt="home_preview">
    <img src="./docs/assets/positioning_preview.jpg" width="33%" alt="positioning_preview">
    <img src="./docs/assets/map_preview.jpg" width="33%" alt="map_preview">
</div>

## What's in here <a name="whatsinhere"/>

Situm SDK is a set of utilities that allow any developer to build location based apps using Situm's indoor positioning system.
Among many other capabilities, apps developed with Situm SDK will be able to:

1. Obtain information related to buildings where Situm's positioning system is already configured:
   floor plans, points of interest, geotriggered events, etc.
2. Retrieve the location of the smartphone inside these buildings (position, orientation, and floor
   where the smartphone is).
3. Compute a route from a point A (e.g. where the smartphone is) to a point B (e.g. any point of
   interest within the building).

## How to run the app <a name="howtorun"/>

### Step 1: Install the dependencies <a name="dependencies"/>

The first step is to download this repo:

```bash
git clone https://github.com/situmtech/react-native.git
```

And then install the plugin dependencies alongside the example/ app dependecies as follows:

```bash
cd situm-react-native-plugin/;

yarn install;
yarn example install;
```

-   **iOS**
    In case you are using iOS, the last step is to install de dependencies specified in [`example/ios/Podfile`](./ios/Podfile) with:

```bash
cd ios/
pod install
```

### Step 2: Set your credentials <a name="config"/>

For this step you must create a situm account, so [setup your account](../README.md#setup-your-account) before continuing.
After creating your situm account, you can set your [credentials](https://situm.com/docs/built-in-wayfinding-ui/#prepare-viewer) on the properties of [`src/situm.tsx`](./src/situm.tsx), like so:

```js
export const SITUM_API_KEY = '';
export const BUILDING_IDENTIFIER = '';
```


### Step 3: Run the app <a name="runapplication"></a>

#### Android

-   **Run from command line:**

    1. Initialize the metro terminal with `$ react-native start`
    2. Then (in another terminal) compile and run this app in your device with `$ react-native run-android`.

-   **Run from Android Studio:** Open `root/android` folder in Android Studio and run project.

#### iOS

-   **Run from command line:**

    1. Initialize the metro terminal with `$ react-native start`
    2. Then (in another terminal) compile and run this app in your device with `$ react-native run-ios`.

-   **Run from XCode:** Go to `example/ios` folder and open `example.xcworkspace` or run command `xed ios` from root directory.

## Documentation <a name="documentation"/>

More information on how to use the official React Native plugin and the set of APIs, the functions, parameters and results each function accepts and provides can be found in our [Cordova JSDoc](https://developers.situm.com/sdk_documentation/cordova/jsdoc/latest/situm) which shares interfaces.

### Examples

In case you want to learn how to use our plugin, you may want to take a look at our code samples of the basics functionalities:

-   **Showcasing our SDK**
    1. [**Positioning**](./src/examples/sdk/Positioning.tsx): Learn how to start positioning and get the user location by using our listener with the specified positioning configuration inside [`src/settings.tsx`](./src/settings.tsx) file.
    2. [**Positioning with Remote Configuration**](./src/examples/sdk/RemoteConfig.tsx): Learn how to start positioning with the [remote configuration](https://situm.com/docs/sdk-remote-configuration/) defined in the settings section inside our [dashboard](https://dashboard.situm.com/settings). This way you can manage your positioning parameters with ease and avoid doing several code changes to test different configurations.
    3. [**Show buildings basic info**](./src/examples/sdk/BuildingBasicInfo.tsx): Learn how to retrieve the basic info of a building. (e.g. buildingIdentifier, name, creation date, ...)
    4. [**Show a building full info from different calls**](./src/examples/sdk/InfoFromBuilding.tsx): Learn how to retrive all the information related to a building in different calls. (e.g. floors, pois, geofences, custom fields, ...)
    6. [**Show a building's full info**](./src/examples/sdk/BuildingFullInfo.tsx): Learn how to fetch all the information related to a building with just one call.
    7. [**Show the route between pois**](./src/examples/sdk/RouteBetweenPOIs.tsx): Learn how to retrieve all the info of a route between 2 pois.
-   **Showcasing our Wayfinding module**:
    1. [**Complete Wayfinding Experience**](./src/examples/wayfinding/Wayfinding.tsx): An integrated wayfinding experience powered by Situm, designed for ease of integration.
    2. [**Navigate to POI**](./src/examples/wayfinding/NavigateToPoi.tsx): Learn how to trigger the navigation to a concrete POI and display it on the map.
    3. [**Select POI**](./src/examples/wayfinding/SelectPoi.tsx): Learn how to set a POI as selected on the map.

## Versioning

We use [SemVer](http://semver.org/) for versioning.

Please refer to [CHANGELOG.md](../CHANGELOG.md) for a list of notables changes for each version of the library.

You can also see the [tags on this repository](https://github.com/situmtech/situm-react-native-plugin/tags).

## Submitting Contributions <a name="contributions"/>

You will need to sign a Contributor License Agreement (CLA) before making a submission. [Learn more here.](https://situm.com/contributions/)

## License

This project is licensed under the MIT - see the [LICENSE](../LICENSE) file for details.

## More information <a name="more-info"/>

More info is available at our [Developers Page](https://situm.com/docs/01-introduction/).

## Support information <a name="support"/>

For any question or bug report, please send an email to [support@situm.es](mailto:support@situm.es)
