import type { DirectionPoint, Poi } from "../../sdk/types";
import { ErrorName } from "./constants";

export interface MapViewError {
  name: ErrorName;
  description: string;
}

export interface MapViewRef {
  selectPoi: (poiId: number) => void;
  navigateToPoi: ({ poi, poiId }: { poi?: Poi; poiId?: number }) => void;
  navigateToPoint: ({
    lat,
    lng,
    floorIdentifier,
    navigationName,
    type,
  }: NavigateToPointType) => void;
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
  point: DirectionPoint;
}

export interface Navigation {
  status: string;
  destination?: Destination;
}

export interface OnNavigationResult {
  navigation: Navigation;
  error?: Error;
}

export type NavigateToPoiType = {
  navigationTo: number;
  type?: string;
};

export type NavigationAccessibilityTypes =
  | "CHOOSE_SHORTEST"
  | "ONLY_NOT_ACCESSIBLE_FLOOR_CHANGES"
  | "ONLY_ACCESSIBLE";

export type NavigateToPointType = {
  lat: number;
  lng: number;
  floorIdentifier: string;
  navigationName?: string;
  type?: NavigationAccessibilityTypes;
};
