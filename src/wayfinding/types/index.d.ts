//@ts-ignore
import { DirectionPoint } from "src/sdk/types";

import { ErrorName } from "../components/MapView";

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
