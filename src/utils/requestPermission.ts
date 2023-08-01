import { Platform } from "react-native";
import {
  PERMISSIONS,
  request,
  requestMultiple,
  RESULTS,
} from "react-native-permissions";

// TODO: can requestMultiple be used ?
const checkIOSPermissions = async () => {
  let granted = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

  if (granted === RESULTS.GRANTED) {
    console.info(
      "Situm > permissionns > LOCATION_WHEN_IN_USE permission granted"
    );

    //@ts-ignore
    if (parseInt(Platform.Version, 10) > 12) {
      granted = await request(PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL);

      if (granted === RESULTS.GRANTED) {
        console.info(
          "Situm > permissionns > BLUETOOTH_PERIPHERAL permission granted"
        );
        return true;
      } else {
        throw "Situm > permissionns > BLUETOOTH_PERIPHERAL permission not granted";
      }
    } else {
      console.warn(
        "Situm > permissionns > BLUETOOTH_PERIPHERAL permissions not required"
      );
      return true;
    }
  } else {
    throw "Situm > permissionns > ACCESS_FINE_LOCATION denied";
  }
};

const checkAndroidPermissions = async () => {
  let granted;
  //@ts-ignore
  if (Platform.Version > 30) {
    console.log("Situm > permissionns > ANDROID VERSION > 30");
    granted = await requestMultiple([
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
      PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
    ]);

    if (
      granted["android.permission.ACCESS_FINE_LOCATION"] === RESULTS.GRANTED &&
      granted["android.permission.BLUETOOTH_CONNECT"] === RESULTS.GRANTED &&
      granted["android.permission.BLUETOOTH_SCAN"] === RESULTS.GRANTED
    ) {
      console.info(
        "Situm > permissionns > ACCESS_FINE_LOCATION, BLUETOOTH_CONNECT and BLUETOOTH_SCAN permissions granted"
      );
      return true;
    }

    throw "Situm > permissionns > ACCESS_FINE_LOCATION, BLUETOOTH_CONNECT and BLUETOOTH_SCAN permissions not granted";
  } else {
    console.info("ANDROID VERSION < 30");
    granted = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

    if (granted === RESULTS.GRANTED) {
      console.info("Situm > permissionns > ACCESS_FINE_LOCATION granted");
      return true;
    } else {
      throw "Situm > permissionns > ACCESS_FINE_LOCATION permission not granted";
    }
  }
};

const requestPermission = () =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise<void>(async (resolve, reject) => {
    console.log(
      "Situm > permissionns > Retrieving permissions for platform " +
        Platform.OS
    );
    if (Platform.OS === "ios") {
      await checkIOSPermissions()
        .then(() => resolve())
        .catch((e: string) => {
          console.warn(e);
          reject(e);
        });
    } else if (Platform.OS === "android") {
      await checkAndroidPermissions()
        .then(() => resolve())
        .catch((e: string) => {
          console.warn(e);
          reject(e);
        });
    }

    reject(`Situm > permissionns > Platform ${Platform.OS} not supported`);
  });

export default requestPermission;
