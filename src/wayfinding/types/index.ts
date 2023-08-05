import type { DirectionPoint, Poi } from "../../sdk/types";

// Define class that handles errors
export enum ErrorName {
  ERR_INTERNET_DISCONNECTED = "ERR_INTERNET_DISCONNECTED",
  ERR_INTERNAL_SERVER_ERROR = "ERR_INTERNAL_SERVER_ERROR",
}

export interface MapViewError {
  name: ErrorName;
  description: string;
}

export interface MapViewRef {
  selectPoi: (poiId: number) => void;
  navigateToPoi: ({ poi, poiId }: { poi?: Poi; poiId?: number }) => void;
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
