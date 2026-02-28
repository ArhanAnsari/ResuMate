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

const getPasswordStrength = (pw: string) => {
  if (pw.length === 0) return { label: "", color: "#475569", pct: 0 };
  if (pw.length < 6) return { label: "Weak", color: "#EF4444", pct: 25 };
  if (pw.length < 10) return { label: "Fair", color: "#F59E0B", pct: 50 };
  if (/[A-Z]/.test(pw) && /[0-9]/.test(pw))
    return { label: "Strong", color: "#10B981", pct: 100 };
  return { label: "Good", color: "#4F46E5", pct: 75 };
};

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [oauthLoading, setOauthLoading] = useState<"google" | "github" | null>(
    null,
  );
  const { register, loginWithOAuth, isLoading } = useAuthStore();
  const strength = getPasswordStrength(password);

  const validate = () => {
    let valid = true;
    setNameError("");
    setEmailError("");
    setPasswordError("");
    if (!name.trim()) {
      setNameError("Full name is required");
      valid = false;
    }
    if (!email.trim()) {
      setEmailError("Email is required");
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Enter a valid email");
      valid = false;
    }
    if (!password) {
      setPasswordError("Password is required");
      valid = false;
    } else if (password.length < 8) {
      setPasswordError("Minimum 8 characters");
      valid = false;
    }
    return valid;
  };

  const handleRegister = async () => {
    if (!validate()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await register(email.trim(), password, name.trim());
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Registration Failed", error.message || "Please try again.");
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
        "Sign Up Failed",
        error.message || "OAuth sign-up failed. Please try again.",
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
            <View className="w-16 h-16 rounded-2xl bg-violet-600 items-center justify-center mb-6">
              <Ionicons name="rocket" size={32} color="white" />
            </View>
            <Text className="text-4xl font-bold text-white mb-2 tracking-tight">
              Create account
            </Text>
            <Text className="text-slate-400 text-base text-center">
              Join ResuMate — free to start
            </Text>
          </View>

          {/* Form Card */}
          <View className="mx-6 bg-slate-900 rounded-3xl p-6 border border-slate-800">
            <Input
              label="Full Name"
              placeholder="John Doe"
              value={name}
              onChangeText={(t) => {
                setName(t);
                setNameError("");
              }}
              leftIcon="person-outline"
              returnKeyType="next"
              error={nameError}
            />
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
              placeholder="Minimum 8 characters"
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                setPasswordError("");
              }}
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleRegister}
              leftIcon="lock-closed-outline"
              error={passwordError}
            />

            {/* Password strength meter */}
            {password.length > 0 && (
              <View className="-mt-2 mb-4">
                <View className="h-1.5 rounded-full bg-slate-700 overflow-hidden">
                  <View
                    style={{
                      width: `${strength.pct}%`,
                      backgroundColor: strength.color,
                      height: "100%",
                      borderRadius: 9999,
                    }}
                  />
                </View>
                <Text
                  className="text-xs mt-1 ml-0.5 font-medium"
                  style={{ color: strength.color }}
                >
                  {strength.label}
                </Text>
              </View>
            )}

            <Button
              title="Create Account"
              onPress={handleRegister}
              loading={isLoading}
              size="lg"
              className="w-full"
            />
            <Text className="text-slate-500 text-xs text-center mt-4">
              By signing up you agree to our Terms & Privacy Policy
            </Text>
          </View>
          {/* Divider */}
          <View className="flex-row items-center mx-6 my-6">
            <View className="flex-1 h-px bg-slate-800" />
            <Text className="text-slate-500 px-4 text-sm">or</Text>
            <View className="flex-1 h-px bg-slate-800" />
          </View>

          {/* OAuth buttons */}
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
            <Text className="text-slate-500">Already have an account? </Text>
            <Link href="/(auth)/sign-in" asChild>
              <TouchableOpacity>
                <Text className="text-indigo-400 font-bold">Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
