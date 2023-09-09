import React, {useEffect, useState} from 'react';
import {Text, ScrollView} from 'react-native';
import SitumPlugin from '@situm/react-native';
import styles from './styles/styles';
import {Button, Card} from 'react-native-paper';

//You may use a few seconds in development and at least 30 minutes in production
const NUMBER_OF_SECONDS = 60;

export const SetCacheMaxAge = () => {
  const [status, setStatus] = useState('');
  const [buildings, setBuildings] = useState('');

  // Set the cache when the component mounts
  useEffect(() => {
    setCache(NUMBER_OF_SECONDS);
  }, []);

  // Invalidate the current cache
  const invalidateCache = async () => {
    try {
      await SitumPlugin.invalidateCache();
      setStatus('Cache invalidated');
    } catch (err) {
      console.error('Failed to invalidate cache:', err);
      setStatus('Cache not invalidated');
    }
  };

  // Set the cache duration
  const setCache = async (numSeconds: number) => {
    try {
      await SitumPlugin.setConfiguration({
        cacheMaxAge: numSeconds,
      });
      console.log('Cache Age Set:', numSeconds);
      setStatus(`Cache max age set to ${numSeconds} seconds`);
    } catch (err) {
      console.error('Failed to set cache max age:', err);
    }
  };

  // Fetch and display buildings
  const showBuildings = async () => {
    try {
      const fetchedBuildings = await SitumPlugin.fetchBuildings();
      setBuildings(JSON.stringify(fetchedBuildings, null, 2));
    } catch (err) {
      console.error('Failed to fetch Buildings:', err);
      setStatus('Failed to fetch Buildings');
    }
  };

  return (
    <ScrollView style={styles.screenWrapper}>
      <Text style={styles.text}>
        This example demonstrates how to set cache duration and invalidate cache
        using SitumSDK. You can also modify buildings in Situm Dashboard and
        display them here to see how caching works.
      </Text>
      <Button onPress={showBuildings} mode="contained" style={styles.margin}>
        Show Buildings
      </Button>
      <Button
        onPress={() => setCache(NUMBER_OF_SECONDS)}
        mode="contained"
        style={styles.margin}>
        Set max cache age to {NUMBER_OF_SECONDS} seconds
      </Button>
      <Button
        onPress={invalidateCache}
        buttonColor="#B22222"
        mode="contained"
        style={styles.margin}>
        Invalidate cache
      </Button>
      <Card mode="contained" style={styles.margin}>
        <Card.Title titleVariant="headlineSmall" title="Cache Status" />
        <Card.Content>
          <Text style={styles.text}>{status}</Text>
        </Card.Content>
      </Card>
      <Card mode="contained" style={styles.margin}>
        <Card.Title titleVariant="headlineSmall" title="Show Buildings" />
        <Card.Content>
          <Text style={styles.text}>{buildings}</Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};
