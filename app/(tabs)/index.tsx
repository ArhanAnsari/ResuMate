import { useAuthStore } from "@/store/authStore";
import { EducationSection } from "@/src/features/resume/components/EducationSection";
import { PersonalInfoForm } from "@/src/features/resume/components/PersonalInfoForm";
import { useResumeStore } from "@/store/resumeStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BuilderScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { resumes, activeResumeId, createResume, setActiveResume } =
    useResumeStore();
  const { colorScheme } = useColorScheme();

  const resumeList = useMemo(() => Object.values(resumes), [resumes]);
  const activeResume = activeResumeId ? resumes[activeResumeId] : null;

  // Auto-select or create resume logic
  useEffect(() => {
    if (!user) return; // Wait for user to be logged in (or at least loaded)

    // If no resumes exist, create one
    if (resumeList.length === 0) {
      createResume("My First Resume");
    } else if (resumeList.length > 0 && !activeResumeId) {
      // If resumes exist but none selected, select the first one
      setActiveResume(resumeList[0].id);
    }
  }, [user, resumeList.length, activeResumeId]);

  if (!activeResume) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" className="text-primary" />
        <Text className="mt-4 text-muted-foreground font-medium">
          Preparing Builder...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="px-4 py-3 border-b border-border bg-card flex-row justify-between items-center shadow-sm">
        <View>
          <Text className="text-xl font-bold text-foreground">
            Resume Builder
          </Text>
          <Text className="text-xs text-muted-foreground">
            Editing: {activeResume.title}
          </Text>
        </View>
        <TouchableOpacity
          className="bg-primary/10 p-2 rounded-full active:bg-primary/20"
          onPress={() => router.push("/resumes")}
        >
          <Ionicons
            name="list"
            size={20}
            className="text-primary"
            color={colorScheme === "dark" ? "#fff" : "#000"}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="p-4 pb-24 gap-6"
      >
        <View className="gap-2 mb-2">
          <Text className="text-2xl font-bold text-foreground">
            Let's build your resume
          </Text>
          <Text className="text-muted-foreground">
            Fill in the sections below. Your changes are saved automatically.
          </Text>
        </View>

        {/* Sections */}
        <PersonalInfoForm />
        <EducationSection />

        {/* Placeholder for future sections */}
        <View className="bg-card p-6 rounded-2xl border border-dashed border-border items-center justify-center py-10">
          <Text className="text-muted-foreground text-center mb-2">
            More sections coming soon
          </Text>
          <Text className="text-xs text-muted-foreground/60 text-center">
            (Experience, Skills, Projects)
          </Text>
        </View>
      </ScrollView>

      {/* Floating Action Button for Preview */}
      <View className="absolute bottom-6 right-6">
        <TouchableOpacity
          className="bg-primary h-14 w-14 rounded-full items-center justify-center shadow-lg active:scale-95 transition-transform"
          onPress={() => router.push("/modal")}
        >
          <Ionicons name="eye" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
