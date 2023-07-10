/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useEffect, useRef, useState } from "react";
import { Platform, StyleSheet } from "react-native";
import WebView from "react-native-webview";
import {
  WebViewErrorEvent,
  WebViewMessageEvent,
} from "react-native-webview/lib/WebViewTypes";

//This icon should either be inside plugin or not be used rat all
import useSitum from "../hooks";
import {
  NavigationStatus,
  NavigationUpdateType,
  setWebViewRef,
} from "../store";
import { useDispatch } from "../store/utils";
import {
  MapViewError,
  OnFloorChangedResult,
  OnNavigationResult,
  OnPoiDeselectedResult,
  OnPoiSelectedResult,
  WayfindingResult,
} from "../types/index.d";
import { sendMessageToViewer } from "../utils";
import Mapper from "../utils/mapper";

const SITUM_BASE_DOMAIN = "https://map-viewer.situm.com";

// Define class that handles errors
export enum ErrorName {
  ERR_INTERNET_DISCONNECTED = "ERR_INTERNET_DISCONNECTED",
  ERR_INTERNAL_SERVER_ERROR = "ERR_INTERNAL_SERVER_ERROR",
}

const NETWORK_ERROR_CODE = {
  android: -2,
  ios: -1009,
  // These platforms are unhandled
  windows: 0,
  macos: 0,
  web: 0,
};

export interface MapViewProps {
  domain?: string;
  user?: string;
  apikey?: string;
  configuration?: {
    buildingIdentifier?: string;
    enablePoiClustering?: boolean;
    showPoiNames?: boolean;
    useRemoteConfig?: boolean;
    minZoom?: number;
    maxZoom?: number;
    initialZoom?: number;
    useDashboardTheme?: boolean;
  };
  googleApikey?: string;
  onLoadError?: (event: MapViewError) => void;
  onLoad?: (event: WayfindingResult) => void;
  onFloorChanged?: (event: OnFloorChangedResult) => void;
  onPoiSelected?: (event: OnPoiSelectedResult) => void;
  onPoiDeselected?: (event: OnPoiDeselectedResult) => void;
  onNavigationRequested?: (event: OnNavigationResult) => void;
  onNavigationStarted?: (event: OnNavigationResult) => void;
  onNavigationError?: (event: OnNavigationResult) => void;
  onNavigationFinished?: (event: OnNavigationResult) => void;
  style?: any;
  iOSMapViewIndex?: string;
}

const viewerStyles = StyleSheet.create({
  webview: {
    minHeight: "100%",
    minWidth: "100%",
  },
});

