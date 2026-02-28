import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { useAuthStore } from "@/src/store/useAuthStore";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Link } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { OAuthProvider } from "react-native-appwrite";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [oauthLoading, setOauthLoading] = useState<"google" | "github" | null>(
    null,
  );
  const { login, loginWithOAuth, isLoading } = useAuthStore();

  const validate = () => {
    let valid = true;
    setEmailError("");
    setPasswordError("");
    if (!email.trim()) {
      setEmailError("Email is required");
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Enter a valid email address");
      valid = false;
    }
    if (!password) {
      setPasswordError("Password is required");
      valid = false;
    }
    return valid;
  };

  const handleLogin = async () => {
    if (!validate()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await login(email.trim(), password);
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        "Sign In Failed",
        error.message || "Invalid credentials. Please try again.",
      );
    }
  };

  const handleOAuth = async (provider: "google" | "github") => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setOauthLoading(provider);
    try {
      await loginWithOAuth(
        provider === "google" ? OAuthProvider.Google : OAuthProvider.Github,
      );
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        "Sign In Failed",
        error.message || "OAuth sign-in failed. Please try again.",
      );
    } finally {
      setOauthLoading(null);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="items-center pt-14 pb-10 px-8">
            <View className="w-16 h-16 rounded-2xl bg-indigo-600 items-center justify-center mb-6">
              <Ionicons name="document-text" size={32} color="white" />
            </View>
            <Text className="text-4xl font-bold text-white mb-2 tracking-tight">
              Welcome back
            </Text>
            <Text className="text-slate-400 text-base text-center">
              Sign in to your ResuMate account
            </Text>
          </View>

          {/* Form Card */}
          <View className="mx-6 bg-slate-900 rounded-3xl p-6 border border-slate-800">
            <Input
              label="Email Address"
              placeholder="you@example.com"
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                setEmailError("");
              }}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
              leftIcon="mail-outline"
              error={emailError}
            />
            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                setPasswordError("");
              }}
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleLogin}
              leftIcon="lock-closed-outline"
              error={passwordError}
            />
            <TouchableOpacity className="self-end -mt-2 mb-5">
              <Text className="text-indigo-400 text-sm font-medium">
                Forgot password?
              </Text>
            </TouchableOpacity>
            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={isLoading}
              size="lg"
              className="w-full"
            />
          </View>

          {/* Divider */}
          <View className="flex-row items-center mx-6 my-6">
            <View className="flex-1 h-px bg-slate-800" />
            <Text className="text-slate-500 px-4 text-sm">or</Text>
            <View className="flex-1 h-px bg-slate-800" />
          </View>

          {/* Social buttons */}
          <View className="flex-row mx-6 gap-3">
            <TouchableOpacity
              disabled={oauthLoading !== null || isLoading}
              className="flex-1 flex-row items-center justify-center gap-2 bg-slate-800 border border-slate-700 rounded-xl py-3.5"
              style={{ opacity: oauthLoading !== null ? 0.65 : 1 }}
              onPress={() => handleOAuth("google")}
            >
              {oauthLoading === "google" ? (
                <ActivityIndicator size="small" color="#EA4335" />
              ) : (
                <Ionicons name="logo-google" size={20} color="#EA4335" />
              )}
              <Text className="text-white font-semibold">Google</Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={oauthLoading !== null || isLoading}
              className="flex-1 flex-row items-center justify-center gap-2 bg-slate-800 border border-slate-700 rounded-xl py-3.5"
              style={{ opacity: oauthLoading !== null ? 0.65 : 1 }}
              onPress={() => handleOAuth("github")}
            >
              {oauthLoading === "github" ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Ionicons name="logo-github" size={20} color="white" />
              )}
              <Text className="text-white font-semibold">GitHub</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="flex-row justify-center mt-8 mb-8">
            <Text className="text-slate-500">Don't have an account? </Text>
            <Link href="/(auth)/sign-up" asChild>
              <TouchableOpacity>
                <Text className="text-indigo-400 font-bold">Sign Up Free</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
