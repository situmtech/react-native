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
  const [building, setBuilding] = useState<any>();

  const populateFloorsFromBuilding = (b: any) => {
    SitumPlugin.fetchFloorsFromBuilding(
      b,
      (f: any) => {
        setFloors(JSON.stringify(f, null, 2));
      },
      (_error: any) => {},
    );
  };

  const populatePOIsFromBuilding = (b: Building) => {
    SitumPlugin.fetchIndoorPOIsFromBuilding(
      b,
      (ip: any) => {
        setIndoorPOIs(JSON.stringify(ip, null, 2));
      },
      (_error: any) => {},
    );

    SitumPlugin.fetchOutdoorPOIsFromBuilding(
      b,
      (op: any) => {
        setOutdoorPOIs(JSON.stringify(op, null, 2));
      },
      (_error: any) => {},
    );
  };

  useEffect(() => {
    fetchBuilding(SITUM_BUILDING_ID).then(setBuilding);
  }, []);

  useEffect(() => {
    populateFloorsFromBuilding(building);
    populatePOIsFromBuilding(building);
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
