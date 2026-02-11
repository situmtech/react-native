import React, { createContext, useContext, useMemo, useState } from "react";
import { SITUM_API_KEY, SITUM_BUILDING_ID, SITUM_PROFILE, SITUM_API_DOMAIN } from "../situm";

type SitumConfig = {
  apiKey: string;
  buildingId: string;
  profile: string;
  apiDomain: string;
  mapViewerDomain: string;
};

type SitumConfigContextType = SitumConfig & {
  updateConfig: (config: SitumConfig) => void;
};

export const DEFAULT_SITUM_CONFIG: SitumConfig = {
  apiKey: SITUM_API_KEY,
  buildingId: SITUM_BUILDING_ID,
  profile: SITUM_PROFILE,
  apiDomain: SITUM_API_DOMAIN,
  mapViewerDomain: "https://maps.situm.com",
};

const SitumConfigContext = createContext<SitumConfigContextType | undefined>(
  undefined
);

export const SitumConfigProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [config, setConfig] = useState<SitumConfig>(DEFAULT_SITUM_CONFIG);

  const value = useMemo(
    () => ({
      ...config,
      updateConfig: setConfig,
    }),
    [config]
  );

  return (
    <SitumConfigContext.Provider value={value}>
      {children}
    </SitumConfigContext.Provider>
  );
};

export const useSitumConfig = (): SitumConfigContextType => {
  const context = useContext(SitumConfigContext);
  if (!context) {
    throw new Error("useSitumConfig must be used within SitumConfigProvider");
  }
  return context;
};
