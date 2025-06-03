import React, {useEffect, useState, useRef} from 'react';
import {SafeAreaView, StyleSheet, useColorScheme} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

import SitumPlugin, {MapView, SitumProvider} from '@situm/react-native';
import type {MapViewRef} from '@situm/react-native';
import type {OnFavoritePoisUpdatedResult} from '@situm/react-native';
import {SITUM_API_KEY, SITUM_BUILDING_ID} from '../../situm';
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
  const [favoritePoisIds, setAddedFavoritePoisIdentifiers] =
    useState<string>('');
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  /**
   * Helper function that sets up the system to start positioning
   */
  const initializeSitum = async () => {
    // Define your own configuration if needed
    SitumPlugin.setConfiguration({useRemoteConfig: true});
    // Tells the underlying native SDKs to automatically manage permissions
    // and sensor related issues.
    SitumPlugin.enableUserHelper();
    // Start positioning: 
    SitumPlugin.requestLocationUpdates();
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
  }, [mapViewRef]);

  const onFavoritePoisUpdated = (event: OnFavoritePoisUpdatedResult) => {
    console.log('Situm > example > favorite POIs: ' + JSON.stringify(event));
  };

  function parseTextFieldValueToArray(text: string) {
    if (!text?.trim()) {
      return [];
    }
    const values = text.split(',');
    const integers = values.map((value: string) => parseInt(value.trim(), 10));
    const numbers = integers.filter((value: number) => !isNaN(value));
    return numbers;
  }
  return (
    <>
      <SafeAreaView style={{...styles.viewer_container, ...backgroundStyle}}>
        <MapView
          ref={mapViewRef}
          onFavoritePoisUpdated={onFavoritePoisUpdated}
          configuration={{
            buildingIdentifier: SITUM_BUILDING_ID,
            situmApiKey: SITUM_API_KEY,
          }}
        />
      </SafeAreaView>
      <SafeAreaView style={styles.input_container}>
        <TextInput
          placeholder={'Favorite Pois'}
          value={favoritePoisIds}
          onChangeText={setAddedFavoritePoisIdentifiers}
          style={styles.text_input}
        />
        <Button
          mode="outlined"
          onPress={() => {
            _controller?.setFavoritePois(
              parseTextFieldValueToArray(favoritePoisIds),
            );
          }}>
          Set Favorites
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
