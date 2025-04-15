import React, {useEffect, useState, useRef} from 'react';
import {
  AppState,
  NativeEventSubscription,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';

import SitumPlugin, {MapView, SitumProvider, Error} from '@situm/react-native';
import type {
  OnPoiDeselectedResult,
  OnPoiSelectedResult,
  OnExternalLinkClickedResult,
  MapViewRef,
} from '@situm/react-native';
import {SITUM_API_KEY, SITUM_BUILDING_ID, SITUM_PROFILE} from '../situm';

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
  
      // Initial configuration
      SitumPlugin.setConfiguration({useRemoteConfig: true});
      
      // Start positioning
      if (!SitumPlugin.positioningIsRunning()) {
        SitumPlugin.requestLocationUpdates();
        console.log('Situm > example > Starting positioning');
      }
  
      // Register listener to react to the app comming from the background
      appStateListener = registerAppStateListener();
      // Register callbacks
      registerCallbacks();
  
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
  
    const onFloorChanged = (event: any) => {
      console.log('Situm > example > floor changed to: ' + event.floor);
    };
  
    const onFavoritePoisUpdated = (event: any) => {
      console.log('Situm > example > favorite pois updated: ' + JSON.stringify(event.pois));
    };
  
    const onMapError = (error: any) => {
      console.error('Situm > example > map error: ' + error.message);
    };
  
    return (
      <View style={styles.screenWrapper}>
        <MapView
          ref={mapViewRef}
          configuration={{
            situmApiKey: SITUM_API_KEY,
            buildingIdentifier: SITUM_BUILDING_ID,
            profile: SITUM_PROFILE,
          }}
          onLoad={onLoad}
          onLoadError={onMapError}
          onPoiSelected={onPoiSelected}
          onPoiDeselected={onPoiDeselected}
          onFloorChanged={onFloorChanged}
          onExternalLinkClicked={onExternalLinkClicked}
          onFavoritePoisUpdated={onFavoritePoisUpdated}
        />
      </View>
    );
  };

export const WayfindingScreen = () => {
    return (
        <SitumProvider apiKey={SITUM_API_KEY}>
          <SafeAreaView style={{...styles.container}}>
            <Screen />
          </SafeAreaView>
        </SitumProvider>
      );
};

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
    screenWrapper: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
    },
  });


// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';

// export const WayfindingScreen = () => {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Welcome to Situm Example</Text>
//       <Text style={styles.subtitle}>
//         This example shows how to integrate Situm SDK in your React Native application
//       </Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#fff',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: '600',
//     marginBottom: 16,
//     color: '#000',
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#666',
//     lineHeight: 24,
//   },
// }); 