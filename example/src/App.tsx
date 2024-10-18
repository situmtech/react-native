import React, {useEffect} from 'react';
import {View, useColorScheme, StyleSheet, ScrollView, Text} from 'react-native';
import {Card, List, PaperProvider, TouchableRipple} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SitumPlugin from '@situm/react-native';

import {SITUM_API_KEY, SITUM_DASHBOARD_URL} from './situm';
import Theme from './examples/styles/theme';

import PositioningScreen from './examples/sdk/Positioning';
import {BuildingsBasicInfo} from './examples/sdk/BuildingsBasicInfo';
import {BuildingFullInfo} from './examples/sdk/BuildingFullInfo';
import {InfoFromBuilding} from './examples/sdk/InfoFromBuilding';
import {RouteBetweenPOIs} from './examples/sdk/RouteBetweenPOIs';
import {RemoteConfig} from './examples/sdk/RemoteConfig';
import {SetCacheMaxAge} from './examples/sdk/SetCacheMaxAge';
import Wayfinding from './examples/wayfinding/Wayfinding';
import NavigateToPoi from './examples/wayfinding/NavigateToPoi';
import SelectPoi from './examples/wayfinding/SelectPoi';
import SelectPoiCategory from './examples/wayfinding/SelectPoiCategory';
import SetFavoritePois from './examples/wayfinding/SetFavoritePois';
import {DeviceIdentifier} from './examples/sdk/DeviceIdentifier';
import SelectFloor from './examples/wayfinding/SelectFloor';
import FollowUser from './examples/wayfinding/FollowUser';

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
  useEffect(() => {
    try {
      SitumPlugin.init();
      SitumPlugin.setDashboardURL(SITUM_DASHBOARD_URL);
      SitumPlugin.setApiKey(SITUM_API_KEY);
    } catch (e) {
      console.error(`Situm > example > Could not initialize SDK ${e}`);
    }
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
        {
          title: 'Navigate to POI',
          subtitle:
            'Shows how to trigger the navigation to a concrete POI programmatically that, once computed, will be displayed on the map.',
          key: 'NavigateToPoi',
        },
        {
          title: 'Follow user',
          subtitle: 'Follow user programmatically',
          key: 'FollowUser',
        },
        {
          title: 'Select POI',
          subtitle:
            'Shows how to select a POI programmatically, which is then displayed as selected on the map',
          key: 'SelectPoi',
        },
        {
          title: 'Select POI category',
          subtitle:
            'Shows how to select a POI category programmatically, which is then displayed as selected on the map',
          key: 'SelectPoiCategory',
        },
        {
          title: 'Select Floor',
          subtitle:
            'Shows how to select a floor programmatically, which is then displayed on the map',
          key: 'SelectFloor',
        },
        {
          title: 'Select Favorite Pois',
          subtitle: 'Shows how to set a list of favorite pois',
          key: 'SetFavoritePois',
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
        {
          title: 'Get Device ID',
          subtitle:
            'Retrieve the random Device Identifier that Situm assigns to each geolocation stored in Situm Platform (analytics only).',
          key: 'DeviceIdentifier',
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
            name="InfoFromBuilding"
            component={InfoFromBuilding}
            options={{title: 'Building info multiple calls'}}
          />
          <Stack.Screen name="RouteBetweenPOIs" component={RouteBetweenPOIs} />
          <Stack.Screen
            name="RemoteConfig"
            component={RemoteConfig}
            options={{title: 'Positioning with remote configuration'}}
          />
          <Stack.Screen
            name="SetCacheMaxAge"
            component={SetCacheMaxAge}
            options={{title: 'Max cache age and cache invalidation'}}
          />
          <Stack.Screen
            name="Wayfinding"
            component={Wayfinding}
            options={{title: 'Full Wayfinding'}}
          />
          <Stack.Screen
            name="NavigateToPoi"
            component={NavigateToPoi}
            options={{title: 'Navigate To Poi'}}
          />
          <Stack.Screen
            name="FollowUser"
            component={FollowUser}
            options={{title: 'Follow User'}}
          />
          <Stack.Screen
            name="SelectPoi"
            component={SelectPoi}
            options={{title: 'Select Poi'}}
          />
          <Stack.Screen
            name="SelectPoiCategory"
            component={SelectPoiCategory}
            options={{title: 'Select Poi Category'}}
          />
          <Stack.Screen
            name="SelectFloor"
            component={SelectFloor}
            options={{title: 'Select Floor'}}
          />
          <Stack.Screen
            name="SetFavoritePois"
            component={SetFavoritePois}
            options={{title: 'Select Favorite Pois'}}
          />
          <Stack.Screen
            name="DeviceIdentifier"
            component={DeviceIdentifier}
            options={{title: 'Get Device ID'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;
