import React, {useEffect, useState, useRef} from 'react';
import {SafeAreaView, StyleSheet, useColorScheme} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

import SitumPlugin, {MapView, SitumProvider} from '@situm/react-native';
import type {MapViewRef} from '@situm/react-native';
import {SITUM_API_KEY, SITUM_BUILDING_ID} from '../../situm';
import {Button} from 'react-native-paper';
import {getDefaultLocationOptions} from '../../settings';

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
  const [isFollowing, setIsFollowing] = useState(false);
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
      await SitumPlugin.requestLocationUpdates();
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
    startPositioning();
  }, [mapViewRef]);

  const startPositioning = async () => {
    console.log('Starting positioning');

    const locationOptions = getDefaultLocationOptions();
    try {
      SitumPlugin.requestLocationUpdates(locationOptions);
    } catch (e) {
      console.log(`Situm > example > Could not start positioning ${e}`);
    }
  };

  /**
   * Handles follow or unfollow actions for a user.
   * Sends a request to the Mapview to start or stop following the user's position.
   * Requires that positioning services are enabled.
   * If attempting to follow an already-followed user or unfollow a user not currently followed, no action is taken.
   */
  const handleFollowUnfollowUser = () => {
    if (!isFollowing) {
      // if not following start following
      _controller?.followUser();
      setIsFollowing(true);
    } else {
      //if already following stop following
      _controller?.unfollowUser();
      setIsFollowing(false);
    }
  };

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
        <Button
          mode="outlined"
          onPress={() => {
            startPositioning();
          }}>
          Start positioning
        </Button>
        <Button mode="outlined" onPress={handleFollowUnfollowUser}>
          {!isFollowing ? 'Follow' : 'Unfollow'}
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
