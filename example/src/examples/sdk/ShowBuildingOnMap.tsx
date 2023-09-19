import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import MapView, {Overlay, PROVIDER_GOOGLE} from 'react-native-maps';
import {SITUM_BUILDING_ID, SITUM_FLOOR_ID} from '../../situm';
import {calculateBuildingLocation} from '../Utils/CalculateBuildingLocation';
import {fetchBuilding, fetchBuildingInfo} from '../Utils/CommonFetchs';
import {Building} from '@situm/react-native';
import styles from '../styles/styles';

export const ShowBuildingOnMap = () => {
  const [building, setBuilding] = useState<Building>();
  const [mapImage, setMapImage] = useState<any>();
  const [bounds, setBounds] = useState<any>();
  const [bearing, setBearing] = useState<any>(0);
  const [mapRegion, setMapRegion] = useState<any>();

  useEffect(() => {
    fetchBuilding(SITUM_BUILDING_ID)
      .then(setBuilding)
      .catch(e => {
        console.error(`Situm > example > Could not fetch building: ${e}`);
      });
  }, []);

  useEffect(() => {
    if (!building) {
      return;
    }

    fetchBuildingInfo(building)
      .then(data => {
        const {
          bearing: _bearing,
          bounds: _bounds,
          map_region: _mapRegion,
        } = calculateBuildingLocation(data.building);
        setBearing(_bearing);
        setBounds(_bounds);
        setMapRegion(_mapRegion);
        if (data?.floors.length === 0) {
          return;
        }
        var selectedFloor = data.floors.filter(
          (f: any) => f.identifier === SITUM_FLOOR_ID,
        )[0];
        setMapImage(selectedFloor.mapUrl);
      })
      .catch(console.debug);
  }, [building]);

  return (
    <View>
      <MapView
        style={styles.container}
        region={mapRegion}
        showsIndoorLevelPicker={false}
        showsIndoors={false}
        provider={PROVIDER_GOOGLE}>
        {mapImage && bounds && (
          <Overlay image={{uri: mapImage}} bounds={bounds} bearing={bearing} />
        )}
      </MapView>
    </View>
  );
};
