import { AccessibilityMode } from "src/sdk";

import type { DirectionsRequest, Point } from "../../sdk/types";
export type { MapViewConfiguration, MapViewProps } from "../components/MapView";
import { ErrorName } from "./constants";

export interface MapViewError {
  name: ErrorName;
  description: string;
}

export interface MapViewRef {
  /**
   * Sets the list of favoritePois that will appear in the mapView. This method removes any previous pois from the favorite list.
   * @param poiIds Ids of the pois you want to set as favorites. You can obtain the identifiers of your POIs by retrieving them with [SitumPlugin.fetchIndoorPOIsFromBuilding()](https://developers.situm.com/sdk_documentation/react-native/typedoc/classes/default.html#fetchIndoorPOIsFromBuilding).
   */
  setFavoritePois: (poiIds: number[]) => void;
  /**
   * Selects the given POI in the map.
   * @param poiId You can obtain the identifiers of your POIs by retrieving them with [SitumPlugin.fetchIndoorPOIsFromBuilding()](https://developers.situm.com/sdk_documentation/react-native/typedoc/classes/default.html#fetchIndoorPOIsFromBuilding).
   */
  selectPoi: (poiId: number) => void;
  /**
   * Selects the given POI category and displays the list of POIs that belong to the given category.
   * Also, the POIs that do not belong to this category will be hidden in the map.
   * @param categoryId You can obtain the identifiers of your POI categories by retrieving them with [SitumPlugin.fetchPoiCategories()](https://developers.situm.com/sdk_documentation/react-native/typedoc/classes/default.html#fetchPoiCategories).
   */
  selectPoiCategory: (categoryId: number) => void;
  /**
   * Define the {@link MapViewDirectionsOptions} that the routes calculated by the MapView will use.
   * @param directionsOptions {@link MapViewDirectionsOptions}
   */
  setDirectionsOptions: (directionsOptions: MapViewDirectionsOptions) => void;
  /**
   * Starts navigating to the given POI.
   * @param params.identifier You can obtain the identifiers of your POIs by retrieving them with [SitumPlugin.fetchIndoorPOIsFromBuilding()](https://developers.situm.com/sdk_documentation/react-native/typedoc/classes/default.html#fetchIndoorPOIsFromBuilding).
   * @param params.accessibilityMode You can optionally choose the desired [AccessibilityMode](https://developers.situm.com/sdk_documentation/react-native/typedoc/enums/accessibilitymode) used to calculate the route.
   */
  navigateToPoi: (params: {
    identifier: number;
    accessibilityMode?: AccessibilityMode;
  }) => void;
  /**
   * Starts navigating to the given coordinates, at the given floor.
   * @param params.lat The latitude of the destination point.
   * @param params.lng The longitude of the destination point.
   * @param params.floorIdentifier The floorIndetifier of the destination point.
   * @param params.navigationName You can optionally set the name of the destination to be displayed on the MapView.
   * @param params.accessibilityMode You can optionally choose the desired [AccessibilityMode](https://developers.situm.com/sdk_documentation/react-native/typedoc/enums/accessibilitymode) used to calculate the route.
   */
  navigateToPoint: (params: {
    lat: number;
    lng: number;
    floorIdentifier: string;
    navigationName?: string;
    accessibilityMode?: AccessibilityMode;
  }) => void;
  /**
   * Cancels the current navigation, if any.
   */
  cancelNavigation: () => void;
  setOnDirectionsRequestInterceptor: (params: {
    onDirectionsRequestInterceptor: OnDirectionsRequestInterceptor;
  }) => void;

  /**
   * Performs a search with the given SearchFilter.
   *
   * This action will have the same effect as the user searching in the searchbar.
   */
  search: (searchFilter: SearchFilter) => void;
}

export interface WayfindingResult {
  status: string;
  message: string;
}

export interface OnPoiSelectedResult {
  identifier: string;
  buildingIdentifier: string;
}

export interface OnPoiDeselectedResult {
  identifier: string;
  buildingIdentifier: string;
}

export interface OnFloorChangedResult {
  buildingId: string;
  buildingName: string;
  fromFloorId: string;
  toFloorId: string;
  fromFloorName: string;
  toFloorName: string;
}

/**
 * If you want to change the route calculated based on tags you can use this interface.
 * Using this interface you can change all the routes that will be calculated including or excluding tags.
 * Use the method MapViewRef.setDirectionsOptions(MapViewDirectionsOptions) after the MapView ends loading
 * You can call this as many times you want and the mapviewer will use the last options that you set.
 */
export interface MapViewDirectionsOptions {
  includedTags?: string[];
  excludedTags?: string[];
}

/**
 * This interface allows you to modify all the parameters in the DirectionRequest used by the MapViewer to calculate the route.
 * To use this you will need to load the MapView and once it ends loading use the MapViewRef that you obtain an call setOnDirectionsRequestInterceptor(interceptor)
 */
export interface OnDirectionsRequestInterceptor {
  (directionRequest: DirectionsRequest): void;
}

export interface OnExternalLinkClickedResult {
  url: string;
}

/**
 * Result that will be returned when the list of favoritePois is updated
 */
export interface OnFavoritePoisUpdatedResult {
  /**
   * Array containing the list of ids of all the pois that are currently stored as favorites.
   */
  currentPoisIdentifiers: number[];
}

export interface OnSpeakAloudTextResult {
  /**
   * Text that must be speak aloud.
   */
  text: string;
}

export interface Destination {
  category: string;
  identifier?: string;
  name?: string;
  point: Point;
}

export interface Navigation {
  status: string;
  destination?: Destination;
}

export interface OnNavigationResult {
  navigation?: Navigation;
  error?: Error;
}

export type NavigateToPoiPayload = {
  identifier: number;
  accessibilityMode?: AccessibilityMode;
};

export type NavigateToPointPayload = {
  lat: number;
  lng: number;
  floorIdentifier: string;
  navigationName?: string;
  accessibilityMode?: AccessibilityMode;
};

export type DirectionsMessage = {
  buildingIdentifier: string;
  originIdentifier: string;
  originCategory: string;
  destinationIdentifier: string;
  destinationCategory: string;
  identifier: string;
};

export interface SearchFilter {
  /**
   * Text used in the searchbar to filter and display the search results whose name or description matches the filter.
   *
   * An empty string will clear the current text filter (if any). A null value will apply no change.
   */
  text?: string | null;
  /**
   * A [PoiCategory](https://developers.situm.com/sdk_documentation/react-native/typedoc/types/poicategory) identifier used to filter and display the POIs that belong to the given category.
   *
   * An empty string will clear the current category filter (if any). A null value will apply no change.
   */
  poiCategoryIdentifier?: string | null;
}
