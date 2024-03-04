import { AccessibilityMode } from "../../sdk/types/constants";

import type { DirectionsRequest, Point } from "../../sdk/types";
import { ErrorName } from "./constants";

export interface MapViewError {
  name: ErrorName;
  description: string;
}

export interface MapViewRef {
  selectPoi: (poiId: number) => void;
  selectPoiCategory: (categoryId: number) => void;
  setDirectionsOptions: (directionsOptions: MapViewDirectionsOptions) => void;
  navigateToPoi: ({
    identifier,
    accessibilityMode = AccessibilityMode.CHOOSE_SHORTEST,
  }: {
    identifier: number;
    accessibilityMode?: AccessibilityMode;
  }) => void;
  navigateToPoint: ({
    lat,
    lng,
    floorIdentifier,
    navigationName,
    accessibilityMode = AccessibilityMode.CHOOSE_SHORTEST,
  }: {
    lat: number;
    lng: number;
    floorIdentifier: string;
    navigationName?: string;
    accessibilityMode?: AccessibilityMode;
  }) => void;
  cancelNavigation: () => void;
  setOnDirectionsRequestInterceptor: ({
    onDirectionsRequestInterceptor,
  }: {
    onDirectionsRequestInterceptor: OnDirectionsRequestInterceptor;
  }) => void;
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
