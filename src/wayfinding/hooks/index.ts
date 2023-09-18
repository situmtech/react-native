/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useState } from "react";

import SitumPlugin from "../../sdk";
import {
  type Building,
  type DirectionsOptions,
  type Error,
  type Location,
  type LocationStatus,
  type NavigationProgress,
  type Poi,
} from "../../sdk/types";
import {
  CURRENT_USER_LOCATION_ID,
  CUSTOM_DESTINATION_LOCATION_ID,
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
import {
  destinationToPoint,
  locationToPoint,
  poiToPoint,
} from "../utils/mapper";

const defaultNavigationOptions = {
  distanceToGoalThreshold: 4,
  outsideRouteThreshold: 5,
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
    directionsOptions?: DirectionsOptions;
    updateRoute?: boolean;
  }) => {
    // TODO: remove all this, use information from payload (to, from, etc)
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

    if (
      (!poiDestination && destinationId !== CUSTOM_DESTINATION_LOCATION_ID) ||
      (!poiOrigin && originId !== CURRENT_USER_LOCATION_ID) ||
      lockDirections
    ) {
      console.debug(
        `Situm > hook > Could not compute route for origin: ${originId} or destination: ${destinationId} (lockDirections: ${lockDirections})`
      );
      return;
    }

    const shouldBeLocation = location && originId === CURRENT_USER_LOCATION_ID;
    const shouldBeCustomDestination =
      location && destinationId === CUSTOM_DESTINATION_LOCATION_ID;

    const fromPoint = shouldBeLocation
      ? locationToPoint(location)
      : poiToPoint(poiOrigin);
    const toPoint = shouldBeCustomDestination
      ? destinationToPoint(directionsOptions.to)
      : poiToPoint(poiDestination);

    // iOS workaround -> does not allow for several direction petitions
    setLockDirections(true);
    return await SitumPlugin.requestDirections(
      _building,
      fromPoint,
      toPoint,
      directionsOptions
    )
      .then((_directions) => {
        const newRoute = {
          ..._directions,
          originId,
          destinationId,
          type: directionsOptions?.accessibilityMode,
        };
        if (updateRoute) {
          dispatch(setDirections(newRoute));
        }
        return newRoute;
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
    directionsOptions?: DirectionsOptions;
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
      if (!r) {
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

    try {
      SitumPlugin.requestNavigationUpdates({
        ...defaultNavigationOptions,
        ...navigationOptions,
      });
    } catch (e) {
      console.error(`Situm > hook >Could not update navigation ${e}`);
      dispatch(setError({ message: "error", code: 3051 } as Error));
      stopNavigation();
    }
  };

  const stopNavigation = async (): Promise<void> => {
    console.debug("Situm > hook > Stopping navigation");

    try {
      SitumPlugin.removeNavigationUpdates();
      console.debug("Situm > hook > Successfully removed navigation updates");
      dispatch(setNavigation({ status: NavigationStatus.STOP }));
      dispatch(setDestinationPoiID(undefined));
    } catch (e) {
      console.debug(`Situm > hook > Could not remove navigation updates ${e}`);
    }
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
