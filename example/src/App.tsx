/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TabNavigator } from "./navigation/TabNavigator";
import { SitumProvider } from "@situm/react-native";
import { StatusBar } from "react-native";
import { SITUM_API_KEY, SITUM_DASHBOARD_URL } from "./situm";

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      {/** Make sure to authenticate with `SitumProvider.apiKey` at the root of your app */}
      <SitumProvider apiKey={SITUM_API_KEY} dashboardUrl={SITUM_DASHBOARD_URL}>
        <NavigationContainer>
          <StatusBar barStyle="dark-content" />
          <TabNavigator />
        </NavigationContainer>
      </SitumProvider>
    </SafeAreaProvider>
  );
}

export default App;
