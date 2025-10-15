/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TabNavigator } from "./navigation/TabNavigator";
import SitumPlugin from "@situm/react-native";
import { SITUM_API_KEY, SITUM_DASHBOARD_URL } from "./situm";
import { StatusBar } from "react-native";

function App(): React.JSX.Element {
  useEffect(() => {
    try {
      SitumPlugin.init();
      SitumPlugin.setDashboardURL(SITUM_DASHBOARD_URL);
      SitumPlugin.setApiKey(SITUM_API_KEY);
      // Automatically manage positioning permissions and sensor issues:
      SitumPlugin.enableUserHelper();
    } catch (e) {
      console.error(`Situm > example > Could not initialize SDK ${e}`);
    }
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" />
        <TabNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
