import React, {useEffect, useState} from 'react';
import {ScrollView, Text} from 'react-native';
import {getDefaultLocationOptions} from '../settings';
import SitumPlugin from '@situm/react-native';
import styles from './styles/styles';
import requestPermissions from './Utils/RequestPermissions';
import {setBuildings} from '../../../src/wayfinding/store';
import {Button, Divider, List} from 'react-native-paper';

function PositioningScreen() {
  useEffect(() => {
    //Set remote config to false, so we actually use local request
    SitumPlugin.setUseRemoteConfig('false', (response: any) => {
      console.log(`Remote config disabled: ${JSON.stringify(response)}`);
    });

    return () => {
      //STOP POSITIONING ON CLOSE COMPONENT
      stopPositioning();
    };
  }, []);

  const [location, setLocation] = useState<String>('ready to be used');
  const [status, setStatus] = useState<String>('ready to be used');
  const [error, setError] = useState<String>('ready to be used');

  // Requests the permissions required by Situm (e.g. Location)
  const requestLocationPermissions = async () => {
    requestPermissions();
  };

  const startPositioning = async () => {
    requestPermissions();

    console.log('Starting positioning');
    setLocation('');
    setStatus('');
    setError('');

    //Declare the locationOptions (empty = default parameters)
    const locationOptions = getDefaultLocationOptions();

    //Start positioning
    SitumPlugin.startPositioning(
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
    setLocation('');
    setStatus('');
    setError('');
    setBuildings(null);
    SitumPlugin.stopPositioning((_success: any) => {});
  };

  return (
    <ScrollView style={{...styles.screenWrapper}}>
      <List.Section>
        <Button onPress={requestLocationPermissions} mode="contained">
          Request permissions
        </Button>
        <Divider style={{marginVertical: 5}} />
        <Button onPress={startPositioning} mode="contained">
          Start positioning
        </Button>
        <Divider style={{marginVertical: 5}} />
        <Button onPress={stopPositioning} mode="contained">
          Stop positioning
        </Button>
      </List.Section>
      <Text style={styles.text}>Error: {error}</Text>
      <Text style={styles.text}>Status: {status}</Text>
      <Text style={styles.text}>Location: {location}</Text>
    </ScrollView>
  );
}

export default PositioningScreen;
