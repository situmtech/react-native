# Situm React Native Plugin &middot; [![npm](https://img.shields.io/npm/dm/react-native-situm-plugin.svg)](https://www.npmjs.com/package/react-native-situm-plugin) [![npm](https://img.shields.io/npm/v/react-native-situm-plugin.svg)](https://www.npmjs.com/package/react-native-situm-plugin) [![npm](https://img.shields.io/github/license/situmtech/situm-react-native-plugin.svg)](https://opensource.org/licenses/MIT)


[![](https://situm.es/assets/svg/logo-situm.svg)](https://www.situm.com)

---

## Table of contents

  * [Description](#description)
  * [Setup your account](#setup-your-account)
  * [Installing pre-requisites](#installing-pre-requisites)
  * [Using the Plugin](#using-the-plugin)
    + [Accessing plugin object](#accessing-plugin-object)
    + [Methods](#methods)
      - [initSitumSDK](#--initsitumsdk)
      - [setApiKey](#--setapikey)
      - [setUserPass](#--setuserpass)
      - [setCacheMaxAge](#--setcachemaxage)
      - [startPositioning](#--startpositioning)
      - [stopPositioning](#--stoppositioning)
      - [fetchBuildings](#--fetchbuildings)
      - [fetchFloorsFromBuilding](#--fetchfloorsfrombuilding)
      - [fetchIndoorPOIsFromBuilding](#--fetchindoorpoisfrombuilding)
      - [fetchOutdoorPOIsFromBuilding](#--fetchoutdoorpoisfrombuilding)
      - [fetchEventsFromBuilding](# --fetcheventsfrombuilding)
      - [fetchPoiCategories](#--fetchpoicategories)
      - [fetchMapFromFloor](#--fetchmapfromfloor)
      - [fetchPoiCategoryIconNormal](#--fetchpoicategoryiconnormal)
      - [fetchPoiCategoryIconSelected](#--fetchpoicategoryiconselected)
      - [invalidateCache](#--invalidatecache)
      - [requestDirections](#--requestdirections)
      - [requestNavigationUpdates](#--requestnavigationupdates)
      - [updateNavigationWithLocation](#--updatenavigationwithlocation)
      - [removeNavigationUpdates](#--removenavigationupdates)
      - [requestRealTimeUpdates](#--requestRealTimeUpdates)
      - [removeRealTimeUpdates](#--removeRealTimeUpdates)
      - [checkIfPointInsideGeofence](#--checkIfPointInsideGeofence)
      - [requestAuthorization](#--requestAuthorization)
      - [sdkVersions](#--sdkVersions)
      - [getDeviceId](#--getDeviceId)
  * [License](#license)
  * [More information](#more-information)
  * [Support information](#support-information)

---

## Description

Situm React Native Plugin is a set of utilities that allow any developer to build React Native location based apps using Situm's indoor positioning system. Among many other capabilities, apps developed with Situm React Native Plugin will be able to:

* Obtain information related to buildings where Situm's positioning system is already configured: floorplans, points of interest, geotriggered events, etc.

* Retrieve the location of the smartphone inside these buildings (position, orientation, and floor where the smartphone is).

* Compute a route from a point A (e.g. where the smartphone is) to a point B (e.g. any point of interest within the building).

* Trigger notifications when the user enters a certain area.

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

Make sure to delete `node_modulles/` at `project/node_modules/react-native-situm-plugin/node_modules`.

Note: As of now the SDK is available only on Github. When updating the SDK, make sure to delete the existing one from `node_modules/react-native-situm-plugin`.


### 2) Integrate plugin into project from npm  

```shell
yarn add react-native-situm-plugin

#OR

npm install --save react-native-situm-plugin
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

If your React Native version >= 0.63.0 podspec will be detected automatically.

```js
  target 'YourApp' do

    pod 'ReactNativeSitumPlugin', :path => '../node_modules/react-native-situm-plugin/ReactNativeSitumPlugin.podspec'

  end
```

You may need to add a Header Search Path: ([screenshot](https://reactnative.dev/docs/linking-libraries-ios.html#step-3))

```
  $(SRCROOT)/../node_modules/react-native-situm-plugin/lib/ios
```

## Using the Plugin

### Accessing plugin object

In order to use the plugin in a React Native component all you need is the following:

```js
import  SitumPlugin  from  "react-native-situm-plugin";

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

#### - setApiKey

Log in into your Situm Account. This key is generated in Situm Dashboard. Return true if apiKey was set successfully, otherwise false

```js
SitumPlugin.setApiKey("SITUM_EMAIL","SITUM_API_KEY")
```

#### - setUserPass

Provides user's email and password.
```js
SitumPlugin.setUserPass("SITUM_EMAIL","SITUM_USER_PASSWORD")
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

const subscriptionId = SitumPlugin.startPositioning(
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

Stop the positioning system on current active listener. Make sure to pass `subscriptionId` received from start positioning updates for those particular listeners.
```js
SitumPlugin.stopPositioning(subscriptionId, (success: any) => {});
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

Calculates a route between two points.
```js
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
  [building, ...points],
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

Request location permissions on Android & iOS

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


## License

Situm-React-Native-Plugin is licensed under [MIT License](https://opensource.org/licenses/MIT)

## More information

More info is available at our [Developers Page](http://developers.situm.com/pages/mobile/react-native/).

## Support information
For any question or bug report, please send an email to [support@situm.com](mailto:support@situm.com)
