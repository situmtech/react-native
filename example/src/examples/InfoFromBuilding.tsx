import React, {useEffect, useState} from 'react';
import {Text, ScrollView} from 'react-native';

import SitumPlugin from 'react-native-situm-plugin';
import {SITUM_BUILDING_ID} from '../situm';
import styles from './styles/styles';
import {fetchBuilding} from './Utils/CommonFetchs';

export const InfoFromBuilding = () => {
  const [buildingInfo, setBuildingInfo] = useState<any>();

  const loadBuilding = (buildingId: string) => {
    fetchBuilding(buildingId).then(myBuilding =>
      getInfoFromBuilding(myBuilding),
    );
  };

  const getInfoFromBuilding = (building: any) => {
    SitumPlugin.fetchBuildingInfo(
      building,
      (buildingInfo: any) => {
        console.log('buildingInfo:', buildingInfo);
        setBuildingInfo(JSON.stringify(buildingInfo, null, 2));
      },
      (error: string) => {
        console.log('fetching building error:', error);
      },
    );
  };

  useEffect(() => {
    loadBuilding(SITUM_BUILDING_ID);
  }, []);

  return (
    <ScrollView>
      <Text style={styles.text}>{buildingInfo}</Text>
    </ScrollView>
  );
};
