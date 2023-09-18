import React, {useEffect, useState} from 'react';
import {ScrollView, Text} from 'react-native';
import SitumPlugin, {
  LocationStatus,
  LocationStatusName,
  Location,
  Error,
} from '@situm/react-native';
import styles from './styles/styles';
import requestPermissions from './Utils/RequestPermissions';
import {setBuildings} from '../../../src/wayfinding/store';
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
        console.log(JSON.stringify(st));
        setStatus(JSON.stringify(st, null, 3));
      }
    });

    // Handle location errors
    SitumPlugin.onLocationError((err: Error) => {
      console.log(JSON.stringify(err));
      setError(err.message);
    });

    // Handle positioning stop event
    SitumPlugin.onLocationStopped(() => {
      console.log('Situm > example > Stopped positioning');
    });

    // Handle geofence enter event
    SitumPlugin.onEnterGeofences((items: any) => {
      console.log('Detected Entered geofences: ' + JSON.stringify(items));
      setGeofences('Inside ' + JSON.stringify(items));
    });

    // Handle geofence exit event
    SitumPlugin.onExitGeofences((items: any) => {
      console.log('Detected Exited geofences: ' + JSON.stringify(items));
      setGeofences('Outside ' + JSON.stringify(items));
    });
  };

  // Start positioning using Situm SDK
  const startPositioning = async () => {
    await requestPermissions();

    console.log('Starting positioning');
    setLocation('');
    setStatus('');
    setError('');

    //You may overwrite some remote configuration options if you want
    const locationOptions = {
      useBle: true,
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
    setBuildings(null);
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
        <Button onPress={requestPermissions} mode="contained">
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
