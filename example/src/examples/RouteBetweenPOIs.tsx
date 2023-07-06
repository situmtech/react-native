import React, {useEffect, useState} from 'react';
import {ScrollView, Text} from 'react-native';
import SitumPlugin from '@situm/react-native';
import {SITUM_BUILDING_ID} from '../situm';
import styles from './styles/styles';
import {fetchBuilding} from './Utils/CommonFetchs';

export const RouteBetweenPOIs = () => {
  const [building, setBuilding] = useState<any>();
  const [indoorPOIs, setIndoorPOIs] = useState<any>();
  const [route, setRoute] = useState<any>();

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
    if (indoorPOIs.length >= 2) {
      SitumPlugin.requestDirections(
        [building, indoorPOIs[0], indoorPOIs[1]],
        (route: any) => {
          setRoute(JSON.stringify(route));
        },
        (error: any) => {
          console.log(error);
        },
      );
    }
  };

  useEffect(() => {
    // first load the building
    fetchBuilding(SITUM_BUILDING_ID).then(setBuilding);
  }, []);

  useEffect(() => {
    // later get pois
    building && populatePOIsFromBuilding();
  }, [building]);

  useEffect(() => {
    //finaly ask for directions
    building && indoorPOIs && requestDirections();
  }, [building, indoorPOIs]);

  return (
    <ScrollView>
      <Text style={styles.text}>{route}</Text>
    </ScrollView>
  );
};
