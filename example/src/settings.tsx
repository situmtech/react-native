const DEFAULT_LOCATION_OPTIONS = {
    useWifi: true,
    useBle: true,
    useGps: false,
    useForegroundService: true,
    useGlobalLocation:true,
    interval: 1000,
    useLocationsCache: false,
    useBatterySaver: false,
    useBarometer: false,
    useDeadReckoning: false,
    ignoreWifiThrottling: true, 
    realtimeUpdateInterval: "REALTIME",
    buildingIdentifier: -1,
    outdoorLocationOptions: {
      buildingDetector: "BLE", 
      updateInterval: 5000,
      computeInterval: 1000,
      backgroundAccuracy: "MAXIMUM",
      useGeofencesinBuildingSelector: false, 
      enableOutdoorPositions: true,
      minimumOutdoorLocationAccuracy: 0,
      scansBasedDetectorAlwaysOn: false, 
      enableOpenSkyDetector: false,
      averageSnrThreshold: 28,
    },
    useRemoteConfiguration: true
  };

  export const getDefaultLocationOptions = () => {
    return DEFAULT_LOCATION_OPTIONS
  }
