import React, {useEffect, useState} from 'react';
import {Text, ScrollView} from 'react-native';

import SitumPlugin from '@situm/react-native';
import {SITUM_BUILDING_ID} from '../situm';
import styles from './styles/styles';
import {fetchBuilding} from './Utils/CommonFetchs';
import {Card} from 'react-native-paper';

export const InfoFromBuilding = () => {
  const [buildingInfo, setBuildingInfo] = useState<any>();

  const loadBuilding = (buildingId: string) => {
    fetchBuilding(buildingId).then(myBuilding =>
      getInfoFromBuilding(myBuilding),
    );
  };
  const getInfoFromBuilding = async (building: any) => {
    try {
      const buildingInfo = await SitumPlugin.fetchBuildingInfo(building);
      console.log('buildingInfo:', buildingInfo);
      setBuildingInfo(JSON.stringify(buildingInfo, null, 2));
    } catch (error) {
      console.log('fetching building error:', error);
    }
  };

  useEffect(() => {
    loadBuilding(SITUM_BUILDING_ID);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ScrollView style={{...styles.screenWrapper}}>
      <Card mode="contained" style={{marginVertical: 5}}>
        <Card.Title
          titleVariant="headlineSmall"
          title={'Buildings information'}
        />
        <Card.Content>
          <Text style={styles.text}>{buildingInfo}</Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};
