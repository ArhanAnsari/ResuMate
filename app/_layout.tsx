import "@/global.css";
import "@/src/core/config/ignoreWarnings";
import { useAuthStore } from "@/store/authStore";
import {
  Slot,
  useRootNavigationState,
  useRouter,
  useSegments,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

function useProtectedRoute(isAuthenticated: boolean) {
  const segments = useSegments();
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    if (!rootNavigationState?.key) return;

    const timeout = setTimeout(() => {
      const inAuthGroup = segments[0] === "(auth)";

      if (
        // If the user is not signed in and the initial segment is not anything in the auth group.
        !isAuthenticated &&
        !inAuthGroup
      ) {
        // Redirect to the sign-in page.
        router.replace("/login");
      } else if (isAuthenticated && inAuthGroup) {
        // Redirect away from the sign-in page.
        router.replace("/(tabs)");
      }
    }, 0);

    return () => clearTimeout(timeout);
  }, [isAuthenticated, segments, rootNavigationState]);
}

export default function RootLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  // We might want a dedicated 'isHydrated' state if using persist,
  // but for now, we assume swift storage access or default false triggers login.

  useProtectedRoute(isAuthenticated);

  return (
    <>
      <Slot />
      <StatusBar style="dark" />
    </>
  );
}
