import "@/global.css";
import { ToastProvider } from "@/src/context/ToastContext";
import { useAuthStore } from "@/src/store/useAuthStore";
import * as Sentry from "@sentry/react-native";
import * as Notifications from "expo-notifications";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
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

// Initialize Notification Handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

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
          <Stack screenOptions={{ headerShown: false }} />
          <StatusBar style="auto" />
        </ToastProvider>
      </CopilotProvider>
    </GestureHandlerRootView>
  );
}
