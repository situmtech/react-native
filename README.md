<p align="center"> <img width="233" src="https://situm.com/wp-content/themes/situm/img/logo-situm.svg" style="margin-bottom:1rem" /> <h1 align="center">@situm/react-native</h1> </p>

<p align="center" style="text-align:center">

Set of utilities that allow any developer to build React Native location based apps using Situm's indoor positioning system.

</p>

<div align="center" style="text-align:center">

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
![Latest version:](https://img.shields.io/npm/v/@situm/sdk-js/latest)
![Node compatibility:](https://img.shields.io/node/v/@situm/sdk-js)
[![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/)
![React Native](https://img.shields.io/badge/react--native%40lastest-0.68.2-blueviolet)

</div>

## Introduction

Situm React Native Plugin is a set of utilities that allow any developer to build React Native location based apps using Situm's indoor positioning system. Among many other capabilities, apps developed with Situm React Native Plugin will be able to:

* Obtain information related to buildings where Situm's positioning system is already configured: floorplans, points of interest, geotriggered events, etc.

* Retrieve the location of the smartphone inside these buildings (position, orientation, and floor where the smartphone is).

* Compute a route from a point A (e.g. where the smartphone is) to a point B (e.g. any point of interest within the building).

* Trigger notifications when the user enters a certain area.

* Show a fully featured Wayfinding experience to show your cartography on a map,
offer your users point-to-point wayfinging routes, show indoor location, explore
Points of interest on your buildings.

![Preview of WYF module](https://raw.githubusercontent.com/situmtech/situm-react-native-plugin/feature/merge-wayfinding/docs/assets/preview.png)

## Table of contents

  * [Setup your account](#setup-your-account)
  * [Installing pre-requisites](#installing-pre-requisites)
  * [Using the Plugin](#using-the-plugin)
    + [Getting Started](#getting-started)
    + [Accessing plugin object](#accessing-plugin-object)
    + [Methods](#methods)
  * [Submitting Contributions](#submitting-contributions)
  * [License](#license)
  * [More information](#more-information)
  * [Support information](#support-information)

---


---

## Setup your account

In this tutorial, we will guide you step by step to set up your first React Native application using Situm React Native Plugin. Before starting to write code, we recommend you to set up an account in our Dashboard (https://dashboard.situm.es), retrieve your API KEY and configure your first building.

1. Go to the [sign in form](http://dashboard.situm.es/accounts/register) and enter your username and password to sign in.

2. Go to the [account section](https://dashboard.situm.es/accounts/profile) and on the bottom, click on “generate one” to generate your API KEY.

3. Go to the [buildings section](http://dashboard.situm.es/buildings) and create your first building.

4. Download Situm Mapping Tool in Play Store (Only Android devices) and calibrate your building. Check out our user guide for detailed information.

5. You are ready for building your own React Native applications. Please check next steps about requirements

---

## Installing pre-requisites

### Configure React Native:

Firstly you need to setup react-native development environment. To get started please follow instructions under section **React Native CLI Quickstart** on this [guide.](https://reactnative.dev/docs/environment-setup)

## Installing the plugin

In this we assume you have already created an hybrid application with React Native. After that there are some different ways to install the plugin:

### 1) Integrate project from Github

```shell
yarn add https://github.com/situmtech/situm-react-native-plugin.git

#OR

npm install --save https://github.com/situmtech/situm-react-native-plugin.git
```

Make sure to delete `node_modulles/` at `project/node_modules/@situm/react-native/node_modules`.

Note: As of now the SDK is available only on Github. When updating the SDK, make sure to delete the existing one from `node_modules/@situm/react-native`.


### 2) Integrate plugin into project from npm

```shell
yarn add @situm/react-native

#OR

npm install --save @situm/react-native
```

### Android

You'll need to add the follow repository in your project gradle file

```groovy
allprojects {
    repositories {
        maven {
            url "https://repo.situm.es/artifactory/libs-release-local"
        }
    }
}
```

### iOS
You'll need to add depedency in `PodFile`

```js
  target 'YourApp' do

    pod 'ReactNativeSitumPlugin', :path => '../node_modules/@situm/react-native/ReactNativeSitumPlugin.podspec'

  end
```

You may need to add a Header Search Path: ([screenshot](https://reactnative.dev/docs/linking-libraries-ios.html#step-3))

```
  $(SRCROOT)/../node_modules/@situm/react-native/lib/ios
```

## Using the Plugin

### Getting Started
Before start using our plugin in your own project, you can try out our [Getting Started sample app](./example/README.md) in your device.

### Accessing plugin object

In order to use the plugin in a React Native component all you need is the following:

```js
import  SitumPlugin  from  "@situm/react-native";

   SitumPlugin.fetchFloorsFromBuilding(building,
       (floors) => {...},
       (error) => {...},
   );
```

### Methods

NOTE: This plugin is currently under development. There may be method not implemented yet. Also there may be some API changes as development progresses.

### - initSitumSDK

Method that initialize the SDK. This method needs to be called once before using the rest of the methods.

```js
SitumPlugin.initSitumSDK();
```

#### - setDashboardURL

Set the environment that will be used to retrieve the data of your account. Return true if `url` was set successfully, otherwise false. The default environment is "https://dashboard.situm.com".

- **NOTE**: You must set the environment with this method before authenticating with `setUserPass()` or `setApiKey()`. In case you are authenticating with the `AndroidManifest.xml` fields, make sure the credentials specified there belong to the enviroment specified with this method.
```js
SitumPlugin.setDashboardURL("https://dashboard.situm.com", (success: any) => {});
```

#### - setApiKey

Log in into your Situm Account. This key is generated in Situm Dashboard. Return true if apiKey was set successfully, otherwise false.

```js
SitumPlugin.setApiKey("SITUM_EMAIL","SITUM_API_KEY")
```

#### - setUserPass

Provides user's email and password.
```js
SitumPlugin.setUserPass("SITUM_EMAIL","SITUM_USER_PASSWORD")
```

#### - setDashboardURL

Set the enviroment that will be used to retrieve the data of your account. Return true if `url` was set successfully, otherwise false
```js
SitumPlugin.setDashboardURL("https://dashboard.situm.com", (success: any) => {});
```

#### - setUseRemoteConfig

Set the remote configuration state which allows to use the configuration (location request) stored on the web to find the location of the user.
```js
SitumPlugin.setUseRemoteConfig("true", (success: any) => {});
```

#### - setCacheMaxAge

Sets the maximum age of a cached response in seconds.
```js
SitumPlugin.setCacheMaxAge(1*60*60) // 1 hour
```

#### - startPositioning

Starts the positioning system.
```js
const locationOptions = {
  buildingIdentifier: building.buildingIdentifier,
};

SitumPlugin.startPositioning(
  (location) => {
    //returns location object
    console.log(JSON.stringy(location))
  },
  (status) => {
    //returns positioning status
    console.log(JSON.stringy(status))
  },
  (error: string) => {
    // returns an error string
    console.log(error)
  },
  locationOptions
)
```

#### - stopPositioning

Stop the positioning system on current active listener.
```js
SitumPlugin.stopPositioning((success: any) => {});
```

#### - fetchBuildings

Download all the buildings for the current user.

```js
const getBuildings = () => {
  SitumPlugin.fetchBuildings(
    (buildings) => {
      // returns list of buildings
      if (!buildings || buildings.length == 0)
        alert(
          'No buildings, add a few buildings first by going to:\nhttps://dashboard.situm.es/buildings',
        );
    },
    (error) => {
      // returns an error string
    },
  );
};
```

### - fetchBuildingInfo

Download the information (floors, pois, ...) of a building.

```js
const getBuildingInfo = () => {
  SitumPlugin.fetchBuildingInfo(
    building,
    (buildingInfo) => {
      // returns a building info object
    },
    (error) => {
      // returns an error string
    },
  );
};
```

#### - fetchFloorsFromBuilding

Download all the floors of a building.

```js
const getFloorsFromBuilding = () => {
  SitumPlugin.fetchFloorsFromBuilding(
    building,
    (floors) => {
      // returns list of floors
    },
    (error) => {
      // returns an error string
    },
  );
};
```

#### - fetchIndoorPOIsFromBuilding

Download the indoor POIs of a building.

```js
const getPOIsFromBuilding = () => {
  SitumPlugin.fetchIndoorPOIsFromBuilding(
    building,
    (pois) => {
    // returns list of POIs
   },
    (error) => {
      //returns error string
    }
  );
};
```

#### - fetchOutdoorPOIsFromBuilding

Download the outdoor POIs of a building.

```js
const getPOIsFromBuilding = () => {
  SitumPlugin.fetchOutdoorPOIsFromBuilding(
    building,
    (pois) => {
    // returns list of POIs
   },
    (error) => {
      //returns error string
    }
  );
};
```

#### - fetchEventsFromBuilding

Download the events of a building.

```js
const getEventsFromBuilding = () => {
 SitumPlugin.fetchEventsFromBuilding(
    building,
    (events: any) => {
    // returns list of events
   },
    (error) => {
      //returns error string
    }
  );
};
```
#### - fetchPoiCategories

Get all POI categories, download and cache their icons asynchronously.

```js
 const getPoiCategories = () => {
    SitumPlugin.fetchPoiCategories(
      (categories) => {
        // returns list of categories
      },
      (error) => {
        //returns error string
      }
    );
  };
```

#### - fetchMapFromFloor

Download the map image of a floor.

```js
const getMapFromFloor = (floor) => {
  SitumPlugin.fetchMapFromFloor(
    floor,
    (map) => {
      // map image in Base64 format
    },
    (error) => {
      // returns error string
    },
  );
};
```

#### - fetchPoiCategoryIconNormal

Get the normal category icon for a POICategory.

```js
const getPoiCategoryIconNormal = (category) => {
    SitumPlugin.fetchPoiCategoryIconNormal(
      category,
      (icon) => {
        // returns base64 icon
      },
      (error) => {
        //returns error string
      }
    );
  };
  ```

#### - fetchPoiCategoryIconSelected

Get the selected category icon for a POICategory.

```js
const getPoiCategoryIconSelected = (category) => {
    SitumPlugin.fetchPoiCategoryIconSelected(
      category,
      (icon) => {
        // returns base64 icon
      },
      (error) => {
        //returns error string
      }
    );
  };
  ```


#### - invalidateCache

Invalidate all the resources in the cache.

```js
SitumPlugin.invalidateCache();
```

#### - requestDirections

Calculates a route between two points. Note that you can also specify the [accessibility mode](https://situm.com/docs/wayfinding/#route-types). The values allowed for this parameter are: `'CHOOSE_SHORTEST', 'ONLY_ACCESSIBLE'` or `'ONLY_NOT_ACCESSIBLE_FLOOR_CHANGES'`.

```js

// Set the accessibility mode used on route computation
const directionOptions = {
  accessibilityMode: 'CHOOSE_SHORTEST'
};

const points = [
  {
    floorIdentifier: floor.floorIdentifier,
    buildingIdentifier: building.buildingIdentifier,
    coordinate: {latitude:41.37968, longitude:2.1460623},
  },
  {
    floorIdentifier: floor.floorIdentifier,
    buildingIdentifier: building.buildingIdentifier,
    coordinate: {latitude:41.375566, longitude:2.1467063},
  }
];

SitumPlugin.requestDirections(
  [building, ...points, {...directionOptions}],
  (route) => {
    // returns route object
    let latlngs = [];
    for (let segment of route.segments) {
      for (let point of segment.points) {
        latlngs.push({
          latitude: point.coordinate.latitude,
          longitude: point.coordinate.longitude,
        });
      }
    }
    setPolylineLatlng(latlngs);
  },
  (error) => {
    // returns error string
    console.log(error);
  }
);
```

#### - requestNavigationUpdates

Necessary step to request progress. Alone this method does not provide progress object. You must feed navigation API with location, as indicated on updateNavigationWithLocation section.

```js
const requestNavigationUpdates = () => {
  SitumPlugin.requestNavigationUpdates(
    (navigation) => {
      //returns navigation object
    },
    (error) => {
      //returns error string
    },
    {
      distanceToGoalThreshold: 3,
      outsideRouteThreshold: 50
    }
    );
  };
```

#### - updateNavigationWithLocation

Usually, position variable should be one of the locations provided by the system on the [startPositioning](#--startpositioning) function.

```js
SitumPlugin.updateNavigationWithLocation(currentLocation)
```

#### - removeNavigationUpdates

When you are no longer interested on Navigation Updates you should call this method to remove internal allocated resources.

```js
SitumPlugin.removeNavigationUpdates();
```

#### - requestRealTimeUpdates

Emits the real time location of devices

```js
const requestRealtime = () => {
  SitumPlugin.requestRealTimeUpdates(
    (locations) => {
      // returns list of locations
    },
    (error) => {
      // returns error string
    },
    { building: building, pollTime: 3000 }
    );
  };
```

#### - removeRealTimeUpdates

When you are no longer interested on realtime location Updates you should call this method to remove internal allocated resources.

```js
SitumPlugin.removeRealTimeUpdates();
```

#### - checkIfPointInsideGeofence

Checks if a point on the map is inside a geofence

```js
SitumPlugin.checkIfPointInsideGeofence(
  { coordinate: coordinate },
  (response) => {
    // returns geofence name and id if point is inside a geofence
  }
);
```

#### - requestAuthorization

Request location permissions on Android & iOS.

```js
SitumPlugin.requestAuthorization()
```

#### - sdkVersions

Returns iOS, Android and react native SDK versions depending on the platform the app is running on.

```js
SitumPlugin.sdkVersions(response=>{

  // e.g. {ios: "2.45.0", android: "1.60@aar", react_native:"0.0.3"}
});
```

#### - getDeviceId

Returns user's device Id generated by SitumSDK

```js
SitumPlugin.getDeviceId(response=>{

  // e.g. {deviceId: 12345678}
});
```

#### - onEnterGeofences

Get notified about entering geofences. Take into account:

- This method must be called **before** the positioning is started.
- Positioning geofences (with `trainer_metadata` custom field) won't be notified.
- This callback only work with indoor locations. Any outdoor location will produce a call to [onExitedGeofences](#--onExitedGeofences) with the last positioned geofences as argument.

```js
SitumPlugin.onEnterGeofences((geofences) => {

  // e.g. [{"polygonPoints": [], "customFields": {}, "updatedAt": "Thu Jan 01 01:00:00 +0100 1970", "buildingIdentifier": "1234", "floorIdentifier": "123456", "code": "", "createdAt": "Thu Jan 01 01:00:00 +0100 1970", "infoHtml": "", "name": "My Geofence", "identifier": "12345678-aaaa-bbbb-cccc-12345678abcd"}]
});
```

#### - onExitGeofences

Get notified about exiting geofences. Take into account the considerations described at [onEnterGeofences](#--onEnterGeofences).


## Versioning

Please refer to [CHANGELOG.md](./CHANGELOG.md) for a list of notable changes for each version of the plugin.

You can also see the [tags on this repository](https://github.com/situmtech/situm-react-native-wayfinding/tags).

---

## Submitting contributions

You will need to sign a Contributor License Agreement (CLA) before making a submission. [Learn more here](https://situm.com/contributions/).

---

## License

This project is licensed under the MIT - see the [LICENSE](./LICENSE) file for further details.

---

## More information

More info is available at our [Developers Page](https://situm.com/docs/01-introduction/).

---

## Support information

For any question or bug report, please send an email to [support@situm.es](mailto:support@situm.es)
