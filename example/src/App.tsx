import * as React from 'react';
import {View, FlatList, TouchableHighlight, Button} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SitumPlugin from '@situm/react-native';
import {SITUM_EMAIL, SITUM_API_KEY, SITUM_DASHBOARD_URL} from './situm';
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
  SitumPlugin.setDashboardURL(SITUM_DASHBOARD_URL, response => {
    console.log(
      `Set dashboard url to [${SITUM_DASHBOARD_URL}]: ${JSON.stringify(
        response,
      )}`,
    );
  });
  SitumPlugin.setApiKey(SITUM_EMAIL, SITUM_API_KEY, response => {
    console.log(`Authenticated Succesfully: ${response.success}`);
  });
  SitumPlugin.setCacheMaxAge(1, response => {
    console.log(`Cache Age: ${response.success}`);
  });
  SitumPlugin.sdkVersions(response => {
    console.log(`VERSIONS: ${JSON.stringify(response)}`);
  });
}

const HomeScreen = ({navigation}) => {
  React.useEffect(() => {
    initSitumSdk();
  }, []);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <FlatList
        //Example screens
        data={[
          {title: 'Positioning', key: 'Positioning'},
          {
            title: 'Positioning with remote configuration',
            key: 'RemoteConfig',
          },
          {title: 'Show buildings basic info', key: 'BuildingsBasicInfo'},
          {
            title: 'Show a building full info from different calls',
            key: 'BuildingFullInfo',
          },
          {
            title: 'Draw a building on top of Google Maps',
            key: 'ShowBuildingOnMap',
          },
          {title: "Show a building's full info", key: 'InfoFromBuilding'},
          {title: 'Show the route between 2 POIs', key: 'RouteBetweenPOIs'},
          {
            title: 'Draw route between POIs',
            key: 'DrawRouteBetweenPOIs',
          },
          {
            title: 'Draw pois with custom icons',
            key: 'GetPoisIcons',
          },
          {
            title: 'Set cache max age and invalidate it',
            key: 'SetCacheMaxAge',
          },
          {
            title: 'Show building with tiles',
            key: 'TiledBuilding',
          },
          {
            title: 'Wayfinding',
            key: 'Wayfinding',
          },
        ]}
        renderItem={({item, index, separators}) => (
          <TouchableHighlight key={item.key}>
            <View>
              <Button
                title={item.title}
                onPress={() => navigation.navigate(item.key)}
              />
            </View>
          </TouchableHighlight>
        )}
      />
    </View>
  );
};

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Positioning" component={PositioningScreen} />
        <Stack.Screen
          name="BuildingsBasicInfo"
          component={BuildingsBasicInfo}
        />
        <Stack.Screen name="BuildingFullInfo" component={BuildingFullInfo} />
        <Stack.Screen name="ShowBuildingOnMap" component={ShowBuildingOnMap} />
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
  );
}

export default App;
