/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useState } from "react";

import SitumPlugin from "../../sdk";
import {
  type Building,
  type Error,
  type Location,
  type LocationStatus,
  type NavigationProgress,
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
  setDirections,
  setError,
  setLocation,
  setLocationStatus,
  setNavigation,
  UseSitumContext,
} from "../store/index";
import { useDispatch, useSelector } from "../store/utils";
import {
  createDirectionsMessage,
  createDirectionsRequest,
  createNavigationRequest,
} from "../utils/mapper";

const defaultNavigationRequest = {
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
          type: NavigationUpdateType.OUT_OF_ROUTE,
          status: NavigationStatus.UPDATE,
        })
      );

      console.log("Situm > hook > NavigationOutOfRoute");
    });

    SitumPlugin.onNavigationFinished(() => {
      dispatch(
        setNavigation({
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

  const calculateRoute = async (payload: any, updateRoute = true) => {
    console.log("Situm > hook > calculating route");

    const { to, from, minimizeFloorChanges, accessibilityMode, bearingFrom } =
      createDirectionsRequest(payload.directionsRequest);
    const { originIdentifier, destinationIdentifier, buildingIdentifier } =
      createDirectionsMessage(payload);

    const _buildings = await SitumPlugin.fetchBuildings();
    const _building = _buildings.find(
      (b: Building) => b.buildingIdentifier === buildingIdentifier
    );

    if (!to || !from || lockDirections) {
      console.debug(
        `Situm > hook > Could not compute route (lockDirections: ${lockDirections})`
      );
      return;
    }

    // iOS workaround -> does not allow for several direction petitions
    setLockDirections(true);
    return await SitumPlugin.requestDirections(_building, from, to, {
      minimizeFloorChanges,
      accessibilityMode,
      bearingFrom,
    })
      .then((_directions) => {
        const newRoute = {
          ..._directions,
          originIdentifier,
          destinationIdentifier,
          type: accessibilityMode,
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
  const startNavigation = async (payload: any) => {
    console.debug("Situm > hook > requesting to start navigation");
    if (SitumPlugin.navigationIsRunning()) stopNavigation();

    await calculateRoute(payload, false).then((r) => {
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
      const navigationRequest = createNavigationRequest(
        payload.navigationRequest
      );
      SitumPlugin.requestNavigationUpdates({
        ...defaultNavigationRequest,
        ...navigationRequest,
      });
    } catch (e) {
      console.error(`Situm > hook >Could not update navigation ${e}`);
      dispatch(setError({ message: "error", code: 3051 } as Error));
      stopNavigation();
    }
  };

  const stopNavigation = () => {
    console.debug("Situm > hook > Stopping navigation");

    try {
      SitumPlugin.removeNavigationUpdates();
      console.debug("Situm > hook > Successfully removed navigation updates");
      dispatch(setNavigation({ status: NavigationStatus.STOP }));
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
