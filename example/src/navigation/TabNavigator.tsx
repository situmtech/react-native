import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { HomeScreen } from "../screens/HomeScreen";
import { WayfindingScreen } from "../screens/WayfindingScreen";
import { Colors } from "../SharedStyles";
import { RootTabsParamsList } from "./types";

const Tab = createBottomTabNavigator<RootTabsParamsList>(); // See types.tsx.

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#fff",
          elevation: 0, // Remove shadow on Android
          shadowOpacity: 0, // Remove shadow on iOS
          borderBottomWidth: 1,
          borderBottomColor: "#f0f0f0",
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: "600",
          color: Colors.primary,
        },
        tabBarStyle: {
          borderTopColor: "#f0f0f0",
          backgroundColor: Colors.white,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: "#8E8E93",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Home",
          headerTitle: "@situm/react-native",
          headerLeft: () => (
            <MaterialCommunityIcons
              name="navigation-variant-outline"
              size={24}
              color={Colors.primary}
              style={{ marginLeft: 15 }}
            />
          ),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="home-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Wayfinding"
        component={WayfindingScreen}
        options={{
          title: "Wayfinding",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="map" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
