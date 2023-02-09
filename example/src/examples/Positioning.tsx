import React, {useEffect, useState} from 'react';
import {
  Button,
  PermissionsAndroid,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {getDefaultLocationOptions} from '../settings';
import SitumPlugin from 'react-native-situm-plugin';
import styles from './styles/styles';

let subscriptionId = -1;

function PositioningScreen() {
  useEffect(() => {
    //Set remote config to false, so we actually use local request
    SitumPlugin.setUseRemoteConfig('false', (res: any) => {});
  }, []);

  const [location, setLocation] = useState<String>('ready to be used');
  const [status, setStatus] = useState<String>('ready to be used');
  const [error, setError] = useState<String>('ready to be used');

  // Requests the permissions required by Situm (e.g. Location)
  const requestLocationPermissions = async () => {
    SitumPlugin.requestAuthorization();
  };

  const startPositioning = async () => {
    if (subscriptionId != -1) {
      console.log('Positioning already started');
      return;
    }

    console.log('Starting positioning');
    setLocation('');
    setStatus('');
    setError('');

    //Declare the locationOptions (empty = default parameters)
    const locationOptions = {};
    //Start positioning
    subscriptionId = SitumPlugin.startPositioning(
      (location: any) => {
        //returns location object
        console.log(JSON.stringify(location, null, 2));
        setLocation(JSON.stringify(location, null, 2));
      },
      (status: any) => {
        //returns positioning status
        console.log(JSON.stringify(status));
        setStatus(JSON.stringify(status, null, 3));
      },
      (error: any) => {
        // returns an error string
        console.log(JSON.stringify(error));
        setError(error);
      },
      locationOptions,
    );
  };

  //We will call this method from a <Button /> later
  const stopPositioning = async () => {
    console.log('Stopping positioning');
    SitumPlugin.stopPositioning(subscriptionId, (success: any) => {});
    setLocation('');
    setStatus('');
    setError('');
    subscriptionId = -1;
  };

  return (
    <ScrollView>
      <Button
        title="request permissions"
        onPress={requestLocationPermissions}
      />
      <Button title="start" onPress={startPositioning} />
      <Button title="stop" onPress={stopPositioning} />
      <Text style={styles.text}>Error: {error}</Text>
      <Text style={styles.text}>Status: {status}</Text>
      <Text style={styles.text}>Location: {location}</Text>
    </ScrollView>
  );
}

export default PositioningScreen;
