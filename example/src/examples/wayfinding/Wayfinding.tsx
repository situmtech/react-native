import React, {useEffect, useState, useRef} from 'react';
import {SafeAreaView, StyleSheet, useColorScheme} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

import SitumPlugin, {
  MapView,
  SitumProvider,
  requestPermission,
} from '@situm/react-native';
import type {
  OnPoiDeselectedResult,
  OnPoiSelectedResult,
  MapViewRef,
} from '@situm/react-native';
import {SITUM_API_KEY, SITUM_BUILDING_ID} from '../../situm';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  mapview: {
    width: '100%',
    height: '100%',
  },
});

const Screen: React.FC = () => {
  const mapViewRef = useRef<MapViewRef>(null);
  const [_controller, setController] = useState<MapViewRef | null>();

  // Initialize SDK when mounting map
  useEffect(() => {
    // Set positioning configuration
    SitumPlugin.setConfiguration({useRemoteConfig: true});

    // Request necessary permissions to start positioning
    requestPermission()
      .then(() => {
        console.log('Situm > example > Starting positioning');
        SitumPlugin.requestLocationUpdates();
      })
      .catch(e => {
        console.log(`Situm > example > Permissions rejected: ${e}`);
      });

    // When unmounting make sure to stop positioning
    return () => SitumPlugin.removeLocationUpdates();
  }, []);

  // Initialize controller
  useEffect(() => {
    if (!mapViewRef) {
      return;
    }

    setController(mapViewRef.current);
  }, [mapViewRef]);

  const onLoad = (event: any) => {
    console.log('Situm > example > Map is ready', event);
  };

  const onPoiSelected = (event: OnPoiSelectedResult) => {
    console.log(
      'Situm > example > on poi selected detected: ' + JSON.stringify(event),
    );
  };

  const onPoiDeselected = (event: OnPoiDeselectedResult) => {
    console.log(
      'Situm > example > on poi deselected detected: ' + JSON.stringify(event),
    );
  };

  return (
    <MapView
      ref={mapViewRef}
      configuration={{
        buildingIdentifier: SITUM_BUILDING_ID,
        situmApiKey: SITUM_API_KEY,
      }}
      onLoad={onLoad}
      onPoiSelected={onPoiSelected}
      onPoiDeselected={onPoiDeselected}
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
    </SitumProvider>
  );
};

export default App;
