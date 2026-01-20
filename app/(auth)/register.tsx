import { PremiumButton } from "@/shared/components/ui/PremiumButton";
import { PremiumInput } from "@/shared/components/ui/PremiumInput";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen() {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!name || !email || !password) return;
    try {
      await register({ name, email, password });
    } catch (err) {
      // Error handled in store
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            padding: 24,
            justifyContent: "center",
          }}
        >
          <View className="mb-8 items-center">
            <Text className="text-3xl font-bold text-text mb-2">
              Create Account
            </Text>
            <Text className="text-base text-textSecondary text-center">
              Start building your professional resume today.
            </Text>
          </View>

          <View className="w-full max-w-[600px] self-center">
            {error && (
              <Text className="text-error mb-4 text-center">{error}</Text>
            )}

            <PremiumInput
              label="Full Name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoComplete="name"
            />

            <PremiumInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />

            <PremiumInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            <View className="mt-4">
              <PremiumButton
                title="Sign Up"
                onPress={handleRegister}
                isLoading={isLoading}
                size="lg"
              />
            </View>

            <PremiumButton
              title="Already have an account? Sign In"
              variant="ghost"
              onPress={() => router.back()}
              style={{ marginTop: 8 }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
