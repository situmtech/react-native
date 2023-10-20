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
import {Button, TextInput} from 'react-native-paper';

const styles = StyleSheet.create({
  viewer_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input_container: {
    paddingHorizontal: 12,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    margin: 5,
    gap: 6,
  },
  buttons_container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    margin: 5,
    gap: 6,
  },
  text_input: {
    flex: 1,
    borderRadius: 90,
  },
});

const Screen: React.FC = () => {
  const mapViewRef = useRef<MapViewRef>(null);
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  // State
  const [customFieldKey, setCustomFieldKey] = useState<string>();
  const [customFieldValue, setCustomFieldValue] = useState<string>();

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
          // SitumPlugin.requestLocationUpdates();
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

  return (
    <>
      <SafeAreaView style={{...styles.viewer_container, ...backgroundStyle}}>
        <MapView
          ref={mapViewRef}
          configuration={{
            buildingIdentifier: SITUM_BUILDING_ID,
            situmApiKey: SITUM_API_KEY,
          }}
        />
      </SafeAreaView>
      <SafeAreaView style={styles.input_container}>
        <TextInput
          mode="outlined"
          placeholder={'Custom field key'}
          value={customFieldKey}
          onChangeText={setCustomFieldKey}
          style={styles.text_input}
        />
        <TextInput
          mode="outlined"
          placeholder={'Value (optional)'}
          value={customFieldValue}
          onChangeText={setCustomFieldValue}
          style={styles.text_input}
        />
      </SafeAreaView>
      <SafeAreaView style={styles.buttons_container}>
        <Button
          mode="contained"
          icon={'eye'}
          onPress={() => {
            mapViewRef?.current?.showPoisByCustomField(
              customFieldKey,
              customFieldValue,
            );
          }}>
          Show
        </Button>
        <Button
          icon={'eye-off'}
          mode="contained"
          onPress={() => {
            mapViewRef?.current?.hidePoisByCustomField(
              customFieldKey,
              customFieldValue,
            );
          }}>
          Hide
        </Button>
        <Button
          mode="contained"
          icon={'arrow-right'}
          onPress={() => {
            mapViewRef?.current?.selectPoiByCustomField(
              customFieldKey,
              customFieldValue,
            );
          }}>
          Select
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
