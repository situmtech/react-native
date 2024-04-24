import React, {useEffect, useState, useRef} from 'react';
import {SafeAreaView, StyleSheet, useColorScheme} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

import SitumPlugin, {
  MapView,
  SitumProvider,
  requestPermission,
} from '@situm/react-native';
import type {MapViewRef} from '@situm/react-native';
import {
  SITUM_API_KEY,
  BUILDING_IDENTIFIER,
  LANGUAGE,
  REMOTE_IDENTIFIER,
} from '../../situm';
import {Button, TextInput} from 'react-native-paper';

const styles = StyleSheet.create({
  viewer_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input_container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    margin: 5,
  },
  text_input: {
    width: 180,
  },
});

const Screen: React.FC = () => {
  const mapViewRef = useRef<MapViewRef>(null);
  const [_controller, setController] = useState<MapViewRef | null>();
  const [selectedPoiCategoryIdentifier, setSelectedPoiCategoryIdentifier] =
    useState<string>();
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  /**
   * Helper function that sets up the system to start positioning
   */
  const initializeSitum = async () => {
    try {
      // Define your own configuration if needed
      SitumPlugin.setConfiguration({useRemoteConfig: true});
      // Request permissions and start positioning
      await requestPermission()
        .then(() => {
          SitumPlugin.requestLocationUpdates();
        })
        .catch(console.debug);
    } catch (e) {
      console.log(`Situm > example > Could not start positioning ${e}`);
    }
  };

  /**
   * Helper function that stop the positioning session
   */
  const stopPositioning = () => {
    try {
      SitumPlugin.removeLocationUpdates();
    } catch (e) {
      console.log(`Situm > example > Could not stop positioning ${e}`);
    }
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
    console.log(mapViewRef.current);
  }, [mapViewRef]);

  return (
    <>
      <SafeAreaView style={{...styles.viewer_container, ...backgroundStyle}}>
        <MapView
          ref={mapViewRef}
          configuration={{
            buildingIdentifier: BUILDING_IDENTIFIER,
            situmApiKey: SITUM_API_KEY,
            remoteIdentifier: REMOTE_IDENTIFIER,
            language: LANGUAGE,
          }}
        />
      </SafeAreaView>
      <SafeAreaView style={styles.input_container}>
        <TextInput
          placeholder={'POI category identifier'}
          value={selectedPoiCategoryIdentifier}
          onChangeText={setSelectedPoiCategoryIdentifier}
          style={styles.text_input}
        />
        <Button
          mode="outlined"
          onPress={() => {
            _controller?.selectPoiCategory(
              Number(selectedPoiCategoryIdentifier),
            );
          }}>
          Select POI category
        </Button>
      </SafeAreaView>
    </>
  );
};

const App: React.FC = () => {
  return (
    <SitumProvider apiKey={SITUM_API_KEY}>
      <Screen />
    </SitumProvider>
  );
};

export default App;
