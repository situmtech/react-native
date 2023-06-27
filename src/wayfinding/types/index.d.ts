//@ts-ignore
import type { Building } from "react-native-situm-plugin";

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
export interface MapViewProps {
  domain?: string;
  user?: string;
  apikey?: string;
  googleApikey?: string;
  buildingId?: string;
  building?: Building;
  onMapReady?: (event: WayfindingResult) => void;
  onFloorChanged?: (event: OnFloorChangedResult) => void;
  onPoiSelected?: (event: OnPoiSelectedResult) => void;
  onPoiDeselected?: (event: OnPoiDeselectedResult) => void;
  onNavigationRequested?: (event: OnNavigationResult) => void;
  onNavigationStarted?: (event: OnNavigationResult) => void;
  onNavigationError?: (event: OnNavigationResult) => void;
  onError?: (event: MapViewError) => void;
  onNavigationFinished?: (event: OnNavigationResult) => void;
  style?: any;
  iOSMapViewIndex?: string;
  enablePoiClustering?: boolean;
  showPoiNames?: boolean;
  useRemoteConfig?: boolean;
  minZoom?: number;
  maxZoom?: number;
  initialZoom?: number;
  useDashboardTheme?: boolean;
}
