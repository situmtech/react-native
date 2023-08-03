import React from 'react';
import {useEffect, useState} from 'react';
import {ScrollView, Text} from 'react-native';
import SitumPlugin, {Building} from '@situm/react-native';

import {SITUM_BUILDING_ID} from '../situm';
import styles from './styles/styles';
import {fetchBuilding} from './Utils/CommonFetchs';

export const BuildingFullInfo = () => {
  const [floors, setFloors] = useState<any>();
  const [indoorPOIs, setIndoorPOIs] = useState<any>();
  const [outdoorPOIs, setOutdoorPOIs] = useState<any>();
  const [building, setBuilding] = useState<any>();

  const populateFloorsFromBuilding = (building: any) => {
    SitumPlugin.fetchFloorsFromBuilding(
      building,
      (floors: any) => {
        setFloors(JSON.stringify(floors, null, 2));
      },
      (_error: any) => {},
    );
  };

  const populatePOIsFromBuilding = (building: Building) => {
    SitumPlugin.fetchIndoorPOIsFromBuilding(
      building,
      (indoorPOIs: any) => {
        setIndoorPOIs(JSON.stringify(indoorPOIs, null, 2));
      },
      (_error: any) => {},
    );

    SitumPlugin.fetchOutdoorPOIsFromBuilding(
      building,
      (outdoorPOIs: any) => {
        setOutdoorPOIs(JSON.stringify(outdoorPOIs, null, 2));
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
    <ScrollView>
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
