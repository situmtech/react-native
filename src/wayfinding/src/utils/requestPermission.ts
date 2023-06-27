import { Platform } from 'react-native';
import {
  PERMISSIONS,
  request,
  requestMultiple,
  RESULTS,
} from 'react-native-permissions';

// TODO: can requestMultiple be used ?
const checkIOSPermissions = async () => {
  let granted = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

  if (granted === RESULTS.GRANTED) {
    console.info('LOCATION_WHEN_IN_USE permission granted');

    //@ts-ignore
    if (parseInt(Platform.Version, 10) > 12) {
      granted = await request(PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL);

      if (granted === RESULTS.GRANTED) {
        console.info('BLUETOOTH_PERIPHERAL permission granted');
        return true;
      } else {
        throw 'BLUETOOTH_PERIPHERAL permission not granted';
      }
    } else {
      console.warn('BLUETOOTH_PERIPHERAL permissions not required');
      return true;
    }
  } else {
    throw 'ACCESS_FINE_LOCATION denied';
  }
};

const checkAndroidPermissions = async () => {
  let granted;
  //@ts-ignore
  if (Platform.Version > 30) {
    console.log('ANDROID VERSION > 30');
    granted = await requestMultiple([
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
      PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
    ]);

    if (
      granted['android.permission.ACCESS_FINE_LOCATION'] === RESULTS.GRANTED &&
      granted['android.permission.BLUETOOTH_CONNECT'] === RESULTS.GRANTED &&
      granted['android.permission.BLUETOOTH_SCAN'] === RESULTS.GRANTED
    ) {
      console.info(
        'ACCESS_FINE_LOCATION, BLUETOOTH_CONNECT and ACCESS_FINE_LOCATION permissions granted'
      );
      return true;
    }
    throw 'ACCESS_FINE_LOCATION, BLUETOOTH_CONNECT and ACCESS_FINE_LOCATION permissions not granted';
  } else {
    console.info('ANDROID VERSION < 30');
    granted = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

    if (granted === RESULTS.GRANTED) {
      console.info('ACCESS_FINE_LOCATION granted');
      return true;
    } else {
      throw 'ACCESS_FINE_LOCATION permission not granted';
    }
  }
};

const requestPermission = () =>
  new Promise<void>(async (resolve, reject) => {
    console.log('Retrieving permissions for platform ' + Platform.OS);
    if (Platform.OS === 'ios') {
      await checkIOSPermissions()
        .then(() => resolve())
        .catch((e: string) => {
          console.warn(e);
          reject(e);
        });
    } else if (Platform.OS === 'android') {
      await checkAndroidPermissions()
        .then(() => resolve())
        .catch((e: string) => {
          console.warn(e);
          reject(e);
        });
    }

    reject(`Platform ${Platform.OS} not supported`);
  });

export default requestPermission;
