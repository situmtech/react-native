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
import {SITUM_API_KEY, SITUM_BUILDING_ID} from '../situm';

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
    const initializeSitum = async () => {
      await SitumPlugin.setConfiguration({useRemoteConfig: true});

      requestPermission()
        .then(async () => {
          await SitumPlugin.requestLocationUpdates();
        })
        .catch((e: string) => {
          console.error(e);
        });
    };

    initializeSitum();
  }, []);

  // Initialize controller
  useEffect(() => {
    if (!mapViewRef) {
      return;
    }

    setController(mapViewRef.current);
  }, [mapViewRef]);

  const onLoad = (a: any) => {
    console.log('Situm > example > Map is ready', a);
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
      //style={styles.mapview}
      configuration={{
        buildingIdentifier: SITUM_BUILDING_ID,
        situmApiKey: SITUM_API_KEY,
        //  style: styles.mapview,
      }}
      callbacks={{
        onLoad: onLoad,
        onPoiSelected: onPoiSelected,
        onPoiDeselected: onPoiDeselected,
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
    </SitumProvider>
  );
};

export default App;
