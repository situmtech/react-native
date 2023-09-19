import React, {useEffect, useState} from 'react';
import {ScrollView, Text} from 'react-native';
import SitumPlugin, {Building, Poi} from '@situm/react-native';

import {SITUM_BUILDING_ID} from '../../situm';
import styles from '../styles/styles';
import {fetchBuilding} from '../Utils/CommonFetchs';
import {Card} from 'react-native-paper';

export const RouteBetweenPOIs = () => {
  const [building, setBuilding] = useState<Building>();
  const [indoorPOIs, setIndoorPOIs] = useState<Poi[]>();
  const [route, setRoute] = useState<any>();
  const [error, setError] = useState('');

  const populatePOIsFromBuilding = async () => {
    if (!building) {
      return;
    }

    await SitumPlugin.fetchIndoorPOIsFromBuilding(building)
      .then(_indoorPois => {
        console.log(JSON.stringify(_indoorPois, null, 2));
        setIndoorPOIs(_indoorPois);
      })
      .catch(e => {
        console.debug(`Situm > example > Could not fetch indoor POIs ${e}`);
      });
  };

  const requestDirections = async () => {
    //check if we have 2 pois at least
    if ((indoorPOIs && indoorPOIs.length < 2) || !building) {
      console.error('Your building has less than two POIs');
      return;
    }
    await SitumPlugin.requestDirections(
      building,
      indoorPOIs![0],
      indoorPOIs![1],
    )
      .then(_route => {
        console.log(JSON.stringify(_route, null, 2));
        setRoute(_route);
      })
      .catch(e => {
        console.debug(`Could not compute route ${e}`);
        setError(e);
      });
  };

  useEffect(() => {
    // first load the building
    fetchBuilding(SITUM_BUILDING_ID).then(setBuilding);
  }, []);

  useEffect(() => {
    // later get pois
    building && populatePOIsFromBuilding();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [building]);

  useEffect(() => {
    //finaly ask for directions
    building && indoorPOIs && requestDirections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [building, indoorPOIs]);

  return (
    <ScrollView style={{...styles.screenWrapper}}>
      <Card mode="contained" style={{marginVertical: 5}}>
        <Card.Title title="Route" />
        <Card.Content>
          {indoorPOIs && indoorPOIs.length > 0 && (
            <Text>
              Showing route from '{indoorPOIs[0].poiName}' to '
              {indoorPOIs[1].poiName}'
            </Text>
          )}
          <Text style={styles.text}>{JSON.stringify(route) || error}</Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};
