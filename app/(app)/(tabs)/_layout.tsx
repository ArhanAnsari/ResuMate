import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform, View, useColorScheme } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
          borderTopColor: isDark ? "#1E293B" : "#F1F5F9",
          borderTopWidth: 1,
          height: Platform.OS === "ios" ? 84 : 64,
          paddingBottom: Platform.OS === "ios" ? 24 : 8,
          paddingTop: 8,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: "#4F46E5",
        tabBarInactiveTintColor: isDark ? "#475569" : "#94A3B8",
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Resumes",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "document-text" : "document-text-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: "#4F46E5",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: Platform.OS === "ios" ? 0 : 4,
                shadowColor: "#4F46E5",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.35,
                shadowRadius: 8,
                elevation: 6,
              }}
            >
              <Ionicons name="add" size={24} color="white" />
            </View>
          ),
          tabBarLabelStyle: {
            color: "#4F46E5",
            fontSize: 11,
            fontWeight: "600",
          },
        }}
      />
      <Tabs.Screen
        name="ai"
        options={{
          title: "AI Hub",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "sparkles" : "sparkles-outline"}
              size={22}
              color={focused ? "#7C3AED" : color}
            />
          ),
          tabBarActiveTintColor: "#7C3AED",
        }}
      />
      <Tabs.Screen
        name="plan"
        options={{
          title: "Plans",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "diamond" : "diamond-outline"}
              size={22}
              color={focused ? "#7C3AED" : color}
            />
          ),
          tabBarActiveTintColor: "#7C3AED",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
