import React, {useEffect, useState} from 'react';
import {Text, SafeAreaView, ScrollView, StyleSheet, Button} from 'react-native';

import SitumPlugin from 'react-native-situm-plugin';
import styles from './styles/styles';

let subscriptionId = -1;

export const RemoteConfig = () => {
  const [response, setResponse] = useState<String>('ready to be used');
  const [status, setStatus] = useState<String>('ready to be used');

  //We will call this method from a <Button /> later
  const stopPositioning = async () => {
    console.log('Stopping positioning');
    SitumPlugin.stopPositioning(subscriptionId, (success: any) => {});
    setResponse('Positioning was stopped');
    subscriptionId = -1;
  };

  const startPositioning = () => {
    if (subscriptionId != -1) {
      console.log('Positioning already started');
      return;
    }

    console.log('Starting positioning');
    setResponse('Starting positioning');
    //Start positioning
    subscriptionId = SitumPlugin.startPositioning(
      (location: any) => {
        console.log(JSON.stringify(location, null, 3));
        setResponse(JSON.stringify(location, null, 3));
      },
      (status: any) => {
        console.log(JSON.stringify(status));
        setStatus(JSON.stringify(status, null, 3));
      },
      (error: string) => {
        console.log(JSON.stringify(error));
        setStatus(error);
        stopPositioning();
      },
      null,
    );
  };

  useEffect(() => {
    SitumPlugin.requestAuthorization();
    return () => {
      //STOP POISTIONING ON CLOSE COMPONENT
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
        <Text style={styles.text}>Status: {status}</Text>
        <Text style={styles.text}>Response: {response}</Text>
      </SafeAreaView>
    </ScrollView>
  );
};
