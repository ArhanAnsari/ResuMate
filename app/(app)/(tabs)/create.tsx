import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { useToast } from "@/src/context/ToastContext";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useResumeStore } from "@/src/store/useResumeStore";
import { useSettingsStore } from "@/src/store/useSettingsStore";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateResume() {
  const [title, setTitle] = useState("");
  const { user } = useAuthStore();
  const { createResume, isLoading } = useResumeStore();
  const { hapticsEnabled } = useSettingsStore();
  const { showToast } = useToast();
  const router = useRouter();

  const handleCreate = async () => {
    if (!title.trim() || !user) return;

    try {
      if (hapticsEnabled)
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      await createResume(user.$id, title);

      showToast("Resume created successfully", "success");
      setTitle("");
      router.push("/(app)/(tabs)");
    } catch (error: any) {
      showToast(error.message || "Failed to create resume", "error");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900 px-6 pt-10">
      <Text className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
        New Resume
      </Text>

      <Input
        label="Resume Title"
        placeholder="e.g. Software Engineer 2026"
        value={title}
        onChangeText={setTitle}
        autoFocus
      />

      <Button
        title="Create Resume"
        onPress={handleCreate}
        loading={isLoading}
        className="mt-6"
      />
    </SafeAreaView>
  );
}
