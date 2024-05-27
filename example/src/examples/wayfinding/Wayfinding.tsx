import React, {useEffect, useState, useRef} from 'react';
import {
  AppState,
  NativeEventSubscription,
  SafeAreaView,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

import SitumPlugin, {
  MapView,
  SitumProvider,
  requestPermission,
  Error,
} from '@situm/react-native';
import type {
  OnPoiDeselectedResult,
  OnPoiSelectedResult,
  OnExternalLinkClickedResult,
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

  // When coming from background, try to start positioning (if not running yet)
  // This will ensure that, if the user enables the app permissions from the phone settings
  // your application will start positioning right away
  const registerAppStateListener = (): NativeEventSubscription => {
    return AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        if (!SitumPlugin.positioningIsRunning()) {
          SitumPlugin.requestLocationUpdates();
          console.log(
            'Situm > example > Starting positioning after coming from background',
          );
        }
      }
    });
  };

  // Initialize SDK when mounting map
  useEffect(() => {
    let appStateListener: NativeEventSubscription;

    // Set positioning configuration
    SitumPlugin.setConfiguration({useRemoteConfig: true});
    //Request permissions and start positioning
    requestPermission()
      .then(() => {
        if (!SitumPlugin.positioningIsRunning()) {
          SitumPlugin.requestLocationUpdates();
          console.log('Situm > example > Starting positioning');
        }
      })
      .catch(e => {
        console.log(`Situm > example > Permissions rejected: ${e}`);
      })
      .finally(() => {
        //Register listener to react to the app comming from the background
        appStateListener = registerAppStateListener();
        //Register callbacks
        registerCallbacks();
      });

    // When unmounting make sure to stop positioning and remove listeners
    return () => {
      SitumPlugin.removeLocationUpdates();
      appStateListener.remove();
    };
  }, []);

  // Register callbacks to handle Situm SDK events
  const registerCallbacks = () => {
    // Handle location errors
    SitumPlugin.onLocationError((err: Error) => {
      console.error(
        'Situm > example > Error while positioning: ',
        JSON.stringify(err),
      );

      // Please take a look to RemoteConfig.tsx to know what kind of errors
      // your app may be able to react to (and other useful callbacks as well)
      // E.g. you might want to inform the user that he/she needs to grant some permission
      // based on the callbacks' result
    });
  };

  // Initialize controller
  useEffect(() => {
    if (!mapViewRef) {
      return;
    }

    setController(mapViewRef.current);
  }, [mapViewRef]);

  const onLoad = (event: any) => {
    console.log('Situm > example > Map is ready, received event: ', event);
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

  const onExternalLinkClicked = (event: OnExternalLinkClickedResult) => {
    // MapView will open the external link in the system's default browser if this callback is not set.
    console.log('Situm > example > click on external link: ' + event.url);
  };

  return (
    <MapView
      ref={mapViewRef}
      configuration={{
        buildingIdentifier: SITUM_BUILDING_ID,
        situmApiKey: SITUM_API_KEY,
        viewerDomain: 'http://192.168.1.142:5173/',
      }}
      onLoad={onLoad}
      onPoiSelected={onPoiSelected}
      onPoiDeselected={onPoiDeselected}
      onExternalLinkClicked={onExternalLinkClicked}
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
