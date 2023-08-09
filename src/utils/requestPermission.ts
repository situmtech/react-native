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

  // Check if already denied
  if (granted !== RESULTS.GRANTED) {
    throw "Situm > permissions > ACCESS_FINE_LOCATION denied";
  }

  console.debug(
    "Situm > permissions > LOCATION_WHEN_IN_USE permission granted"
  );

  //@ts-ignore
  if (parseInt(Platform.Version, 10) > 12) {
    granted = await request(PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL);

    if (granted === RESULTS.GRANTED) {
      console.debug(
        "Situm > permissions > BLUETOOTH_PERIPHERAL permission granted"
      );
      return true;
    } else {
      throw "Situm > permissions > BLUETOOTH_PERIPHERAL permission not granted";
    }
  } else {
    console.debug(
      "Situm > permissions > BLUETOOTH_PERIPHERAL permissions not required"
    );
    return true;
  }
};

const checkAndroidPermissions = async () => {
  let granted;

  //@ts-ignore
  if (Platform.Version <= 30) {
    console.debug("Situm > permissions > ANDROID VERSION < 30");

    granted = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

    if (granted === RESULTS.GRANTED) {
      console.debug("Situm > permissions > ACCESS_FINE_LOCATION granted");
      return true;
    } else {
      throw "Situm > permissions > ACCESS_FINE_LOCATION permission not granted";
    }
  }

  console.debug("Situm > permissions > ANDROID VERSION > 30");
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
    console.debug(
      "Situm > permissions > ACCESS_FINE_LOCATION, BLUETOOTH_CONNECT and BLUETOOTH_SCAN permissions granted"
    );
    return true;
  }

  throw "Situm > permissions > ACCESS_FINE_LOCATION, BLUETOOTH_CONNECT or BLUETOOTH_SCAN permissions not granted";
};

export const requestPermission = () =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise<void>(async (resolve, reject) => {
    console.log(
      "Situm > permissions > Retrieving permissions for platform " + Platform.OS
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

    reject(`Situm > permissions > Platform '${Platform.OS}' not supported`);
  });

export default requestPermission;
