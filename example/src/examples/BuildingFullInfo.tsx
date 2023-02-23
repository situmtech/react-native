import React from 'react';
import {useEffect, useState} from 'react';
import {ScrollView, Text, View} from 'react-native';
import SitumPlugin from 'react-native-situm-plugin';
import {SITUM_BUILDING_ID} from '../situm';
import styles from './styles/styles';
import {fetchBuilding} from './Utils/CommonFetchs';

export const BuildingFullInfo = () => {
  const [floors, setFloors] = useState<any>();
  const [indoorPOIs, setIndoorPOIs] = useState<any>();
  const [outdoorPOIs, setOutdoorPOIs] = useState<any>();
  const [error, setError] = useState<String>();
  const [building, setBuilding] = useState<any>();

  const populateFloorsFromBuilding = building => {
    SitumPlugin.fetchFloorsFromBuilding(
      building,
      floors => {
        setFloors(JSON.stringify(floors, null, 2));
      },
      error => {},
    );
  };

  const populatePOIsFromBuilding = building => {
    SitumPlugin.fetchIndoorPOIsFromBuilding(
      building,
      indoorPOIs => {
        setIndoorPOIs(JSON.stringify(indoorPOIs, null, 2));
      },
      error => {},
    );

    SitumPlugin.fetchOutdoorPOIsFromBuilding(
      building,
      outdoorPOIs => {
        setOutdoorPOIs(JSON.stringify(outdoorPOIs, null, 2));
      },
      error => {},
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
