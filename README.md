Note: This section will be removed once final version is published to `npm`.

Firstly need to setup react-native development environment. To get started please follow instructions under section **React Native CLI Quickstart** on this [guide.](https://reactnative.dev/docs/environment-setup)

1. Clone [Getting Started](https://github.com/situmtech/situm-react-native-plugin) project
2. Clone [Situm Plugin](https://github.com/situmtech/situm-react-native-plugin) Project
3. Place both cloned projects in same workspace directory, e.g.

```
  - workspace
     |-situm-react-native-plugin
     |-situm-react-native-getting-started
```

4. Checkout to `situm-react-native-getting-started` directory
5. Run command `yarn` to install all the dependencies
6. Checkout to `situm-react-native-getting-started/ios` directory
7. Run command `pod install` to install plugin dependency
8. On the root directory of the project, run `react-native run-ios` or `react-run run-android` command to launch the project on iOS simulator or android emulator respectively.

### Add to an existing project

After cloning the project, follow these steps to integrate and run with a react-native app.

1. Add the plugin as a dependency in your `package.json` file.

```json
"dependencies": {
	"react-native-situm-plugin": "file:../situm-react-native-plugin"
}
```

2. Execute `yarn`

## General use

```js
import  SitumPlugin  from  "react-native-situm-plugin";

   SitumPlugin.fetchFloorsFromBuilding(building,
       (floors) => {...},
       (error: string) => {...},
   );
```

### Fetch Buildings

```js
const getBuildings = () => {
  SitumPlugin.fetchBuildings(
    (buildings: any) => {
      if (!buildings || buildings.length == 0)
        alert(
          'No buildings, add a few buildings first by going to:\nhttps://dashboard.situm.es/buildings',
        );
    },
    (error: any) => {},
  );
};
```

### Fetch Building Info

```js
const getBuildingInfo = () => {
  SitumPlugin.fetchBuildingInfo(
    building,
    (buildingInfo: any) => {},
    (error: string) => {},
  );
};
```

### Fetch Floors from Building

```js
const getFloorsFromBuilding = () => {
  SitumPlugin.fetchFloorsFromBuilding(
    building,
    (floors: any) => {},
    (error: string) => {},
  );
};
```

### Fetch Map image from Floor

```js
const getMapFromFloor = (floor: any) => {
  SitumPlugin.fetchMapFromFloor(
    floor,
    (map: any) => {},
    (error: string) => {},
  );
};
```

Note: This repository is under development, will be adding more methods soon.
