import React from "react";
import { HomeScreen } from "../screens/HomeScreen";
import { WayfindingScreen } from "../screens/WayfindingScreen";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

export const StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Wayfinding" component={WayfindingScreen} />
    </Stack.Navigator>
  );
};
