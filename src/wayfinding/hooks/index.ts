/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";

import {
  type Building,
  type DirectionPoint,
  type LocationRequestOptions,
  LocationStatus,
  LocationStatusName,
  NavigationStatus,
  NavigationUpdateType,
  type Poi,
  type Position,
  type SDKError,
  type SDKNavigation,
} from "../../index";
import SitumPlugin from "../../sdk";
import requestPermission from "../../utils/requestPermission";
import {
  resetLocation,
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
} from "../store/index";
import { useDispatch, useSelector } from "../store/utils";

const defaultNavigationOptions = {
  distanceToGoalThreshold: 4,
  outsideRouteThreshold: 5,
};

// Hook to define references that point to functions
// used on listeners. These references are updated whenever
// one of the dependencies on the array change
export const useCallbackRef = <T>(fn: T, deps: any[]) => {
  const fnRef = useRef(fn);

  useEffect(() => {
    fnRef.current = fn;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return fnRef;
};

const useSitum = () => {
  const dispatch = useDispatch();
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
    startPositions = true,
    fetchCartography = true,
    useRemoteConfig = true,
  }: {
    email?: string;
    apiKey?: string;
    startPositions?: boolean;
    fetchCartography?: boolean;
    useRemoteConfig?: boolean;
  }) =>
    // TODO fix this async/await
    // eslint-disable-next-line no-async-promise-executor
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
          console.debug("Situm > hook > Successful authentication.");
        } else {
          reject("Situm > hook > Failure while authenticating.");
        }
      });

      useRemoteConfig &&
        SitumPlugin.setUseRemoteConfig(`${useRemoteConfig}`, () => {
          console.debug("Situm > hook > Using remote config");
        });

      startPositions &&
        (await requestPermission()
          .then(() => {
            startPositioning();
          })
          .catch((e: string) => {
            console.error(e);
            reject(e);
          }));

      fetchCartography &&
        (await initializeBuildings().catch((e: string) => {
          console.error(e);
          reject(e);
        }));

      resolve();
    });

  // Cartography
  const initializeBuildings = async () =>
    new Promise<Building[]>((resolve, reject) => {
      console.debug("Retrieving buildings from Situm API");

      SitumPlugin.fetchBuildings(
        (buildingArray: Building[]) => {
          dispatch(setBuildings(buildingArray));
          console.debug("Situm > hook > Successfully retrieved buildings.");
          resolve(buildingArray);
        },
        (_error: string) => {
          console.error(
            `Situm > hook > Could not retrieve buildings: ${_error}`
          );
          reject(`Could not retrieve buildings: ${_error}`);
          dispatch(setError({ message: _error, code: 3011 } as SDKError));
        }
      );
    });

  const initializeBuildingById = async (buildingId: string) => {
    if (!buildings || buildings.length === 0) return;
    const newBuilding = buildings.find(
      (b: Building) => b.buildingIdentifier === buildingId
    );
    if (newBuilding) {
      dispatch(setCurrentBuilding(newBuilding));
      initializeBuildingPois(newBuilding);
    } else {
      console.warn(`Situm > hook > No building found for id ${buildingId}`);
    }
  };

  const initializeBuilding = async (b: Building) => {
    dispatch(setCurrentBuilding(b));
    initializeBuildingPois(b);
  };

  const initializeBuildingPois = (b: Building) => {
    SitumPlugin.fetchBuildingInfo(
      b,
      (buildingInfo: any) => {
        console.debug(
          "Situm > hook > Successfully retrieved pois of the selected building. "
        );

        // Please, do not change the next line. iOS sends data as indoorPois and Android sends it as indoorPOIs
        const buildingPois =
          buildingInfo?.indoorPOIs || buildingInfo?.indoorPois || [];
        dispatch(setPois(buildingPois));
      },
      (err: string) => {
        console.error(
          `Situm > hook > Could not initialize building pois: ${error}`
        );
        dispatch(setError({ message: err, code: 3021 } as SDKError));
      }
    );
  };

  const startPositioning = () => {
    console.debug("Situm > hook > Starting positioning...");

    if (location.status !== LocationStatusName.STOPPED) {
      console.debug("Situm > hook > Positioning has already started");
      return;
    }

    // Declare the locationOptions (empty = default parameters)
    const locationOptions = {
      useDeadReckoning: false,
    } as LocationRequestOptions;
    // Start positioning
    SitumPlugin.startPositioning(
      (newLocation: State["location"]) => {
        dispatch(
          setLocation({
            ...newLocation,
          })
        );
      },
      (status: LocationStatus) => {
        if (status.statusName in LocationStatusName) {
          console.debug(
            `Situm > hook > Positioning state updated ${status.statusName}`
          );
          dispatch(setLocationStatus(status.statusName as LocationStatusName));
        }
      },
      (err: string) => {
        console.error(`Situm > hook > Error while positioning: ${err}}`);
        //@ts-ignore
        dispatch(setError({ message: err, code: 3001 } as SDKError));
      },
      locationOptions
    );
    console.debug(`Successfully started positioning`);
  };

  const stopPositioning = async () => {
    console.debug(`Stopping positioning ...`);
    SitumPlugin.stopPositioning((success: boolean) => {
      if (success) {
        dispatch(resetLocation());
        console.debug("Situm > hook > Successfully stopped positioning");
      } else {
        console.error("Situm > hook > Could not stop positioning");
      }
    });
  };

  // Routes
  const requestDirections = async (
    building: Building,
    from: Position,
    to: Position,
    directionsOptions?: any
  ): Promise<State["directions"]> => {
    console.debug("Requesting directions");
    const fromPoint = {
      floorIdentifier: from.floorIdentifier,
      buildingIdentifier: from.buildingIdentifier,
      coordinate: from.coordinate,
    } as DirectionPoint;
    const toPoint = {
      floorIdentifier: to.floorIdentifier,
      buildingIdentifier: to.buildingIdentifier,
      coordinate: to.coordinate,
    } as DirectionPoint;

    return new Promise((resolve, reject) => {
      SitumPlugin.requestDirections(
        [building, fromPoint, toPoint, directionsOptions],
        (newDirections: State["directions"]) => {
          console.debug("Situm > hook > Successfully computed route");
          resolve(newDirections);
        },
        (err: string) => {
          console.debug(`Situm > hook > Could not compute route: ${err}`);
          dispatch(setError({ message: err, code: 3041 } as SDKError));
          reject(err);
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
        `Situm > hook >Could not compute route for origin: ${originId} or destination: ${destinationId} (lockDirections: ${lockDirections})`
      );
      return;
    }

    const from =
      originId === -1 && location
        ? location.position
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
      .then((newDirections: State["directions"]) => {
        const extendedRoute = {
          ...newDirections,
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
        callback && callback("error");
        return;
      }
      dispatch(
        setNavigation({
          status: NavigationStatus.START,
          ...r,
        })
      );
      callback && callback("success", r);
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
        (err: string) => {
          console.error(`Situm > hook >Could not update navigation: ${err}`);
          callback && callback("error");
          dispatch(setError({ message: err, code: 3051 } as SDKError));
          stopNavigationRef.current();
        },
        { ...defaultNavigationOptions, ...navigationOptions }
      );
    });
  };

  const stopNavigation = (): void => {
    console.debug("Stopping navigation");
    if (!navigation || navigation.status === NavigationStatus.STOP) {
      return;
    }
    SitumPlugin.removeNavigationUpdates((response: any) => {
      if (response && response.success) {
        console.debug("Situm > hook > Successfully removed navigation updates");
      } else {
        console.error("Situm > hook > Could not remove navigation updates");
      }
    });
    dispatch(setNavigation({ status: NavigationStatus.STOP }));
    dispatch(setDestinationPoiID(undefined));
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
        console.debug(info);
      },
      (e: string) => {
        console.error(`Situm > hook > Error on navigation update ${e}`);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  };
};

export default useSitum;
