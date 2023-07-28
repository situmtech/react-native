import React, {useEffect, useState} from 'react';
import {Platform, View} from 'react-native';
import MapView, {
  Marker,
  Overlay,
  Polyline,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import SitumPlugin from '@situm/react-native';
import {SITUM_BUILDING_ID, SITUM_FLOOR_ID} from '../situm';
import {calculateBuildingLocation} from './Utils/CalculateBuildingLocation';
import {fetchBuilding, fetchBuildingInfo} from './Utils/CommonFetchs';

const fetchPOIsFromBuilding = (building: any) => {
  return new Promise((resolve, reject) => {
    SitumPlugin.fetchIndoorPOIsFromBuilding(
      building,
      (indoorPOIs: any) => {
        console.log(indoorPOIs);
        resolve(indoorPOIs);
      },
      (error: any) => {
        reject(error);
      },
    );
  });
};

const requestDirections = (building: any, pois: any) => {
  return new Promise((resolve, reject) => {
    SitumPlugin.requestDirections(
      [building, pois[0], pois[1], null],
      (route: any) => {
        let latlngs = [];
        for (let segment of route.segments) {
          for (let point of segment.points) {
            latlngs.push({
              latitude: point.coordinate.latitude,
              longitude: point.coordinate.longitude,
            });
          }
        }
        resolve(latlngs);
      },
      (error: any) => {
        reject(error);
      },
    );
  });
};

export const DrawRouteBetweenPOIs = () => {
  const [building, setBuilding] = useState<any>();
  const [mapImage, setMapImage] = useState<any>();
  const [bounds, setBounds] = useState<any>();
  const [bearing, setBearing] = useState<any>(0);
  const [mapRegion, setMapRegion] = useState<any>();
  const [pois, setPois] = useState<any>();
  const [polylineLatlng, setPolylineLatlng] = useState<any>([]);

  // useEffects to get data
  useEffect(() => {
    fetchBuilding(SITUM_BUILDING_ID)
      .then(data => {
        setBuilding(data);
      })
      .catch(_err => console.log);
  }, []);

  useEffect(() => {
    if (!building) {
      return;
    }
    fetchPOIsFromBuilding(building)
      .then(data => {
        setPois(data);
      })
      .catch(_err => console.log);
  }, [building]);

  useEffect(() => {
    if (!building) {
      return;
    }
    fetchBuildingInfo(building)
      .then(data => {
        const {bearing, bounds, map_region} = calculateBuildingLocation(
          data.building,
        );
        setBearing(bearing);
        setBounds(bounds);
        setMapRegion(map_region);
        if (data?.floors.length == 0) {
          return;
        }
        var selectedFloor = data.floors.filter(
          (f: any) => f.identifier == SITUM_FLOOR_ID,
        )[0];
        setMapImage(selectedFloor.mapUrl);
      })
      .catch(_err => console.log);
  }, [building]);

  //ask for directions once we know the building and the 2 POIS we use as origin and destination
  useEffect(() => {
    if (!building || !pois) {
      return;
    }
    requestDirections(building, pois).then(res => setPolylineLatlng(res));
  }, [building, pois]);

  return (
    <View>
      <MapView
        style={{width: '100%', height: '100%'}}
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
