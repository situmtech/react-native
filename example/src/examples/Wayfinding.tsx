import React, {useEffect, useState, useRef} from 'react';
import {SafeAreaView, StyleSheet, useColorScheme} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

import {
  MapView,
  OnFloorChangedResult,
  OnNavigationResult,
  OnPoiDeselectedResult,
  OnPoiSelectedResult,
  SitumProvider,
  useSitum,
  MapViewRef,
} from '@situm/react-native';
import {SITUM_EMAIL, SITUM_API_KEY, SITUM_BUILDING_ID} from '../situm';

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

const Screen: React.FC = () => {
  const {initSitumSdk} = useSitum();
  const mapViewRef = useRef<MapViewRef>(null);
  const [_controller, setController] = useState<MapViewRef | null>();

  // Initialize SDK when mounting map
  useEffect(() => {
    initSitumSdk({})
      .then(() => {
        console.info('SDK initialized successfully');
      })
      .catch(e => {
        console.error(`Error on SDK initialization: ${e}`);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initialize controller
  useEffect(() => {
    if (!mapViewRef) {
      return;
    }

    setController(mapViewRef.current);
  }, [mapViewRef]);

  const onLoad = (event: any) => {
    console.log('Map is ready now' + JSON.stringify(event));
  };

  const onFloorChanged = (event: OnFloorChangedResult) => {
    console.log('on floor change detected: ' + JSON.stringify(event));
  };

  const onPoiSelected = (event: OnPoiSelectedResult) => {
    console.log('on poi selected detected: ' + JSON.stringify(event));
  };

  const onPoiDeselected = (event: OnPoiDeselectedResult) => {
    console.log('on poi deselected detected: ' + JSON.stringify(event));
  };

  const onNavigationRequested = (event: OnNavigationResult) => {
    console.log('on navigation requested detected: ' + JSON.stringify(event));
  };

  const onNavigationStarted = (event: OnNavigationResult) => {
    console.log('on navigation started detected: ' + JSON.stringify(event));
  };

  const onNavigationError = (event: OnNavigationResult) => {
    console.log('on navigation error detected: ' + JSON.stringify(event));
  };

  const onNavigationFinished = (event: OnNavigationResult) => {
    console.log('on navigation finished detected: ' + JSON.stringify(event));
  };

  return (
    <MapView
      ref={mapViewRef}
      style={styles.mapview}
      configuration={{
        buildingIdentifier: SITUM_BUILDING_ID,
      }}
      onLoad={onLoad}
      onFloorChanged={onFloorChanged}
      onPoiSelected={onPoiSelected}
      onPoiDeselected={onPoiDeselected}
      onNavigationRequested={onNavigationRequested}
      onNavigationStarted={onNavigationStarted}
      onNavigationError={onNavigationError}
      onNavigationFinished={onNavigationFinished}
    />
  );
};

const App: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SitumProvider email={SITUM_EMAIL} apiKey={SITUM_API_KEY}>
      <SafeAreaView style={{...styles.container, ...backgroundStyle}}>
        <Screen />
      </SafeAreaView>
    </SitumProvider>
  );
};

export default App;
