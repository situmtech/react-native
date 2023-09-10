import React from 'react';
import {useEffect, useState} from 'react';
import {ScrollView} from 'react-native';
import SitumPlugin from '@situm/react-native';
import type {Building} from '@situm/react-native';

import {SITUM_BUILDING_ID} from '../situm';
import styles from './styles/styles';
import {fetchBuilding} from './Utils/CommonFetchs';
import {Card, Text} from 'react-native-paper';

export const BuildingFullInfo = () => {
  const [floors, setFloors] = useState<any>();
  const [indoorPOIs, setIndoorPOIs] = useState<any>();
  const [outdoorPOIs, setOutdoorPOIs] = useState<any>();
  const [building, setBuilding] = useState<any>(undefined);

  const populateFloorsFromBuilding = async (b: any) => {
    try {
      const _floors = await SitumPlugin.fetchFloorsFromBuilding(b);
      setFloors(JSON.stringify(_floors, null, 2));
    } catch (error) {
      console.error(`Failed to fetch floors: ${error}`);
      // Handle the error as needed
    }
  };

  const populateIndoorPOIsFromBuilding = async (b: Building) => {
    try {
      const _indoorPOIs = await SitumPlugin.fetchIndoorPOIsFromBuilding(b);
      setIndoorPOIs(JSON.stringify(_indoorPOIs, null, 2));
    } catch (error) {
      console.debug(`Failed to fetch POIs: ${error}`);
      // Handle the error as needed
    }
  };

  const populateOutdoorPOIsFromBuilding = async (b: Building) => {
    try {
      const _outdoorPOIs = await SitumPlugin.fetchOutdoorPOIsFromBuilding(b);
      setOutdoorPOIs(JSON.stringify(_outdoorPOIs, null, 2));
    } catch (error) {
      console.debug(`Failed to fetch outdoor POIs: ${error}`);
      // Handle the error as needed
    }
  };

  useEffect(() => {
    fetchBuilding(SITUM_BUILDING_ID).then(setBuilding);
  }, []);

  useEffect(() => {
    building && populateFloorsFromBuilding(building);
    building && populateIndoorPOIsFromBuilding(building);
    building && populateOutdoorPOIsFromBuilding(building);
  }, [building]);

  return (
    <ScrollView style={{...styles.screenWrapper}}>
      {!SITUM_BUILDING_ID && (
        <Text>No building id provided, please edit your situm.tsx file</Text>
      )}
      <Card mode="contained" style={{marginVertical: 5}}>
        <Card.Title titleVariant="headlineSmall" title={'Floors'} />
        <Card.Content>
          <Text variant="bodyMedium">{floors}</Text>
        </Card.Content>
      </Card>
      <Card mode="contained" style={{marginVertical: 5}}>
        <Card.Title titleVariant="headlineSmall" title={'POIs'} />
        <Card.Content>
          <Text>{indoorPOIs}</Text>
        </Card.Content>
      </Card>
      <Card mode="contained" style={{marginVertical: 5}}>
        <Card.Title titleVariant="headlineSmall" title={'Outdoor POIs'} />
        <Card.Content>
          <Text>{outdoorPOIs}</Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};
