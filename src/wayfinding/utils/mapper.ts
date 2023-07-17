/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Location,
  NavigateToPoiType,
  SDKNavigation,
} from "../../sdk/types/index.d";
import { Destination, Navigation, Point } from "..";
import { Directions } from "../store/index";

const mapperWrapper = (type: string, payload: unknown) =>
  JSON.stringify({ type, payload });

const Mapper = {
  location: (location: Location) =>
    mapperWrapper("location.update", {
      ...(location.position && {
        latitude: location.position.coordinate.latitude,
        longitude: location.position.coordinate.longitude,
        x: location.position.cartesianCoordinate.x,
        y: location.position.cartesianCoordinate.y,
        buildingId: location.position.buildingIdentifier,
        floorId: location.position.floorIdentifier,
        bearing: location.bearing?.degreesClockwise,
        isIndoor: location.position.isIndoor,
        isOutdoor: location.position.isOutdoor,
        accuracy: location.accuracy,
        hasBearing: location.hasBearing,
      }),
      status: location.status,
    }),
  locationStatus: (locationStatus: Location["status"]) =>
    mapperWrapper("location_status.update", locationStatus),

  route: (directions: Directions) =>
    mapperWrapper("directions.update", directions),

  navigation: (navigation: Navigation) =>
    mapperWrapper(`navigation.${navigation.status}`, navigation),

  navigateToPoi: (navigate: NavigateToPoiType) =>
    mapperWrapper(`navigation.start`, { navigationTo: navigate?.navigationTo }),

  cancelNavigation: () => mapperWrapper(`navigation.cancel`, {}),

  selectPoi: (poiId: number) =>
    mapperWrapper(`cartography.select_poi`, { identifier: poiId }),

  followUser: (follow: boolean) => mapperWrapper("camera.follow_user", follow),

  initialConfiguration: (
    style: any,
    enablePoiClustering: any,
    showPoiNames: any,
    minZoom: any,
    maxZoom: any,
    initialZoom: any,
    useDashboardTheme: any
  ) =>
    mapperWrapper("ui.initial_configuration", {
      ...(style && {
        style: style,
      }),
      ...(enablePoiClustering && {
        enablePoiClustering: enablePoiClustering,
      }),
      ...(showPoiNames && {
        showPoiNames: showPoiNames,
      }),
      ...(minZoom && {
        minZoom: minZoom,
      }),
      ...(maxZoom && {
        maxZoom: maxZoom,
      }),
      ...(initialZoom && {
        initialZoom: initialZoom,
      }),
      ...(useDashboardTheme && {
        useDashboardTheme: useDashboardTheme,
      }),
    }),

  routeToResult: (navigation: any): Navigation => {
    //console.log('navigation/route to be mapped:', navigation);
    return {
      status: navigation.status,
      destination: {
        category: navigation?.destinationId ? "POI" : "COORDINATE",
        identifier: navigation?.destinationId,
        //name:, //TODO
        point: {
          buildingId:
            navigation.to.buildingIdentifier ||
            navigation.TO.buildingIdentifier,
          floorId:
            navigation.to.floorIdentifier || navigation.TO.floorIdentifier,
          latitude:
            navigation.to.coordinate.latitude ||
            navigation.TO.coordinate.latitude,
          longitude:
            navigation.to.coordinate.longitude ||
            navigation.TO.coordinate.longitude,
        } as Point,
      } as Destination,
    } as Navigation;
  },

  navigationToResult: (navigation: SDKNavigation): Navigation => {
    return {
      status: navigation?.type,
    };
    // return {
    //   status: navigation.status,
    //   destination: {
    //     category: navigation.routeStep.TO.destinationId ? 'POI' : 'COORDINATE',
    //     identifier: navigation.routeStep.TO.destinationId,
    //     //name:, //TODO
    //     point: {
    //       buildingId: navigation.routeStep.TO.buildingIdentifier,
    //       floorId: navigation.routeStep.TO.floorIdentifier,
    //       latitude: navigation.routeStep.TO.coordinate.latitude,
    //       longitude: navigation.routeStep.TO.coordinate.longitude,
    //     } as Point,
    //   } as Destination,
    // } as Navigation;
  },
};

export default Mapper;
