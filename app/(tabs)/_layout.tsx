import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const activeColor = "#D4AF37"; // GOLD
  const inactiveColor = "#625b5bff";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#EEEEEE",
          height: 65,
          paddingBottom: 10,
          paddingTop: 5,
        },
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
          marginTop: -4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Display",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="monitor-dashboard" color={color} size={20} />
          ),
        }}
      />
      <Tabs.Screen
        name="setup"
        options={{
          title: "Setup",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cog" color={color} size={20} />
          ),
        }}
      />
    </Tabs>
  );
}
