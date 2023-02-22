import React, {useEffect, useState} from 'react';
import {View, Text, Button} from 'react-native';
import {SITUM_BUILDING_ID, SITUM_FLOOR_ID} from '../situm';
import {calculateBuildingLocation} from './Utils/CalculateBuildingLocation';
import {fetchBuilding, fetchBuildingInfo} from './Utils/CommonFetchs';
import SitumPlugin from 'react-native-situm-plugin';
import styles from './styles/styles';

const NUMBER_OF_SECONDS = 30 * 60;

export const SetCacheMaxAge = () => {
  const [building, setBuilding] = useState<any>();
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
      .catch(err => console.log);
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
    <View>
      <Button
        onPress={setCacheMaxAge}
        title="set max cache age"
        color="#07F736"
      />
      <Button
        onPress={invalidateCache}
        title="invalidate cache"
        color="#F71D07"
      />
      <Text style={styles.text}>Status:</Text>
      <Text style={styles.text}>{status}</Text>
    </View>
  );
};
