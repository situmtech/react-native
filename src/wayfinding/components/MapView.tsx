/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Platform, StyleSheet } from "react-native";
import WebView from "react-native-webview";
import type {
  WebViewErrorEvent,
  WebViewMessageEvent,
} from "react-native-webview/lib/WebViewTypes";

import SitumPlugin, { NavigationStatus, NavigationUpdateType } from "../../sdk";
import useSitum from "../hooks";
import {
  type MapViewError,
  type MapViewRef,
  type NavigateToPointPayload,
  type NavigateToPoiPayload,
  type OnFloorChangedResult,
  type OnNavigationResult,
  type OnPoiDeselectedResult,
  type OnPoiSelectedResult,
} from "../types";
import { ErrorName } from "../types/constants";
import { sendMessageToViewer } from "../utils";
import ViewerMapper from "../utils/mapper";
const SITUM_BASE_DOMAIN = "https://map-viewer.situm.com";

const NETWORK_ERROR_CODE = {
  android: -2,
  ios: -1009,
  // These platforms are unhandled
  windows: 0,
  macos: 0,
  web: 0,
};

export type MapViewConfiguration = {
  apiDomain?: string;
  viewerDomain?: string;
  situmApiKey: string;
  remoteIdentifier?: string;
  buildingIdentifier: string;
  directionality?: string;
  style?: string;
  language?: string;
};

const viewerStyles = StyleSheet.create({
  webview: {
    minHeight: "100%",
    minWidth: "100%",
  },
});

export interface MapViewProps {
  configuration: MapViewConfiguration;
  onPoiSelected?: (event: OnPoiSelectedResult) => void;
  onPoiDeselected?: (event: OnPoiDeselectedResult) => void;
  onLoad?: (event: any) => void;
  onLoadError?: (event: MapViewError) => void;
  onFloorChanged?: (event: OnFloorChangedResult) => void;
  onNavigationRequested?: (event: OnNavigationResult) => void;
  onNavigationStarted?: (event: OnNavigationResult) => void;
  onNavigationError?: (event: OnNavigationResult) => void;
  onNavigationFinished?: (event: OnNavigationResult) => void;
}

