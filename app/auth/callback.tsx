import { appwrite } from "@/src/services/appwrite/client";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * OAuth callback screen.
 *
 * Appwrite redirects back to `resumate://auth/callback?userId=...&secret=...`
 * after the user authenticates in the browser. expo-router routes that deep link
 * here. We exchange the one-time userId+secret for a real session, then let the
 * root layout's auth effect redirect the user to the main app.
 */
export default function OAuthCallback() {
  const { userId, secret } = useLocalSearchParams<{
    userId: string;
    secret: string;
  }>();
  const { initialize } = useAuthStore();
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId || !secret) {
      // No credentials in URL — user may have cancelled or the URL was wrong
      router.replace("/(auth)/sign-in");
      return;
    }

    (async () => {
      try {
        // Exchange the one-time token pair for a persistent session
        await appwrite.account.createSession(
          userId as string,
          secret as string,
        );
        // initialize() fetches the current user and sets isAuthenticated: true
        // which triggers the _layout.tsx effect → router.replace("/(app)/(tabs)")
        await initialize();
      } catch (err: any) {
        setError(err?.message || "Authentication failed. Please try again.");
        setTimeout(() => router.replace("/(auth)/sign-in"), 2500);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-slate-950 items-center justify-center gap-5">
      {error ? (
        <>
          <View className="w-14 h-14 rounded-full bg-red-900/40 items-center justify-center">
            <Text className="text-3xl">✕</Text>
          </View>
          <Text className="text-red-400 text-sm text-center px-8">{error}</Text>
          <Text className="text-slate-500 text-xs">
            Redirecting to sign in…
          </Text>
        </>
      ) : (
        <>
          <View className="w-14 h-14 rounded-full bg-indigo-900/40 items-center justify-center">
            <ActivityIndicator size="large" color="#4F46E5" />
          </View>
          <Text className="text-slate-300 text-base font-semibold">
            Completing sign in…
          </Text>
          <Text className="text-slate-500 text-sm">Just a moment</Text>
        </>
      )}
    </SafeAreaView>
  );
}
