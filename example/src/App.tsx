import * as React from 'react';
import {View, useColorScheme, StyleSheet, ScrollView, Text} from 'react-native';
import {Card, List, PaperProvider, TouchableRipple} from 'react-native-paper';
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
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {},
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
      title: 'UI',
      screens: [
        {
          title: 'Full wayfinding',
          subtitle:
            'Easy to integrate full experience of wayfinding implemented by Situm',
          key: 'Wayfinding',
          icon: '',
        },
        {
          title: 'Draw a building on top of a map',
          subtitle:
            'Basic example that renders a building on top of Google Maps',
          key: 'ShowBuildingOnMap',
          icon: '',
        },
        {
          title: 'Draw a route between 2 POIs on a map',
          subtitle: 'Calculates and shows on a map a route between two POI',
          key: 'RouteBetweenPOIs',
          icon: '',
        },
        {
          title: 'Draw route between POIs',
          subtitle: '',
          key: 'DrawRouteBetweenPOIs',
          icon: '',
        },
        {
          title: 'Draw pois with custom icons on a map',
          subtitle: '',
          key: 'GetPoisIcons',
          icon: '',
        },
        {
          title: 'Draw a building with tiles on a map',
          subtitle: '',
          key: 'TiledBuilding',
          icon: '',
        },
      ],
    },
    {
      title: 'Primitives',
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
          title: 'Show buildings basic info',
          subtitle:
            'Example that fetches and shows the list of buildings in your account',
          key: 'BuildingsBasicInfo',
          icon: '',
        },
        {
          title: 'Show a building full info from different calls',
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
          <List.Section title={item.title} key={item.title}>
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
                    titleStyle={{...styles.title}}
                    subtitle={screen.subtitle}
                    subtitleStyle={styles.subtitle}
                  />
                </TouchableRipple>
                {/* <Card.Content>
              <TextComponent>
                This is a pressable chameleon. If you press me, I will alert.
              </TextComponent>
            </Card.Content> */}
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
          <Stack.Screen name="Positioning" component={PositioningScreen} />
          <Stack.Screen
            name="BuildingsBasicInfo"
            component={BuildingsBasicInfo}
          />
          <Stack.Screen name="BuildingFullInfo" component={BuildingFullInfo} />
          <Stack.Screen
            name="ShowBuildingOnMap"
            component={ShowBuildingOnMap}
          />
          <Stack.Screen name="InfoFromBuilding" component={InfoFromBuilding} />
          <Stack.Screen name="RouteBetweenPOIs" component={RouteBetweenPOIs} />
          <Stack.Screen
            name="DrawRouteBetweenPOIs"
            component={DrawRouteBetweenPOIs}
          />
          <Stack.Screen name="RemoteConfig" component={RemoteConfig} />
          <Stack.Screen name="GetPoisIcons" component={GetPoisIcons} />
          <Stack.Screen name="SetCacheMaxAge" component={SetCacheMaxAge} />
          <Stack.Screen name="TiledBuilding" component={TiledBuilding} />
          <Stack.Screen name="Wayfinding" component={Wayfinding} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;
