import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LanguageSelectionScreen from "../screens/LanguageSelectionScreen";
import LandingScreen from "../screens/LandingScreen";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import MainTabs from "./MainTabs";

const Stack = createNativeStackNavigator();

const HEADER_OPTS = {
  headerTitleAlign: "center",
  headerStyle: { backgroundColor: "#000" },
  headerTintColor: "#FF6600",
  headerTitleStyle: { fontWeight: "700", fontSize: 16 },
  headerBackTitleVisible: false,
  headerShadowVisible: false,
};

export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="LanguageSelection" screenOptions={HEADER_OPTS}>
      <Stack.Screen
        name="LanguageSelection"
        component={LanguageSelectionScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Landing"
        component={LandingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: "Verify Identity" }}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{ title: "Create Account" }}
      />
      <Stack.Screen
        name="Main"
        component={MainTabs}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
