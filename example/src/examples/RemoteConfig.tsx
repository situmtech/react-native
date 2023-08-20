import React, {useEffect, useState} from 'react';
import {Text, SafeAreaView, ScrollView} from 'react-native';

import SitumPlugin, {
  Location,
  Error,
  LocationStatus,
  LocationStatusName,
} from '@situm/react-native';

import styles from './styles/styles';
import requestPermissions from './Utils/RequestPermissions';
import {Button, Card, Divider, List} from 'react-native-paper';

export const RemoteConfig = () => {
  const [location, setLocation] = useState<String>('ready to be used');
  const [status, setStatus] = useState<String>('ready to be used');
  const [error, setError] = useState<String>('ready to be used');
  const [geofences, setGeofences] = useState<String>('ready to be used');

  //We will call this method from a <Button /> later
  const stopPositioning = async () => {
    console.log('Stopping positioning');
    SitumPlugin.removeUpdates();
  };

  const startPositioning = () => {
    requestPermissions();
    registerCallbacks();

    console.log('Starting positioning');
    setLocation('');
    setStatus('');
    setError('');
    //Start positioning
    SitumPlugin.requestLocationUpdates();
  };

  function registerCallbacks() {
    console.log('Registering callbacks');
    SitumPlugin.onLocationUpdate((location: Location) => {
      //console.log(JSON.stringify(location, null, 2));
      setLocation(JSON.stringify(location, null, 2));
    });

    SitumPlugin.onLocationStatus((status: LocationStatus) => {
      if (status.statusName in LocationStatusName) {
        console.log(JSON.stringify(status));
        setStatus(JSON.stringify(status, null, 3));
      }
    });

    SitumPlugin.onLocationError((err: Error) => {
      console.log(JSON.stringify(err));
      setError(err.message);
    });

    SitumPlugin.onLocationStopped(() => {
      console.log('Situm > hook > Stopped positioning');
    });

    SitumPlugin.onEnterGeofences((items: any) => {
      console.log('Detected Entered geofences: ' + JSON.stringify(items));
      setGeofences('Inside ' + JSON.stringify(items));
    });

    SitumPlugin.onExitGeofences((items: any) => {
      console.log('Detected Exited geofences: ' + JSON.stringify(items));
      setGeofences('Outside ' + JSON.stringify(items));
    });
  }

  useEffect(() => {
    const enableRemoteConfig = async () => {
      const success: boolean = await SitumPlugin.setUseRemoteConfig(true);
      if (success) console.log('Remote config enabled');
      else console.log('Unable to set remote config');
    };

    enableRemoteConfig();

    return () => {
      //STOP POSITIONING ON CLOSE COMPONENT
      stopPositioning();
    };
  }, []);

  return (
    <ScrollView style={{...styles.screenWrapper}}>
      <SafeAreaView>
        <List.Section>
          <Button onPress={startPositioning} mode="contained">
            Start positioning
          </Button>
          <Divider style={{marginVertical: 5}} />
          <Button onPress={stopPositioning} mode="contained">
            Stop positioning
          </Button>
        </List.Section>

        <Card mode="contained" style={{marginVertical: 5}}>
          <Card.Title title="Error" />
          <Card.Content>
            <Text style={styles.text}>{error}</Text>
          </Card.Content>
        </Card>

        <Card mode="contained" style={{marginVertical: 5}}>
          <Card.Title title="Status" />
          <Card.Content>
            <Text style={styles.text}>{status}</Text>
          </Card.Content>
        </Card>

        <Card mode="contained" style={{marginVertical: 5}}>
          <Card.Title title="Location" />
          <Card.Content>
            <Text style={styles.text}>{location}</Text>
          </Card.Content>
        </Card>

        <Card mode="contained" style={{marginVertical: 5}}>
          <Card.Title title="Geofences actions" />
          <Card.Content>
            <Text style={styles.text}>{geofences}</Text>
          </Card.Content>
        </Card>
      </SafeAreaView>
    </ScrollView>
  );
};
