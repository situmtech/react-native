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
import { StackNavigator } from "./navigation/StackNavigator";
import SitumPlugin from "@situm/react-native";
import { SITUM_API_KEY, SITUM_DASHBOARD_URL } from "./situm";
import { WebViewProvider } from "@situm/react-native";

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
      <WebViewProvider>
        <NavigationContainer>
          <StackNavigator />
        </NavigationContainer>
      </WebViewProvider>
    </SafeAreaProvider>
  );
}

export default App;
