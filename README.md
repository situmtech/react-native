# Situm React Native Plugin &middot; [![npm](https://img.shields.io/npm/dm/situm-cordova-plugin-official.svg)](https://www.npmjs.com/package/situm-cordova-plugin-official) [![npm](https://img.shields.io/npm/v/situm-cordova-plugin-official.svg)](https://www.npmjs.com/package/situm-cordova-plugin-official) [![npm](https://img.shields.io/npm/l/situm-cordova-plugin-official.svg)](https://opensource.org/licenses/MIT)

[![](https://situm.es/assets/svg/logo-situm.svg)](https://www.situm.com)

---

## Table of contents

  * [Description](#description)
  * [Setup your account](#setup-your-account)
  * [Installing pre-requisites](#installing-pre-requisites)
  * [Using the Plugin](#using-the-plugin)
    + [Accessing plugin object](#accessing-plugin-object)
    + [Methods](#methods)
      - [setApiKey](#--setapikey)
      - [setUserPass](#--setuserpass)
      - [setCacheMaxAge](#--setcachemaxage)
      - [startPositioning](#--startpositioning)
      - [stopPositioning](#--stoppositioning)
      - [fetchBuildings](#--fetchbuildings)
      - [fetchFloorsFromBuilding](#--fetchfloorsfrombuilding)
      - [fetchIndoorPOIsFromBuilding](#--fetchindoorpoisfrombuilding)
      - [fetchOutdoorPOIsFromBuilding](#--fetchoutdoorpoisfrombuilding)
      - [fetchEventsFromBuilding](#--fetcheventsfrombuilding)
      - [fetchPoiCategories](#--fetchpoicategories)
      - [fetchMapFromFloor](#--fetchmapfromfloor)
      - [fetchPoiCategoryIconNormal](#--fetchpoicategoryiconnormal)
      - [fetchPoiCategoryIconSelected](#--fetchpoicategoryiconselected)
      - [invalidateCache](#--invalidatecache)
      - [requestDirections](#--requestdirections)
      - [requestNavigationUpdates](#--requestnavigationupdates)
      - [updateNavigationWithLocation](#--updatenavigationwithlocation)
      - [removeNavigationUpdates](#--removenavigationupdates)
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

After cloning the project, follow these steps to integrate and run with a react-native app.

1. Add the plugin as a dependency in your `package.json` file.

```json
"dependencies": {
	"react-native-situm-plugin": "file:../situm-react-native-plugin"
}
```

2. Execute `yarn`

### 2) Integrate plugin into project from npm (Pending) 

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

#### - setApiKey

Log in into your Situm Account. This key is generated in Situm Dashboard. Return true if apiKey was set successfully, otherwise false

#### - setUserPass

Provides user's email and password.

#### - setCacheMaxAge

Sets the maximum age of a cached response in seconds.

#### - startPositioning

Starts the positioning system.

#### - stopPositioning

Stop the positioning system on current active listener.

#### - fetchBuildings

Download all the buildings for the current user.

```js
const getBuildings = () => {
  SitumPlugin.fetchBuildings(
    (buildings) => {
      if (!buildings || buildings.length == 0)
        alert(
          'No buildings, add a few buildings first by going to:\nhttps://dashboard.situm.es/buildings',
        );
    },
    (error) => {},
  );
};
```

### - fetchBuildingInfo

Download the information (floors, pois, ...) of a building.

```js
const getBuildingInfo = () => {
  SitumPlugin.fetchBuildingInfo(
    building,
    (buildingInfo) => {},
    (error) => {},
  );
};
```

#### - fetchFloorsFromBuilding

Download all the floors of a building.

```js
const getFloorsFromBuilding = () => {
  SitumPlugin.fetchFloorsFromBuilding(
    building,
    (floors) => {},
    (error) => {},
  );
};
```

#### - fetchIndoorPOIsFromBuilding

Download the indoor POIs of a building.

#### - fetchOutdoorPOIsFromBuilding

Download the outdoor POIs of a building.

#### - fetchEventsFromBuilding

Download the events of a building.

#### - fetchPoiCategories

Get all POI categories, download and cache their icons asynchronously.

#### - fetchMapFromFloor

Download the map image of a floor.

```js
const getMapFromFloor = (floor) => {
  SitumPlugin.fetchMapFromFloor(
    floor,
    (map) => {},
    (error) => {},
  );
};
```

#### - fetchPoiCategoryIconNormal

Get the normal category icon for a POICategory.

#### - fetchPoiCategoryIconSelected

Get the selected category icon for a POICategory.

#### - invalidateCache

Invalidate all the resources in the cache.

#### - requestDirections

Calculates a route between two points.


#### - requestNavigationUpdates

Necessary step to request progress. Alone this method does not provide progress object. You must feed navigation API with location, as indicated on updateNavigationWithLocation section.

#### - updateNavigationWithLocation
    
Usually, position variable should be one of the locations provided by the system on the [startPositioning](#--startpositioning) function.

#### - removeNavigationUpdates

When you are no longer interested on Navigation Updates you should call this method to remove internal allocated resources.


## License

Situm-React-Native-Plugin is licensed under [MIT License](https://opensource.org/licenses/MIT)

## More information

More info is available at our [Developers Page](http://developers.situm.com/pages/mobile/react-native/).

## Support information
For any question or bug report, please send an email to [support@situm.com](mailto:support@situm.com)