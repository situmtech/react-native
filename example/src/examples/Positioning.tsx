import React, {useEffect, useState} from 'react';
import {ScrollView, Text} from 'react-native';
import {getDefaultLocationOptions} from '../settings';
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

function PositioningScreen() {
  // State variables to store location, status, error, and geofences data
  const [location, setLocation] = useState<String>('ready to be used');
  const [status, setStatus] = useState<String>('ready to be used');
  const [error, setError] = useState<String>('ready to be used');
  const [geofences, setGeofences] = useState<String>('ready to be used');

  // Configure Situm SDK
  async function configureSitum() {
    try {
      await SitumPlugin.setConfiguration({
        useRemoteConfig: false,
      });
      console.log('Configuration set successfully');
    } catch (err) {
      console.log('Failed to set configuration:', err);
    }
  }

  useEffect(() => {
    // Initial configuration and callback registration
    configureSitum();
    registerCallbacks();

    return () => {
      // Cleanup: stop positioning when component is unmounted
      stopPositioning();
    };
  }, []);

  // Request permissions required by Situm SDK
  const requestLocationPermissions = async () => {
    requestPermissions();
  };

  // Start positioning using Situm SDK
  const startPositioning = async () => {
    requestPermissions();

    console.log('Starting positioning');
    setLocation('');
    setStatus('');
    setError('');

    const locationOptions = getDefaultLocationOptions();

    try {
      SitumPlugin.requestLocationUpdates(locationOptions);
    } catch (err: any) {
      console.debug(err);
    }
  };

  // Register callbacks to handle Situm SDK events
  function registerCallbacks() {
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
      setGeofences('Inside ' + JSON.stringify(items, null, 2));
    });

    // Handle geofence exit event
    SitumPlugin.onExitGeofences((items: any) => {
      console.log('Detected Exited geofences: ' + JSON.stringify(items));
      setGeofences('Outside ' + JSON.stringify(items, null, 2));
    });
  }

  // Stop positioning using Situm SDK
  const stopPositioning = async () => {
    console.log('Situm > example > Stopping positioning');
    setLocation('');
    setStatus('');
    setError('');
    setBuildings(null);
    try {
      await SitumPlugin.removeLocationUpdates();
    } catch (err: any) {
      console.log('Situm > example > Could not stop positioning');
    }
  };

  // Render the UI
  return (
    <ScrollView style={{...styles.screenWrapper}}>
      <List.Section>
        <Button onPress={requestLocationPermissions} mode="contained">
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
}

export default PositioningScreen;
