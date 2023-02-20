import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import MapView, {Overlay, PROVIDER_GOOGLE} from 'react-native-maps';
import {SITUM_BUILDING_ID, SITUM_FLOOR_ID} from '../situm';
import {calculateBuildingLocation} from './Utils/CalculateBuildingLocation';
import {fetchBuilding, fetchBuildingInfo} from './Utils/CommonFetchs';

export const ShowBuildingOnMap = () => {
  const [building, setBuilding] = useState<any>();
  const [mapImage, setMapImage] = useState<any>();
  const [bounds, setBounds] = useState<any>();
  const [bearing, setBearing] = useState<any>(0);
  const [mapRegion, setMapRegion] = useState<any>();

  useEffect(() => {
    fetchBuilding(SITUM_BUILDING_ID)
      .then(data => {
        setBuilding(data);
      })
      .catch(err => console.log);
  }, []);

  useEffect(() => {
    if (!building) return;

    fetchBuildingInfo(building)
      .then(data => {
        const {bearing, bounds, map_region} = calculateBuildingLocation(
          data.building,
        );
        setBearing(bearing);
        setBounds(bounds);
        setMapRegion(map_region);
        if (data?.floors.length == 0) return;
        var selectedFloor = data.floors.filter(
          f => f.identifier == SITUM_FLOOR_ID,
        )[0];
        setMapImage(selectedFloor.mapUrl);
      })
      .catch(err => console.log);
  }, [building]);

  return (
    <View>
      <MapView
        style={{width: '100%', height: '100%'}}
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
