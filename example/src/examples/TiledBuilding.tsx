import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Image, Dimensions } from "react-native";

import SitumPlugin from "react-native-situm-plugin";
import MapView, { PROVIDER_GOOGLE, Overlay, Marker , UrlTile, MapLocalTile} from "react-native-maps";
import { SITUM_BUILDING_ID } from "../situm";




//This example shows how to display a tiled floorplan hosted in Situm Platform.
//Floorplans are not stored in tiles by default, but Situm Support Team can tile your floorplans & upload them to Situm Platform (ask us: support@situm.com)
//Change TILES_URL to the URL provided by Situm Support.
 

const MAX_ZOOM_LEVEL = 20


// This URL will be provided by Situm Support. {building_id} and {floor_id} will be the ID of the building and that you want to display, respectivelly.
// {z},{y}, {x} are the tile selection variables that will be auto-filled at runtime by react-native-maps
const TILES_URL = "https://dashboard.situm.com/uploads/{building_id}/{floor_id}/{z}/{x}/{y}.png" 


export const TiledBuilding = () => {
  const [building, setBuilding] = useState<any>();
  const [buildings, setBuildings] = useState<any>();
  const [selectedBuilding, setSelectedBuilding] = useState<any>();
  const [mapRegion, setMapRegion] = useState<any>();
  
  const [isLoading, setIsLoading] = useState<Boolean>(false); 
  const [error, setError] = useState<String>();
  const [floor, setFloor] = useState<any>();

  const [hasStoredTiles, setHasStoredTiles] = useState<Boolean>(false); 
  const [offlineTilePath, setOfflineTilePath] = useState<String>();
  


    /*
  const getBuildings = () => {
    SitumPlugin.fetchBuildings(
        (buildings: any) => {
          if (!buildings || buildings.length == 0)
            setError(
              'No buildings, add a few buildings first by going to:\nhttps://dashboard.situm.es/buildings',
            );
          // console.log(JSON.stringify(buildings));
          setBuildings(JSON.stringify(buildings, null, 2));

          console.log ("looping through elements in array");
          for (let b in buildings) {
            console.log ("building bucle " + JSON.stringify(b));
            if (b.identifier === buildingID) {
                console.log("Established selected building");
                setSelectedBuilding(b);                    
            }
          }
        },
        (error: any) => {
          console.log(error);
          setError(error);
        },
      );
  }*/

  const getBuildingInfo = (building: any) => {
    
    SitumPlugin.fetchBuildings(
        (buildings) => {
          // returns list of buildings
          if (!buildings || buildings.length == 0)
            alert(
              'No buildings, add a few buildings first by going to:\nhttps://dashboard.situm.es/buildings',
            );

            for (const [key, b] of buildings.entries()) {
                console.log(key + JSON.stringify(b));


                if (b.buildingIdentifier === SITUM_BUILDING_ID) {
                    console.log("Found selected buidling");
                    console.log("Found required building, going to download entire building");
                    SitumPlugin.fetchBuildingInfo(
                        b,
                        (buildingInfo: any) => {
                          console.log('FetchBuildingInfo ' + JSON.stringify(buildingInfo));
                
                          if (buildingInfo.floors.length >= 1) {
                            setFloor(buildingInfo.floors.find((fl: any) => fl.level === 0));
                          } else {
                            console.error('No floors found!');
                          }
                
                
                        setMapRegion( {
                            latitude: buildingInfo.building.center.latitude,
                            longitude: buildingInfo.building.center.longitude,
                            latitudeDelta: 0.005,
                            longitudeDelta: 0.005,
                          });
                
                          getOfflineTiles(b);
                        },
                        (error: any) => {
                          console.log('FetchBuildingInfoError ' + error);
                        },
                      );
                } 


            }

            /*
            for (const [k, b] in Object.entries(buildings)) {
                console.log("buildings are" + k + ": " + JSON.stringify(b));
                ///console.log("downloaded building: " + JSON.stringify(b));
                if (b.identifier === SITUM_BUILDING_ID) {
                    
                }
            }*/

        },
        (error) => {
          // returns an error string
        },
      );
    
    
    
    
    
    
  }

  const getOfflineTiles = (building: any) => {
    SitumPlugin.fetchTilesFromBuilding(building,
        (result: any) => {
          console.log("result is" + JSON.stringify(result));

            // setHasStoredTiles(true);
            // result is{"results":"/data/user/0/com.example.reactnativesdkplugin/files/tiles/12929"}
            setOfflineTilePath(result.results);

        },
        (error: any) => {
          console.log("Fetch tiles from building error" + error);
        }
      );
  }

  /*
   const [mapRegion] = useState<any>({
    latitude: building.center.latitude,
    longitude: building.center.longitude,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });*/
 
  const initializeBuilding = () => {
    setBuilding({"identifier" : "12929"});
  }
  
  useEffect(() => {
    console.log("called initialized");
    initializeBuilding();
   }, []);

   useEffect(() => {
    console.log("called getbuilding info");
    getBuildingInfo(building);
   }, building);

   /*
   useEffect(() => {
    getBuildingInfo(selectedBuilding);
   }, selectedBuilding);*/
  
  return (
    <View>
      <MapView
        style={{ width: "100%", height: "100%" }}
        initialRegion={mapRegion}
        maxZoomLevel={MAX_ZOOM_LEVEL}
      >

    {offlineTilePath !== "" ? (
        <MapLocalTile 
        pathTemplate={offlineTilePath + '/40600/{z}/{x}/{y}.png'}
        tileSize={256}
      ></MapLocalTile>)
      : (
      <UrlTile
        key={ "https://dashboard.situm.com/uploads/12929/{floor_id}/{z}/{x}/{y}.png" }
        urlTemplate={"https://dashboard.situm.com/uploads/12929/{floor_id}/{z}/{x}/{y}.png"}
        flipY={false}
    />
    )}

      
      </MapView>

      {isLoading && (
        <View style={{ position: "absolute" }}>
          <ActivityIndicator size="large" color="#000000" />
        </View>
      )}
    </View>
  );
};