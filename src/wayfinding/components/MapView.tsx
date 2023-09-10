/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { Platform, StyleSheet } from "react-native";
import WebView from "react-native-webview";
import type {
  WebViewErrorEvent,
  WebViewMessageEvent,
} from "react-native-webview/lib/WebViewTypes";

import { ErrorName, NavigationStatus, type Poi } from "../../";
import useSitum, { useCallbackRef } from "../hooks";
import { setWebViewRef } from "../store";
import { useDispatch } from "../store/utils";
import {
  type MapViewError,
  type MapViewRef,
  type NavigateToPoiType,
  type OnPoiDeselectedResult,
  type OnPoiSelectedResult,
} from "../types";
import { sendMessageToViewer } from "../utils";
import Mapper from "../utils/mapper";

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

export interface MapViewCallbacks {
  onPoiSelected: (event: OnPoiSelectedResult) => void;
  onPoiDeselected: (event: OnPoiDeselectedResult) => void;
  onLoad?: (event: any) => void;
  onLoadError?: (event: MapViewError) => void;
}

export interface MapViewProps {
  configuration: MapViewConfiguration;
  callbacks: MapViewCallbacks;
}

const MapView = React.forwardRef<MapViewRef, MapViewProps>(
  ({ configuration, callbacks }, ref) => {
    const dispatch = useDispatch();
    const webViewRef = useRef(null);

    // Local states
    const [mapLoaded, setMapLoaded] = useState<boolean>(false);
    const [buildingIdentifier, setBuildingIdentifier] = useState<string>(
      configuration.buildingIdentifier
    );

    const {
      init,
      pois,
      location,
      directions,
      navigation,
      currentBuilding,

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
        sendMessageToViewer(webViewRef.current, Mapper.followUser(true));
      }
    };

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
    const navigateToPoiRef = useCallbackRef(
      ({ poi, poiId }: { poi?: Poi; poiId?: number }) => {
        if (!webViewRef.current || (!poi && !poiId)) return;
        const validPoi = pois?.find(
          (p) =>
            p?.identifier === poiId?.toString() ||
            // @ts-ignore
            p?.identifier === poi?.id?.toString()
        );
        if (!validPoi) {
          console.error("Situm > hook > Invalid value as poi or poiId");
          return;
        }

        sendMessageToViewer(
          webViewRef.current,
          Mapper.navigateToPoi({
            // @ts-ignore
            navigationTo: poi?.id || poiId,
          } as NavigateToPoiType)
        );
      },
      [pois]
    );

    const selectPoiRef = useCallbackRef(
      (poiId: number) => {
        if (!webViewRef.current) {
          return;
        }
        const poi = pois?.find((p) => p?.identifier === poiId?.toString());
        if (!poi) {
          console.error("Situm > hook > Invalid value as poiId");
          return;
        }
        if (navigation.status !== NavigationStatus.STOP) {
          console.error(
            "Situm > hook > Navigation on course, poi selection is unavailable"
          );
          return;
        }
        sendMessageToViewer(webViewRef.current, Mapper.selectPoi(poiId));
      },
      [pois, navigation?.status]
    );

    useImperativeHandle(
      ref,
      () => {
        return {
          followUser() {
            webViewRef.current &&
              sendMessageToViewer(webViewRef.current, Mapper.followUser(true));
          },
          unFollowUser() {
            webViewRef.current &&
              sendMessageToViewer(webViewRef.current, Mapper.followUser(false));
          },
          selectPoi(poiId: number) {
            selectPoiRef.current(poiId);
          },
          deselectPoi() {
            webViewRef.current &&
              sendMessageToViewer(webViewRef.current, Mapper.selectPoi(null));
          },
          navigateToPoi({ poi, poiId }: { poi?: Poi; poiId?: number }): void {
            navigateToPoiRef.current({ poi, poiId });
          },
          cancelNavigation(): void {
            if (!webViewRef.current) return;
            stopNavigation();
            sendMessageToViewer(webViewRef.current, Mapper.cancelNavigation());
          },
        };
      },
      [stopNavigation, navigateToPoiRef, selectPoiRef]
    );

    // useEffect(() => {
    //   configuration.buildingIdentifier &&
    //     initializeBuildingById(configuration.buildingIdentifier);
    //   // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [configuration.buildingIdentifier]);

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

      sendMessageToViewer(webViewRef.current, Mapper.location(location));
    }, [location]);

    // Updated SDK navigation
    useEffect(() => {
      if (!webViewRef.current || !navigation) return;

      sendMessageToViewer(webViewRef.current, Mapper.navigation(navigation));

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigation]);

    // Updated SDK route
    useEffect(() => {
      if (!webViewRef.current || !directions) return;

      sendMessageToViewer(webViewRef.current, Mapper.route(directions));
    }, [directions]);

    useEffect(() => {
      if (!webViewRef.current || !configuration.language || !mapLoaded) return;

      sendMessageToViewer(
        webViewRef.current,
        Mapper.setLanguage(configuration.language)
      );
    }, [configuration.language, mapLoaded]);

    useEffect(() => {
      if (webViewRef.current && mapLoaded) {
        sendMessageToViewer(
          webViewRef.current,
          Mapper.initialConfiguration(configuration.style)
        );
      }
    }, [webViewRef, mapLoaded, configuration.style]);

    useEffect(() => {
      mapLoaded && sendFollowUser();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mapLoaded]);

    const handleRequestFromViewer = (event: WebViewMessageEvent) => {
      const eventParsed = JSON.parse(event.nativeEvent.data);
      switch (eventParsed.type) {
        case "app.map_is_ready":
          init();
          callbacks.onLoad("");
          setMapLoaded(true);
          break;
        case "directions.requested":
          calculateRoute({
            buildingId: buildingIdentifier,
            originId: JSON.parse(event.nativeEvent.data).payload
              .originIdentifier,
            destinationId: JSON.parse(event.nativeEvent.data).payload
              .destinationIdentifier,
            directionsOptions: JSON.parse(event.nativeEvent.data).payload
              .directionsOptions,
          });
          break;
        case "navigation.requested":
          startNavigation({
            buildingId: buildingIdentifier,
            originId: JSON.parse(event.nativeEvent.data).payload
              .originIdentifier,
            destinationId: JSON.parse(event.nativeEvent.data).payload
              .destinationIdentifier,
            directionsOptions: JSON.parse(event.nativeEvent.data).payload
              .directionsOptions,
          });
          break;
        case "navigation.stopped":
          stopNavigation();
          break;
        case "cartography.poi_selected":
          callbacks.onPoiSelected(eventParsed?.payload);

          break;
        case "cartography.poi_deselected":
          callbacks.onPoiDeselected(eventParsed?.payload);
          break;
        case "cartography.floor_changed":
          break;
        case "cartography.building_selected":
          console.log("Building Selected");
          if (
            !eventParsed.payload.identifier ||
            (currentBuilding &&
              eventParsed.payload.identifier.toString() ===
                currentBuilding.buildingIdentifier)
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
        // This is called on a lot of interactions with the map because of url change probably
        onLoadEnd={() => {
          if (!webViewRef.current) return;
          dispatch(setWebViewRef(webViewRef));
        }}
        onError={(evt: WebViewErrorEvent) => {
          const { nativeEvent } = evt;
          // TODO: on render error should probably still try to render an html
          if (nativeEvent.code === NETWORK_ERROR_CODE[Platform.OS]) {
            callbacks.onLoadError({
              name: ErrorName.ERR_INTERNET_DISCONNECTED,
              description: nativeEvent.description,
            });
          } else {
            // TODO: handle more errors
            callbacks.onLoadError({
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
