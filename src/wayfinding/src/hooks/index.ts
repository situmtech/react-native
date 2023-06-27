import { useEffect, useRef, useState } from 'react';
import SitumPlugin, {
  Building,
  BuildingInfo,
  Poi,
  //@ts-ignore
} from 'react-native-situm-plugin';

import {
  NavigateToPoiType,
  NavigationStatus,
  NavigationUpdateType,
  Position,
  PositioningStatus,
  resetLocation,
  SDKError,
  SDKNavigation,
  selectBuildings,
  selectCurrentBuilding,
  selectDestinationPoiID,
  selectDirections,
  selectError,
  selectIsSDKInitialized as selectIsSdkInitialized,
  selectLocation,
  selectLocationStatus,
  selectNavigation,
  selectPois,
  selectUser,
  selectWebViewRef,
  setAuth,
  setBuildings,
  setCurrentBuilding,
  setDestinationPoiID,
  setDirections,
  setError,
  setLocation,
  setLocationStatus,
  setNavigation,
  setPois,
  setSdkInitialized,
  State,
} from '../store/index';
import { useDispatch, useSelector } from '../store/utils';
import requestPermission from '../utils/requestPermission';
import { sendMessageToViewer } from '../utils';
import Mapper from '../utils/mapper';

const defaultNavigationOptions = {
  distanceToGoalThreshold: 4,
  outsideRouteThreshold: 5,
};

export interface LocationStatus {
  statusName: string;
  statusCode: number;
}

// Hook to define references that point to functions
// used on listeners. These references are updated whenever
// one of the dependencies on the array change
const useCallbackRef = <T>(fn: T, deps: any[]) => {
  const fnRef = useRef(fn);

  useEffect(() => {
    fnRef.current = fn;
  }, deps);

  return fnRef;
};

