import * as React from 'react';
import {View, useColorScheme, StyleSheet, ScrollView, Text} from 'react-native';
import {
  Avatar,
  Card,
  List,
  PaperProvider,
  TouchableRipple,
} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SitumPlugin from '@situm/react-native';

import {SITUM_EMAIL, SITUM_API_KEY, SITUM_DASHBOARD_URL} from './situm';
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

function initSitumSdk() {
  SitumPlugin.initSitumSDK();
  SitumPlugin.setDashboardURL(SITUM_DASHBOARD_URL, (response: any) => {
    console.log(
      `Set dashboard url to [${SITUM_DASHBOARD_URL}]: ${JSON.stringify(
        response,
      )}`,
    );
  });
  SitumPlugin.setApiKey(
    SITUM_EMAIL,
    SITUM_API_KEY,
    (response: {success: any}) => {
      console.log(`Authenticated Succesfully: ${response.success}`);
    },
  );
  SitumPlugin.setCacheMaxAge(1, (response: {success: any}) => {
    console.log(`Cache Age: ${response.success}`);
  });
  SitumPlugin.sdkVersions((response: any) => {
    console.log(`VERSIONS: ${JSON.stringify(response)}`);
  });
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
});

const HomeScreen = ({navigation}) => {
  React.useEffect(() => {
    initSitumSdk();
  }, []);

  const screensAndSections = [
    {
      title: 'Examples rendered on a map',
      screens: [
        {
          title: 'Full wayfinding experience',
          subtitle:
            'Easy to integrate full experience of wayfinding implemented by Situm',
          key: 'Wayfinding',
          // icon: 'dots-vertical',
        },
        {
          title: 'Draw a building on top of a map',
          subtitle:
            'Basic example that renders a building on top of Google Maps',
          key: 'ShowBuildingOnMap',
          icon: '',
        },

        {
          title: 'Draw route between POIs',
          subtitle:
            'Renders the route calculated using our SDK between to POIs on your building on top of a map',
          key: 'DrawRouteBetweenPOIs',
          icon: '',
        },
        {
          title: 'Draw pois with custom icons on a map',
          subtitle:
            'This example renders your building POIs as markers on a map',
          key: 'GetPoisIcons',
          icon: '',
        },
        {
          title: 'Draw a building with tiles on a map',
          subtitle: 'Show a building on a map using map tiels.',
          key: 'TiledBuilding',
          icon: '',
        },
      ],
    },
    {
      title: 'Examples of RAW api calls (JSON)',
      screens: [
        {
          title: 'Positioning',
          subtitle:
            'Example that ilustrates how to start/stop the Situm indoor positioning',
          key: 'Positioning',
          icon: '',
        },
        {
          title: 'Positioning with remote configuration',
          subtitle:
            'This example shows how to start positioning using the remote configuration feature',
          key: 'RemoteConfig',
          icon: '',
        },
        {
          title: 'Buildings basic info',
          subtitle:
            'Fetches the buildings available on your account and shows them in RAW format',
          key: 'BuildingsBasicInfo',
          icon: '',
        },
        {
          title: 'Building full information using different calls',
          subtitle:
            'Example that fetches and shows all the information of a building. Information fetched using differente calls to our API',
          key: 'BuildingFullInfo',
          icon: '',
        },
        {
          title: "Building's full information",
          subtitle: 'Shows the building full information on RAW text',
          key: 'InfoFromBuilding',
          icon: '',
        },
        {
          title: 'Set cache max age and invalidate it',
          subtitle:
            'Example that shows how to set a custom max age to the cache elements.',
          key: 'SetCacheMaxAge',
          icon: '',
        },
        {
          title: 'Calculate route between two POIs on RAW format',
          subtitle:
            'Calculates and shows on RAW format a route between two POI',
          key: 'RouteBetweenPOIs',
          icon: '',
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
            titleStyle={{fontSize: 20}}
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
                    style={{paddingVertical: 16}}
                    left={props => {
                      return screen.icon ? (
                        <Avatar.Icon {...props} icon={screen.icon} />
                      ) : (
                        false
                      );
                    }}
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
