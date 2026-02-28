import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { useToast } from "@/src/context/ToastContext";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useResumeStore } from "@/src/store/useResumeStore";
import { useSettingsStore } from "@/src/store/useSettingsStore";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const templates = [
  {
    id: "blank",
    icon: "document-outline" as const,
    label: "Blank",
    color: "#4F46E5",
  },
  {
    id: "modern",
    icon: "layers-outline" as const,
    label: "Modern",
    color: "#7C3AED",
  },
  {
    id: "minimal",
    icon: "remove-outline" as const,
    label: "Minimal",
    color: "#0EA5E9",
  },
  {
    id: "classic",
    icon: "briefcase-outline" as const,
    label: "Classic",
    color: "#10B981",
  },
] as const;

export default function CreateResume() {
  const [title, setTitle] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("blank");
  const [titleError, setTitleError] = useState("");
  const { user } = useAuthStore();
  const { createResume, isLoading } = useResumeStore();
  const { hapticsEnabled } = useSettingsStore();
  const { showToast } = useToast();
  const router = useRouter();

  const handleCreate = async () => {
    if (!title.trim()) {
      setTitleError("Please enter a title for your resume");
      if (hapticsEnabled)
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    if (!user) return;
    setTitleError("");

    try {
      if (hapticsEnabled)
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await createResume(user.$id, title);
      showToast("Resume created!", "success");
      if (hapticsEnabled)
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTitle("");
      router.push("/(app)/(tabs)");
    } catch (error: any) {
      showToast(error.message || "Failed to create resume", "error");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Header */}
        <View className="px-5 pt-4 pb-5 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
          <Text className="text-2xl font-bold text-slate-900 dark:text-white">
            New Resume
          </Text>
          <Text className="text-slate-500 text-sm mt-0.5">
            Start building your next opportunity
          </Text>
        </View>

        <ScrollView
          className="flex-1 px-5"
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title input */}
          <Input
            label="Resume Title"
            placeholder="e.g. Software Engineer 2026"
            value={title}
            onChangeText={(t) => {
              setTitle(t);
              if (t.trim()) setTitleError("");
            }}
            error={titleError}
            leftIcon="document-text-outline"
            autoFocus
          />

          {/* Template selector */}
          <Text className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 mt-5">
            Starting Template
          </Text>
          <View className="flex-row gap-3 flex-wrap">
            {templates.map((t) => {
              const selected = selectedTemplate === t.id;
              return (
                <TouchableOpacity
                  key={t.id}
                  activeOpacity={0.8}
                  onPress={() => {
                    setSelectedTemplate(t.id);
                    if (hapticsEnabled) Haptics.selectionAsync();
                  }}
                  className={`flex-1 min-w-[40%] items-center p-4 rounded-2xl border-2 ${
                    selected
                      ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                  }`}
                >
                  <View
                    className="w-10 h-10 rounded-xl items-center justify-center mb-2"
                    style={{ backgroundColor: t.color + "18" }}
                  >
                    <Ionicons name={t.icon} size={22} color={t.color} />
                  </View>
                  <Text
                    className={`text-sm font-bold ${
                      selected
                        ? "text-indigo-700 dark:text-indigo-300"
                        : "text-slate-700 dark:text-slate-200"
                    }`}
                  >
                    {t.label}
                  </Text>
                  {selected && (
                    <View className="absolute top-2 right-2 w-5 h-5 rounded-full bg-indigo-600 items-center justify-center">
                      <Ionicons name="checkmark" size={12} color="white" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Tips card */}
          <View className="mt-5 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-2xl p-4">
            <View className="flex-row items-center gap-2 mb-2">
              <Ionicons name="bulb-outline" size={16} color="#4F46E5" />
              <Text className="text-sm font-bold text-indigo-700 dark:text-indigo-300">
                Quick Tips
              </Text>
            </View>
            {[
              "Use a job-specific title for better tracking",
              "You can rename this resume at any time",
              "AI Hub can score and improve your resume",
            ].map((tip, i) => (
              <View key={i} className="flex-row items-start gap-2 mt-1">
                <Text className="text-indigo-400 text-xs mt-0.5">•</Text>
                <Text className="text-xs text-indigo-600/80 dark:text-indigo-300/80 flex-1">
                  {tip}
                </Text>
              </View>
            ))}
          </View>

          <Button
            title="Create Resume"
            variant="primary"
            onPress={handleCreate}
            loading={isLoading}
            icon="document-text-outline"
            className="mt-6"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
