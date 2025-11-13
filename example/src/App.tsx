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
import { SITUM_API_KEY, SITUM_API_DOMAIN } from "./situm";

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {/**
         * Make sure to authenticate with `SitumProvider.apiKey` before using SitumPlugin methods
         * or rendering MapView component.
         */}
        <SitumProvider apiKey={SITUM_API_KEY} apiDomain={SITUM_API_DOMAIN}>
          <StatusBar barStyle="dark-content" />
          <TabNavigator />
        </SitumProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
