import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {SITUM_BUILDING_ID} from '../situm';
import {fetchBuilding} from './Utils/CommonFetchs';
import SitumPlugin from '@situm/react-native';
import styles from './styles/styles';
import {Button, Card} from 'react-native-paper';

const NUMBER_OF_SECONDS = 30 * 60;

export const SetCacheMaxAge = () => {
  const [_building, setBuilding] = useState<any>();
  const [status, setStatus] = useState('');

  useEffect(() => {
    const initialize = async () => {
      try {
        const success: boolean = await SitumPlugin.setCacheMaxAge(
          NUMBER_OF_SECONDS,
        );
        if (success) {
          console.log('Cache Age Set:', success);
          setStatus(
            'cache max age set to ' +
              NUMBER_OF_SECONDS +
              ' seconds: ' +
              JSON.stringify(success),
          );
        }
        const buildingData = await fetchBuilding(SITUM_BUILDING_ID);
        setBuilding(buildingData);
      } catch (error) {
        console.error(error);
      }
    };

    initialize();
  }, []);

  const invalidateCache = async () => {
    //invalidates current cache
    const success: boolean = await SitumPlugin.invalidateCache();
    if (success) setStatus('Cache invalidated');
    else setStatus('Cache not invalidated');
  };

  const setCacheMaxAge = async () => {
    //it can be set again after certain actions

    const success = await SitumPlugin.setCacheMaxAge(NUMBER_OF_SECONDS);
    if (success) {
      console.log('Cache Age Set: ' + success);
      setStatus(
        'cache max age set to ' +
          NUMBER_OF_SECONDS +
          ' seconds: ' +
          JSON.stringify(success),
      );
    }
  };

  return (
    <View style={{...styles.screenWrapper}}>
      <Button
        onPress={setCacheMaxAge}
        mode="contained"
        style={{marginVertical: 5}}>
        set max cache age to {NUMBER_OF_SECONDS} seconds
      </Button>
      <Button
        onPress={invalidateCache}
        buttonColor="#B22222"
        mode="contained"
        style={{marginVertical: 5}}>
        invalidate cache
      </Button>
      <Card mode="contained" style={{marginVertical: 5}}>
        <Card.Title titleVariant="headlineSmall" title={'Status'} />
        <Card.Content>
          <Text style={styles.text}>{status}</Text>
        </Card.Content>
      </Card>
    </View>
  );
};
