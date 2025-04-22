import React, {useEffect, useState, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';

import {
  type OnPoiDeselectedResult,
  type OnPoiSelectedResult,
  type OnExternalLinkClickedResult,
  type MapViewRef,
  SitumProvider,
  MapView,
} from '@situm/react-native';

import {SITUM_API_KEY, SITUM_BUILDING_ID, SITUM_PROFILE} from '../situm';
import { Dialog, FAB, Icon, List, PaperProvider, Portal } from 'react-native-paper';
import { Colors } from '../SharedStyles';

export const WayfindingScreen: React.FC = () => {
  
    // ////////////////////////////////////////////////////////////////////////
    // INITIALIZATION
    // ////////////////////////////////////////////////////////////////////////

    const mapViewRef = useRef<MapViewRef>(null);
    const [controller, setController] = useState<MapViewRef | null>();

    useEffect(() => {
      if (!mapViewRef) {
        return;
      }
  
      setController(mapViewRef.current);
    }, [mapViewRef]);
  
    const onLoad = (event: any) => {
      console.log('Situm > example > Map is ready, received event: ', event);
    };
  
    // ////////////////////////////////////////////////////////////////////////
    // CALLBACKS:
    // ////////////////////////////////////////////////////////////////////////

    const [selectedPoi, setSelectedPoi] = useState<string | null>();

    const onPoiSelected = (event: OnPoiSelectedResult) => {
      setSelectedPoi(event.identifier);
      console.log(
        'Situm > example > on poi selected detected: ' + JSON.stringify(event),
      );
    };
  
    const onPoiDeselected = (event: OnPoiDeselectedResult) => {
      setSelectedPoi(null);
      console.log(
        'Situm > example > on poi deselected detected: ' + JSON.stringify(event),
      );
    };
  
    const onExternalLinkClicked = (event: OnExternalLinkClickedResult) => {
      // MapView will open the external link in the system's default browser if this callback is not set.
      console.log('Situm > example > click on external link: ' + event.url);
    };
  
    const onFloorChanged = (event: any) => {
      console.log('Situm > example > floor changed to: ' + event.identifier);
    };
  
    const onFavoritePoisUpdated = (event: any) => {
      console.log('Situm > example > favorite pois updated: ' + JSON.stringify(event.pois));
    };
  
    const onMapError = (error: any) => {
      console.error('Situm > example > map error: ' + error.message);
    };

    // ////////////////////////////////////////////////////////////////////////
    // ACTIONS:
    // ////////////////////////////////////////////////////////////////////////

    const [dialogVisible, setDialogVisible] = useState(false);

    const showDialog = () => setDialogVisible(true);
    const hideDialog = () => setDialogVisible(false);
  
    const followUser = () => {
      controller?.followUser();
      hideDialog();
    }
  
    const navigateToPoi = () => {
      if (!selectedPoi) return;
      controller?.navigateToPoi({
        identifier: Number(selectedPoi)
      });
      hideDialog();
    }

    return (
      <PaperProvider>

        {/* Add a SitumProvider with a valid API KEY */}
        <SitumProvider apiKey={SITUM_API_KEY}>
          <SafeAreaView style={{...styles.container}}>
            <View style={styles.screenWrapper}>

              {/* Add your MapView with a MapViewConfiguration */}
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

            {/* Actions FAB+dialog available after selecting a POI */}
            <FAB
              visible={mapViewRef != null}
              style={[styles.fab, { backgroundColor: Colors.primary }]}
              icon="code-greater-than"
              onPress={showDialog}
            />
            <Portal>
              <Dialog visible={dialogVisible} onDismiss={hideDialog}>
                <Dialog.Title>Programmatic actions:</Dialog.Title>
                <Dialog.Content>
                  <List.Item 
                    title="Navigate to selected POI"
                    onPress={navigateToPoi} disabled={!selectedPoi}
                    left={() => <Icon source="navigation-variant-outline" size={20} />} />
                  <List.Item
                    title="Follow user" 
                    onPress={followUser}
                    left={() => <Icon source="crosshairs-gps" size={20} />} />
                </Dialog.Content>
              </Dialog>
            </Portal>
          </SafeAreaView>
        </SitumProvider>
      </PaperProvider>
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
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      top: 64,
    },
  });
