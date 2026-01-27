import { AIService } from "@/services/ai.service";
import { PremiumButton } from "@/shared/components/ui/PremiumButton";
import { MaterialIcons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

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
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === "dark" ? "#E2E8F0" : "#475569";
  const primaryColor = "#2563EB";

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
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-card w-full h-[90%] rounded-t-3xl shadow-2xl overflow-hidden border-t border-white/20">
          {/* Header */}
          <View className="flex-row justify-between items-center p-5 border-b border-border bg-card">
            <View className="flex-row items-center gap-3">
              <View className="bg-primary/10 p-2 rounded-xl">
                <MaterialIcons
                  name="auto-awesome"
                  size={24}
                  color={primaryColor}
                />
              </View>
              <View>
                <Text className="text-xl font-bold text-foreground">
                  AI Assistant
                </Text>
                <Text className="text-xs text-muted-foreground">
                  Powered by Gemini 2.5
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={onClose}
              className="p-2 rounded-full active:bg-muted"
            >
              <MaterialIcons name="close" size={24} color={iconColor} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View className="flex-1 p-5 gap-6 bg-background">
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground ml-1">
                What do you want to write?
              </Text>
              <TextInput
                className="bg-card border border-input rounded-xl p-4 text-foreground min-h-[100px] text-base leading-6"
                value={prompt}
                onChangeText={setPrompt}
                placeholder="E.g., Write a professional summary highlighting my experience in React Native and Node.js..."
                multiline
                numberOfLines={3}
                placeholderTextColor="#94A3B8"
                textAlignVertical="top"
              />
              <View className="flex-row justify-end mt-2">
                <PremiumButton
                  title={loading ? "Generating..." : "Generate Draft"}
                  onPress={handleGenerate}
                  isLoading={loading}
                  size="sm"
                  variant="primary"
                />
              </View>
            </View>

            {generatedContent ? (
              <View className="flex-1 gap-2">
                <View className="flex-row justify-between items-center mt-2">
                  <Text className="text-sm font-semibold text-foreground ml-1">
                    Preview:
                  </Text>
                  <TouchableOpacity onPress={() => setGeneratedContent("")}>
                    <Text className="text-xs text-primary font-medium mr-1">
                      Clear
                    </Text>
                  </TouchableOpacity>
                </View>

                <TextInput
                  className="flex-1 bg-primary/5 border border-primary/20 rounded-xl p-4 text-foreground text-base leading-6 text-left"
                  value={generatedContent}
                  onChangeText={setGeneratedContent}
                  multiline
                  textAlignVertical="top"
                />

                <View className="flex-row gap-3 pt-2 pb-6">
                  <PremiumButton
                    title="Discard"
                    onPress={() => setGeneratedContent("")}
                    variant="secondary"
                    style={{ flex: 1 }}
                  />
                  <PremiumButton
                    title="Apply to Resume"
                    onPress={handleApply}
                    variant="primary"
                    style={{ flex: 1 }}
                  />
                </View>
              </View>
            ) : (
              <View className="flex-1 justify-center items-center opacity-40 gap-4 mb-10">
                <MaterialIcons name="text-fields" size={64} color={iconColor} />
                <Text className="text-muted-foreground text-center px-10 text-base">
                  Enter a prompt above and tap Generate to create professional
                  content for your resume.
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};
