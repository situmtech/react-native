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
    //usually set before any fetch
    SitumPlugin.setCacheMaxAge(NUMBER_OF_SECONDS, (response: Response) => {
      console.log('Cache Age Set: ' + response);
      setStatus(
        'cache max age set to ' +
          NUMBER_OF_SECONDS +
          ' seconds: ' +
          JSON.stringify(response),
      );
    });

    fetchBuilding(SITUM_BUILDING_ID)
      .then(data => {
        setBuilding(data);
      })
      .catch(console.log);
  }, []);

  const invalidateCache = () => {
    //invalidates current cache
    SitumPlugin.invalidateCache();
    setStatus('cache invalidated');
  };

  const setCacheMaxAge = () => {
    //it can be set again after certain actions
    SitumPlugin.setCacheMaxAge(NUMBER_OF_SECONDS, (response: Response) => {
      setStatus(
        'cache max age reset to ' +
          NUMBER_OF_SECONDS +
          ' seconds: ' +
          JSON.stringify(response),
      );
    });
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
