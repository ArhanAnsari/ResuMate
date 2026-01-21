import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { AIService } from "@/src/services/ai/gemini";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
  const { user, logout } = useAuthStore();
  const [apiKey, setApiKey] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Only attempt to load the key if the user is authenticated.
    // This prevents passing undefined user IDs to underlying services/DBs.
    if (user) {
      loadKey();
    }
  }, [user]);

  const loadKey = async () => {
    try {
      const key = await AIService.getApiKey();
      if (key) setApiKey(key);
    } catch (error) {
      console.warn("Failed to load API key:", error);
    }
  };

  const handleSaveKey = async () => {
    if (!apiKey.trim()) {
      Alert.alert("Error", "Please enter a valid API key");
      return;
    }

    setIsSaving(true);
    try {
      await AIService.setApiKey(apiKey);
      Alert.alert("Success", "API Key saved!");
    } catch (error) {
      Alert.alert("Error", "Failed to save API Key");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: logout },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900 px-6 pt-10">
      <Text className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
        Settings
      </Text>
      <Text className="text-slate-500 mb-8">
        Manage your account and preferences
      </Text>

      <View className="mb-8">
        <Text className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
          AI Configuration
        </Text>
        <Input
          label="Gemini API Key"
          placeholder="Paste your API Key here"
          value={apiKey}
          onChangeText={setApiKey}
          secureTextEntry
          autoCapitalize="none"
        />
        <Button
          title="Save API Key"
          onPress={handleSaveKey}
          loading={isSaving}
          variant="outline"
        />
        <Text className="text-xs text-slate-400 mt-2">
          Required for AI features. Get one from Google AI Studio.
        </Text>
      </View>

      <View className="mt-auto mb-8">
        <Text className="text-center text-slate-400 mb-4">
          Logged in as {user?.email}
        </Text>
        <Button title="Sign Out" onPress={handleLogout} variant="secondary" />
      </View>
    </SafeAreaView>
  );
}
