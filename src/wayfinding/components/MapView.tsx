/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
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

import SitumPlugin, { type Poi } from "../../sdk";
import useSitum from "../hooks";
import { setWebViewRef } from "../store";
import { useDispatch } from "../store/utils";
import {
  type MapViewError,
  type MapViewRef,
  type NavigateToPoiType,
  type OnPoiDeselectedResult,
  type OnPoiSelectedResult,
} from "../types";
import { ErrorName } from "../types/constants";
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

export interface MapViewProps {
  configuration: MapViewConfiguration;
  onPoiSelected: (event: OnPoiSelectedResult) => void;
  onPoiDeselected: (event: OnPoiDeselectedResult) => void;
  onLoad?: (event: any) => void;
  onLoadError?: (event: MapViewError) => void;
}

const MapView = React.forwardRef<MapViewRef, MapViewProps>(
  (
    { configuration, onPoiSelected, onPoiDeselected, onLoad, onLoadError },
    ref
  ) => {
    const dispatch = useDispatch();
    const webViewRef = useRef(null);

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

    // TODO: this check should not be here
    const isPoiValid = useCallback(
      async (poiId: number) => {
        return await SitumPlugin.fetchBuildings().then(async (buildings) => {
          const building = buildings.find(
            (b) => b.buildingIdentifier === buildingIdentifier
          );
          return await SitumPlugin.fetchIndoorPOIsFromBuilding(building).then(
            (_pois) => {
              const validPoi = _pois?.find(
                (p) => p?.identifier === poiId?.toString()
              );
              return validPoi;
            }
          );
        });
      },
      [buildingIdentifier]
    );

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
    const _navigateToPoi = useCallback(
      async ({ poi, poiId }: { poi?: Poi; poiId?: number }) => {
        if (!webViewRef.current || (!poi && !poiId)) return;

        const isValid =
          //@ts-ignore
          (poi?.id && (await isPoiValid(poi?.id))) || (await isPoiValid(poiId));
        if (isValid) {
          sendMessageToViewer(
            webViewRef.current,
            Mapper.navigateToPoi({
              // @ts-ignore
              navigationTo: poi?.id || poiId,
            } as NavigateToPoiType)
          );
        } else {
          console.error("Situm > hook > Invalid value as poi");
        }
      },
      [isPoiValid]
    );

    const _selectPoi = useCallback(
      async (poiId: number) => {
        if (!webViewRef.current) {
          return;
        }
        if (SitumPlugin.navigationIsRunning()) {
          console.error(
            "Situm > hook > Navigation on course, poi selection is unavailable"
          );
          return;
        }
        //@ts-ignore
        const isValid = await isPoiValid(poiId);
        if (isValid) {
          sendMessageToViewer(webViewRef.current, Mapper.selectPoi(poiId));
        } else {
          console.error("Situm > hook > Invalid value as poiId");
        }
      },
      [isPoiValid]
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
            _selectPoi(poiId);
          },
          deselectPoi() {
            webViewRef.current &&
              sendMessageToViewer(webViewRef.current, Mapper.selectPoi(null));
          },
          navigateToPoi({ poi, poiId }: { poi?: Poi; poiId?: number }): void {
            _navigateToPoi({ poi, poiId });
          },
          cancelNavigation(): void {
            if (!webViewRef.current) return;
            stopNavigation();
            sendMessageToViewer(webViewRef.current, Mapper.cancelNavigation());
          },
        };
      },
      [stopNavigation, _navigateToPoi, _selectPoi]
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
          onLoad("");
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
          onPoiSelected(eventParsed?.payload);

          break;
        case "cartography.poi_deselected":
          onPoiDeselected(eventParsed?.payload);
          break;
        case "cartography.floor_changed":
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
        // This is called on a lot of interactions with the map because of url change probably
        onLoadEnd={() => {
          if (!webViewRef.current) return;
          dispatch(setWebViewRef(webViewRef));
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
  }
);

export default MapView;
