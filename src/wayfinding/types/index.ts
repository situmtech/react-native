import { AccessibilityMode } from "src/sdk";

import type { DirectionsRequest, Point } from "../../sdk/types";
import { ErrorName } from "./constants";

export interface MapViewError {
  name: ErrorName;
  description: string;
}

export interface MapViewRef {
  selectPoi: (poiId: number) => void;
  selectPoiCategory: (categoryId: number) => void;
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
  setOnDirectionsRequestInterceptor: ({onDirectionsRequestInterceptor}: {onDirectionsRequestInterceptor: OnDirectionsRequestInterceptor}) => void;
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
