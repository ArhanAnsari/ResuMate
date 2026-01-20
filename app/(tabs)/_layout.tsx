import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useColorScheme } from "nativewind";
import React from "react";

import { Colors } from "@/constants/theme";

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const theme = colorScheme ?? "light";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[theme].tint,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme === "dark" ? "#000" : "#fff",
          borderTopColor: theme === "dark" ? "#333" : "#e5e5e5",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Builder",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={24}
              name={focused ? "construct" : "construct-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="resumes"
        options={{
          title: "My Resumes",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={24}
              name={focused ? "documents" : "documents-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={24}
              name={focused ? "person" : "person-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
