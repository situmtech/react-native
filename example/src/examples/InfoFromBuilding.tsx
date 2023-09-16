import React, {useEffect, useState} from 'react';
import {Text, ScrollView} from 'react-native';

import SitumPlugin, {BuildingInfo} from '@situm/react-native';
import {SITUM_BUILDING_ID} from '../situm';
import styles from './styles/styles';
import {fetchBuilding} from './Utils/CommonFetchs';
import {Card} from 'react-native-paper';

export const InfoFromBuilding = () => {
  const [buildingInfo, setBuildingInfo] = useState<BuildingInfo>();

  const getInfoFromBuilding = async (building: any) => {
    SitumPlugin.fetchBuildingInfo(building)
      .then(_buildingInfo => {
        console.log('buildingInfo:', _buildingInfo);
        setBuildingInfo(_buildingInfo);
      })
      .catch(error => console.debug(error));
  };

  useEffect(() => {
    fetchBuilding(SITUM_BUILDING_ID).then(myBuilding =>
      getInfoFromBuilding(myBuilding),
    );
  }, []);

  return (
    <ScrollView style={{...styles.screenWrapper}}>
      <Card mode="contained" style={{marginVertical: 5}}>
        <Card.Title
          titleVariant="headlineSmall"
          title={'Buildings information'}
        />
        <Card.Content>
          <Text style={styles.text}>
            {JSON.stringify(buildingInfo, null, 2)}
          </Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};
