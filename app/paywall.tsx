import { Redirect } from "expo-router";

// Paywall removed — ResuMate is now 100% free for everyone 🎉
export default function PaywallScreen() {
  return <Redirect href="/(app)/(tabs)/plan" />;
}
