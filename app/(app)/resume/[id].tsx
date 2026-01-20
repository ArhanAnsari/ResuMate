import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";
import { APP_CONFIG } from "@/src/core/config/app";
import { AIService } from "@/src/services/ai/gemini";
import { appwrite } from "@/src/services/appwrite/client";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ResumeEditor() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [resume, setResume] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    fetchResume();
  }, [id]);

  const fetchResume = async () => {
    try {
      const doc = await appwrite.databases.getDocument(
        APP_CONFIG.APPWRITE.DATABASE_ID,
        APP_CONFIG.APPWRITE.COLLECTION.RESUMES,
        id as string,
      );
      setResume(doc);
      setData(JSON.parse(doc.data));
    } catch (error) {
      Alert.alert("Error", "Failed to load resume");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const saveResume = async () => {
    setIsSaving(true);
    try {
      await appwrite.databases.updateDocument(
        APP_CONFIG.APPWRITE.DATABASE_ID,
        APP_CONFIG.APPWRITE.COLLECTION.RESUMES,
        id as string,
        { data: JSON.stringify(data) },
      );
      Alert.alert("Saved", "Resume updated successfully");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const generateSummary = async () => {
    setAiLoading(true);
    try {
      // Construct prompt based on other data
      const context = `Experience: ${JSON.stringify(data.experience)}. Skills: ${JSON.stringify(data.skills)}`;
      const result = await AIService.enhanceResumeSection(context, "summary");
      setData({ ...data, summary: result });
    } catch (error) {
      Alert.alert("AI Error", "Failed to generate summary");
      console.error(error);
    } finally {
      setAiLoading(false);
    }
  };

  if (loading)
    return (
      <View className="flex-1 justify-center">
        <ActivityIndicator />
      </View>
    );

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
      <View className="flex-row justify-between items-center px-4 py-2 bg-white dark:bg-slate-900 shadow-sm z-10">
        <Button
          title="Back"
          variant="ghost"
          onPress={() => router.back()}
          size="sm"
        />
        <Text className="font-bold text-lg dark:text-white truncate max-w-[150px]">
          {resume?.title}
        </Text>
        <Button
          title="Save"
          onPress={saveResume}
          loading={isSaving}
          size="sm"
        />
      </View>

      <ScrollView className="flex-1 p-4">
        <Card className="mb-6">
          <Text className="text-xl font-bold mb-4 dark:text-white">
            Personal Information
          </Text>
          <Input
            label="Full Name"
            value={data.profile?.fullName}
            onChangeText={(t) =>
              setData({ ...data, profile: { ...data.profile, fullName: t } })
            }
          />
          <Input
            label="Email"
            value={data.profile?.email}
            onChangeText={(t) =>
              setData({ ...data, profile: { ...data.profile, email: t } })
            }
          />
        </Card>

        <Card className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold dark:text-white">
              Professional Summary
            </Text>
            <Button
              title="AI Enhance"
              size="sm"
              variant="outline"
              onPress={generateSummary}
              loading={aiLoading}
            />
          </View>
          <Input
            multiline
            numberOfLines={6}
            value={data.summary}
            onChangeText={(t) => setData({ ...data, summary: t })}
            placeholder="Write a brief professional summary..."
            className="h-32 text-top"
          />
        </Card>

        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
