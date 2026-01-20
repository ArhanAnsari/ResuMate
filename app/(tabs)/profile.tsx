import { AIService } from "@/services/aiService";
import { PremiumButton } from "@/shared/components/ui/PremiumButton";
import { PremiumInput } from "@/shared/components/ui/PremiumInput";
import { COLORS } from "@/src/core/theme";
import { useAuthStore } from "@/src/features/auth/store/authStore";
import { useResumeStore } from "@/store/resumeStore";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { syncResumes, isSyncing } = useResumeStore();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [apiKey, setApiKey] = useState("");

  // Settings state
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const key = await AIService.getApiKey();
    if (key) setApiKey(key);
  };

  const handleSaveProfile = async () => {
    try {
      await AIService.setApiKey(apiKey);
      // Simulate name update for now
      Alert.alert("Success", "Profile & Settings saved successfully");
      setIsEditing(false);
    } catch (e) {
      Alert.alert("Error", "Failed to save settings");
    }
  };

  const handleSync = async () => {
    if (!user) return;
    try {
      await syncResumes(user.id);
      Alert.alert(
        "Sync Complete",
        "Your resumes are up to date with the cloud.",
      );
    } catch (e) {
      Alert.alert(
        "Sync Failed",
        "Check your internet connection or DB configuration.",
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-6 py-4 border-b border-border bg-surface flex-row justify-between items-center">
        <Text className="text-2xl font-bold text-text">Profile</Text>
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
          <Text className="text-primary font-medium">
            {isEditing ? "Cancel" : "Edit"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        {/* User Card */}
        <View className="bg-surface p-6 rounded-2xl border border-border mb-6 items-center shadow-sm">
          <View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-4">
            <Text className="text-3xl font-bold text-primary">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </Text>
          </View>

          {isEditing ? (
            <View className="w-full mb-4 gap-4">
              <PremiumInput
                label="Full Name"
                value={name}
                onChangeText={setName}
              />
              <PremiumInput
                label="Gemini API Key"
                value={apiKey}
                onChangeText={setApiKey}
                placeholder="AIza..."
                secureTextEntry
              />
              <PremiumButton
                title="Save Changes"
                onPress={handleSaveProfile}
                size="sm"
                style={{ marginTop: 8 }}
              />
            </View>
          ) : (
            <>
              <Text className="text-xl font-bold text-text mb-1">
                {user?.name || "Guest User"}
              </Text>
              <Text className="text-textSecondary text-base mb-4">
                {user?.email}
              </Text>
            </>
          )}

          <View className="w-full border-t border-border pt-4 mt-2">
            <PremiumButton
              title="Sign Out"
              variant="ghost"
              onPress={logout}
              style={{ width: "100%" }}
              textStyle={{ color: COLORS.error }}
            />
          </View>
        </View>

        {/* Settings Section */}
        <Text className="text-lg font-bold text-text mb-4">Cloud & Sync</Text>

        <View className="bg-surface rounded-xl border border-border overflow-hidden mb-6">
          <TouchableOpacity onPress={handleSync} disabled={isSyncing}>
            <SettingItem
              icon={isSyncing ? "sync" : "cloud-queue"}
              title="Sync Resumes"
              value={isSyncing ? "Syncing..." : "Tap to Sync"}
              isLast={false}
              highlight={true}
            />
          </TouchableOpacity>

          <View className="p-4 flex-row items-center justify-between bg-surface">
            <View className="flex-row items-center gap-3">
              <View className="w-8 h-8 rounded-full bg-surface-active items-center justify-center">
                <MaterialIcons
                  name="notifications-none"
                  size={20}
                  color={COLORS.textSecondary}
                />
              </View>
              <Text className="text-text font-medium">Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: "#767577", true: COLORS.primary }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const SettingItem = ({
  icon,
  title,
  value,
  isLast,
  highlight = false,
}: {
  icon: any;
  title: string;
  value: string;
  isLast: boolean;
  highlight?: boolean;
}) => (
  <View
    className={`p-4 flex-row items-center justify-between bg-surface ${!isLast ? "border-b border-border" : ""}`}
  >
    <View className="flex-row items-center gap-3">
      <View className="w-8 h-8 rounded-full bg-surface-active items-center justify-center">
        <MaterialIcons
          name={icon}
          size={20}
          color={highlight ? COLORS.primary : COLORS.textSecondary}
        />
      </View>
      <Text
        className={`font-medium ${highlight ? "text-primary" : "text-text"}`}
      >
        {title}
      </Text>
    </View>
    <View className="flex-row items-center gap-2">
      <Text className="text-textSecondary text-sm">{value}</Text>
      <MaterialIcons
        name="chevron-right"
        size={20}
        color={COLORS.textTertiary}
      />
    </View>
  </View>
);
