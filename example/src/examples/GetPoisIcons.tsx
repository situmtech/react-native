import React, {useEffect, useMemo, useState} from 'react';
import {Image, View} from 'react-native';
import MapView, {Marker, Overlay, PROVIDER_GOOGLE} from 'react-native-maps';
import SitumPlugin from '@situm/react-native';
import {SITUM_BUILDING_ID, SITUM_FLOOR_ID} from '../situm';
import {calculateBuildingLocation} from './Utils/CalculateBuildingLocation';
import {fetchBuilding, fetchBuildingInfo} from './Utils/CommonFetchs';

const getIconForPOI = (
  poi: any,
): Promise<{
  poi: any;
  icon: string;
}> => {
  return new Promise((resolve, reject) => {
    SitumPlugin.fetchPoiCategoryIconNormal(
      poi.category,
      (icon: any) => {
        const result = {poi: poi, icon: 'data:image/png;base64,' + icon.data};
        resolve(result);
      },
      (error: any) => {
        reject(error);
      },
    );
  });
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
          console.log(
            poiAndIcon.poi.floorIdentifier,
            '-',
            currentFloor.identifier,
          );
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
    fetchBuilding(SITUM_BUILDING_ID)
      .then(data => {
        setBuilding(data);
      })
      .catch(console.log);
  }, []);

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
          (f: any) => f.identifier === SITUM_FLOOR_ID,
        )[0];
        setCurrentFloor(selectedFloor);
        setMapImage(selectedFloor.mapUrl);

        getPoisInfo(data).then((res: any) => setPois(res));
      })
      .catch(console.log);
  }, [building]);

  return (
    <View>
      <MapView
        style={{width: '100%', height: '100%'}}
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
