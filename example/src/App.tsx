import * as React from 'react';
import {View, useColorScheme, StyleSheet, ScrollView, Text} from 'react-native';
import {Card, List, PaperProvider, TouchableRipple} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SitumPlugin from '@situm/react-native';

import {SITUM_API_KEY, SITUM_DASHBOARD_URL} from './situm';
import Theme from './examples/styles/theme';

import PositioningScreen from './examples/Positioning';
import {BuildingsBasicInfo} from './examples/BuildingsBasicInfo';
import {BuildingFullInfo} from './examples/BuildingFullInfo';
import {InfoFromBuilding} from './examples/InfoFromBuilding';
import {RouteBetweenPOIs} from './examples/RouteBetweenPOIs';
import {ShowBuildingOnMap} from './examples/ShowBuildingOnMap';
import {DrawRouteBetweenPOIs} from './examples/DrawRouteBetweenPOIs';
import {RemoteConfig} from './examples/RemoteConfig';
import {GetPoisIcons} from './examples/GetPoisIcons';
import {SetCacheMaxAge} from './examples/SetCacheMaxAge';
import {TiledBuilding} from './examples/TiledBuilding';
import Wayfinding from './examples/Wayfinding';

async function initSitumSdk() {
  try {
    await SitumPlugin.init();
    await SitumPlugin.setDashboardURL(SITUM_DASHBOARD_URL);
    await SitumPlugin.setApiKey(SITUM_API_KEY);
    await SitumPlugin.sdkVersion();
  } catch (err: unknown) {
    console.log('Situm SDK error: ', err);
  }
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    overflow: 'hidden',
  },
  wrapper: {
    margin: 16,
  },
  copyright: {
    textAlign: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
  },
  padding: {
    paddingVertical: 16,
  },
});

const HomeScreen = ({navigation}) => {
  React.useEffect(() => {
    initSitumSdk();
  }, []);

  const screensAndSections = [
    {
      title: 'Situm WYF',
      screens: [
        {
          title: 'Complete Wayfinding Experience',
          subtitle:
            'An integrated wayfinding experience powered by Situm, designed for ease of integration.',
          key: 'Wayfinding',
        },
      ],
    },

    {
      title: 'Build-your own UI (Not Recommended)',
      screens: [
        {
          title: 'Display a Building on Google Maps',
          subtitle:
            'A foundational example that overlays a building layout on Google Maps.',
          key: 'ShowBuildingOnMap',
        },
        {
          title: 'Visualize Route Between POIs',
          subtitle:
            'Demonstrates how to use the SDK to calculate and display a route between two Points of Interest (POIs) on a map.',
          key: 'DrawRouteBetweenPOIs',
        },
        {
          title: 'Custom Icons for POIs on a Map',
          subtitle:
            'Showcase how to represent building POIs with custom marker icons on a map.',
          key: 'GetPoisIcons',
        },
        {
          title: 'Tile-based Building Display on a Map',
          subtitle:
            'Illustrates how to render a building on a map using map tiles.',
          key: 'TiledBuilding',
        },
      ],
    },
    {
      title: 'JSON-based Examples',
      screens: [
        {
          title: 'Indoor Positioning',
          subtitle:
            'A hands-on example detailing the steps to initiate and terminate indoor positioning with Situm.',
          key: 'Positioning',
        },
        {
          title: 'Positioning with Remote Configuration',
          subtitle:
            'Learn how to initiate positioning by leveraging the remote configuration feature of Situm SDK.',
          key: 'RemoteConfig',
        },
        {
          title: 'Retrieve Basic Building Information',
          subtitle:
            'Fetch and display basic details of the buildings associated with your account in a raw format.',
          key: 'BuildingsBasicInfo',
        },
        {
          title: 'Comprehensive Building Information',
          subtitle:
            'A deep dive into fetching all available information about a building using various API calls.',
          key: 'BuildingFullInfo',
        },
        {
          title: 'Complete Building Details',
          subtitle:
            'View the entire set of details for a building in raw text format.',
          key: 'InfoFromBuilding',
        },
        {
          title: 'Manage Cache Duration and Invalidate Cache',
          subtitle:
            'Understand how to set a custom expiration time for cache elements and how to invalidate them when needed.',
          key: 'SetCacheMaxAge',
        },
        {
          title: 'Calculate Route Between Two POIs (Raw Format)',
          subtitle:
            'Learn to compute and display a route between two POIs in a raw text format.',
          key: 'RouteBetweenPOIs',
        },
      ],
    },
  ];

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      alwaysBounceVertical={false}
      showsVerticalScrollIndicator={false}>
      <View style={styles.wrapper}>
        {screensAndSections.map(item => (
          <List.Section
            title={item.title}
            titleStyle={styles.title}
            key={item.title}>
            {item.screens.map(screen => (
              <Card
                key={screen.key}
                style={{
                  ...styles.container,
                }}
                mode={'contained'}>
                <TouchableRipple
                  onPress={() => navigation.navigate(screen.key)}>
                  <Card.Title
                    title={screen.title}
                    titleNumberOfLines={4}
                    titleVariant="titleMedium"
                    subtitle={screen.subtitle}
                    subtitleNumberOfLines={5}
                    style={styles.padding}
                  />
                </TouchableRipple>
              </Card>
            ))}
          </List.Section>
        ))}
      </View>
      <Text style={{...styles.copyright}}>
        © {new Date().getFullYear()} Situm Technologies
      </Text>
    </ScrollView>
  );
};

const Stack = createNativeStackNavigator();

function App() {
  const scheme = useColorScheme();
  const theme =
    scheme === 'dark' ? Theme.SitumDarkTheme : Theme.SitumLightTheme;

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={theme}>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="@situm/react-native examples"
            component={HomeScreen}
          />
          <Stack.Screen
            name="Positioning"
            component={PositioningScreen}
            options={{title: 'Positioning example'}}
          />
          <Stack.Screen
            name="BuildingsBasicInfo"
            component={BuildingsBasicInfo}
            options={{title: 'Basic building info'}}
          />
          <Stack.Screen
            name="BuildingFullInfo"
            component={BuildingFullInfo}
            options={{title: 'Full building info'}}
          />
          <Stack.Screen
            name="ShowBuildingOnMap"
            component={ShowBuildingOnMap}
            options={{title: 'Building on map'}}
          />
          <Stack.Screen
            name="InfoFromBuilding"
            component={InfoFromBuilding}
            options={{title: 'Building info multiple calls'}}
          />
          <Stack.Screen name="RouteBetweenPOIs" component={RouteBetweenPOIs} />
          <Stack.Screen
            name="DrawRouteBetweenPOIs"
            component={DrawRouteBetweenPOIs}
            options={{title: 'Route between POIs on map'}}
          />
          <Stack.Screen
            name="RemoteConfig"
            component={RemoteConfig}
            options={{title: 'Positioning with remote connfiguration'}}
          />
          <Stack.Screen
            name="GetPoisIcons"
            component={GetPoisIcons}
            options={{title: 'POIs on map'}}
          />
          <Stack.Screen
            name="SetCacheMaxAge"
            component={SetCacheMaxAge}
            options={{title: 'Max cache age and cache invalidation'}}
          />
          <Stack.Screen
            name="TiledBuilding"
            component={TiledBuilding}
            options={{title: 'Building with tiles on map'}}
          />
          <Stack.Screen
            name="Wayfinding"
            component={Wayfinding}
            options={{title: 'Full Wayfinding'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;
