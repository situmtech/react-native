import React, {useEffect, useState, useRef} from 'react';
import {SafeAreaView, StyleSheet, useColorScheme} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

import SitumPlugin, {
  MapView,
  SitumProvider,
  requestPermission,
} from '@situm/react-native';
import type {MapViewRef} from '@situm/react-native';
import {SITUM_API_KEY, SITUM_BUILDING_ID} from '../../situm';
import {getDefaultLocationOptions} from '../../settings';
import {FAB} from 'react-native-paper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapview: {
    width: '100%',
    height: '100%',
  },
});

const fabStyles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

const Screen: React.FC = () => {
  const mapViewRef = useRef<MapViewRef>(null);
  const [_controller, setController] = useState<MapViewRef | null>();

  /**
   * Helper function that sets up the system to start positioning
   */
  const initializeSitum = async () => {
    // Define your own configuration if needed
    await SitumPlugin.setConfiguration({useRemoteConfig: false});
    // Request permissions and start positioning
    requestPermission()
      .then(() => {
        SitumPlugin.requestLocationUpdates(getDefaultLocationOptions()).catch(
          console.debug,
        );
      })
      .catch(console.debug);
  };

  /**
   * Helper function that stop the positioning session
   */
  const stopPositioning = () => {
    SitumPlugin.removeLocationUpdates().catch(console.debug);
  };

  // Initialize SDK when mounting map and start positioning
  useEffect(() => {
    initializeSitum();

    // Once component unmounts, stop positioning
    return () => stopPositioning();
  }, []);

  // Initialize controller
  useEffect(() => {
    if (!mapViewRef) {
      return;
    }
    setController(mapViewRef.current);
  }, [mapViewRef]);

  return (
    <MapView
      ref={mapViewRef}
      configuration={{
        buildingIdentifier: SITUM_BUILDING_ID,
        situmApiKey: SITUM_API_KEY,
      }}
    />
  );
};

const App: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SitumProvider apiKey={SITUM_API_KEY}>
      <SafeAreaView style={{...styles.container, ...backgroundStyle}}>
        <Screen />
      </SafeAreaView>
      <FAB
        style={fabStyles.fab}
        onPress={() => {
          console.log('pressed');
        }}
      />
    </SitumProvider>
  );
};

export default App;
