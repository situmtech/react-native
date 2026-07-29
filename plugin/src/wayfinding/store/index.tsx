/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  createContext,
  type MutableRefObject,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";

import SitumPlugin from "../../sdk";
import {
  type Building,
  type Directions,
  type Error,
  type Location,
  type NavigationProgress,
  type Poi,
} from "../../sdk/types";
import { LocationStatusName } from "../../sdk/types/constants";
import { useSitumInternal } from "../hooks";
import { createStore } from "./utils";
import { SitumAuth } from "../../sdk/authStore";

interface User {
  email?: string;
  apiKey?: string;
  token?: string;
}

export interface State {
  webViewRef: MutableRefObject<undefined> | undefined;
  sdkInitialized: boolean;
  user?: User;
  apiDomain?: string;
  location?: Location;
  locationStatus?: LocationStatusName;
  buildings: Building[] | null;
  currentBuilding: Building | undefined;
  pois: Poi[];
  /**
   * @deprecated Routes are now calculated and managed by the MapView.
   * This property is kept for backward compatibility and will always be undefined.
   */
  directions?: Directions;
  /**
   * @deprecated Navigation is now calculated and managed by the MapView.
   * This property is kept for backward compatibility and will always be undefined.
   */
  navigation?: NavigationProgress;
  destinationPoiID?: number;
  error?: Error;
  buildingIdentifier: string;
}

