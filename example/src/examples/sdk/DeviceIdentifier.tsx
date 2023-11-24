import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native';
import SitumPlugin from '@situm/react-native';
import styles from '../styles/styles';
import {Text, Card} from 'react-native-paper';

//You may use a few seconds in development and at least 30 minutes in production

export const DeviceIdentifier = () => {
  const [deviceId, setDeviceID] = useState('');

  // Set the cache when the component mounts
  useEffect(() => {
    SitumPlugin.getDeviceId()
      .then(setDeviceID)
      .catch(error => {
        console.error(
          `Situm > example > Failed to retrieve Device ID: ${error}`,
        );
      });
  }, []);

  return (
    <ScrollView style={styles.screenWrapper}>
      <Text style={styles.text}>
        This example demonstrates how to retrieve the randon Device Identifier
        that Situm assigns to each geolocation stored in Situm Platform.
      </Text>

      <Card mode="contained" style={styles.margin}>
        <Card.Title titleVariant="headlineSmall" title={'Device ID'} />
        <Card.Content>
          <Text variant="bodyMedium">{deviceId}</Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};
