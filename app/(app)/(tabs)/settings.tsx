import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { useToast } from "@/src/context/ToastContext";
import { AIService } from "@/src/services/ai/gemini";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useProfileStore } from "@/src/store/useProfileStore";
import { useSettingsStore } from "@/src/store/useSettingsStore";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
  const { user, logout } = useAuthStore();
  const { profile, fetchProfile } = useProfileStore();
  const { hapticsEnabled, toggleHaptics } = useSettingsStore();
  const { showToast } = useToast();
  const router = useRouter();
  const [apiKey, setApiKey] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadKey();
      if (user.$id) fetchProfile(user.$id);
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
      showToast("Please enter a valid API key", "error");
      return;
    }

    if (hapticsEnabled)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsSaving(true);
    try {
      await AIService.setApiKey(apiKey);
      showToast("API Key saved successfully", "success");
    } catch (error) {
      showToast("Failed to save API Key", "error");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    if (hapticsEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert("Sign Out", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: logout },
    ]);
  };

  const handleToggleHaptics = () => {
    toggleHaptics();
    if (!hapticsEnabled) Haptics.selectionAsync(); // Provide feedback when enabling
  };

  const SectionHeader = ({ title }: { title: string }) => (
    <Text className="text-sm font-bold text-slate-500 uppercase mb-3 ml-1 mt-6">
      {title}
    </Text>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
      <View className="px-6 pt-6 pb-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <Text className="text-3xl font-bold text-slate-900 dark:text-white">
          Settings
        </Text>
      </View>

      <ScrollView className="flex-1 px-6">
        <SectionHeader title="Account" />
        <View className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 mb-2">
          <TouchableOpacity
            onPress={() => router.push("/profile")}
            className="flex-row justify-between items-center p-4"
          >
            <View className="flex-row items-center gap-3">
              {profile?.avatarUrl ? (
                <Image
                  source={{ uri: profile.avatarUrl }}
                  className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 border border-slate-100 dark:border-slate-700"
                  contentFit="cover"
                  transition={500}
                />
              ) : (
                <View className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full w-12 h-12 items-center justify-center">
                  <Text className="text-lg font-bold text-purple-600 dark:text-purple-400">
                    {profile?.fullName?.[0]?.toUpperCase() ||
                      user?.name?.[0]?.toUpperCase() ||
                      "U"}
                  </Text>
                </View>
              )}
              <View>
                <Text className="text-base font-bold text-slate-900 dark:text-white">
                  {profile?.fullName || user?.name || "User"}
                </Text>
                <Text className="text-xs text-slate-500">{user?.email}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        <SectionHeader title="Preferences" />
        <View className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
          <View className="flex-row justify-between items-center p-4 border-b border-slate-100 dark:border-slate-800">
            <View className="flex-row items-center gap-3">
              <View className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                <Ionicons
                  name="hardware-chip-outline"
                  size={20}
                  color="#2563EB"
                />
              </View>
              <Text className="text-base font-medium text-slate-900 dark:text-white">
                Haptic Feedback
              </Text>
            </View>
            <Switch
              value={hapticsEnabled}
              onValueChange={handleToggleHaptics}
              trackColor={{ false: "#CBD5E1", true: "#93C5FD" }}
              thumbColor={hapticsEnabled ? "#2563EB" : "#F1F5F9"}
            />
          </View>
          {/* Future: Theme Toggle could go here */}
        </View>

        <SectionHeader title="AI Configuration" />
        <View className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
          <Input
            label="Gemini API Key (Optional)"
            placeholder="Paste your API Key here"
            value={apiKey}
            onChangeText={setApiKey}
            secureTextEntry
            autoCapitalize="none"
            containerClassName="mb-2"
          />
          <Text className="text-xs text-slate-400 mb-4 px-1">
            Leave empty to use the app's secure default key.
          </Text>
          <Button
            title="Save Preference"
            onPress={handleSaveKey}
            loading={isSaving}
            variant="outline"
            size="sm"
          />
        </View>

        <SectionHeader title="Account" />
        <View className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 mb-10">
          <View className="flex-row items-center gap-4 mb-6">
            <View className="h-12 w-12 bg-slate-100 dark:bg-slate-800 rounded-full items-center justify-center">
              <Text className="text-xl font-bold text-slate-600 dark:text-slate-400">
                {user?.name?.charAt(0) || "U"}
              </Text>
            </View>
            <View>
              <Text className="text-lg font-bold text-slate-900 dark:text-white">
                {user?.name || "User"}
              </Text>
              <Text className="text-slate-500">{user?.email}</Text>
            </View>
          </View>

          <Button
            title="Sign Out"
            onPress={handleLogout}
            variant="outline"
            className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-900"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
