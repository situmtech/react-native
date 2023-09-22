import {Platform} from 'react-native';
import {
  PERMISSIONS,
  request,
  requestMultiple,
  RESULTS,
} from 'react-native-permissions';

enum PermissionsRequestResultTypes {
  GRANTED,
  NOT_GRANTED,
}

export interface PermissionsRequestResult {
  result: PermissionsRequestResultTypes;
}

async function requestPermissions(): Promise<PermissionsRequestResult> {
  return new Promise(async (resolve, _reject) => {
    console.debug(
      'Situm > permisssions > Retrieving permissions for platform ' +
        Platform.OS,
    );
    if (Platform.OS === 'ios') {
      let granted = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

      if (granted === RESULTS.GRANTED) {
        console.debug(
          'Situm > permisssions > LOCATION_WHEN_IN_USE permission granted',
        );

        if (Platform.OS === 'ios' && parseInt(Platform.Version, 10) > 12) {
          granted = await request(PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL);

          if (granted === RESULTS.GRANTED) {
            console.debug(
              'Situm > permisssions > BLUETOOTH_PERIPHERAL permission granted',
            );
            resolve({result: PermissionsRequestResultTypes.GRANTED});
          } else {
            console.debug(
              'Situm > permisssions > BLUETOOTH_PERIPHERAL permission not granted',
            );
            resolve({result: PermissionsRequestResultTypes.NOT_GRANTED});
          }
        } else {
          console.warn(
            'Situm > permisssions > BLUETOOTH_PERIPHERAL permissions not required',
          );
          resolve({result: PermissionsRequestResultTypes.GRANTED});
        }
      } else {
        console.error('Situm > permisssions > ACCESS_FINE_LOCATION denied');
        resolve({result: PermissionsRequestResultTypes.NOT_GRANTED});
      }
    } else {
      try {
        //@ts-ignore
        if (Platform.Version > 30) {
          console.debug('Situm > permisssions > Android API is 30+');
          let granted = await requestMultiple([
            PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
            PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
            PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
          ]);

          if (
            granted['android.permission.ACCESS_FINE_LOCATION'] ===
              RESULTS.GRANTED &&
            granted['android.permission.BLUETOOTH_CONNECT'] ===
              RESULTS.GRANTED &&
            granted['android.permission.BLUETOOTH_SCAN'] === RESULTS.GRANTED
          ) {
            resolve({result: PermissionsRequestResultTypes.GRANTED});
          }
          resolve({result: PermissionsRequestResultTypes.NOT_GRANTED});
        } else {
          console.debug('Situm > permisssions > Android API <30');
          let granted = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

          if (granted === RESULTS.GRANTED) {
            console.debug(
              'Situm > permisssions > ACCESS_FINE_LOCATION granted',
            );
            resolve({result: PermissionsRequestResultTypes.GRANTED});
          } else {
            console.error('Situm > permisssions > ACCESS_FINE_LOCATION denied');
            resolve({result: PermissionsRequestResultTypes.NOT_GRANTED});
          }
        }
      } catch (err) {
        console.warn(err);
      }
    }

    resolve({result: PermissionsRequestResultTypes.NOT_GRANTED});
  });
}

export default requestPermissions;
