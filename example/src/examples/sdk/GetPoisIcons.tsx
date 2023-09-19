import React, {useEffect, useMemo, useState} from 'react';
import {Image, View} from 'react-native';
import MapView, {Marker, Overlay, PROVIDER_GOOGLE} from 'react-native-maps';
import SitumPlugin, {PoiIcon} from '@situm/react-native';

import {SITUM_BUILDING_ID, SITUM_FLOOR_ID} from '../../situm';
import {calculateBuildingLocation} from '../Utils/CalculateBuildingLocation';
import {fetchBuilding, fetchBuildingInfo} from '../Utils/CommonFetchs';
import styles from '../styles/styles';

const getIconForPOI = async (poi: any): Promise<{poi: any; icon: string}> => {
  try {
    const icon: PoiIcon = await SitumPlugin.fetchPoiCategoryIconNormal(
      poi.category,
    );

    return {
      poi: poi,
      icon: 'data:image/png;base64,' + icon.data,
    };
  } catch (error) {
    throw error;
  }
};

const getPoisInfo = async (buildingInfo: any) => {
  let pois = buildingInfo?.indoorPOIs || buildingInfo?.indoorPois || [];
  const poisWithIcons: any[] = [];

  for (const poi of pois) {
    poi.customFields.searchName = poi.poiName.slice();
    await getIconForPOI(poi)
      .then(res => {
        poisWithIcons.push(res);
      })
      .catch(err => console.error(err));
  }
  return new Promise(resolve => {
    resolve(poisWithIcons);
  });
};

export const GetPoisIcons = () => {
  const [building, setBuilding] = useState<any>();
  const [mapImage, setMapImage] = useState<any>();
  const [bounds, setBounds] = useState<any>();
  const [bearing, setBearing] = useState<any>(0);
  const [mapRegion, setMapRegion] = useState<any>();
  const [currentFloor, setCurrentFloor] = useState<any>();
  const [pois, setPois] = useState([]);

  const renderPoiMarkers = useMemo(() => {
    let markers: Array<any> = [];
    if (pois.length) {
      markers = pois
        .filter((poiAndIcon: any) => {
          return poiAndIcon.poi.floorIdentifier === currentFloor.identifier;
        })
        .map((poiAndIcon: any) => {
          return (
            <Marker
              key={poiAndIcon.poi.identifier}
              identifier={poiAndIcon.poi.identifier}
              coordinate={poiAndIcon.poi.coordinate}
              title={poiAndIcon.poi.poiName}
              flat={false}>
              <Image
                source={{uri: poiAndIcon.icon}}
                // eslint-disable-next-line react-native/no-inline-styles
                style={{width: 40, height: 40}}
                fadeDuration={0}
              />
            </Marker>
          );
        });
    }
    return markers.length > 0 ? markers : null;
  }, [pois, currentFloor]);

  useEffect(() => {
    fetchBuilding(SITUM_BUILDING_ID).then(setBuilding).catch(console.debug);
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
        setCurrentFloor(selectedFloor);
        setMapImage(selectedFloor.mapUrl);

        getPoisInfo(data).then((res: any) => setPois(res));
      })
      .catch(console.debug);
  }, [building]);

  return (
    <View>
      <MapView
        style={styles.container}
        region={mapRegion}
        provider={PROVIDER_GOOGLE}>
        {mapImage && bounds && (
          <Overlay image={{uri: mapImage}} bounds={bounds} bearing={bearing} />
        )}
        {renderPoiMarkers}
      </MapView>
    </View>
  );
};
