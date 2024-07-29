import React, {useEffect, useState, useRef} from 'react';
import {SafeAreaView, StyleSheet, View, useColorScheme} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import SitumPlugin, {MapView, SitumProvider} from '@situm/react-native';
import {AccessibilityMode, MapViewRef} from '@situm/react-native';
import {SITUM_API_KEY, SITUM_BUILDING_ID} from '../../situm';
import {Button, Text} from 'react-native-paper';
import requestPermission from '../Utils/requestPermission';
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
  radio_group: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
const Screen: React.FC = () => {
  const mapViewRef = useRef<MapViewRef>(null);
  const [_controller, setController] = useState<MapViewRef | null>();
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const [accessibilityMode, setAccessibilityMode] =
    React.useState<AccessibilityMode>(AccessibilityMode.CHOOSE_SHORTEST);
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
  }, [mapViewRef]);
  return (
    <>
      <SafeAreaView style={{...styles.viewer_container, ...backgroundStyle}}>
        <MapView
          ref={mapViewRef}
          configuration={{
            buildingIdentifier: SITUM_BUILDING_ID,
            situmApiKey: SITUM_API_KEY,
            viewerDomain: 'https://pro-3477.map-viewer.situm.com',
          }}
        />
      </SafeAreaView>
      <SafeAreaView style={styles.input_container}>
        <Button
          mode="outlined"
          onPress={() => {
            _controller?.selectCar();
          }}>
          Select
        </Button>
        <Button
          mode="outlined"
          onPress={() => {
            _controller?.navigateToCar({accessibilityMode: accessibilityMode});
          }}>
          Navigate
        </Button>
      </SafeAreaView>
      <SafeAreaView>
        {Object.keys(AccessibilityMode).map(v => {
          return (
            <View style={styles.radio_group} key={v}>
              <Button
                mode="outlined"
                onPress={() => setAccessibilityMode(v as AccessibilityMode)}>
                {v}
              </Button>
            </View>
          );
        })}
        <Text>Route type: {accessibilityMode}</Text>
      </SafeAreaView>
    </>
  );
};
const App: React.FC = () => {
  return (
    <SitumProvider>
      <Screen />
    </SitumProvider>
  );
};
export default App;
