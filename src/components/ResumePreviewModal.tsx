import { Button } from "@/src/components/ui/Button";
import { Colors } from "@/src/core/theme/tokens";
import { ResumeData } from "@/interfaces/resume";
import { Ionicons } from "@expo/vector-icons";
import { Modal, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface PreviewModalProps {
  visible: boolean;
  onClose: () => void;
  data: ResumeData;
}

export const ResumePreviewModal = ({ visible, onClose, data }: PreviewModalProps) => {
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
        <View className="flex-row justify-between items-center px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <Text className="text-lg font-bold dark:text-white">Resume Preview</Text>
          <Button title="Close" variant="ghost" onPress={onClose} size="sm" />
        </View>

        <ScrollView className="flex-1 p-6" contentContainerStyle={{ paddingBottom: 50 }}>
          {/* Header */}
          <View className="items-center mb-8 border-b-2 border-slate-200 pb-6">
            <Text className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {data.profile?.fullName || "Your Name"}
            </Text>
            <Text className="text-slate-600 dark:text-slate-400">
              {data.profile?.email} • {data.profile?.location}
            </Text>
          </View>

          {/* Summary */}
          {data.summary ? (
            <View className="mb-6">
              <Text className="text-sm font-bold text-blue-600 uppercase mb-2">
                Summary
              </Text>
              <Text className="text-slate-700 dark:text-slate-300 leading-6">
                {data.summary}
              </Text>
            </View>
          ) : null}

          {/* Education */}
          {(data.education || []).length > 0 && (
            <View className="mb-6">
              <Text className="text-sm font-bold text-blue-600 uppercase mb-2">
                Education
              </Text>
              {data.education.map((edu, index) => (
                <View key={index} className="mb-3">
                  <View className="flex-row justify-between">
                    <Text className="font-bold text-slate-800 dark:text-slate-200">
                        {edu.institution}
                    </Text>
                    <Text className="text-slate-500 text-sm">
                        {edu.startDate} - {edu.endDate}
                    </Text>
                  </View>
                  <Text className="text-slate-600 dark:text-slate-400 italic">
                    {edu.degree}
                  </Text>
                </View>
              ))}
            </View>
          )}
          
          {/* Experience */}
          {(data.experience || []).length > 0 && (
            <View className="mb-6">
              <Text className="text-sm font-bold text-blue-600 uppercase mb-2">
                Experience
              </Text>
              {data.experience.map((exp, index) => (
               <View key={index} className="mb-4">
                  <View className="flex-row justify-between">
                    <Text className="font-bold text-slate-800 dark:text-slate-200">
                        {exp.position}
                    </Text>
                    <Text className="text-slate-500 text-sm">
                        {exp.startDate} - {exp.endDate}
                    </Text>
                  </View>
                  <Text className="text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    {exp.company}
                  </Text>
                  <Text className="text-slate-600 dark:text-slate-400 leading-5">
                    {exp.description}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Skills */}
          {(data.skills || []).length > 0 && (
            <View className="mb-6">
              <Text className="text-sm font-bold text-blue-600 uppercase mb-2">
                Skills
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {data.skills.map((skill, index) => (
                  <View key={index} className="bg-slate-200 dark:bg-slate-800 px-3 py-1 rounded-full">
                    <Text className="text-slate-700 dark:text-slate-300 text-sm">
                        {skill.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};
