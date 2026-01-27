import { PremiumInput } from "@/shared/components/ui/PremiumInput";
import { AIAssistantModal } from "@/src/features/ai/components/AIAssistantModal";
import { useResumeStore } from "@/store/resumeStore";
import { MaterialIcons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export const PersonalInfoForm: React.FC = () => {
  const activeResumeId = useResumeStore((state) => state.activeResumeId);
  const profile = useResumeStore((state) =>
    activeResumeId ? state.resumes[activeResumeId]?.profile : null,
  );
  const updateProfile = useResumeStore((state) => state.updateProfile);
  const { colorScheme } = useColorScheme();
  const primaryColor = "#2563EB";

  const [aiModalVisible, setAiModalVisible] = useState(false);

  if (!profile) return null;

  return (
    <View className="bg-card p-4 rounded-2xl border border-border">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-bold text-foreground">
          Personal Information
        </Text>
        <TouchableOpacity
          className="flex-row items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-full active:bg-primary/20"
          onPress={() => setAiModalVisible(true)}
        >
          <MaterialIcons name="auto-awesome" size={16} color={primaryColor} />
          <Text className="text-primary font-medium text-xs">AI Assist</Text>
        </TouchableOpacity>
      </View>

      <View className="gap-4">
        <PremiumInput
          label="Full Name"
          value={profile.fullName}
          onChangeText={(text) => updateProfile({ fullName: text })}
          placeholder="e.g. John Doe"
        />

        <PremiumInput
          label="Email"
          value={profile.email}
          onChangeText={(text) => updateProfile({ email: text })}
          placeholder="e.g. john@example.com"
          keyboardType="email-address"
        />

        <PremiumInput
          label="Phone"
          value={profile.phone}
          onChangeText={(text) => updateProfile({ phone: text })}
          placeholder="e.g. +1 234 567 890"
          keyboardType="phone-pad"
        />

        <PremiumInput
          label="Location"
          value={profile.location}
          onChangeText={(text) => updateProfile({ location: text })}
          placeholder="e.g. New York, NY"
        />

        <PremiumInput
          label="Professional Summary"
          value={profile.summary || ""}
          onChangeText={(text) => updateProfile({ summary: text })}
          placeholder="Brief overview of your career and goals..."
          multiline
          numberOfLines={4}
        />
      </View>

      <AIAssistantModal
        visible={aiModalVisible}
        onClose={() => setAiModalVisible(false)}
        onApply={(content) => {
          // Logic: Update the profile summary with the AI generated text
          console.log("AI Generated Summary:", content);
          updateProfile({ summary: content });
        }}
        promptType="summary"
        initialPrompt="Write a professional summary for my resume..."
      />
    </View>
  );
};
