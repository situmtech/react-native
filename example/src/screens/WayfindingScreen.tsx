import React, { useEffect, useState, useRef } from "react";
import { StyleSheet } from "react-native";

import {
  type OnPoiDeselectedResult,
  type OnPoiSelectedResult,
  type OnExternalLinkClickedResult,
  type MapViewRef,
  MapView,
} from "@situm/react-native";

import { PaperProvider } from "react-native-paper";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootTabsParamsList } from "../navigation/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSitumConfig } from "../config/SitumConfigContext";

export const WayfindingScreen: React.FC = () => {
  const { buildingId, profile, mapViewerDomain } = useSitumConfig();

  // ////////////////////////////////////////////////////////////////////////
  // INITIALIZATION
  // ////////////////////////////////////////////////////////////////////////

  const mapViewRef = useRef<MapViewRef>(null);
  const [controller, setController] = useState<MapViewRef | null>();
  const [mapViewLoaded, setMapViewLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (!mapViewRef) {
      return;
    }
    setController(mapViewRef.current);
  }, [mapViewRef]);

  const onLoad = (event: any) => {
    // The "onLoad" callback indicates that the map has been loaded and is
    // ready to receive calls to perform actions (e.g., selectPoi, navigateToPoi).
    setMapViewLoaded(true);
    console.log("Situm> example> Map is ready, received event: ", event);
  };

  // ////////////////////////////////////////////////////////////////////////
  // CALLBACKS:
  // ////////////////////////////////////////////////////////////////////////

  const onPoiSelected = (event: OnPoiSelectedResult) => {
    console.log(
      "Situm> example> on poi selected detected: " + JSON.stringify(event)
    );
  };

  const onPoiDeselected = (event: OnPoiDeselectedResult) => {
    console.log(
      "Situm> example> on poi deselected detected: " + JSON.stringify(event)
    );
  };

  const onExternalLinkClicked = (event: OnExternalLinkClickedResult) => {
    // MapView will open the external link in the system's default browser if this callback is not set.
    console.log("Situm> example> click on external link: " + event.url);
  };

  const onFloorChanged = (event: any) => {
    console.log("Situm> example> floor changed to: " + event.identifier);
  };

  const onFavoritePoisUpdated = (event: any) => {
    console.log(
      "Situm> example> favorite pois updated: " + JSON.stringify(event.pois)
    );
  };

  const onMapError = (error: any) => {
    console.error("Situm> example> map error: " + error.message);
  };

  // ////////////////////////////////////////////////////////////////////////
  // ACTIONS:
  // ////////////////////////////////////////////////////////////////////////

  // Get the POI identifier from react-navigation route params.
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootTabsParamsList, "Wayfinding">>();
  const { poiIdentifier, action } = route.params || {};

  useEffect(() => {
    // The MapView must be loaded to perform actions.
    if (!mapViewLoaded) return;
    if (!poiIdentifier || !action) return;

    if (action === "select") {
      selectPoi(poiIdentifier);
    } else if (action === "navigate") {
      navigateToPoi(poiIdentifier);
    }

    // Reset params to make the useEffect execute even with the same values.
    navigation.setParams({
      poiIdentifier: undefined,
      action: undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poiIdentifier, action, mapViewLoaded]);

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const selectPoi = (poiIdentifier: string) => {
    controller?.selectPoi(Number(poiIdentifier));
  };

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const navigateToPoi = (poiIdentifier: string) => {
    controller?.navigateToPoi({
      identifier: Number(poiIdentifier),
    });
  };

  return (
    <PaperProvider>
      <SafeAreaView edges={["top"]} style={{ ...styles.container }}>
        {/* Add your MapView with a MapViewConfiguration */}
        <MapView
          ref={mapViewRef}
          configuration={{
            buildingIdentifier: buildingId,
            profile,
            viewerDomain: mapViewerDomain,
          }}
          onLoad={onLoad}
          onLoadError={onMapError}
          onPoiSelected={onPoiSelected}
          onPoiDeselected={onPoiDeselected}
          onFloorChanged={onFloorChanged}
          onExternalLinkClicked={onExternalLinkClicked}
          onFavoritePoisUpdated={onFavoritePoisUpdated}
        />
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapview: {
    width: "100%",
    height: "100%",
  },
});
