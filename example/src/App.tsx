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
import {
  SitumConfigProvider,
  useSitumConfig,
} from "./config/SitumConfigContext";

const AppContent = (): React.JSX.Element => {
  const { apiKey, apiDomain } = useSitumConfig();

  return (
    <NavigationContainer>
      {/**
       * Make sure to authenticate with `SitumProvider.apiKey` before using SitumPlugin methods
       * or rendering MapView component.
       */}
      <SitumProvider apiKey={apiKey} apiDomain={apiDomain}>
        <StatusBar barStyle="dark-content" />
        <TabNavigator />
      </SitumProvider>
    </NavigationContainer>
  );
};

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <SitumConfigProvider>
        <AppContent />
      </SitumConfigProvider>
    </SafeAreaProvider>
  );
}

export default App;
