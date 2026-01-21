import "@/global.css";
import { useAuthStore } from "@/src/store/useAuthStore";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View } from "react-native";

export default function RootLayout() {
  const { isAuthenticated, initialize, isLoading } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inAppGroup = segments[0] === "(app)";

    if (isAuthenticated && !inAppGroup) {
      router.replace("/(app)/(tabs)");
    } else if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/sign-in");
    }
  }, [isAuthenticated, segments, isLoading]);

  if (isLoading) {
    return <View className="flex-1 bg-slate-50 dark:bg-slate-950" />;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="auto" />
    </>
  );
}
