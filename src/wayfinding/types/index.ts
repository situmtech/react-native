import { AccessibilityMode } from "src/sdk";

import type { Point } from "../../sdk/types";
import { ErrorName } from "./constants";

export interface MapViewError {
  name: ErrorName;
  description: string;
}

export interface MapViewRef {
  selectPoi: (poiId: number) => void;
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
}

export interface WayfindingResult {
  status: string;
  message: string;
}

export interface OnPoiSelectedResult {
  buildingId: string;
  buildingName: string;
  floorId: string;
  floorName: string;
  poiId: string;
  poiName: string;
}

export interface OnPoiDeselectedResult {
  buildingId: string;
  buildingName: string;
}

export interface OnFloorChangedResult {
  buildingId: string;
  buildingName: string;
  fromFloorId: string;
  toFloorId: string;
  fromFloorName: string;
  toFloorName: string;
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
  navigation: Navigation;
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
