import React from "react";
import { Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import WalletDashboard from "../screens/wallet/WalletDashboard";
import VerificationDashboard from "../screens/verification/VerificationDashboard";
import BorrowScreen from "../screens/BorrowScreen";

const Tab = createBottomTabNavigator();

const ORANGE = "#FF6600";
const MUTED = "#52525B";

function TabIcon({ symbol, focused }) {
  return (
    <Text style={{ fontSize: 18, color: focused ? ORANGE : MUTED, lineHeight: 22 }}>
      {symbol}
    </Text>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#000",
          borderTopWidth: 1,
          borderTopColor: "#1A1A1A",
          height: 64,
          paddingBottom: 10,
          paddingTop: 6,
        },
        tabBarActiveTintColor: ORANGE,
        tabBarInactiveTintColor: MUTED,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          letterSpacing: 0.5,
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen
        name="Wallet"
        component={WalletDashboard}
        options={{ tabBarIcon: ({ focused }) => <TabIcon symbol="◈" focused={focused} /> }}
      />
      <Tab.Screen
        name="Verify"
        component={VerificationDashboard}
        options={{ tabBarIcon: ({ focused }) => <TabIcon symbol="◎" focused={focused} /> }}
      />
      <Tab.Screen
        name="Borrow"
        component={BorrowScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon symbol="◇" focused={focused} /> }}
      />
    </Tab.Navigator>
  );
}
