import React, {useEffect, useState} from 'react';
import {Text, ScrollView} from 'react-native';

import SitumPlugin, {BuildingInfo} from '@situm/react-native';
import {BUILDING_IDENTIFIER} from '../../situm';
import styles from '../styles/styles';
import {fetchBuilding} from '../Utils/CommonFetchs';
import {Card} from 'react-native-paper';

export const InfoFromBuilding = () => {
  const [buildingInfo, setBuildingInfo] = useState<BuildingInfo>();

  const getInfoFromBuilding = async (building: any) => {
    SitumPlugin.fetchBuildingInfo(building)
      .then(_buildingInfo => {
        setBuildingInfo(_buildingInfo);
      })
      .catch(e => {
        console.error(
          `Situm > example > Could not fetch building's full information: ${e}`,
        );
      });
  };

  useEffect(() => {
    fetchBuilding(BUILDING_IDENTIFIER)
      .then(myBuilding => getInfoFromBuilding(myBuilding))
      .catch(e => {
        console.error(`Situm > example > Could not fetch building: ${e}`);
      });
  }, []);

  return (
    <ScrollView style={{...styles.screenWrapper}}>
      <Card mode="contained" style={styles.margin}>
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
