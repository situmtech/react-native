import React, {useEffect, useState} from 'react';
import {Text, SafeAreaView, ScrollView, StyleSheet, Button} from 'react-native';

import SitumPlugin from 'react-native-situm-plugin';
import styles from './styles/styles';

let subscriptionId = -1;

export const RemoteConfig = () => {
  const [response, setResponse] = useState<String>('ready to be used');
  const [status, setStatus] = useState<String>('ready to be used');

  const stopPositioning = () => {
    SitumPlugin.stopPositioning(subscriptionId, (success: any) => {
      setResponse(JSON.stringify(success, null, 3));
    });
  };
  const startPositioning = () => {
    //START POISTIONING
    subscriptionId = SitumPlugin.startPositioning(
      (location: any) => {
        setResponse(JSON.stringify(location, null, 3));
      },
      (status: any) => {
        setStatus(JSON.stringify(status, null, 3));
      },
      (error: string) => {
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

  useEffect(() => {
    //REMOTE CONFIG
    SitumPlugin.setUseRemoteConfig('true', (res: any) => {
      console.log(
        'success while configuring remote configuration' +
          JSON.stringify(res, null, 3),
      );
    });
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
