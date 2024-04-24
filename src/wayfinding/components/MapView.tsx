/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Linking,
  Platform,
  type StyleProp,
  StyleSheet,
  type ViewStyle,
} from "react-native";
import WebView from "react-native-webview";
import type {
  WebViewErrorEvent,
  WebViewMessageEvent,
} from "react-native-webview/lib/WebViewTypes";

import SitumPlugin from "../../sdk";
import useSitum from "../hooks";
import {
  type MapViewDirectionsOptions,
  type MapViewError,
  type MapViewRef,
  type NavigateToPointPayload,
  type NavigateToPoiPayload,
  type OnDirectionsRequestInterceptor,
  type OnExternalLinkClickedResult,
  type OnFloorChangedResult,
  type OnPoiDeselectedResult,
  type OnPoiSelectedResult,
  type SearchFilter,
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
  /**
   * A String parameter that allows you to choose the API you will be retrieving our cartography from. Default is "dashboard.situm.com".
   * In most cases this parameter shouldn't be changed.
   */
  apiDomain?: string;
  /**
   * A String parameter that allows you to specify which domain will be displayed inside our webview. Defaults to "https://map-viewer.situm.com/".
   * In most cases this parameter shouldn't be changed.
   */
  viewerDomain?: string;
  /**
   * @required
   * Your Situm API key. Find your API key at your [situm profile](https://dashboard.situm.com/accounts/profile)
   */
  situmApiKey: string;
  /**
   * A String identifier that allows you to remotely configure all map settings.
   */
  remoteIdentifier?: string;
  /**
   * @required
   * The building that will be loaded on the map.
   * In case you set a buildingIdentifier in your remote configuration, it will be prioritized over {@link MapViewConfiguration.buildingIdentifier} parameter.
   */
  buildingIdentifier: string;
  /**
   * Sets the directionality of the texts that will be displayed inside MapView. Default is "ltr".
   */
  directionality?: string;
  /**
   * Sets the UI language based on the given ISO 639-1 code. Checkout the [Situm docs](https://situm.com/docs/query-params/) to see the list of supported languages.
   */
  language?: string;
};

const viewerStyles = StyleSheet.create({
  webview: {
    minHeight: "100%",
    minWidth: "100%",
  },
});

export interface MapViewProps {
  /**
   * The required basic configuration to use our MapView.
   */
  configuration: MapViewConfiguration;
  style?: StyleProp<ViewStyle>;
  /**
   * Get notified when a POI is selected.
   * @param event {@link OnPoiSelectedResult} object.
   */
  onPoiSelected?: (event: OnPoiSelectedResult) => void;
  /**
   * Get notified when the selected POI is deselected.
   * @param event {@link OnPoiDeselectedResult} object.
   */
  onPoiDeselected?: (event: OnPoiDeselectedResult) => void;
  /**
   * Get notified when the MapView has been loaded and is ready to receive actions.
   */
  onLoad?: (event: any) => void;
  /**
   * Get notified when an error has occurred during the MapView load process.
   * @param event {@link MapViewError} object.
   */
  onLoadError?: (event: MapViewError) => void;
  /**
   * Get notified when the current floor displayed on the map has changed.
   * @param event {@link OnFloorChangedResult} object.
   */
  onFloorChanged?: (event: OnFloorChangedResult) => void;
  /**
   * Callback invoked when the user clicks on a link in the MapView that leads to a website different from the MapView's domain.
   * For example some POI description may contain a link to a video or a website, and if this callback is not set,
   * the link will be opened in the system's default browser by default.
   * @param event {@link OnExternalLinkClickedResult} object.
   */
  onExternalLinkClicked?: (event: OnExternalLinkClickedResult) => void;
}

