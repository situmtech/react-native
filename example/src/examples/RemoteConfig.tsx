import React, {useEffect, useState} from 'react';
import {Text, SafeAreaView, ScrollView, Button} from 'react-native';

import SitumPlugin from 'react-native-situm-plugin';
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
    SitumPlugin.stopPositioning((success: any) => {});
  };

  const startPositioning = () => {
    requestPermissions();

    console.log('Starting positioning');
    setLocation('');
    setStatus('');
    setError('');
    //Start positioning
    SitumPlugin.startPositioning(
      (location: any) => {
        console.log(JSON.stringify(location, null, 3));
        setLocation(JSON.stringify(location, null, 3));
      },
      (status: any) => {
        //returns positioning status
        console.log(JSON.stringify(status));
        setStatus(JSON.stringify(status, null, 3));
      },
      (error: string) => {
        // returns an error string
        console.log(JSON.stringify(error));
        setError(error);
        stopPositioning();
      },
      null,
    );

    SitumPlugin.onEnterGeofences((geofences: any) => {
      console.log('Detected Entered geofences: ' + JSON.stringify(geofences));
      setGeofences('Inside ' + JSON.stringify(geofences));
    });

    SitumPlugin.onExitGeofences((geofences: any) => {
      console.log('Detected Exited geofences: ' + JSON.stringify(geofences));
      setGeofences('Outside ' + JSON.stringify(geofences));
    });
  };

  useEffect(() => {
    // Set useRemoteConfig to true in order to be able to
    SitumPlugin.setUseRemoteConfig('true', response => {
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
