import { AIService } from "@/services/ai.service";
import { PremiumButton } from "@/shared/components/ui/PremiumButton";
import { COLORS, SPACING } from "@/src/core/theme";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, Modal, StyleSheet, Text, TextInput, View } from "react-native";

interface AIAssistantProps {
  visible: boolean;
  onClose: () => void;
  onApply: (content: string) => void;
  promptType: "summary" | "experience" | "skills" | "custom";
  initialPrompt?: string;
  contextData?: any;
}

export const AIAssistantModal: React.FC<AIAssistantProps> = ({
  visible,
  onClose,
  onApply,
  promptType,
  initialPrompt,
  contextData,
}) => {
  const [prompt, setPrompt] = useState(initialPrompt || "");
  const [generatedContent, setGeneratedContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);

    try {
      const result = await AIService.generateContent(prompt, contextData);
      setGeneratedContent(result);
    } catch (error: any) {
      if (error.message.includes("API Key")) {
        Alert.alert("Configuration Missing", error.message);
      } else {
        Alert.alert("Error", "Failed to generate content. Please try again.");
        console.error("AI Assistant Error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    onApply(generatedContent);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerTitleContainer}>
              <MaterialIcons
                name="auto-awesome"
                size={24}
                color={COLORS.primary}
              />
              <Text style={styles.headerTitle}>AI Assistant</Text>
            </View>
            <MaterialIcons
              name="close"
              size={24}
              color={COLORS.textSecondary}
              onPress={onClose}
            />
          </View>

          <View style={styles.content}>
            <Text style={styles.label}>What should I write about?</Text>
            <TextInput
              style={styles.input}
              value={prompt}
              onChangeText={setPrompt}
              placeholder="E.g., Write a professional summary for a Senior React Developer..."
              multiline
              numberOfLines={3}
              placeholderTextColor={COLORS.textTertiary}
            />

            <View style={styles.generateRow}>
              <PremiumButton
                title="Generate"
                onPress={handleGenerate}
                isLoading={loading}
                size="sm"
                variant="primary"
              />
            </View>

            {generatedContent ? (
              <View style={styles.resultContainer}>
                <Text style={styles.resultLabel}>Generated Draft:</Text>
                <TextInput
                  style={styles.resultInput}
                  value={generatedContent}
                  onChangeText={setGeneratedContent}
                  multiline
                />
                <View style={styles.footer}>
                  <PremiumButton
                    title="Use This"
                    onPress={handleApply}
                    style={{ flex: 1 }}
                  />
                </View>
              </View>
            ) : (
              <View style={styles.placeholder}>
                <Text style={styles.placeholderText}>
                  Enter a prompt above and let AI help you write the perfect
                  resume content.
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: SPACING.xl,
    height: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  content: {
    padding: SPACING.lg,
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: SPACING.md,
    color: COLORS.text,
    backgroundColor: COLORS.surface,
    textAlignVertical: "top",
    height: 80,
    marginBottom: SPACING.md,
  },
  generateRow: {
    alignItems: "flex-end",
    marginBottom: SPACING.md,
  },
  resultContainer: {
    flex: 1,
    gap: SPACING.sm,
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  resultInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 12,
    padding: SPACING.md,
    color: COLORS.text,
    backgroundColor: COLORS.surface,
    textAlignVertical: "top",
    fontSize: 16,
    lineHeight: 24,
  },
  footer: {
    marginTop: SPACING.md,
  },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.5,
  },
  placeholderText: {
    textAlign: "center",
    color: COLORS.textSecondary,
    width: "70%",
  },
});
