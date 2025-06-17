import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tabIconSelected,
        tabBarInactiveTintColor: Colors[colorScheme ?? "light"].tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: isDark ? 0.3 : 0.1,
          shadowRadius: 20,
          height: Platform.OS === "ios" ? 88 : 68,
          paddingBottom: Platform.OS === "ios" ? 28 : 12,
          paddingTop: 12,
          ...Platform.select({
            ios: {
              position: "absolute",
            },
            default: {},
          }),
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={focused ? 26 : 24}
              name="house.fill"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="personality"
        options={{
          title: "Personality",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={focused ? 26 : 24}
              name="person.crop.circle.fill"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={focused ? 26 : 24}
              name="gearshape.fill"
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
