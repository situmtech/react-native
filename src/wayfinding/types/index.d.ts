//@ts-ignore
import { ErrorName } from "../components/MapView";

interface MapViewError {
  name: ErrorName;
  description: string;
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
export interface Point {
  buildingId: string;
  floorId: string;
  latitude: number;
  longitude: number;
}
export interface Error {
  code: number;
  message: string;
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