export const initialState: State = {
  webViewRef: undefined,
  sdkInitialized: false,
  user: undefined,
  apiDomain: undefined,
  location: undefined,
  locationStatus: undefined,
  buildings: null,
  currentBuilding: undefined,
  pois: [],
  directions: undefined,
  navigation: undefined,
  destinationPoiID: undefined,
  error: undefined,
  buildingIdentifier: "-1",
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
    setLocation: (state: State, payload: State["location"]) => {
      return { ...state, location: payload };
    },
    setLocationStatus: (state: State, payload: State["locationStatus"]) => {
      return { ...state, locationStatus: payload };
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
    setDestinationPoiID: (state: State, payload: State["destinationPoiID"]) => {
      return { ...state, destinationPoiID: payload };
    },
    setError: (state: State, payload: State["error"]) => {
      return { ...state, error: payload };
    },
    setBuildingIdentifier: (
      state: State,
      payload: State["buildingIdentifier"],
    ) => {
      return { ...state, buildingIdentifier: payload };
    },

    /* Internal use only */
    _setSdkInitialized: (state: State, payload: State["sdkInitialized"]) => {
      return { ...state, sdkInitialized: payload };
    },
    /*  Users are intended to change these variables through SitumProvider's props  */
    _setAuth: (state: State, payload: State["user"]) => {
      return { ...state, user: payload };
    },
    _setApiDomain: (state: State, payload: State["apiDomain"]) => {
      return { ...state, apiDomain: payload };
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

export const selectApiDomain = (state: State) => {
  return state.apiDomain;
};

export const selectLocation = (state: State) => {
  return state.location;
};

export const selectLocationStatus = (state: State) => {
  return state.locationStatus;
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

/**
 * @deprecated Routes are now calculated and managed by the MapView.
 * This selector is kept for backward compatibility and will always return undefined.
 */
export const selectDirections = (state: State) => {
  return state.directions;
};

/**
 * @deprecated Navigation is now calculated and managed by the MapView.
 * This selector is kept for backward compatibility and will always return undefined.
 */
export const selectNavigation = (state: State) => {
  return state.navigation;
};

export const selectDestinationPoiID = (state: State) => {
  return state.destinationPoiID;
};

export const selectError = (state: State) => {
  return state.error;
};

export const selectBuildingIdentifier = (state: State) => {
  return state.buildingIdentifier;
};

export const {
  setWebViewRef,
  setLocation,
  setLocationStatus,
  resetLocation,
  setBuildings,
  setCurrentBuilding,
  setPois,
  setDestinationPoiID,
  setError,
  setBuildingIdentifier,
} = store.actions;

/**
 * Context specifically to store the only instance of our hook.
 */
export const UseSitumContext = createContext<{ useSitum: any } | undefined>(
  undefined,
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
 * Main context of the application. Initializes the Situm plugin and stores its state,
 * so SitumPlugin.init() does not need to be called manually.
 *
 * An API key or JWT token must be provided before the provider mounts and renders its children.
 * API key authentication is the primary and recommended method, while JWT authentication is available as an alternative. 
 */
const SitumProvider: React.FC<
  React.PropsWithChildren<{
    /**
     * Your Situm email account.
     */
    email?: string;
    /**
     * Your Situm API key. Find your API key at your [Situm dashboard's profile](https://dashboard.situm.com/accounts/profile)
     *
     * When specifying a valid situm API key in this parameter, you won't need to call later on the `SitumPlugin.setApiKey()` method,
     * and also you won't need to specify `MapViewConfiguration.situmApiKey` when configuring your MapView.
     */
    apiKey?: string;
    /**
     * JWT token used to authenticate the Situm native SDKs and MapView.
     *
     * When specified, you don't need to call `SitumPlugin.setToken()` manually.
     * Token renewal is the client's responsibility: update this property or call
     * `SitumPlugin.setToken()` when a new token is available.
     */
    token?: string;
    /**
     * Set the API domain that will be used by the native SDKs and MapView to obtain the situm's data.
     *
     * When specifying a valid domain in this parameter, you won't need to call later on the `SitumPlugin.setDashboardURL()` method,
     * and also you won't need to specify `MapViewConfiguration.apiDomain` when configuring your MapView.
     *
     * Defaults to "api.situm.com"
     */
    apiDomain?: string;
  }>
> = ({ email, apiKey, token, apiDomain, children }) => {
  const [state, dispatch] = useReducer(store.reducer, {
    ...store.initialState,
    user: { email }
  });

  const [isApiDomainInitialized, setIsApiDomainInitialized] = useState(false);
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);
  const isReady = (state.sdkInitialized && isApiDomainInitialized && isAuthInitialized);
  const lastAuthProp = useRef<SitumAuth | undefined>(undefined);

  useEffect(() => {
    try {
      SitumPlugin.init();
      dispatch(store.actions._setSdkInitialized(true));
    } catch (e) {
      console.error(`SitumProvider > Could not initialize ${e}`);
    }
  }, []);

  useEffect(() => {
    if (apiDomain) {
      SitumPlugin.setDashboardURL(apiDomain);
      dispatch(store.actions._setApiDomain(apiDomain));
    }
    setIsApiDomainInitialized(true);
  }, [apiDomain, dispatch]);

  useEffect(() => {
    if (token) {
      SitumPlugin.setToken(token);
      setIsAuthInitialized(true);
      lastAuthProp.current = { type: "jwt", value: token };
    }
  }, [token])

  useEffect(() => {
    if (apiKey) {
      SitumPlugin.setApiKey(apiKey);
      setIsAuthInitialized(true);
      lastAuthProp.current = { type: "apiKey", value: apiKey };
    }
  }, [apiKey])

  useEffect(() => {
    const lastAuth = lastAuthProp.current;
    const auth: User = !lastAuth
      ? { email }
      : lastAuth.type === "apiKey"
        ? { email, apiKey: lastAuth.value }
        : { email, token: lastAuth.value };

    dispatch(store.actions._setAuth(auth));
  }, [email, token, apiKey, dispatch]);

  return (
    <SitumContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {/**
       * Make sure to execute first SitumProvider's initialization & authentication useEffect(),
       * before letting children components rendering MapView or calling SitumPlugin methods.
       *
       * If we directly let the `children` render, the children's useEffect() will execute before SitumProvider's useEffect().
       * This causes a crash when the children wants to access SitumPlugin before it is ready.
       */}
      <UseSitumProvider>{isReady ? children : <></>}</UseSitumProvider>
    </SitumContext.Provider>
  );
};

export default SitumProvider;