const useSitum = () => {
  const dispatch = useDispatch();
  const webViewRef = useSelector(selectWebViewRef);
  const isSdkInitialized = useSelector(selectIsSdkInitialized);
  const user = useSelector(selectUser);
  const location = useSelector(selectLocation);
  const locationStatus = useSelector(selectLocationStatus);
  const buildings = useSelector(selectBuildings);
  const currentBuilding = useSelector(selectCurrentBuilding);
  const pois = useSelector(selectPois);
  const directions = useSelector(selectDirections);
  const navigation = useSelector(selectNavigation);
  const error = useSelector(selectError);
  const destinationPoiID = useSelector(selectDestinationPoiID);

  const [lockDirections, setLockDirections] = useState<boolean>(false);

  const initSitumSdk = async ({
    email,
    apiKey,
    withPosition,
    fetch,
    useRemoteConfig = true,
  }: {
    email?: string;
    apiKey?: string;
    withPosition?: boolean;
    fetch?: boolean;
    useRemoteConfig?: boolean;
  }) =>
    // TODO fix this async/await
    new Promise<void>(async (resolve, reject) => {
      if (!isSdkInitialized) {
        SitumPlugin.initSitumSDK();
        setSdkInitialized(true);
      }

      if (email && apiKey) {
        dispatch(setAuth({ email, apiKey }));
      } else {
        email = user.email;
        apiKey = user.apiKey;
      }

      SitumPlugin.setApiKey(email, apiKey, (response: any) => {
        if (response && Boolean(response.success) === true) {
          console.info('\u2713 Successful authentication.');
        } else {
          reject('Failure while authenticating.');
        }
      });

      SitumPlugin.setUseRemoteConfig(`${useRemoteConfig}`, () => {
        console.log('Using remote config');
      });

      withPosition &&
        (await requestPermission()
          .then(() => {
            startPositioning();
          })
          .catch((e: string) => {
            console.error(e);
            reject(e);
          }));

      fetch &&
        (await initializeBuildings().catch((e: string) => {
          console.error(e);
          reject(e);
        }));

      resolve();
    });

  // Cartography
  const initializeBuildings = async () =>
    new Promise<Building[]>((resolve, reject) => {
      console.log('Retrieving buildings from Situm Dashboard');
      SitumPlugin.fetchBuildings(
        (buildingArray: Building[]) => {
          dispatch(setBuildings(buildingArray));
          console.info('\u2713 Successfully retrieved buildings.');
          resolve(buildingArray);
        },
        (error: string) => {
          console.error(`Could not retrieve buildings: ${error}`);
          reject(`Could not retrieve buildings: ${error}`);
          dispatch(setError({ message: error, code: 3011 } as SDKError));
        }
      );
    });

  const initializeBuildingById = async (buildingId: string) => {
    if (buildings.length == 0) return;
    const newBuilding = buildings.find(
      (b: Building) => b.buildingIdentifier === buildingId
    );
    if (newBuilding) {
      dispatch(setCurrentBuilding(newBuilding));
      initializeBuildingPois(newBuilding);
    } else {
      console.warn(`No building found for id ${buildingId}`);
    }
  };

  const initializeBuilding = async (b: Building) => {
    dispatch(setCurrentBuilding(b));
    initializeBuildingPois(b);
  };

  const initializeBuildingPois = (b: Building) => {
    SitumPlugin.fetchBuildingInfo(
      b,
      (buildingInfo: BuildingInfo) => {
        console.info(
          '\u2713 Successfully retrieved pois of the selected building. '
        );

        // Please, do not change the next line. iOS sends data as indoorPois and Android sends it as indoorPOIs
        const buildingPois =
          buildingInfo?.indoorPOIs || buildingInfo?.indoorPois || [];
        dispatch(setPois(buildingPois));
      },
      (error: string) => {
        console.error(`Could not initialize building pois: ${error}`);
        dispatch(setError({ message: error, code: 3021 } as SDKError));
      }
    );
  };

  const startPositioning = () => {
    console.debug('Starting positioning ...');

    if (location.status !== PositioningStatus.STOPPED) {
      console.log('Positioning has already started');
      return;
    }

    // Declare the locationOptions (empty = default parameters)
    const locationOptions = { useDeadReckoning: false };
    // Start positioning
    SitumPlugin.startPositioning(
      (newLocation: State['location']) => {
        dispatch(
          setLocation({
            ...newLocation,
          })
        );
      },
      (status: LocationStatus) => {
        if (status.statusName in PositioningStatus) {
          console.debug(`Positioning state updated ${status.statusName}`);
          dispatch(setLocationStatus(status.statusName as PositioningStatus));
        }
      },
      (error: string) => {
        console.error(`Error while positioning: ${error}}`);
        //@ts-ignore
        dispatch(setError({ message: error, code: 3001 } as SDKError));
      },
      locationOptions
    );
    console.info(`Successfully started positioning`);
  };

  const stopPositioning = async () => {
    console.debug(`Stopping positioning ...`);
    SitumPlugin.stopPositioning((success: boolean) => {
      if (success) {
        dispatch(resetLocation());
        console.info('Successfully stopped positioning');
      } else {
        console.error('Could not stop positioning');
      }
    });
  };

  // Routes
  const requestDirections = async (
    building: Building,
    from: Position,
    to: Position,
    directionsOptions?: any
  ): Promise<State['directions']> => {
    console.debug('Requesting directions');
    const points = [
      {
        floorIdentifier: from.floorIdentifier,
        buildingIdentifier: from.buildingIdentifier,
        coordinate: from.coordinate,
      },
      {
        floorIdentifier: to.floorIdentifier,
        buildingIdentifier: to.buildingIdentifier,
        coordinate: to.coordinate,
      },
    ];

    return new Promise((resolve, reject) => {
      SitumPlugin.requestDirections(
        [building, ...points, { ...directionsOptions }],
        (newDirections: State['directions']) => {
          console.info('\u2713 Successfully computed route');
          resolve(newDirections);
        },
        (error: string) => {
          console.error(`Could not compute route: ${error}`);
          dispatch(setError({ message: error, code: 3041 } as SDKError));
          reject(error);
        }
      );
    });
  };

  const calculateRoute = async ({
    originId,
    destinationId,
    directionsOptions,
    updateRoute = true,
  }: {
    originId: number;
    destinationId: number;
    directionsOptions?: any;
    updateRoute?: boolean;
  }) => {
    const poiOrigin = pois.find(
      (p: Poi) => p.identifier === originId?.toString()
    );
    const poiDestination = pois.find(
      (p: Poi) => p.identifier === destinationId?.toString()
    );

    if (!poiDestination || (!poiOrigin && originId !== -1) || lockDirections) {
      console.debug(
        `Could not compute route for origin: ${originId} or destination: ${destinationId} (lockDirections: ${lockDirections})`
      );
      return;
    }

    const from =
      originId === -1 && location
        ? location.position!
        : {
            buildingIdentifier: poiOrigin.buildingIdentifier,
            floorIdentifier: poiOrigin.floorIdentifier,
            cartesianCoordinate: poiOrigin.cartesianCoordinate,
            coordinate: poiOrigin.coordinate,
          };

    const to = {
      buildingIdentifier: poiDestination.buildingIdentifier,
      floorIdentifier: poiDestination.floorIdentifier,
      cartesianCoordinate: poiDestination.cartesianCoordinate,
      coordinate: poiDestination.coordinate,
    };

    // iOS workaround -> does not allow for several direction petitions
    setLockDirections(true);
    return requestDirections(currentBuilding, from, to, directionsOptions)
      .then((directions: State['directions']) => {
        const extendedRoute = {
          ...directions,
          originId,
          destinationId,
          type: directionsOptions?.accessibilityMode,
        };
        updateRoute && dispatch(setDirections(extendedRoute));
        return directions;
      })
      .catch((e: string) => {
        dispatch(setDirections({ error: JSON.stringify(e) }));
      })
      .finally(() => setLockDirections(false));
  };

  // Navigation
  // TODO: this function is async and we use a callback, why not use a promise?
  const startNavigation = async ({
    callback,
    destinationId,
    directionsOptions,
    navigationOptions,
    originId,
  }: {
    callback?: (status: string, navigation?: SDKNavigation) => void;
    destinationId: number;
    directionsOptions?: any;
    navigationOptions?: any;
    originId: number;
    updateRoute?: boolean;
  }) => {
    calculateRoute({
      originId,
      destinationId,
      directionsOptions,
      updateRoute: false,
    }).then((r) => {
      if (originId !== -1 || !location || !r) {
        callback && callback('error');
        return;
      }
      dispatch(
        setNavigation({
          status: NavigationStatus.START,
          ...r,
        })
      );
      callback && callback('success', r);
      SitumPlugin.requestNavigationUpdates(
        (update: SDKNavigation) => {
          const newNavType =
            (update.type &&
              update.type in NavigationUpdateType &&
              NavigationUpdateType[
                update.type as unknown as keyof typeof NavigationUpdateType
              ]) ||
            NavigationUpdateType.progress;
          dispatch(
            setNavigation({
              currentIndication: update?.currentIndication,
              routeStep: update?.routeStep,
              distanceToGoal: update?.distanceToGoal,
              points: update?.points,
              type: newNavType,
              segments: update?.segments,
              status: NavigationStatus.UPDATE,
            })
          );
        },
        (error: string) => {
          console.error(`Could not update navigation: ${error}`);
          callback && callback('error');
          dispatch(setError({ message: error, code: 3051 } as SDKError));
          stopNavigationRef.current();
        },
        { ...defaultNavigationOptions, ...navigationOptions }
      );
    });
  };

  const navigateToPoi = async ({
    poi,
    poiId,
  }: {
    poi?: Poi;
    poiId?: number;
  }) => {
    if (!poi && !poiId) return;
    const validPoi = pois?.find(
      (p) =>
        p?.identifier === poiId?.toString() ||
        p?.identifier === poi?.id?.toString()
    );
    if (!validPoi) {
      console.error('invalid value as poi or poiId');
      return;
    }
    sendMessageToViewer(
      webViewRef.current,
      Mapper.navigateToPoi({
        navigationTo: poi?.id || poiId,
      } as NavigateToPoiType)
    );
  };

  const stopNavigation = (): void => {
    console.debug('Stopping navigation');
    if (!navigation || navigation.status === NavigationStatus.STOP) {
      return;
    }
    SitumPlugin.removeNavigationUpdates((response: any) => {
      if (response && response.success) {
        console.debug('\u2713 Successfully removed navigation updates');
      } else {
        console.error('Could not remove navigation updates');
      }
    });
    dispatch(setNavigation({ status: NavigationStatus.STOP }));
    dispatch(setDestinationPoiID(undefined));
  };

  const cancelNavigation = (): void => {
    stopNavigation();
    sendMessageToViewer(webViewRef.current, Mapper.cancelNavigation());
  };

  const selectPoi = (poiId: number): void => {
    const poi = pois?.find((p) => p?.identifier === poiId?.toString());
    if (!poi) {
      console.error('invalid value as poiId');
      return;
    }
    if (navigation.status !== NavigationStatus.STOP) {
      console.error('navigation on course, poi selection is unavailable');
      return;
    }
    sendMessageToViewer(webViewRef.current, Mapper.selectPoi(poiId));
  };

  const stopNavigationRef = useCallbackRef(stopNavigation, [navigation]);

  useEffect(() => {
    if (
      !navigation ||
      navigation.status === NavigationStatus.STOP ||
      !location
    ) {
      return;
    }
    SitumPlugin.updateNavigationWithLocation(
      location,
      (info: any) => {
        console.info(info);
      },
      (e: string) => {
        console.error(`Error on navigation update ${e}`);
      }
    );
  }, [location]);

  return {
    // States
    user,
    location,
    locationStatus,
    currentBuilding,
    buildings,
    pois,
    directions,
    navigation,
    error,
    destinationPoiID,

    // Functions
    initSitumSdk,
    initializeBuildings,
    initializeBuilding,
    initializeBuildingById,
    startPositioning,
    stopPositioning,
    calculateRoute,
    startNavigation,
    stopNavigation,
    cancelNavigation,
    selectPoi,
    navigateToPoi,
  };
};

export default useSitum;
