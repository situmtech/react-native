import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SitumPlugin, {
  LocationStatus,
  Location,
  Error,
  Building,
} from "@situm/react-native";
import { PositioningCard } from "./cards/PositioningCard";
import { Alert, ScrollView, StyleSheet } from "react-native";
import { FetchResourcesCard } from "./cards/FetchResourcesCard";
import { SITUM_BUILDING_ID } from "../situm";
import { MapInteractionCard } from "./cards/MapInteractionCard";
import { useNavigation } from "@react-navigation/native";

export const HomeScreen = () => {
  // ////////////////////////////////////////////////////////////////////////
  // POSITIONING:
  // ////////////////////////////////////////////////////////////////////////

  const [location, setLocation] = useState<Location>();
  const [status, setStatus] = useState<LocationStatus>();
  const [locationError, setLocationError] = useState("");

  useEffect(() => {
    registerCallbacks();

    // Automatically manage positioning permissions and sensor issues:
    SitumPlugin.enableUserHelper();
  }, []);

  const startPositioning = async () => {
    console.log("Starting positioning");
    clearPositioningData();
    SitumPlugin.requestLocationUpdates({});
  };

  const stopPositioning = () => {
    console.log("Stopping positioning");
    SitumPlugin.removeLocationUpdates();
  };

  const clearPositioningData = () => {
    setLocation(undefined);
    setStatus(undefined);
    setLocationError("");
  };

  const registerCallbacks = () => {
    SitumPlugin.onLocationUpdate((loc: Location) => {
      setLocation(loc);
    });

    SitumPlugin.onLocationStatus((st: LocationStatus) => {
      setStatus(st);
    });

    SitumPlugin.onLocationError((err: Error) => {
      setLocationError(err.message);
    });
  };

  // ////////////////////////////////////////////////////////////////////////
  // MAP INTERACTION:
  // ////////////////////////////////////////////////////////////////////////

  const navigation = useNavigation();

  const selectPoi = (identifier: string) => {
    navigation.navigate("Wayfinding", {
      poiIdentifier: identifier,
      action: "select",
    });
  };

  const navigateToPoi = (identifier: string) => {
    if (!location) {
      Alert.alert(
        "Location required",
        "User location is required to start navigation."
      );
      return;
    }
    navigation.navigate("Wayfinding", {
      poiIdentifier: identifier,
      action: "navigate",
    });
  };

  // ////////////////////////////////////////////////////////////////////////
  // FETCH RESOURCES:
  // ////////////////////////////////////////////////////////////////////////

  const [fetchOutput, setFetchOutput] = useState("No data");
  const [building, setBuilding] = useState<Building>();

  useEffect(() => {
    SitumPlugin.fetchBuildings()
      .then((buildings: Building[]) => {
        const myBuilding = buildings.find(
          (b) => b.buildingIdentifier === SITUM_BUILDING_ID
        );
        setBuilding(myBuilding);
      })
      .catch((error: any) => {
        console.error(`Situm > example > Failed to fetch buildings: ${error}`);
      });
  }, []);

  const fetchBuildingInfo = () => {
    setFetchOutput("fetchBuildingInfo...");
    if (!building) return;
    SitumPlugin.fetchBuildingInfo(building)
      .then(setJsonFetchOutput)
      .catch((error: any) => {
        console.error(
          `Situm > example > Failed to fetch building info: ${error}`
        );
      });
  };

  const fetchPois = () => {
    setFetchOutput("fetchPois...");
    if (!building) return;
    SitumPlugin.fetchIndoorPOIsFromBuilding(building)
      .then(setJsonFetchOutput)
      .catch((error: any) => {
        console.error(
          `Situm > example > Failed to fetch building info: ${error}`
        );
      });
  };

  const fetchPoiCategories = () => {
    setFetchOutput("...");
    SitumPlugin.fetchPoiCategories()
      .then(setJsonFetchOutput)
      .catch((error: any) => {
        console.error(
          `Situm > example > Failed to fetch building info: ${error}`
        );
      });
  };

  const fetchGeofences = () => {
    setFetchOutput("fetchGeofences...");
    if (!building) return;
    SitumPlugin.fetchGeofencesFromBuilding(building)
      .then(setJsonFetchOutput)
      .catch((error: any) => {
        console.error(
          `Situm > example > Failed to fetch building info: ${error}`
        );
      });
  };

  const invalidateCache = () => {
    setFetchOutput("invalidateCache...");
    SitumPlugin.invalidateCache();
    setFetchOutput("Cache invalidated");
  };

  const setJsonFetchOutput = (data: any) => {
    console.log(data);
    setFetchOutput(JSON.stringify(data, undefined, 2));
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={true}
      >
        <PositioningCard
          onStartPositioning={startPositioning}
          onStopPositioning={stopPositioning}
          location={location}
          status={status}
          error={locationError}
        />
        <MapInteractionCard
          onSelectPoi={selectPoi}
          onNavigateToPoi={navigateToPoi}
        />
        <FetchResourcesCard
          onFetchBuildingInfo={fetchBuildingInfo}
          onFetchPois={fetchPois}
          onFetchPoiCategories={fetchPoiCategories}
          onFetchGeofences={fetchGeofences}
          onInvalidateCache={invalidateCache}
          output={fetchOutput}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollContainer: {
    padding: 4,
    paddingBottom: 0,
  },
});
