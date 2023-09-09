/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useRef, useState } from "react";

import SitumPlugin from "../../sdk";
import {
  type Building,
  type DirectionPoint,
  type Directions,
  type Error,
  type Location,
  type LocationRequest,
  type LocationStatus,
  type NavigationProgress,
  type Poi,
  type Position,
} from "../../sdk/types";
import {
  LocationStatusName,
  NavigationStatus,
  NavigationUpdateType,
} from "../../sdk/types/constants";
import { requestPermission } from "../../utils/requestPermission";
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
  UseSitumContext,
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

export const useSitumInternal = () => {
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
        SitumPlugin.init();
        setSdkInitialized(true);
      }

      if (email && apiKey) {
        dispatch(setAuth({ email, apiKey }));
      } else {
        email = user.email;
        apiKey = user.apiKey;
      }

      try {
        SitumPlugin.setApiKey(apiKey);
        useRemoteConfig && SitumPlugin.setUseRemoteConfig(useRemoteConfig);
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
      } catch (err: any) {
        console.log("Situm > hook > error: ", err);
      }
    });

  // Cartography
  const initializeBuildings = async (): Promise<Building[]> => {
    console.debug("Situm > hook > Retrieving buildings from Situm API");

    try {
      const buildingArray: Building[] = await SitumPlugin.fetchBuildings();

      dispatch(setBuildings(buildingArray));
      console.debug("Situm > hook > Successfully retrieved buildings.");
      return buildingArray;
    } catch (err) {
      console.error(`Situm > hook > Could not retrieve buildings: ${err}`);
      dispatch(setError({ message: error, code: 3011 } as Error));
      throw new Error(`Situm > hook> Could not retrieve buildings: ${err}`);
    }
  };

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

  const initializeBuildingPois = async (b: Building) => {
    try {
      const buildingInfo: any = await SitumPlugin.fetchBuildingInfo(b);

      console.debug(
        "Situm > hook > Successfully retrieved pois of the selected building."
      );

      // Please, do not change the next line. iOS sends data as indoorPois and Android sends it as indoorPOIs
      const buildingPois =
        buildingInfo?.indoorPOIs || buildingInfo?.indoorPois || [];
      dispatch(setPois(buildingPois));
    } catch (err) {
      console.error(
        `Situm > hook > Could not initialize building pois: ${err}`
      );
      dispatch(setError({ message: err, code: 3021 } as Error));
    }
  };

  const startPositioning = () => {
    console.debug("Situm > hook > Starting positioning...");

    if (SitumPlugin.positioningIsRunning()) return;

    // Declare the locationOptions (empty = default parameters)
    const locationOptions = {
      useDeadReckoning: false,
    } as LocationRequest;
    // Start positioning
    registerCallbacks();

    SitumPlugin.requestLocationUpdates(locationOptions);
    console.debug(`Situm > hook > Successfully started positioning`);
  };

  function registerCallbacks() {
    SitumPlugin.onLocationUpdate((loc: Location) => {
      dispatch(
        setLocation({
          ...loc,
        })
      );
    });

    SitumPlugin.onLocationStatus((status: LocationStatus) => {
      if (status.statusName in LocationStatusName) {
        console.debug(
          `Situm > hook > Positioning state updated ${status.statusName}`
        );
        dispatch(setLocationStatus(status.statusName as LocationStatusName));
      }
    });

    SitumPlugin.onLocationError((err: Error) => {
      console.error(`Situm > hook > Error while positioning: ${err}}`);
      //@ts-ignore
      dispatch(setError({ message: err, code: 3001 } as SDKError));
    });

    SitumPlugin.onLocationStopped(() => {
      console.log("Situm > hook > Stopped positioning");
      dispatch(resetLocation());
    });
    SitumPlugin.onNavigationProgress((progress: NavigationProgress) => {
      console.log("Situm > hook > NavigationProgress");

      dispatch(
        setNavigation({
          currentIndication: progress?.currentIndication,
          routeStep: progress?.routeStep,
          distanceToGoal: progress?.distanceToGoal,
          points: progress?.points,
          type: NavigationUpdateType.PROGRESS,
          segments: progress?.segments,
          status: NavigationStatus.UPDATE,
        })
      );
    });

    SitumPlugin.onNavigationOutOfRoute(() => {
      dispatch(
        setNavigation({
          ...navigation, //TODO: Is this needed?
          type: NavigationUpdateType.OUT_OF_ROUTE,
          status: NavigationStatus.UPDATE,
        })
      );

      console.log("Situm > hook > NavigationOutOfRoute");
    });

    SitumPlugin.onNavigationFinished(() => {
      dispatch(
        setNavigation({
          ...navigation, //TODO: Is this needed?
          type: NavigationUpdateType.FINISHED,
          status: NavigationStatus.UPDATE,
        })
      );
      console.log("Situm > hook > NavigationFinished");
    });

    SitumPlugin.onNavigationError((progress: NavigationProgress) => {
      console.log("Situm > hook > NavigationProgress: ", progress);
    });
  }

  const stopPositioning = async () => {
    console.debug(`Situm > hook > Stopping positioning…`);

    try {
      await SitumPlugin.removeLocationUpdates();
      dispatch(resetLocation());
      console.debug("Situm > hook > Successfully stopped positioning");
    } catch (err) {
      console.error(`Situm > hook > Error while stopping positioning: ${err}`);
    }
  };

  // Routes
  const requestDirections = async (
    building: Building,
    from: Position,
    to: Position,
    directionsOptions?: any
  ): Promise<Directions> => {
    console.debug("Situm > hook > Requesting directions");

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

    try {
      const newDirections: Directions = await SitumPlugin.requestDirections(
        building,
        fromPoint,
        toPoint,
        directionsOptions
      );
      console.debug("Situm > hook > Successfully computed route");
      return newDirections;
    } catch (err) {
      console.debug(`Situm > hook > Could not compute route: ${err}`);
      dispatch(setError({ message: err, code: 3041 } as Error));
      throw err;
    }
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
        `Situm > hook > Could not compute route for origin: ${originId} or destination: ${destinationId} (lockDirections: ${lockDirections})`
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
      .then((newDirections: Directions) => {
        const extendedRoute = {
          ...newDirections,
          originId,
          destinationId,
          type: directionsOptions?.accessibilityMode,
        };
        updateRoute && dispatch(setDirections(extendedRoute));
        return directions;
      })
      .catch((err: string) => {
        dispatch(setDirections({ error: JSON.stringify(err) }));
      })
      .finally(() => setLockDirections(false));
  };

  // Navigation
  // TODO: this function is async and we use a callback, why not use a promise?
  // Navigation
  const startNavigation = async ({
    callback,
    destinationId,
    directionsOptions,
    navigationOptions,
    originId,
    updateRoute,
  }: {
    callback?: (status: string, navigation?: NavigationProgress) => void;
    destinationId: number;
    directionsOptions?: any;
    navigationOptions?: any;
    originId: number;
    updateRoute?: boolean;
  }) => {
    callback;
    destinationId;
    directionsOptions;
    navigationOptions;
    originId;
    updateRoute;
    console.debug("Situm > hook > requesting to start navigation");

    if (SitumPlugin.navigationIsRunning()) await stopNavigation();

    const r = await calculateRoute({
      originId,
      destinationId,
      directionsOptions,
      updateRoute: false,
    });
    if (originId !== -1 || !location || !r) {
      callback && callback("error");
      return;
    }

    dispatch(
      setNavigation({
        status: NavigationStatus.START,
        type: NavigationUpdateType.PROGRESS,
        ...r,
      })
    );
    callback && callback("success", r);
    try {
      SitumPlugin.requestNavigationUpdates({
        ...defaultNavigationOptions,
        ...navigationOptions,
      });
    } catch (err: any) {
      console.error(`Situm > hook >Could not update navigation`);
      callback && callback("error");
      dispatch(setError({ message: "error", code: 3051 } as Error));
      stopNavigationRef.current();
    }
  };

  const stopNavigation = async (): Promise<void> => {
    console.debug("Situm > hook > Stopping navigation");

    try {
      await SitumPlugin.removeNavigationUpdates();
      console.debug("Situm > hook > Successfully removed navigation updates");
      dispatch(setNavigation({ status: NavigationStatus.STOP }));
      dispatch(setDestinationPoiID(undefined));
    } catch (err: any) {
      console.debug("Situm > hook > Could not remove navigation updates");
    }
  };
  const stopNavigationRef = useCallbackRef(stopNavigation, [navigation]);

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

const useSitum = () => {
  const context = useContext(UseSitumContext);

  if (!context) {
    throw new Error("Situm > hook > No SitumProvider found.");
  }

  return context.useSitum;
};

export default useSitum;