const MapView = React.forwardRef<MapViewRef, MapViewProps>(
  (
    {
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
    },
    ref
  ) => {
    const webViewRef = useRef<WebView>();

    // Local states
    const [mapLoaded, setMapLoaded] = useState<boolean>(false);
    const [buildingIdentifier, setBuildingIdentifier] = useState<string>(
      configuration.buildingIdentifier
    );

    const {
      init,
      location,
      directions,
      navigation,

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
          configuration.buildingIdentifier
      ) {
        sendMessageToViewer(webViewRef.current, ViewerMapper.followUser(true));
      }
    };

    // Navigation
    const _navigateToPoi = useCallback((payload: NavigateToPoiPayload) => {
      if (!webViewRef.current || !payload || !payload.identifier) return;

      sendMessageToViewer(
        webViewRef.current,
        ViewerMapper.navigateToPoi(payload)
      );
    }, []);

    const _navigateToPoint = useCallback((payload: NavigateToPointPayload) => {
      if (
        !webViewRef.current ||
        (!payload?.lat && !payload?.lng && !payload?.floorIdentifier)
      )
        return;

      sendMessageToViewer(
        webViewRef.current,
        ViewerMapper.navigateToPoint(payload)
      );
    }, []);

    // Cartography
    const _selectPoi = useCallback((poiId: number) => {
      if (!webViewRef.current) {
        return;
      }
      if (SitumPlugin.navigationIsRunning()) {
        console.error(
          "Situm > hook > Navigation on course, poi selection is unavailable"
        );
        return;
      }
      sendMessageToViewer(webViewRef.current, ViewerMapper.selectPoi(poiId));
    }, []);

    /**
     * API exported to the outside world from the MapViewer
     *
     * These handler allows third party developers to send actions to the MapView.
     * please check the MapViewRef type definitions to know the public API.
     *
     * <MapView
     *    ref={(ref: MapViewRef) => ref.selectPoi(122)}
     *    configuration={{
     *      buildingIdentifier: SITUM_BUILDING_ID,
     *    }}
     *    onLoad={onLoad} />
     */

    useImperativeHandle(
      ref,
      () => {
        return {
          followUser() {
            webViewRef.current &&
              sendMessageToViewer(
                webViewRef.current,
                ViewerMapper.followUser(true)
              );
          },
          unFollowUser() {
            webViewRef.current &&
              sendMessageToViewer(
                webViewRef.current,
                ViewerMapper.followUser(false)
              );
          },
          selectPoi(poiId: number) {
            _selectPoi(poiId);
          },
          deselectPoi() {
            webViewRef.current &&
              sendMessageToViewer(
                webViewRef.current,
                ViewerMapper.selectPoi(null)
              );
          },
          navigateToPoi(payload): void {
            _navigateToPoi(payload);
          },
          navigateToPoint(payload: NavigateToPointPayload): void {
            _navigateToPoint(payload);
          },
          cancelNavigation(): void {
            if (!webViewRef.current) return;
            stopNavigation();
            sendMessageToViewer(
              webViewRef.current,
              ViewerMapper.cancelNavigation()
            );
          },
        };
      },
      [stopNavigation, _navigateToPoi, _navigateToPoint, _selectPoi]
    );

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

      sendMessageToViewer(webViewRef.current, ViewerMapper.location(location));
    }, [location]);

    // Updated SDK navigation
    useEffect(() => {
      if (!webViewRef.current || !navigation) return;

      if (navigation.status === NavigationStatus.START) {
        onNavigationStarted(ViewerMapper.routeToResult(navigation));
      }
      if (navigation?.type === NavigationUpdateType.FINISHED) {
        onNavigationFinished(ViewerMapper.navigationToResult(navigation));
      }

      sendMessageToViewer(
        webViewRef.current,
        ViewerMapper.navigation(navigation)
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigation]);

    // Updated SDK route
    useEffect(() => {
      if (!webViewRef.current || !directions) return;

      sendMessageToViewer(webViewRef.current, ViewerMapper.route(directions));
    }, [directions]);

    // Update language
    useEffect(() => {
      if (!webViewRef.current || !configuration.language || !mapLoaded) return;

      sendMessageToViewer(
        webViewRef.current,
        ViewerMapper.setLanguage(configuration.language)
      );
    }, [configuration.language, mapLoaded]);

    // Update SDK configuration
    useEffect(() => {
      if (webViewRef.current && mapLoaded) {
        sendMessageToViewer(
          webViewRef.current,
          ViewerMapper.initialConfiguration(configuration.style)
        );
      }
    }, [webViewRef, mapLoaded, configuration.style]);

    // Update follow user
    useEffect(() => {
      mapLoaded && sendFollowUser();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mapLoaded]);

    const handleRequestFromViewer = (event: WebViewMessageEvent) => {
      const eventParsed = JSON.parse(event.nativeEvent.data);
      switch (eventParsed.type) {
        case "app.map_is_ready":
          init();
          onLoad && onLoad("");
          setMapLoaded(true);
          break;
        case "directions.requested":
          calculateRoute(eventParsed.payload);
          break;
        case "navigation.requested":
          startNavigation(eventParsed.payload)
            .then((r) => onNavigationRequested(ViewerMapper.routeToResult(r)))
            .catch(onNavigationError);
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
          console.log("Building Selected");
          if (
            !eventParsed.payload.identifier ||
            eventParsed.payload.identifier.toString() === buildingIdentifier
          ) {
            return;
          } else {
            setBuildingIdentifier(eventParsed.payload.identifier.toString());
          }
          break;
        default:
          break;
      }
    };

    return (
      <WebView
        ref={webViewRef}
        source={{
          uri: `${configuration.viewerDomain || SITUM_BASE_DOMAIN}/${
            configuration.remoteIdentifier
              ? `id/${configuration.remoteIdentifier}`
              : ""
          }?&apikey=${
            configuration.situmApiKey
          }&wl=true&global=true&mode=embed${
            configuration.buildingIdentifier
              ? `&buildingid=${configuration.buildingIdentifier}`
              : ""
          }&show=rts`,
        }}
        style={viewerStyles.webview}
        limitsNavigationsToAppBoundDomains={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        cacheEnabled
        onMessage={handleRequestFromViewer}
        onError={(evt: WebViewErrorEvent) => {
          if (!onLoadError) return;
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
  }
);

export default MapView;
