import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SitumPlugin, {
  LocationStatus,
  Location,
  Error,
  Building,
} from "@situm/react-native";
import { PositioningCard } from "./cards/PositioningCard";
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { FetchResourcesCard } from "./cards/FetchResourcesCard";
import { MapInteractionCard } from "./cards/MapInteractionCard";
import { useNavigation } from "@react-navigation/native";
import {
  useSitumConfig,
  DEFAULT_SITUM_CONFIG,
} from "../config/SitumConfigContext";

export const HomeScreen = () => {
  const { apiKey, buildingId, profile, apiDomain, mapViewerDomain, updateConfig } =
    useSitumConfig();

  const [draftApiKey, setDraftApiKey] = useState(apiKey);
  const [draftBuildingId, setDraftBuildingId] = useState(buildingId);
  const [draftProfile, setDraftProfile] = useState(profile);
  const [draftApiDomain, setDraftApiDomain] = useState(apiDomain);
  const [draftMapViewerDomain, setDraftMapViewerDomain] =
    useState(mapViewerDomain);

  useEffect(() => {
    setDraftApiKey(apiKey);
    setDraftBuildingId(buildingId);
    setDraftProfile(profile);
    setDraftApiDomain(apiDomain);
    setDraftMapViewerDomain(mapViewerDomain);
  }, [apiKey, buildingId, profile, apiDomain, mapViewerDomain]);

  const applySitumConfiguration = () => {
    const nextApiKey = draftApiKey.trim();
    const nextBuildingId = draftBuildingId.trim();
    const nextProfile = draftProfile.trim();
    const nextApiDomain = draftApiDomain.trim();
    const nextMapViewerDomain = draftMapViewerDomain.trim();

    if (
      !nextApiKey ||
      !nextBuildingId ||
      !nextProfile ||
      !nextApiDomain ||
      !nextMapViewerDomain
    ) {
      Alert.alert("Invalid configuration", "All Situm fields are required.");
      return;
    }

    updateConfig({
      apiKey: nextApiKey,
      buildingId: nextBuildingId,
      profile: nextProfile,
      apiDomain: nextApiDomain,
      mapViewerDomain: nextMapViewerDomain,
    });
    setFetchOutput("Situm configuration applied.");
  };

  const resetSitumConfiguration = () => {
    updateConfig(DEFAULT_SITUM_CONFIG);
    setFetchOutput("Situm configuration reset to defaults.");
  };

  // ////////////////////////////////////////////////////////////////////////
  // POSITIONING:
  // ////////////////////////////////////////////////////////////////////////

  const [location, setLocation] = useState<Location>();
  const [status, setStatus] = useState<LocationStatus>();
  const [locationError, setLocationError] = useState("");

  useEffect(() => {
    registerCallbacks();
    SitumPlugin.setConfiguration({ useRemoteConfig: true });

    // Automatically manage positioning permissions and sensor issues:
    SitumPlugin.enableUserHelper();

    return () => {
      stopPositioning();
    };
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
          (b) => b.buildingIdentifier === buildingId
        );
        setBuilding(myBuilding);
      })
      .catch((error: any) => {
        console.error(`Situm > example > Failed to fetch buildings: ${error}`);
      });
  }, [buildingId]);

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
        <View style={styles.configCard}>
          <Text style={styles.configTitle}>Situm configuration</Text>
          <TextInput
            style={styles.configInput}
            value={draftApiKey}
            onChangeText={setDraftApiKey}
            placeholder="API key"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextInput
            style={styles.configInput}
            value={draftBuildingId}
            onChangeText={setDraftBuildingId}
            placeholder="Building ID"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextInput
            style={styles.configInput}
            value={draftApiDomain}
            onChangeText={setDraftApiDomain}
            placeholder="API domain"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextInput
            style={styles.configInput}
            value={draftProfile}
            onChangeText={setDraftProfile}
            placeholder="Profile"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextInput
            style={styles.configInput}
            value={draftMapViewerDomain}
            onChangeText={setDraftMapViewerDomain}
            placeholder="Map viewer domain"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <View style={styles.configActions}>
            <Button title="Apply config" onPress={applySitumConfiguration} />
            <Button title="Reset defaults" onPress={resetSitumConfiguration} />
          </View>
        </View>
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
  configCard: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d8d8d8",
    backgroundColor: "#ffffff",
  },
  configTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  configInput: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 8,
  },
  configActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
});
