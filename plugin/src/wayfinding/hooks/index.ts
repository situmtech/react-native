/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from "react";

import SitumPlugin from "../../sdk";
import {
  type Error,
  InternalCall,
  type Location,
} from "../../sdk/types";
import {
  InternalCallType,
  LocationStatusName,
} from "../../sdk/types/constants";
import {
  resetLocation,
  selectError,
  selectLocation,
  selectLocationStatus,
  setError,
  setLocation,
  setLocationStatus,
  UseSitumContext,
} from "../store/index";
import { useDispatch, useSelector } from "../store/utils";

export const useSitumInternal = () => {
  const dispatch = useDispatch();

  const location = useSelector(selectLocation);
  const locationStatus = useSelector(selectLocationStatus);

  const error = useSelector(selectError);

  const init = () => {
    console.debug("Situm > hook > Initializing -> Registering callbacks");
    registerCallbacks();
  };

  function registerCallbacks() {
    SitumPlugin.internalSetMethodCallMapDelegate(
      (internalCall: InternalCall) => {
        switch (internalCall.type) {
          case InternalCallType.LOCATION:
            const receivedLocation = internalCall.get<Location>();
            dispatch(
              setLocation({
                ...receivedLocation,
              }),
            );
            break;
          case InternalCallType.LOCATION_STATUS:
            const statusName = internalCall.get<string>();
            if (statusName in LocationStatusName) {
              dispatch(setLocationStatus(statusName));
            }
            break;
          case InternalCallType.LOCATION_STOPPED:
            // TODO: LOCATION_STOPPED exists only in RN, delete!
            dispatch(resetLocation());
            break;
          case InternalCallType.LOCATION_ERROR:
            const receivedError = internalCall.get<Error>();
            dispatch(setError(receivedError));
            break;
          case InternalCallType.NAVIGATION_ERROR:
          case InternalCallType.GEOFENCES_ENTER:
          case InternalCallType.GEOFENCES_EXIT:
            // Do nothing.
            break;
        }
      },
    );
  }

  return {
    // States
    location,
    locationStatus,

    error,

    // Functions
    init,
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
