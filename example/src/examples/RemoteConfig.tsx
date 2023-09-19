import React, {useEffect, useState} from 'react';
import {Text, SafeAreaView, ScrollView} from 'react-native';

import SitumPlugin from '@situm/react-native';

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
    SitumPlugin.stopPositioning((_success: any) => {});
  };

  const startPositioning = () => {
    requestPermissions();

    console.log('Starting positioning');
    setLocation('');
    setStatus('');
    setError('');
    //Start positioning
    SitumPlugin.startPositioning(
      (newLocation: any) => {
        // console.log(JSON.stringify(newLocation, null, 3));
        setLocation(JSON.stringify(newLocation, null, 3));
      },
      (newStatus: any) => {
        //returns positioning status
        console.log(JSON.stringify(newStatus));
        setStatus(JSON.stringify(newStatus, null, 3));
      },
      (newError: string) => {
        // returns an error string
        console.log(JSON.stringify(newError));
        setError(newError);
        stopPositioning();
      },
      null,
    );
  };

  useEffect(() => {
    // Set useRemoteConfig to true in order to be able to
    SitumPlugin.setUseRemoteConfig('true', (response: any) => {
      console.log(`Remote config enabled: ${JSON.stringify(response)}`);
    });

    // Listen to enter/exit geofences events.
    SitumPlugin.onEnterGeofences((items: any) => {
      console.log('Detected Entered geofences: ' + JSON.stringify(items));
      setGeofences('Inside ' + JSON.stringify(items));
    });

    SitumPlugin.onExitGeofences((items: any) => {
      console.log('Detected Exited geofences: ' + JSON.stringify(items));
      setGeofences('Outside ' + JSON.stringify(items));
    });

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
