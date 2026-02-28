import "@/global.css";
import { ToastProvider } from "@/src/context/ToastContext";
import { useAuthStore } from "@/src/store/useAuthStore";
import { usePlanStore } from "@/src/store/usePlanStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Sentry from "@sentry/react-native";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { CopilotProvider } from "react-native-copilot";
import { GestureHandlerRootView } from "react-native-gesture-handler";

Sentry.init({
  dsn: "https://e1e6c042928f81e715b24e2ed8fcfa9b@o4508228539645952.ingest.us.sentry.io/4510764539183104",

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration({
      colorScheme: "dark",
    }),
  ],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

// Initialize Notification Handler — local notifications still work in dev builds.
// Expo Go SDK 53 removed remote push support; guard to prevent startup error.
if (Constants.appOwnership !== "expo") {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export default function RootLayout() {
  const { isAuthenticated, initialize, isLoading } = useAuthStore();
  const { initPurchases } = usePlanStore();
  const router = useRouter();
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(false);

  useEffect(() => {
    initialize();
    AsyncStorage.getItem("resumate_onboarding_done").then((val) => {
      setOnboardingDone(val === "true");
      setOnboardingChecked(true);
    });
  }, []);

  // Initialize RevenueCat once the user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const { user } = useAuthStore.getState();
      initPurchases(user?.$id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Navigate based purely on auth/onboarding state.
  // Do NOT include `segments` or `router` as deps — doing so causes an infinite
  // loop because router.replace() changes segments, re-firing this effect.
  useEffect(() => {
    if (isLoading || !onboardingChecked) return;

    if (!onboardingDone) {
      router.replace("/onboarding");
      return;
    }

    if (isAuthenticated) {
      router.replace("/(app)/(tabs)");
    } else {
      router.replace("/(auth)/sign-in");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isLoading, onboardingChecked, onboardingDone]);

  if (isLoading || !onboardingChecked) {
    return <View className="flex-1 bg-slate-950" />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <CopilotProvider
        tooltipStyle={{
          backgroundColor: "#1E293B",
          borderRadius: 12,
          paddingTop: 16,
        }}
        stepNumberComponent={() => null}
        labels={{
          skip: "Skip",
          previous: "Back",
          next: "Next",
          finish: "Got it!",
        }}
      >
        <ToastProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="onboarding" options={{ animation: "fade" }} />
            <Stack.Screen
              name="auth/callback"
              options={{ animation: "fade" }}
            />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(app)" />
            <Stack.Screen name="index" />
          </Stack>
          <StatusBar style="auto" />
        </ToastProvider>
      </CopilotProvider>
    </GestureHandlerRootView>
  );
}
