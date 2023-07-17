import React, {useEffect, useState} from 'react';
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
} from '../../../src/wayfinding';
import {SITUM_EMAIL, SITUM_API_KEY, SITUM_BUILDING_ID} from '../situm';
import {MapViewRef} from '../../../src/wayfinding/components/MapView';

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

  // TODO: review ref
  return (
    <MapView
      // ref={ref => setController(ref)}
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
    <SafeAreaView style={{...styles.container, ...backgroundStyle}}>
      <SitumProvider email={SITUM_EMAIL} apiKey={SITUM_API_KEY}>
        <Screen />
      </SitumProvider>
    </SafeAreaView>
  );
};

export default App;
