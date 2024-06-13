import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native';
import SitumPlugin from '@situm/react-native';
import type {Building, Floor, Poi} from '@situm/react-native';

import {BUILDING_IDENTIFIER} from '../../situm';
import styles from '../styles/styles';
import {fetchBuilding} from '../Utils/CommonFetchs';
import {Card, Text} from 'react-native-paper';

export const BuildingFullInfo = () => {
  const [floors, setFloors] = useState<Floor[]>();
  const [indoorPOIs, setIndoorPOIs] = useState<Poi[]>();
  const [outdoorPOIs, setOutdoorPOIs] = useState<Poi[]>();
  const [building, setBuilding] = useState<Building>();

  const populateFloorsFromBuilding = (b: Building) => {
    SitumPlugin.fetchFloorsFromBuilding(b)
      .then(setFloors)
      .catch(error => {
        console.error(`Situm > example > Failed to fetch floors: ${error}`);
      });
  };

  const populateIndoorPOIsFromBuilding = (b: Building) => {
    SitumPlugin.fetchIndoorPOIsFromBuilding(b)
      .then(setIndoorPOIs)
      .catch(error => {
        console.error(`Situm > example > Failed to fetch POIs: ${error}`);
      });
  };

  const populateOutdoorPOIsFromBuilding = (b: Building) => {
    SitumPlugin.fetchOutdoorPOIsFromBuilding(b)
      .then(setOutdoorPOIs)
      .catch(error => {
        console.error(
          `Situm > example > Failed to fetch outdoor POIs: ${error}`,
        );
      });
  };

  useEffect(() => {
    fetchBuilding(BUILDING_IDENTIFIER)
      .then(setBuilding)
      .catch(error => {
        console.error(`Situm > example > Failed to fetch building: ${error}`);
      });
  }, []);

  useEffect(() => {
    building && populateFloorsFromBuilding(building);
    building && populateIndoorPOIsFromBuilding(building);
    building && populateOutdoorPOIsFromBuilding(building);
  }, [building]);

  return (
    <ScrollView style={{...styles.screenWrapper}}>
      {!BUILDING_IDENTIFIER && (
        <Text>No building id provided, please edit your situm.tsx file</Text>
      )}
      <Card mode="contained" style={styles.margin}>
        <Card.Title titleVariant="headlineSmall" title={'Floors'} />
        <Card.Content>
          <Text variant="bodyMedium">{JSON.stringify(floors, null, 2)}</Text>
        </Card.Content>
      </Card>
      <Card mode="contained" style={styles.margin}>
        <Card.Title titleVariant="headlineSmall" title={'POIs'} />
        <Card.Content>
          <Text>{JSON.stringify(indoorPOIs, null, 2)}</Text>
        </Card.Content>
      </Card>
      <Card mode="contained" style={styles.margin}>
        <Card.Title titleVariant="headlineSmall" title={'Outdoor POIs'} />
        <Card.Content>
          <Text>{JSON.stringify(outdoorPOIs, null, 2)}</Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};
