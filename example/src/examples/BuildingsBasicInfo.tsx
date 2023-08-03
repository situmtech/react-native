import React from 'react';
import {useEffect, useState} from 'react';
import {ScrollView, Text} from 'react-native';
import SitumPlugin from '@situm/react-native';
import styles from './styles/styles';

export const BuildingsBasicInfo = () => {
  const [buildings, setBuildings] = useState<any>();
  const [_error, setError] = useState<String>();

  const getBuildings = () => {
    SitumPlugin.fetchBuildings(
      (buildings: any) => {
        if (!buildings || buildings.length == 0) {
          setError(
            'No buildings, add a few buildings first by going to:\nhttps://dashboard.situm.es/buildings',
          );
        }
        console.log(JSON.stringify(buildings));
        setBuildings(JSON.stringify(buildings, null, 2));
      },
      (error: any) => {
        console.log(error);
        setError(error);
      },
    );
  };

  useEffect(() => {
    getBuildings();
  }, []);

  return (
    <ScrollView>
      <Text style={styles.text}>{buildings}</Text>
    </ScrollView>
  );
};