const MapView = React.forwardRef<MapViewRef, MapViewProps>(
  (
    {
      configuration,
      style,
      onLoad = () => {},
      onLoadError = () => {},
      onPoiSelected = () => {},
      onPoiDeselected = () => {},
      onFloorChanged = () => {},
      onExternalLinkClicked = undefined,
    },
    ref
  ) => {
    const webViewRef = useRef<WebView>();
    const [_onDirectionsRequestInterceptor, setInterceptor] =
      useState<OnDirectionsRequestInterceptor>();

    // Local states
    const [mapLoaded, setMapLoaded] = useState<boolean>(false);
    const [buildingIdentifier, setBuildingIdentifier] = useState<string>(
      configuration.buildingIdentifier
    );
    const {
      init,
      location,
      locationStatus,
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

    // Helper functions used on imperative handler
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

    const _selectPoiCategory = useCallback((categoryId: number) => {
      if (!webViewRef.current) {
        return;
      }
      if (SitumPlugin.navigationIsRunning()) {
        console.error(
          "Situm > hook > Navigation on course, poi category selection is unavailable"
        );
        return;
      }
      sendMessageToViewer(
        webViewRef.current,
        ViewerMapper.selectPoiCategory(categoryId)
      );
    }, []);

    const _search = useCallback((payload: SearchFilter) => {
      sendMessageToViewer(webViewRef.current, ViewerMapper.search(payload));
    }, []);

    const _setDirectionsOptions = useCallback(
      (directionsOptions: MapViewDirectionsOptions) => {
        if (!webViewRef.current) {
          return;
        }
        sendMessageToViewer(
          webViewRef.current,
          ViewerMapper.setDirectionsOptions(directionsOptions)
        );
      },
      []
    );

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
          selectPoiCategory(poiId: number) {
            _selectPoiCategory(poiId);
          },
          setDirectionsOptions(directionsOptions: MapViewDirectionsOptions) {
            _setDirectionsOptions(directionsOptions);
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
          setOnDirectionsRequestInterceptor(directionRequestInterceptor): void {
            setInterceptor(() => directionRequestInterceptor);
          },
          cancelNavigation(): void {
            if (!webViewRef.current) return;
            stopNavigation();
            sendMessageToViewer(
              webViewRef.current,
              ViewerMapper.cancelNavigation()
            );
          },
          search(searchFilter): void {
            _search(searchFilter);
          },
        };
      },
      [
        stopNavigation,
        _navigateToPoi,
        _navigateToPoint,
        _selectPoi,
        _selectPoiCategory,
        _setDirectionsOptions,
        _search,
      ]
    );

    useEffect(() => {
      if (!error) return;

      console.error(
        "Error code:",
        error.code ? error.code : " no code provided"
      );
      console.error("Error detected:", error.message);
    }, [error]);

    // Updated SDK location
    useEffect(() => {
      if (!webViewRef.current || !location) return;

      sendMessageToViewer(webViewRef.current, ViewerMapper.location(location));
    }, [location]);

    // Updated SDK navigation
    useEffect(() => {
      if (!webViewRef.current || !navigation) return;

      sendMessageToViewer(
        webViewRef.current,
        ViewerMapper.navigation(navigation)
      );
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
          ViewerMapper.initialConfiguration(style)
        );
      }
    }, [webViewRef, mapLoaded, style]);

    // Update follow user
    useEffect(() => {
      mapLoaded && sendFollowUser();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mapLoaded]);

    //locationStatus
    useEffect(() => {
      if (!webViewRef.current || !locationStatus || !mapLoaded) return;

      sendMessageToViewer(
        webViewRef.current,
        ViewerMapper.locationStatus(locationStatus)
      );
    }, [locationStatus, mapLoaded]);

    const handleRequestFromViewer = (event: WebViewMessageEvent) => {
      const eventParsed = JSON.parse(event.nativeEvent.data);
      switch (eventParsed.type) {
        case "app.map_is_ready":
          init();
          onLoad && onLoad("");
          setMapLoaded(true);
          break;
        case "directions.requested":
          calculateRoute(eventParsed.payload, _onDirectionsRequestInterceptor);
          break;
        case "navigation.requested":
          startNavigation(eventParsed.payload, _onDirectionsRequestInterceptor);
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
        case "cartography.floor_selected":
          onFloorChanged(eventParsed?.payload);
          break;
        case "cartography.building_selected":
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

    const _onShouldStartLoadWithRequest = (request) => {
      if (
        request &&
        request.url &&
        !request.url.startsWith(configuration.viewerDomain || SITUM_BASE_DOMAIN)
      ) {
        if (
          onExternalLinkClicked &&
          typeof onExternalLinkClicked === "function"
        ) {
          onExternalLinkClicked({ url: request.url });
        } else {
          Linking.openURL(request.url);
        }
        return false;
      }
      return true;
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
        style={StyleSheet.flatten([viewerStyles.webview, style])}
        limitsNavigationsToAppBoundDomains={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        cacheEnabled
        onMessage={handleRequestFromViewer}
        onShouldStartLoadWithRequest={_onShouldStartLoadWithRequest}
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
