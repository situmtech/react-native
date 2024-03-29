import React, {useEffect, useState} from 'react';
import {View, ActivityIndicator} from 'react-native';

import SitumPlugin, {Building} from '@situm/react-native';
import MapView, {MapLocalTile} from 'react-native-maps';
import {SITUM_BUILDING_ID, SITUM_FLOOR_ID} from '../../situm';
import styles from '../styles/styles';

//This example shows how to display a tiled floorplan hosted in Situm Platform.
//Floorplans are not stored in tiles by default, but Situm Support Team can tile your floorplans & upload them to Situm Platform (ask us: support@situm.com)

const MAX_ZOOM_LEVEL = 20;

export const TiledBuilding = () => {
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const [offlineTilePath, setOfflineTilePath] = useState<String>();
  const mapRef = React.createRef<MapView>();

  const getBuildingInfo = async () => {
    SitumPlugin.fetchBuildings()
      .then(buildings => {
        if (!buildings || buildings.length === 0) {
          console.error(
            'Situm > example > No buildings, add a few buildings first by going to:\nhttps://dashboard.situm.es/buildings',
          );
          return;
        }

        for (const [_, b] of buildings.entries()) {
          //console.log(key + JSON.stringify(b));
          if (b.buildingIdentifier === SITUM_BUILDING_ID) {
            console.log(
              'Situm > example > Found required building, going to download entire building',
            );

            SitumPlugin.fetchBuildingInfo(b)
              .then(buildingInfo => {
                mapRef.current?.animateToRegion({
                  latitude: buildingInfo.building.center.latitude,
                  longitude: buildingInfo.building.center.longitude,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                });
                getOfflineTiles(b);
              })
              .catch(e => {
                console.error(
                  `Situm > example > Could not fetch building's information: ${e}`,
                );
              });
          }
        }
      })
      .catch(e =>
        console.debug(`Situm > example > Could not fetch buildings: ${e}`),
      );
  };

  const getOfflineTiles = async (building: Building) => {
    SitumPlugin.fetchTilesFromBuilding(building)
      .then(response => {
        setOfflineTilePath(response?.results);
        setIsLoading(false);
      })
      .catch(e => {
        console.error(`Situm > example > Could not fetch tiles ${e}`);
      });
  };

  useEffect(() => {
    getBuildingInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View>
      <MapView
        ref={mapRef}
        style={styles.container}
        maxZoomLevel={MAX_ZOOM_LEVEL}>
        <MapLocalTile
          pathTemplate={
            offlineTilePath + '/' + SITUM_FLOOR_ID + '/{z}/{x}/{y}.png'
          }
          tileSize={256}
        />
      </MapView>

      {isLoading && (
        <View style={styles.indicator}>
          <ActivityIndicator size="large" color="#000000" />
        </View>
      )}
    </View>
  );
};
