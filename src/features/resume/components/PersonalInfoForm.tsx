import { PremiumInput } from "@/shared/components/ui/PremiumInput";
import { COLORS, SPACING } from "@/src/core/theme";
import { AIAssistantModal } from "@/src/features/ai/components/AIAssistantModal";
import { useResumeStore } from "@/store/resumeStore";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const PersonalInfoForm: React.FC = () => {
  const activeResumeId = useResumeStore((state) => state.activeResumeId);
  const profile = useResumeStore((state) =>
    activeResumeId ? state.resumes[activeResumeId]?.profile : null,
  );
  const updateProfile = useResumeStore((state) => state.updateProfile);

  const [aiModalVisible, setAiModalVisible] = useState(false);

  if (!profile) return null;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <TouchableOpacity
          style={styles.aiButton}
          onPress={() => setAiModalVisible(true)}
        >
          <MaterialIcons name="auto-awesome" size={16} color={COLORS.primary} />
          <Text style={styles.aiButtonText}>AI Assist</Text>
        </TouchableOpacity>
      </View>

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

      <AIAssistantModal
        visible={aiModalVisible}
        onClose={() => setAiModalVisible(false)}
        onApply={(content) => {
          console.log("AI Content Applied:", content);
        }}
        promptType="summary"
        initialPrompt="Write a professional summary for my resume..."
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: 16, // LAYOUT.borderRadius.lg
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  aiButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  aiButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.primary,
  },
});
