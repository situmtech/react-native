<p align="center"> <img width="233" src="https://situm.com/wp-content/themes/situm/img/logo-situm.svg" style="margin-bottom:1rem" /> <h1 align="center">Situm React Native Plugin sample app</h1> </p>

<p align="center" style="text-align:center">

A sample React-Native application to start learning the power of [Situm](https://situm.com/en/)'s SDK.

</p>

<div align="center" style="text-align:center">

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
![Latest version:](https://img.shields.io/npm/v/@situm/sdk-js/latest)
![Node compatibility:](https://img.shields.io/node/v/@situm/sdk-js)
[![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/)

</div>

# Getting Started

![](./docs/assets/home_preview.png)
![](./docs/assets/positioning_preview.png)
![](./docs/assets/map_preview.png)

In this sample app we will guide you step by step to set up your first react-native application using Situm SDK.
Before starting to write code, we recommend you to set up an account in our dashboard, retrieve your API KEY and configure your first building:

#### Setup your account <a name="setupaccount"/>

1. Go to the [sign in form](http://dashboard.situm.com/accounts/register) and enter your username
   and password to sign in.
2. Go to the [account section](https://dashboard.situm.com/accounts/profile) and on the bottom, click
   on "generate one" to generate your API KEY.
3. Go to the [buildings section](http://dashboard.situm.com/buildings) and create your first building.
4. Download [Situm Mapping Tool](https://play.google.com/store/apps/details?id=es.situm.maps)
   Android application. With this application you will be able to configure and test Situm's indoor
   positioning system in your buildings.

Perfect! Now you are ready to develop your first indoor positioning application.

**NOTE**: More information on how to use the official React Native plugin and the set of APIs, the functions, parameters and results each function accepts and provides can be found in our [Cordova JSDoc](https://developers.situm.com/sdk_documentation/cordova/jsdoc/latest/situm) which shares interfaces.

### Table of contents

- [**What's in here**](#whatsinhere)
- [**How to run the app**](#howtorun)
  - [Step 1: Configure our SDK in your react-native project](#configureproject)
  - [Step 2: Set your credentials](#config)
  - [Step 3: Setup Google Maps](#mapsapikey)
  - [Step 4: Run the app](#runapplication)
- [**Code samples**](#code-samples)
- [**Submitting contributions**](#contributions)
- [**More information**](#more-info)
- [**Support information**](#support)

### What's in here <a name="whatsinhere"/>

Situm SDK is a set of utilities that allow any developer to build location based apps using Situm's indoor positioning system.
Among many other capabilities, apps developed with Situm SDK will be able to:

1. Obtain information related to buildings where Situm's positioning system is already configured:
   floor plans, points of interest, geotriggered events, etc.
2. Retrieve the location of the smartphone inside these buildings (position, orientation, and floor
   where the smartphone is).
3. Compute a route from a point A (e.g. where the smartphone is) to a point B (e.g. any point of
   interest within the building).

### How to run the app <a name="howtorun"/>

1. [Step 1: Configure our SDK in your react-native project](#configureproject)
2. [Step 2: Set your credentials](#config)
3. [Step 3: Setup Google Maps](#mapsapikey)
4. [Step 4: Run the app](#runapplication)

### Step 1: Configure project and install dependencies <a name="configureproject"/>

First of all, you must install all dependencies required to run the project. You can do that by executing any of the following commands.

```shell
yarn

#OR

npm install

```

After that, you must configure Situm SDK in your project. _This has been already done for you in the sample application, but nonetheless we will walk you through the process._

- Add the SDK to your project directly using your favorite package manager.

```shell
yarn add react-native-situm-plugin

#OR

npm install --save react-native-situm-plugin
```

- You must initialize the SDK before using any of its features:

```js
import SitumPlugin from 'react-native-situm-plugin';

SitumPlugin.initSitumSDK();
```

### Step 2: set your credentials <a name="config"/>

In the code, you can set the situm's account user and API key with:

```js
SitumPlugin.setApiKey(SITUM_EMAIL, SITUM_API_KEY, response => {});
```

or you can set the user and password with:

```js
SitumPlugin.setUserPass(SITUM_EMAIL, SITUM_PASS, response => {});
```

**NOTE**: In case you don't have a situm account, follow the [Setup your account](#setupaccount) section to setup a new account and create a building.

In this sample project you can do this by setting the properties on the [`src/situm.tsx`](./src/situm.tsx) file, like so:

```js
export const SITUM_EMAIL = 'EMAIL_GOES_HERE';
export const SITUM_API_KEY = 'SITUM_API_KEY_GOES_HERE';
export const SITUM_BUILDING_ID = 'BUILDING_ID_GOES_HERE'; // Identifier of the building
export const SITUM_FLOOR_LEVEL = 0; // Floor level (e.g. -1, 0, 1, 2, ...)
```

**NOTE**: You should also fill the SITUM_BUILDING_ID and SITUM_FLOOR_LEVEL variables so all the examples are able to work as expected.

### Step 3: Setup Google Maps <a name="mapsapikey"/>

You may need to configure an API KEY in order to be able to use Google Maps on your app.

Please follow steps provided on [Google Maps for iOS](https://developers.google.com/maps/documentation/ios-sdk/get-api-key?hl=en) to generate an API
Key.

**NOTE**: When generating an API key, you can restrict it to iOS & Android and use the same key for both platforms.

- **iOS**

  When you've successfully generated the key, go to `AppDelegate.m` file and initialize Google Maps as shown:

```objc
#import <GoogleMaps/GoogleMaps.h>
...

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    [GMSServices provideAPIKey:@"HERE_GOES_GOOGLE_MAPS_API_KEY"];
}
```

- **Android**

  Go to `AndroidManifest.xml` file and add Google Maps API key as a `meta-data` inside the `application` section.

```xml
    <meta-data
        android:name="com.google.android.geo.API_KEY"
        android:value="HERE_GOES_GOOGLE_MAPS_API_KEY" />
```

### Step 4: Run the app <a name="runapplication"></a>

#### Android

- **Run from command line:** `$ react-native run-android`
- **Run from Android Studio:** Open `root/android` folder in Android Studio and run project.

#### iOS

- **Run from command line:** `$ react-native run-ios`
- **Run from XCode:** Go to `root/ios` folder and open `SitumRNGettingStarted.xcworkspace` or run command `xed ios` from root directory.

### Code samples <a name="code-samples"/>

1. [**Positioning**](https://github.com/situmtech/situm-react-native-plugin/blob/feature/update-SDK-2.83.7/example/src/examples/Positioning.tsx): Learn how to start positioning and get the user location by using our listener with the specified positioning configuration inside [`src/settings.tsx`](./src/settings.tsx) file.
2. [**Positioning with Remote Configuration**](https://github.com/situmtech/situm-react-native-plugin/blob/feature/update-SDK-2.83.7/example/src/examples/RemoteConfig.tsx): Learn how to start positioning with the [remote configuration](https://situm.com/docs/sdk-remote-configuration/) defined in the settings section inside our [dashboard](https://dashboard.situm.com/settings). This way you can manage your positioning parameters with ease and avoid doing several code changes to test different configurations.
3. [**Show buildings basic info**](https://github.com/situmtech/situm-react-native-plugin/blob/feature/update-SDK-2.83.7/example/src/examples/BuildingBasicInfo.tsx): Learn how to retrieve the basic info of a building. (e.g. buildingIdentifier, name, creation date, ...)
4. [**Show a building full info from different calls**](https://github.com/situmtech/situm-react-native-plugin/blob/feature/update-SDK-2.83.7/example/src/examples/InfoFromBuilding.tsx): Learn how to retrive all the information related to a building in different calls. (e.g. floors, pois, geofences, custom fields, ...)
5. [**Draw a building in top of google maps**](https://github.com/situmtech/situm-react-native-plugin/blob/feature/update-SDK-2.83.7/example/src/examples/ShowBuildingOnMap.tsx): Draw a building above google maps.
6. [**Show a building's full info**](https://github.com/situmtech/situm-react-native-plugin/blob/feature/update-SDK-2.83.7/example/src/examples/BuildingFullInfo.tsx): Learn how to fetch all the information related to a building with just one call.
7. [**Show the route between pois**](https://github.com/situmtech/situm-react-native-plugin/blob/feature/update-SDK-2.83.7/example/src/examples/RouteBetweenPOIs.tsx): Learn how to retrieve all the info of a route between 2 pois.
8. [**Draw route between pois**](https://github.com/situmtech/situm-react-native-plugin/blob/feature/update-SDK-2.83.7/example/src/examples/DrawRouteBetweenPOIs.tsx): Learn how to draw a route between 2 pois above a floor plan.
9. [**Draw POIs with custom icons**](https://github.com/situmtech/situm-react-native-plugin/blob/feature/update-SDK-2.83.7/example/src/examples/GetPoisIcons.tsx): Learn how to display POIs with custom icons. You may need to know first how to [<i>create a custom POI category with custom icons</i>](https://situm.com/docs/cartography-management/#poi-categories).
10. [**Set cache max age and invalidate it**](https://github.com/situmtech/situm-react-native-plugin/blob/feature/update-SDK-2.83.7/example/src/examples/SetCacheMaxAge.tsx): Learn how to set the maximum cache age and how to invalidate it.

## Submitting Contributions <a name="contributions"/>

You will need to sign a Contributor License Agreement (CLA) before making a submission. [Learn more here.](https://situm.com/contributions/)

## More information <a name="more-info"/>

More info is available at our [Developers Page](https://situm.com/docs/01-introduction/).

## Support information <a name="support"/>

For any question or bug report, please send an email to [support@situm.es](mailto:support@situm.es)
