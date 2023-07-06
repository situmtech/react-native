import React, {useEffect, useState} from 'react';
import {Text, SafeAreaView, ScrollView, Button} from 'react-native';

import SitumPlugin from '@situm/react-native';

import styles from './styles/styles';
import requestPermissions from './Utils/RequestPermissions';

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
        console.log(JSON.stringify(newLocation, null, 3));
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

    SitumPlugin.onEnterGeofences((items: any) => {
      console.log('Detected Entered geofences: ' + JSON.stringify(items));
      setGeofences('Inside ' + JSON.stringify(items));
    });

    SitumPlugin.onExitGeofences((items: any) => {
      console.log('Detected Exited geofences: ' + JSON.stringify(items));
      setGeofences('Outside ' + JSON.stringify(items));
    });
  };

  useEffect(() => {
    // Set useRemoteConfig to true in order to be able to
    SitumPlugin.setUseRemoteConfig('true', (response: any) => {
      console.log(`Remote config enabled: ${JSON.stringify(response)}`);
    });

    return () => {
      //STOP POSITIONING ON CLOSE COMPONENT
      stopPositioning();
    };
  }, []);

  return (
    <ScrollView>
      <SafeAreaView>
        <Button
          onPress={startPositioning}
          title="START POSITIONING"
          color="#07F736"
        />
        <Button
          onPress={stopPositioning}
          title="STOP POSITIONING"
          color="#F71D07"
        />
        <Text style={styles.text}>Error: {error}</Text>
        <Text style={styles.text}>Status: {status}</Text>
        <Text style={styles.text}>Location: {location}</Text>
        <Text style={styles.text}>Geofence actions: {geofences} </Text>
      </SafeAreaView>
    </ScrollView>
  );
};
