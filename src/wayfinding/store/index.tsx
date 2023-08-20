/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, type MutableRefObject, useReducer } from "react";

import {
  type Building,
  type Directions,
  type Location,
  type Poi,
  type Error,
  type NavigationProgress,
} from "../../sdk/types";
import { LocationStatusName } from "../../sdk/types/constants";
import { useSitumInternal } from "../hooks";
import { createStore } from "./utils";

interface User {
  email?: string;
  apiKey?: string;
}

// interface SDKNavigation {
//   //closestPositionInRoute: any;
//   currentIndication?: any;
//   //currentStepIndex:number;
//   //distanceToEndStep: number;
//   distanceToGoal?: number;
//   //nextIndication: any;
//   points?: any;
//   routeStep?: any;
//   segments?: any;
//   route?: Directions;
//   //timeToEndStep: number;
//   //timeToGoal: number;
//   type?: NavigationUpdateType;
//   status: NavigationStatus;
// }

export interface State {
  webViewRef: MutableRefObject<undefined>;
  sdkInitialized: boolean;
  user?: User;
  location?: Location;
  buildings: Building[] | null;
  currentBuilding: Building;
  pois: Poi[];
  directions?: Directions;
  navigation?: NavigationProgress;
  destinationPoiID?: number;
  error?: Error;
}

export const initialState: State = {
  webViewRef: undefined,
  sdkInitialized: false,
  user: undefined,
  location: { status: LocationStatusName.STOPPED },
  buildings: null,
  currentBuilding: undefined,
  pois: [],
  directions: undefined,
  navigation: undefined,
  destinationPoiID: undefined,
  error: undefined,
};

export const SitumContext = createContext<
  { state: State; dispatch: React.Dispatch<(s: State) => State> } | undefined
>(undefined);

const store = createStore<State>({
  initialState,
  reducers: {
    setWebViewRef: (state: State, payload: State["webViewRef"]) => {
      return { ...state, webViewRef: payload };
    },
    setSdkInitialized: (state: State, payload: State["sdkInitialized"]) => {
      return { ...state, sdkInitialized: payload };
    },
    setAuth: (state: State, payload: State["user"]) => {
      return { ...state, user: payload };
    },
    setLocation: (state: State, payload: State["location"]) => {
      return { ...state, location: payload };
    },
    setLocationStatus: (state: State, payload: LocationStatusName) => {
      return { ...state, location: { ...state.location, status: payload } };
    },
    resetLocation: (state: State) => {
      return {
        ...state,
        location: initialState.location,
      };
    },
    setBuildings: (state: State, payload: State["buildings"]) => {
      return { ...state, buildings: payload };
    },
    setCurrentBuilding: (state: State, payload: State["currentBuilding"]) => {
      return { ...state, currentBuilding: payload };
    },
    setPois: (state: State, payload: State["pois"]) => {
      return { ...state, pois: payload };
    },
    setDirections: (state: State, payload: State["directions"]) => {
      return { ...state, directions: payload };
    },
    setNavigation: (state: State, payload: State["navigation"]) => {
      return { ...state, navigation: payload };
    },
    setDestinationPoiID: (state: State, payload: State["destinationPoiID"]) => {
      return { ...state, destinationPoiID: payload };
    },
    setError: (state: State, payload: State["error"]) => {
      return { ...state, error: payload };
    },
  },
});

export const selectWebViewRef = (state: State) => {
  return state.webViewRef;
};

export const selectIsSDKInitialized = (state: State) => {
  return state.sdkInitialized;
};

export const selectUser = (state: State) => {
  return state.user;
};

export const selectLocation = (state: State) => {
  return state.location;
};

export const selectLocationStatus = (state: State) => {
  return state.location?.status;
};

export const selectBuildings = (state: State) => {
  return state.buildings;
};

export const selectCurrentBuilding = (state: State) => {
  return state.currentBuilding;
};

export const selectPois = (state: State) => {
  return state.pois;
};

export const selectDirections = (state: State) => {
  return state.directions;
};

export const selectNavigation = (state: State) => {
  return state.navigation;
};

export const selectDestinationPoiID = (state: State) => {
  return state.destinationPoiID;
};

export const selectError = (state: State) => {
  return state.error;
};

export const {
  setWebViewRef,
  setSdkInitialized,
  setAuth,
  setLocation,
  setLocationStatus,
  resetLocation,
  setBuildings,
  setCurrentBuilding,
  setPois,
  setDirections,
  setNavigation,
  setDestinationPoiID,
  setError,
} = store.actions;

/**
 * Context specifically to store the only instance of our hook.
 */
export const UseSitumContext = createContext<{ useSitum: any } | undefined>(
  undefined
);

const UseSitumProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // TODO: if we have this, there is no need to have a context for the rest of the state
  // as there is only one instance of the hook
  const useSitum = useSitumInternal();

  return (
    <UseSitumContext.Provider value={{ useSitum }}>
      {children}
    </UseSitumContext.Provider>
  );
};

/**
 * Main context of the application, stores the plugins' state.
 */
const SitumProvider: React.FC<
  React.PropsWithChildren<{
    email?: string;
    apiKey?: string;
  }>
> = ({ email, apiKey, children }) => {
  const [state, dispatch] = useReducer(store.reducer, {
    ...store.initialState,
    user: { email, apiKey },
  });

  return (
    <SitumContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      <UseSitumProvider>{children}</UseSitumProvider>
    </SitumContext.Provider>
  );
};

export default SitumProvider;
