import React, {useEffect, useState} from 'react';
import {Platform, View} from 'react-native';
import MapView, {
  Marker,
  Overlay,
  Polyline,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import SitumPlugin, {
  Building,
  DirectionsOptions,
  Poi,
} from '@situm/react-native';
import {SITUM_BUILDING_ID, SITUM_FLOOR_ID} from '../../situm';
import {calculateBuildingLocation} from '../Utils/CalculateBuildingLocation';
import {fetchBuilding, fetchBuildingInfo} from '../Utils/CommonFetchs';
import styles from '../styles/styles';

const fetchPOIsFromBuilding = async (building: any) => {
  try {
    const indoorPOIs = await SitumPlugin.fetchIndoorPOIsFromBuilding(building);
    return indoorPOIs;
  } catch (error) {
    throw error;
  }
};

const requestDirections = async (building: Building, pois: Poi[]) => {
  const directionsOptions: DirectionsOptions = {
    minimizeFloorChanges: true,
    accessibilityMode: 'ONLY_ACCESSIBLE',
    startingAngle: 0,
  };

  return await SitumPlugin.requestDirections(
    building,
    pois[0],
    pois[1],
    directionsOptions,
  ).then(route => {
    let latlngs = [];
    for (let segment of route.segments) {
      for (let point of segment.points) {
        latlngs.push({
          latitude: point.coordinate.latitude,
          longitude: point.coordinate.longitude,
        });
      }
    }
    return latlngs;
  });
};

export const DrawRouteBetweenPOIs = () => {
  const [building, setBuilding] = useState<Building>();
  const [mapImage, setMapImage] = useState<any>();
  const [bounds, setBounds] = useState<any>();
  const [bearing, setBearing] = useState<any>(0);
  const [mapRegion, setMapRegion] = useState<any>();
  const [pois, setPois] = useState<Poi[]>();
  const [polylineLatlng, setPolylineLatlng] = useState<any>([]);

  // useEffects to get data
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
    fetchPOIsFromBuilding(building)
      .then(setPois)
      .catch(e => {
        console.error(`Situm > example > Could not fetch POIs: ${e}`);
      });
  }, [building]);

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
        var selectedFloor = data.floors.find(
          (f: any) => f.identifier === SITUM_FLOOR_ID,
        );
        setMapImage(selectedFloor?.mapUrl);
      })
      .catch(e => {
        console.error(
          `Situm > example > Could not fetch building's full information: ${e}`,
        );
      });
  }, [building]);

  //ask for directions once we know the building and the 2 POIS we use as origin and destination
  useEffect(() => {
    if (!building || !pois) {
      return;
    }
    requestDirections(building, pois)
      .then(_route => {
        _route && setPolylineLatlng(_route);
      })
      .catch(e => {
        console.error(`Situm > example > Could not compute route: ${e}`);
      });
  }, [building, pois]);

  return (
    <View>
      <MapView
        style={styles.container}
        region={mapRegion}
        provider={PROVIDER_GOOGLE}>
        {mapImage && bounds && (
          <Overlay image={{uri: mapImage}} bounds={bounds} bearing={bearing} />
        )}
        {
          //RENDER MARKERS
        }
        {pois != null && <Marker coordinate={pois[0].coordinate} />}
        {pois != null && <Marker coordinate={pois[1].coordinate} />}

        {
          //RENDER ROUTE
        }
        {polylineLatlng.length > 0 && (
          <Polyline
            key="editingPolyline"
            coordinates={polylineLatlng}
            strokeColor="#CF3B27"
            zIndex={1001}
            fillColor="#CF3B27"
            strokeWidth={Platform.OS === 'ios' ? 7 : 9}
            lineDashPattern={Platform.OS === 'ios' ? [1, 1] : [1, 15]}
          />
        )}
      </MapView>
    </View>
  );
};