const MapView: React.FC<MapViewProps> = ({
  domain,
  // user,
  // apikey,
  configuration,
  onLoad = () => {},
  onLoadError = () => {},
  onFloorChanged = () => {},
  onPoiSelected = () => {},
  onPoiDeselected = () => {},
  onNavigationRequested = () => {},
  onNavigationStarted = () => {},
  onNavigationError = () => {},
  onNavigationFinished = () => {},
  style,
  //iOSMapViewIndex,
}) => {
  const dispatch = useDispatch();
  const webViewRef = useRef();
  // Local states
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);

  const {
    user: fullUser,
    location,
    directions,
    navigation,
    currentBuilding,
    initializeBuildingById,
    calculateRoute,
    startNavigation,
    stopNavigation,
    error,
  } = useSitum();

  const sendFollowUser = () => {
    if (
      webViewRef.current &&
      mapLoaded &&
      location?.position?.buildingIdentifier ===
        configuration?.buildingIdentifier
    ) {
      sendMessageToViewer(webViewRef.current, Mapper.followUser(true));
    }
  };

  useEffect(() => {
    configuration.buildingIdentifier &&
      initializeBuildingById(configuration.buildingIdentifier);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configuration.buildingIdentifier]);

  useEffect(() => {
    if (error) {
      console.error(
        "Error code:",
        error.code ? error.code : " no code provided"
      );
      console.error("Error detected:", error.message);
    }
  }, [error]);

  // Updated SDK location
  useEffect(() => {
    if (!webViewRef.current || !location) return;
    //console.debug('location', location);

    sendMessageToViewer(webViewRef.current, Mapper.location(location));
  }, [location]);

  // Updated SDK navigation
  useEffect(() => {
    if (!webViewRef.current || !navigation) return;

    sendMessageToViewer(webViewRef.current, Mapper.navigation(navigation));

    if (navigation.status === NavigationStatus.START) {
      onNavigationStarted({
        navigation: Mapper.routeToResult(navigation),
      } as OnNavigationResult);
    }
    if (navigation?.type === NavigationUpdateType.destinationReached) {
      onNavigationFinished({
        navigation: Mapper.navigationToResult(navigation),
      } as OnNavigationResult);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  // Updated SDK route
  useEffect(() => {
    if (!webViewRef.current || !directions) return;

    sendMessageToViewer(webViewRef.current, Mapper.route(directions));
  }, [directions]);

  useEffect(() => {
    if (webViewRef.current && mapLoaded) {
      sendMessageToViewer(
        webViewRef.current,
        Mapper.initialConfiguration(
          style,
          configuration.enablePoiClustering,
          configuration.showPoiNames,
          configuration.minZoom,
          configuration.maxZoom,
          configuration.initialZoom,
          configuration.useDashboardTheme
        )
      );
    }
  }, [
    webViewRef,
    mapLoaded,
    style,
    configuration.enablePoiClustering,
    configuration.showPoiNames,
    configuration.minZoom,
    configuration.maxZoom,
    configuration.initialZoom,
    configuration.useDashboardTheme,
  ]);

  const handleRequestFromViewer = (event: WebViewMessageEvent) => {
    const eventParsed = JSON.parse(event.nativeEvent.data);
    switch (eventParsed.type) {
      case "app.map_is_ready":
        onLoad({
          status: "SUCCESS",
          message: "Map is ready!",
        } as WayfindingResult);
        sendFollowUser();
        break;
      case "directions.requested":
        calculateRoute({
          originId: JSON.parse(event.nativeEvent.data).payload.originIdentifier,
          destinationId: JSON.parse(event.nativeEvent.data).payload
            .destinationIdentifier,
          directionsOptions: JSON.parse(event.nativeEvent.data).payload
            .directionsOptions,
        });
        break;
      case "navigation.requested":
        startNavigation({
          originId: JSON.parse(event.nativeEvent.data).payload.originIdentifier,
          destinationId: JSON.parse(event.nativeEvent.data).payload
            .destinationIdentifier,
          directionsOptions: JSON.parse(event.nativeEvent.data).payload
            .directionsOptions,
          callback: (status, _navigation?) =>
            status === "success" && navigation
              ? onNavigationRequested({
                  navigation: Mapper.routeToResult(_navigation),
                } as OnNavigationResult)
              : status === "error" &&
                onNavigationError({} as OnNavigationResult),
        });
        break;
      case "navigation.stopped":
        stopNavigation();
        break;
      case "cartography.poi_selected":
        onPoiSelected(eventParsed?.payload);
        break;
      case "cartography.poi_deselected":
        onPoiDeselected(eventParsed?.payload);
        break;
      case "cartography.floor_changed":
        onFloorChanged(eventParsed?.payload);
        break;
      case "cartography.building_selected":
        if (
          !eventParsed.payload.identifier ||
          (currentBuilding &&
            eventParsed.payload.identifier.toString() ===
              currentBuilding.buildingIdentifier)
        ) {
          return;
        }

        initializeBuildingById(eventParsed.payload.identifier.toString());
        break;
      default:
        break;
    }
  };

  return (
    <WebView
      ref={webViewRef}
      source={{
        uri: `${domain || SITUM_BASE_DOMAIN}/?email=${fullUser?.email}&apikey=${
          fullUser?.apiKey
        }&wl=true&global=true&mode=embed${
          configuration.buildingIdentifier
            ? `&buildingid=${configuration.buildingIdentifier}`
            : ""
        }&show=rts`,
      }}
      style={viewerStyles.webview}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      startInLoadingState={true}
      onMessage={handleRequestFromViewer}
      // This is called on a lot of interactions with the map because of url change probably
      onLoadEnd={() => {
        if (!webViewRef.current) return;
        dispatch(setWebViewRef(webViewRef));
        setMapLoaded(true);
      }}
      onError={(evt: WebViewErrorEvent) => {
        const { nativeEvent } = evt;
        // TODO: on render error should probably still try to render an html
        if (nativeEvent.code === NETWORK_ERROR_CODE[Platform.OS]) {
          onLoadError({
            name: ErrorName.ERR_INTERNET_DISCONNECTED,
            description: nativeEvent.description,
          });
        } else {
          // TODO: handle more errors
          onLoadError({
            name: ErrorName.ERR_INTERNAL_SERVER_ERROR,
            description: nativeEvent.description,
          });
        }
      }}
    />
  );
};

export default MapView;
