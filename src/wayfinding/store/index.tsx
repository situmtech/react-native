/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, MutableRefObject, useReducer } from "react";
import {
  Building,
  Location,
  LocationStatus,
  NavigationStatus,
  Poi,
  SDKNavigation,
} from "src/sdk/types";

import { createReducer } from "./utils";

// TODO: add types
export type Directions = any;

export type NavigateToPoiType = {
  navigationTo: number;
  type?: string;
};

interface User {
  email?: string;
  apiKey?: string;
}
export interface SDKError {
  code?: number;
  message: string;
}

export interface State {
  webViewRef: MutableRefObject<undefined>;
  sdkInitialized: boolean;
  user?: User;
  location?: Location;
  buildings: Building[] | null;
  currentBuilding: Building;
  pois: Poi[];
  directions?: Directions;
  navigation?: SDKNavigation;
  destinationPoiID?: number;
  error?: SDKError;
}

export const initialState: State = {
  webViewRef: undefined,
  sdkInitialized: false,
  user: undefined,
  location: { status: LocationStatus.STOPPED },
  buildings: null,
  currentBuilding: undefined,
  pois: [],
  directions: undefined,
  navigation: { status: NavigationStatus.STOP },
  destinationPoiID: undefined,
  error: undefined,
};

export const SitumContext = createContext<
  { state: State; dispatch: React.Dispatch<(s: State) => State> } | undefined
>(undefined);

const Reducer = createReducer<State>({
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
  setLocationStatus: (state: State, payload: LocationStatus) => {
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
  return state.location.status;
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
} = Reducer.actions;

const SitumProvider: React.FC<
  React.PropsWithChildren<{
    email?: string;
    apiKey?: string;
  }>
> = ({ email, apiKey, children }) => {
  const [state, dispatch] = useReducer(Reducer.reducer, {
    ...initialState,
    user: { email, apiKey },
  });

  return (
    <SitumContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </SitumContext.Provider>
  );
};

export default SitumProvider;
