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
          borderTopColor: "#333333",
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Display",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="monitor-dashboard" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="setup"
        options={{
          title: "Setup",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
