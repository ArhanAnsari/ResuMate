import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useResumeStore } from "@/src/store/useResumeStore";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateResume() {
  const [title, setTitle] = useState("");
  const { user } = useAuthStore();
  const { createResume, isLoading } = useResumeStore();
  const router = useRouter();

  const handleCreate = async () => {
    if (!title.trim() || !user) return;

    try {
      await createResume(user.$id, title);
      setTitle("");
      router.push("/(app)/(tabs)");
    } catch (error: any) {
      Alert.alert("Error", error.message);
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
