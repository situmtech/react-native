/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useState } from "react";

import SitumPlugin from "../../sdk";
import {
  type Building,
  type Error,
  ErrorCode,
  ErrorType,
  type Location,
  type NavigationProgress,
} from "../../sdk/types";
import {
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
  setNavigation,
  UseSitumContext,
} from "../store/index";
import { useDispatch, useSelector } from "../store/utils";
import type { OnDirectionsRequestInterceptor } from "../types";
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

    // TODO: not working, using local state at MapView.tsx.
    // SitumPlugin.onLocationStatus((status: LocationStatus) => {
    //   if (status.statusName in LocationStatusName) {
    //     console.debug(
    //       `Situm > hook > Positioning state updated ${status.statusName}`
    //     );
    //     dispatch(setLocationStatus(status.statusName as LocationStatusName));
    //   }
    // });

    SitumPlugin.onLocationStopped(() => {
      console.debug("Situm > hook > Stopped positioning");
      dispatch(resetLocation());
    });

    SitumPlugin.onNavigationStart((route) => {
      console.debug(
        `Situm > hook > navigation started to ${route.poiTo?.poiName}`
      );

      dispatch(
        setNavigation({
          type: NavigationUpdateType.PROGRESS,
          status: NavigationStatus.START,
        })
      );
    });

    SitumPlugin.onNavigationProgress((progress: NavigationProgress) => {
      console.debug(
        `Situm > hook > navigation progress, remanining distance to goal ${progress.distanceToGoal.toFixed(
          2
        )} m.`
      );

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
      console.debug("Situm > hook > user went out of route, recalculating ...");

      dispatch(
        setNavigation({
          type: NavigationUpdateType.OUT_OF_ROUTE,
          status: NavigationStatus.UPDATE,
        })
      );
    });

    SitumPlugin.onNavigationDestinationReached((route) => {
      console.debug(
        `Situm > hook > destination ${route.poiTo?.poiName} was reached.`
      );

      dispatch(
        setNavigation({
          type: NavigationUpdateType.DESTINATION_REACHED,
          status: NavigationStatus.UPDATE,
        })
      );
    });

    SitumPlugin.onNavigationCancellation(() => {
      console.debug("Situm > hook > navigation was cancelled by the user.");

      dispatch(
        setNavigation({
          type: NavigationUpdateType.CANCELLED,
          status: NavigationStatus.STOP,
        })
      );
    });

    SitumPlugin.onNavigationError((navigationError: any) => {
      console.error(
        "Situm > hook > ERROR while navigating: ",
        JSON.stringify(navigationError)
      );
    });
  }

  const calculateRoute = async (
    payload: any,
    interceptor?: OnDirectionsRequestInterceptor,
    updateRoute = true
  ) => {
    console.debug("Situm > hook > calculating route");

    const directionsRequest = createDirectionsRequest(
      payload.directionsRequest
    );
    interceptor && interceptor(directionsRequest);
    const {
      to,
      from,
      minimizeFloorChanges,
      accessibilityMode,
      bearingFrom,
      includedTags,
      excludedTags,
    } = directionsRequest;
    const { originIdentifier, destinationIdentifier, buildingIdentifier } =
      createDirectionsMessage(payload);

    const _buildings = await SitumPlugin.fetchBuildings();
    const _building = _buildings.find(
      (b: Building) => b.buildingIdentifier === buildingIdentifier
    );

    if (!to || !from || lockDirections) {
      console.debug(
        `Situm > hook > Could not compute route (to: ${to}, from: ${from}, lockDirections: ${lockDirections})`
      );
      return;
    }

    // iOS workaround -> does not allow for several direction petitions
    setLockDirections(true);
    return await SitumPlugin.requestDirections(_building, from, to, {
      minimizeFloorChanges,
      accessibilityMode,
      bearingFrom,
      includedTags,
      excludedTags,
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
        console.error(`Situm > hook > Could not compute route: ${e}`);
        dispatch(setDirections({ error: JSON.stringify(e) }));
      })
      .finally(() => {
        setLockDirections(false);
      });
  };

  // Navigation
  const startNavigation = (
    payload: any,
    interceptor?: OnDirectionsRequestInterceptor
  ) => {
    console.debug("Situm > hook > request to start navigation");
    // TODO: we should delegate this to the sdk plugin
    if (!navigation || navigation?.status !== NavigationStatus.STOP) {
      stopNavigation();
    }

    calculateRoute(payload, interceptor, false)
      .then((r) => {
        if (!r) {
          console.debug(`Situm > hook > No route was computed`);
          return;
        }
        dispatch(
          setNavigation({
            status: NavigationStatus.START,
            type: NavigationUpdateType.PROGRESS,
            ...r,
          })
        );
        try {
          const navigationRequest = createNavigationRequest(
            payload.navigationRequest
          );
          SitumPlugin.requestNavigationUpdates({
            ...defaultNavigationRequest,
            ...navigationRequest,
          });
        } catch (e) {
          console.error(`Situm > hook > Could not update navigation ${e}`);
          //TODO: Remove this and emit these errors in SitumPlugin.onNavigationError
          dispatch(
            setError({
              message: "Could not update navigation",
              code: ErrorCode.UNKNOWN,
              type: ErrorType.NON_CRITICAL,
            } as Error)
          );
          stopNavigation();
        }
      })
      .catch((e) => {
        console.error(
          `Situm > hook > Could not compute route for navigation ${JSON.stringify(
            e
          )}`
        );
      });
  };

  const stopNavigation = () => {
    // TODO: we should delegate this to the sdk plugin
    if (!navigation || navigation?.status === NavigationStatus.STOP) {
      return;
    }
    console.debug("Situm > hook > Stopping navigation");

    SitumPlugin.removeNavigationUpdates()
      .then(() => {
        console.debug("Situm > hook > Successfully removed navigation updates");
        dispatch(setNavigation({ status: NavigationStatus.STOP }));
      })
      .catch((e) => {
        console.warn(
          `Situm > hook > Could not remove navigation updates ${JSON.stringify(
            e
          )}`
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
