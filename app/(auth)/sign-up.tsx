import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { useAuthStore } from "@/src/store/useAuthStore";
import { Link } from "expo-router";
import { useState } from "react";
import { Alert, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register, isLoading } = useAuthStore();

  const handleRegister = async () => {
    if (!email || !password || !name) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      await register(email, password, name);
    } catch (error: any) {
      Alert.alert("Registration Failed", error.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900 px-6 justify-center">
      <View>
        <Text className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Create Account
        </Text>
        <Text className="text-slate-500 mb-8">
          Start building your perfect resume
        </Text>

        <Input
          label="Full Name"
          placeholder="John Doe"
          value={name}
          onChangeText={setName}
        />

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
          title="Create Account"
          onPress={handleRegister}
          loading={isLoading}
          className="mt-4"
        />

        <View className="flex-row justify-center mt-6">
          <Text className="text-slate-500">Already have an account? </Text>
          <Link href="/(auth)/sign-in" asChild>
            <Text className="text-blue-600 font-semibold">Sign In</Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
