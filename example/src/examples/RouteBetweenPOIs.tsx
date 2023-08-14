import React, {useEffect, useState} from 'react';
import {ScrollView, Text} from 'react-native';
import SitumPlugin, {Building} from '@situm/react-native';

import {SITUM_BUILDING_ID} from '../situm';
import styles from './styles/styles';
import {fetchBuilding} from './Utils/CommonFetchs';
import {Card} from 'react-native-paper';

export const RouteBetweenPOIs = () => {
  const [building, setBuilding] = useState<Building>();
  const [indoorPOIs, setIndoorPOIs] = useState<any>();
  const [route, setRoute] = useState<any>();
  const [error, setError] = useState('');

  const populatePOIsFromBuilding = () => {
    SitumPlugin.fetchIndoorPOIsFromBuilding(
      building,
      (indoorPOIs: any) => {
        setIndoorPOIs(indoorPOIs);
      },
      (error: any) => {
        console.log(error);
      },
    );
  };

  const requestDirections = () => {
    //check if we have 2 pois at least
    if (indoorPOIs.length < 2 || !building) {
      console.error('Your building has less than two POIs');
      return;
    }

    SitumPlugin.requestDirections(
      [building, indoorPOIs[0], indoorPOIs[1], null],
      (route: any) => {
        setRoute(JSON.stringify(route));
      },
      (error: any) => {
        setError(error);
        console.log(error);
      },
    );
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
          <Text>
            Showing route from '{indoorPOIs[0]}.name' to '{indoorPOIs[1].name}'
          </Text>
          <Text style={styles.text}>{route || error}</Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};
