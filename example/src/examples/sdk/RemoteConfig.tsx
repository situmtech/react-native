import React, {useEffect, useState} from 'react';
import {ScrollView, Text} from 'react-native';
import SitumPlugin, {
  LocationStatus,
  LocationStatusName,
  Location,
  Error,
  ErrorCode,
} from '@situm/react-native';
import styles from '../styles/styles';
import {Button, Card, Divider, List} from 'react-native-paper';

export const RemoteConfig = () => {
  // State variables to store location, status, error, and geofences data
  const [location, setLocation] = useState<string>('ready to be used');
  const [status, setStatus] = useState<string>('ready to be used');
  const [error, setError] = useState<string>('ready to be used');
  const [geofences, setGeofences] = useState<string>('ready to be used');

  // Register callbacks to handle Situm SDK events
  const registerCallbacks = () => {
    // Handle location updates
    SitumPlugin.onLocationUpdate((loc: Location) => {
      setLocation(JSON.stringify(loc, null, 2));
    });

    // Handle location status updates
    SitumPlugin.onLocationStatus((st: LocationStatus) => {
      if (st.statusName in LocationStatusName) {
        console.log(
          'Situm > example > New location status: ',
          JSON.stringify(st),
        );
        setStatus(JSON.stringify(st, null, 3));
      }
    });

    // Handle location errors
    SitumPlugin.onLocationError((err: Error) => {
      console.error(
        'Situm > example > Error while positioning: ',
        JSON.stringify(err),
      );

      // The purpose of this switch is just to show how you may handle each error.
      // Instead of outputing a log, you might want inform the user
      // and direct him to take certain actions
      switch (err.code) {
        case ErrorCode.LOCATION_PERMISSION_DENIED:
          console.log(
            "Situm > example > Without location permission, we can't geolocate the smartphone",
          );
          break;
        case ErrorCode.BLUETOOTH_PERMISSION_DENIED:
          console.log(
            "Situm > example > Without Bluetooth permission, we can't scan BLE beacons.",
          );
          break;
        case ErrorCode.BLUETOOTH_DISABLED:
          console.log(
            "Situm > example > If BLE is disabled, we can't scan beacons",
          );
          break;
        case ErrorCode.LOCATION_DISABLED:
          console.log(
            "Situm > example > If location is disabled, we can't geolocate the smartphone",
          );
          break;
      }

      setError(JSON.stringify(err));
    });

    // Handle positioning stop event
    SitumPlugin.onLocationStopped(() => {
      console.log('Situm > example > Stopped positioning');
    });

    // Handle geofence enter event
    SitumPlugin.onEnterGeofences((items: any) => {
      console.log(
        'Situm > example > Detected Entered geofences: ' +
          JSON.stringify(items),
      );
      setGeofences('Inside ' + JSON.stringify(items));
    });

    // Handle geofence exit event
    SitumPlugin.onExitGeofences((items: any) => {
      console.log(
        'Situm > example > Detected Exited geofences: ' + JSON.stringify(items),
      );
      setGeofences('Outside ' + JSON.stringify(items));
    });
  };

  const handlePermissionsButton = async () => {
    // Do nothing.
  };

  // Start positioning using Situm SDK
  const startPositioning = async () => {
    console.log('Situm > example > Starting positioning');
    setLocation('');
    setStatus('');
    setError('');

    //You may overwrite some remote configuration options if you want
    const locationOptions = {
      //useBle: true,
    };

    try {
      SitumPlugin.requestLocationUpdates(locationOptions);
    } catch (e) {
      console.log(`Situm > example > Could not start positioning ${e}`);
    }
  };

  // Stop positioning using Situm SDK
  const stopPositioning = () => {
    console.log('Situm > example > Stopping positioning');
    setLocation('');
    setStatus('');
    setError('');
    try {
      SitumPlugin.removeLocationUpdates();
    } catch (e) {
      console.log(`Situm > example > Could not stop positioning ${e}`);
    }
  };

  useEffect(() => {
    // Initial configuration and callback registration
    SitumPlugin.setConfiguration({
      useRemoteConfig: true,
    });
    // Tells the underlying native SDKs to automatically manage permissions
    // and sensor related issues.
    SitumPlugin.enableUserHelper();

    registerCallbacks();

    return () => {
      // Cleanup: stop positioning when component is unmounted
      stopPositioning();
    };
  }, []);

  // Render the UI
  return (
    <ScrollView style={{...styles.screenWrapper}}>
      <List.Section>
        <Button onPress={handlePermissionsButton} mode="contained">
          Request permissions
        </Button>
        <Divider style={styles.margin} />
        <Button onPress={startPositioning} mode="contained">
          Start positioning
        </Button>
        <Divider style={styles.margin} />
        <Button onPress={stopPositioning} mode="contained">
          Stop positioning
        </Button>
      </List.Section>
      {/* Display error, status, location, and geofences data in cards */}
      <Card mode="contained" style={styles.margin}>
        <Card.Title title="Error" />
        <Card.Content>
          <Text style={styles.text}>{error}</Text>
        </Card.Content>
      </Card>
      <Card mode="contained" style={styles.margin}>
        <Card.Title title="Status" />
        <Card.Content>
          <Text style={styles.text}>{status}</Text>
        </Card.Content>
      </Card>
      <Card mode="contained" style={styles.margin}>
        <Card.Title title="Location" />
        <Card.Content>
          <Text style={styles.text}>{location}</Text>
        </Card.Content>
      </Card>
      <Card mode="contained" style={styles.margin}>
        <Card.Title title="Geofences actions" />
        <Card.Content>
          <Text style={styles.text}>{geofences}</Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};
