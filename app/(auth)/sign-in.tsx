import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { useAuthStore } from "@/src/store/useAuthStore";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useAuthStore();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      await login(email, password);
      // Router redirection is handled in root layout
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900 px-6 justify-center">
      <View>
        <Text className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Welcome Back
        </Text>
        <Text className="text-slate-500 mb-8">
          Sign in to access your resumes
        </Text>

        <Input
          label="Email Address"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Input
          label="Password"
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Button
          title="Sign In"
          onPress={handleLogin}
          loading={isLoading}
          className="mt-4"
        />

        <View className="flex-row justify-center mt-6">
          <Text className="text-slate-500">Don't have an account? </Text>
          <Link href="/(auth)/sign-up" asChild>
            <Text className="text-blue-600 font-semibold">Sign Up</Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
