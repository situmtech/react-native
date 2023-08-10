import React from 'react';
import {useEffect, useState} from 'react';
import {ScrollView, Text} from 'react-native';
import SitumPlugin from '@situm/react-native';
import type {Building} from '@situm/react-native';

import {SITUM_BUILDING_ID} from '../situm';
import styles from './styles/styles';
import {fetchBuilding} from './Utils/CommonFetchs';

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
      <Text style={styles.text}>FLOORS</Text>
      <Text style={styles.text}>{floors}</Text>
      <Text style={styles.text}>------------------------------</Text>
      <Text style={styles.text}>POIs</Text>
      <Text style={styles.text}>{indoorPOIs}</Text>
      <Text style={styles.text}>------------------------------</Text>
      <Text style={styles.text}>Outdoor POIs</Text>
      <Text style={styles.text}>{outdoorPOIs}</Text>
      <Text style={styles.text}>------------------------------</Text>
    </ScrollView>
  );
};
