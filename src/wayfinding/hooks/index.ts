/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useRef, useState } from "react";

import SitumPlugin from "../../sdk";
import {
  type Building,
  type DirectionPoint,
  type Error,
  type Location,
  type LocationStatus,
  type NavigationProgress,
  type Poi,
} from "../../sdk/types";
import {
  LocationStatusName,
  NavigationStatus,
  NavigationUpdateType,
} from "../../sdk/types/constants";
import {
  resetLocation,
  selectDirections,
  selectError,
  selectLocation,
  selectLocationStatus,
  selectNavigation,
  setDestinationPoiID,
  setDirections,
  setError,
  setLocation,
  setLocationStatus,
  setNavigation,
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

  const location = useSelector(selectLocation);
  const locationStatus = useSelector(selectLocationStatus);

  const directions = useSelector(selectDirections);
  const navigation = useSelector(selectNavigation);
  const error = useSelector(selectError);

  const [lockDirections, setLockDirections] = useState<boolean>(false);

  const init = () => {
    console.debug("Situm > hook > Initializing -> Registering callbacks");
    registerCallbacks();
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

  const calculateRoute = async ({
    buildingId,
    originId,
    destinationId,
    directionsOptions,
    updateRoute = true,
  }: {
    buildingId: string;
    originId: number;
    destinationId: number;
    directionsOptions?: any;
    updateRoute?: boolean;
  }) => {
    console.log("Situm > hook > calculating route");
    const _buildings = await SitumPlugin.fetchBuildings();
    const _building = _buildings.find(
      (b: Building) => b.buildingIdentifier === buildingId
    );
    const _pois = await SitumPlugin.fetchIndoorPOIsFromBuilding(_building);
    const poiOrigin = _pois.find(
      (p: Poi) => p.identifier === originId?.toString()
    );
    const poiDestination = _pois.find(
      (p: Poi) => p.identifier === destinationId?.toString()
    );

    if (!poiDestination || (!poiOrigin && originId !== -1) || lockDirections) {
      console.debug(
        `Situm > hook > Could not compute route for origin: ${originId} or destination: ${destinationId} (lockDirections: ${lockDirections})`
      );
      return;
    }

    // iOS workaround -> does not allow for several direction petitions
    setLockDirections(true);
    const shouldBeLocation: boolean = originId === -1 && location;
    const fromPoint = {
      floorIdentifier: shouldBeLocation
        ? location.position.floorIdentifier
        : poiOrigin.floorIdentifier,
      buildingIdentifier: shouldBeLocation
        ? location.position.buildingIdentifier
        : poiOrigin.buildingIdentifier,
      coordinate: shouldBeLocation
        ? location.position.coordinate
        : poiOrigin.coordinate,
    } as DirectionPoint;
    const toPoint = {
      floorIdentifier: poiDestination.floorIdentifier,
      buildingIdentifier: poiDestination.buildingIdentifier,
      coordinate: poiDestination.coordinate,
    } as DirectionPoint;

    return await SitumPlugin.requestDirections(
      _building,
      fromPoint,
      toPoint,
      directionsOptions
    )
      .then((_directions) => {
        updateRoute &&
          dispatch(
            setDirections({
              ..._directions,
              originId,
              destinationId,
              type: directionsOptions?.accessibilityMode,
            })
          );
        return directions;
      })
      .catch((e) => {
        dispatch(setDirections({ error: JSON.stringify(e) }));
      })
      .finally(() => {
        setLockDirections(false);
      });
  };

  // Navigation
  // TODO: this function is async and we use a callback, why not use a promise?
  // Navigation
  const startNavigation = async ({
    buildingId,
    destinationId,
    directionsOptions,
    navigationOptions,
    originId,
    updateRoute,
  }: {
    buildingId: string;
    destinationId: number;
    directionsOptions?: any;
    navigationOptions?: any;
    originId: number;
    updateRoute?: boolean;
  }) => {
    destinationId;
    directionsOptions;
    navigationOptions;
    originId;
    updateRoute;
    console.debug("Situm > hook > requesting to start navigation");

    if (SitumPlugin.navigationIsRunning()) await stopNavigation();

    await calculateRoute({
      buildingId,
      originId,
      destinationId,
      directionsOptions,
      updateRoute: false,
    }).then((r) => {
      if (originId !== -1 || !location || !r) {
        return;
      }

      dispatch(
        setNavigation({
          status: NavigationStatus.START,
          type: NavigationUpdateType.PROGRESS,
          ...r,
        })
      );
    });

    SitumPlugin.requestNavigationUpdates({
      ...defaultNavigationOptions,
      ...navigationOptions,
    }).catch((e) => {
      console.error(`Situm > hook >Could not update navigation ${e}`);
      dispatch(setError({ message: "error", code: 3051 } as Error));
      stopNavigation();
    });
  };

  const stopNavigation = async (): Promise<void> => {
    console.debug("Situm > hook > Stopping navigation");

    SitumPlugin.removeNavigationUpdates()
      .then(() => {
        console.debug("Situm > hook > Successfully removed navigation updates");
        dispatch(setNavigation({ status: NavigationStatus.STOP }));
        dispatch(setDestinationPoiID(undefined));
      })
      .catch((e) => {
        console.debug(
          `Situm > hook > Could not remove navigation updates ${e}`
        );
      });
  };

  return {
    // States
    location,
    locationStatus,

    directions,
    navigation,
    error,

    // Functions
    init,
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
