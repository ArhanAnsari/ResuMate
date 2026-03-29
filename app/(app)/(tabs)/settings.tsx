import { AppwriteImage } from "@/src/components/ui/AppwriteImage";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { useToast } from "@/src/context/ToastContext";
import { AIService } from "@/src/services/ai/gemini";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useProfileStore } from "@/src/store/useProfileStore";
import { useSettingsStore } from "@/src/store/useSettingsStore";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    Linking,
    ScrollView,
    StatusBar,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SettingRowProps {
  icon: keyof typeof import("@expo/vector-icons/build/Icons").Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
  label: string;
  sublabel?: string;
  onPress?: () => void;
  right?: React.ReactNode;
  showBorder?: boolean;
}

const SettingRow = ({
  icon,
  iconBg,
  iconColor,
  label,
  sublabel,
  onPress,
  right,
  showBorder = true,
}: SettingRowProps) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={onPress ? 0.7 : 1}
    className={`flex-row items-center justify-between px-4 py-3.5 ${
      showBorder ? "border-b border-slate-100 dark:border-slate-800" : ""
    }`}
  >
    <View className="flex-row items-center gap-3 flex-1">
      <View
        className="w-9 h-9 rounded-xl items-center justify-center"
        style={{ backgroundColor: iconBg }}
      >
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <View className="flex-1">
        <Text className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
          {label}
        </Text>
        {sublabel ? (
          <Text className="text-xs text-slate-400 mt-0.5">{sublabel}</Text>
        ) : null}
      </View>
    </View>
    {right ??
      (onPress ? (
        <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
      ) : null)}
  </TouchableOpacity>
);

const SectionTitle = ({ title }: { title: string }) => (
  <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 mb-2 mt-6">
    {title}
  </Text>
);

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
      const stored = await AIService.getStoredApiKey();
      if (stored) setApiKey(stored);
    } catch (e) {
      console.warn("Failed to load API key:", e);
    }
  };

  const handleSaveKey = async () => {
    if (!apiKey.trim()) {
      showToast("Please enter a valid API key", "error");
      return;
    }
    setIsSaving(true);
    try {
      await AIService.setApiKey(apiKey);
      if (hapticsEnabled)
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showToast("API Key saved", "success");
    } catch {
      showToast("Failed to save API Key", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    if (hapticsEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: logout },
    ]);
  };

  const handleToggleHaptics = () => {
    toggleHaptics();
    if (!hapticsEnabled) Haptics.selectionAsync();
  };

  const initials = (
    profile?.fullName?.[0] ||
    user?.name?.[0] ||
    "U"
  ).toUpperCase();

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="px-5 pt-4 pb-5 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <Text className="text-2xl font-bold text-slate-900 dark:text-white">
          Settings
        </Text>
        <Text className="text-slate-500 text-sm mt-0.5">
          Manage your account and preferences
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Account profile card */}
        <TouchableOpacity
          onPress={() => router.push("/(app)/profile")}
          activeOpacity={0.88}
          className="mt-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex-row items-center gap-4"
        >
          {profile?.avatarUrl ? (
            <AppwriteImage
              uri={profile.avatarUrl}
              className="w-14 h-14 rounded-full border-2 border-indigo-500"
              contentFit="cover"
              transition={400}
            />
          ) : (
            <View className="w-14 h-14 rounded-full bg-indigo-100 dark:bg-indigo-900/30 border-2 border-indigo-300 dark:border-indigo-700 items-center justify-center">
              <Text className="text-xl font-bold text-indigo-600 dark:text-indigo-300">
                {initials}
              </Text>
            </View>
          )}
          <View className="flex-1">
            <Text className="text-base font-bold text-slate-900 dark:text-white">
              {profile?.fullName || user?.name || "User"}
            </Text>
            <Text className="text-xs text-slate-400 mt-0.5">{user?.email}</Text>
            <Text className="text-xs text-indigo-500 font-semibold mt-1">
              Edit Profile
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
        </TouchableOpacity>

        {/* Preferences */}
        <SectionTitle title="Preferences" />
        <View className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <SettingRow
            icon="hardware-chip-outline"
            iconBg="#EFF6FF"
            iconColor="#2563EB"
            label="Haptic Feedback"
            sublabel="Vibration on interactions"
            right={
              <Switch
                value={hapticsEnabled}
                onValueChange={handleToggleHaptics}
                trackColor={{ false: "#E2E8F0", true: "#A5B4FC" }}
                thumbColor={hapticsEnabled ? "#4F46E5" : "#F8FAFC"}
              />
            }
          />
          <SettingRow
            icon="notifications-outline"
            iconBg="#FEF9C3"
            iconColor="#D97706"
            label="Push Notifications"
            sublabel="Export ready & reminders"
            showBorder={false}
            right={
              <Switch
                value={true}
                disabled
                trackColor={{ true: "#A5B4FC" }}
                thumbColor="#4F46E5"
              />
            }
          />
        </View>

        {/* AI Configuration */}
        <SectionTitle title="AI Configuration" />
        <View className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
          <View className="flex-row items-center gap-2 mb-3">
            <View className="w-9 h-9 rounded-xl items-center justify-center bg-violet-100 dark:bg-violet-900/30">
              <Ionicons name="sparkles-outline" size={18} color="#7C3AED" />
            </View>
            <View>
              <Text className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Gemini API Key
              </Text>
              <Text className="text-xs text-slate-400">
                Optional — leave blank to use default
              </Text>
            </View>
          </View>
          <Input
            placeholder="AIza…"
            value={apiKey}
            onChangeText={setApiKey}
            secureTextEntry
            autoCapitalize="none"
            leftIcon="key-outline"
          />
          <Button
            title="Save Key"
            onPress={handleSaveKey}
            loading={isSaving}
            variant="outline"
            size="sm"
            className="mt-3"
          />
        </View>

        {/* Support */}
        <SectionTitle title="Support" />
        <View className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <SettingRow
            icon="globe-outline"
            iconBg="#ECFDF5"
            iconColor="#10B981"
            label="Developer Portfolio"
            onPress={() => Linking.openURL("https://arhanansari.me")}
          />
          <SettingRow
            icon="logo-github"
            iconBg="#F1F5F9"
            iconColor="#334155"
            label="GitHub"
            onPress={() => Linking.openURL("https://github.com/ArhanAnsari")}
            showBorder={false}
          />
        </View>

        {/* Sign out */}
        <SectionTitle title="Account" />
        <View className="bg-white dark:bg-slate-900 rounded-2xl border border-red-100 dark:border-red-900/30 overflow-hidden">
          <SettingRow
            icon="log-out-outline"
            iconBg="#FEF2F2"
            iconColor="#EF4444"
            label="Sign Out"
            sublabel="You will need to sign in again"
            onPress={handleLogout}
            showBorder={false}
          />
        </View>

        {/* Footer */}
        <View className="mt-8 items-center pb-4">
          <Text className="text-slate-400 text-xs">
            ResuMate © {new Date().getFullYear()} · Developed by{" "}
          </Text>
          <TouchableOpacity
            onPress={() => Linking.openURL("https://arhanansari.vercel.app")}
          >
            <Text className="text-indigo-500 font-bold text-xs underline">
              Arhan Ansari
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
