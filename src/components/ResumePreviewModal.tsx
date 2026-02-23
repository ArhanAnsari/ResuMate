import { ResumeData } from "@/interfaces/resume";
import { Button } from "@/src/components/ui/Button";
import { WordService } from "@/src/services/export/WordService"; // Add import
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    Alert,
    Linking,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface PreviewModalProps {
  visible: boolean;
  onClose: () => void;
  data: ResumeData;
}

const getSkillIcon = (
  skillName: string,
): keyof typeof Ionicons.glyphMap | null => {
  if (!skillName) return null;
  const normalized = skillName.toLowerCase();
  const map: Record<string, keyof typeof Ionicons.glyphMap> = {
    react: "logo-react",
    "react native": "logo-react",
    javascript: "logo-javascript",
    typescript: "logo-nodejs",
    "node.js": "logo-nodejs",
    nodejs: "logo-nodejs",
    python: "logo-python",
    html: "logo-html5",
    css: "logo-css3",
    github: "logo-github",
    git: "git-branch",
    docker: "logo-docker",
    angular: "logo-angular",
    vue: "logo-vue",
    apple: "logo-apple",
    android: "logo-android",
    windows: "logo-windows",
    linux: "logo-tux",
    sass: "logo-sass",
    figma: "color-palette",
    firebase: "flame",
    design: "brush",
  };

  if (map[normalized]) return map[normalized];

  // Fuzzy matching for partials
  if (normalized.includes("react")) return "logo-react";
  if (normalized.includes("script")) return "code-slash";
  if (normalized.includes("css")) return "logo-css3";
  if (normalized.includes("db") || normalized.includes("sql")) return "server";
  if (normalized.includes("cloud") || normalized.includes("aws"))
    return "cloud";

  return null;
};

// --- Templates ---

const ModernTemplate = ({ data }: { data: ResumeData }) => (
  <View className="flex-1">
    {/* Header */}
    <View className="items-center mb-8 border-b-2 border-slate-200 pb-6">
      <Text className="text-3xl font-bold text-slate-900 dark:text-white mb-2 text-center">
        {data.profile?.fullName || "Your Name"}
      </Text>
      <View className="flex-row gap-2 flex-wrap justify-center">
        <Text className="text-slate-600 dark:text-slate-400">
          {data.profile?.email}
        </Text>
        {data.profile?.location && (
          <Text className="text-slate-600 dark:text-slate-400">
            • {data.profile?.location}
          </Text>
        )}
        {data.profile?.phone && (
          <Text className="text-slate-600 dark:text-slate-400">
            • {data.profile?.phone}
          </Text>
        )}
      </View>
    </View>

    {/* Summary */}
    {data.summary && (
      <View className="mb-6">
        <Text className="text-sm font-bold text-blue-600 uppercase mb-2 tracking-wider">
          Summary
        </Text>
        <Text className="text-slate-700 dark:text-slate-300 leading-6 text-base">
          {data.summary}
        </Text>
      </View>
    )}

    {/* Experience */}
    {data.experience && data.experience.length > 0 && (
      <View className="mb-6">
        <Text className="text-sm font-bold text-blue-600 uppercase mb-3 tracking-wider">
          Experience
        </Text>
        {data.experience.map((exp, index) => (
          <View key={index} className="mb-5 ml-1">
            <View className="flex-row justify-between items-baseline mb-1">
              <Text className="font-bold text-slate-800 dark:text-slate-200 text-lg flex-1">
                {exp.position}
              </Text>
              <Text className="text-slate-500 text-sm ml-2">
                {exp.startDate} - {exp.endDate || "Present"}
              </Text>
            </View>
            <Text className="text-slate-700 dark:text-slate-300 font-semibold mb-2 text-base">
              {exp.company}
            </Text>
            <Text className="text-slate-600 dark:text-slate-400 leading-5">
              {exp.description}
            </Text>
          </View>
        ))}
      </View>
    )}

    {/* Education */}
    {data.education && data.education.length > 0 && (
      <View className="mb-6">
        <Text className="text-sm font-bold text-blue-600 uppercase mb-3 tracking-wider">
          Education
        </Text>
        {data.education.map((edu, index) => (
          <View key={index} className="mb-4 ml-1">
            <View className="flex-row justify-between items-baseline mb-1">
              <Text className="font-bold text-slate-800 dark:text-slate-200 text-base flex-1">
                {edu.institution}
              </Text>
              <Text className="text-slate-500 text-sm ml-2">
                {edu.startDate} - {edu.endDate || "Present"}
              </Text>
            </View>
            <Text className="text-slate-600 dark:text-slate-400 italic">
              {edu.degree}
            </Text>
          </View>
        ))}
      </View>
    )}

    {/* Projects */}
    {data.projects && data.projects.length > 0 && (
      <View className="mb-6">
        <Text className="text-sm font-bold text-blue-600 uppercase mb-3 tracking-wider">
          Projects
        </Text>
        {data.projects.map((proj, index) => (
          <View key={index} className="mb-4 ml-1">
            <Text className="font-bold text-slate-800 dark:text-slate-200 text-base">
              {proj.name}
            </Text>
            <Text className="text-slate-600 dark:text-slate-400 leading-5">
              {proj.description}
            </Text>
            {proj.technologies && proj.technologies.length > 0 && (
              <Text className="text-slate-500 text-xs mt-1">
                Tech: {proj.technologies.join(", ")}
              </Text>
            )}
          </View>
        ))}
      </View>
    )}

    {/* Skills */}
    {data.skills && data.skills.length > 0 && (
      <View className="mb-8">
        <Text className="text-sm font-bold text-blue-600 uppercase mb-3 tracking-wider">
          Skills
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {data.skills.map((skill: any, index) => {
            const skillName = typeof skill === "string" ? skill : skill.name;
            if (!skillName) return null;
            const iconName = getSkillIcon(skillName);
            return (
              <View
                key={index}
                className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg flex-row items-center gap-2 border border-slate-200 dark:border-slate-700"
              >
                {iconName && (
                  <Ionicons name={iconName} size={16} color="#2563EB" />
                )}
                <Text className="text-slate-700 dark:text-slate-300 text-sm font-medium">
                  {skillName}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    )}
  </View>
);

const ClassicTemplate = ({ data }: { data: ResumeData }) => (
  <View className="flex-1">
    <View className="border-b-2 border-black pb-4 mb-6">
      <Text className="text-4xl font-serif text-black dark:text-white text-center mb-1">
        {data.profile?.fullName || "Your Name"}
      </Text>
      <Text className="text-center text-gray-600 dark:text-gray-400 font-serif">
        {data.profile?.email} | {data.profile?.phone} | {data.profile?.location}
      </Text>
    </View>

    {data.summary && (
      <View className="mb-6">
        <Text className="text-lg font-serif font-bold border-b border-gray-300 mb-2 uppercase">
          Profile
        </Text>
        <Text className="text-gray-800 dark:text-gray-200 font-serif leading-6">
          {data.summary}
        </Text>
      </View>
    )}

    {data.experience && data.experience.length > 0 && (
      <View className="mb-6">
        <Text className="text-lg font-serif font-bold border-b border-gray-300 mb-2 uppercase">
          Professional Experience
        </Text>
        {data.experience.map((exp, index) => (
          <View key={index} className="mb-4">
            <View className="flex-row justify-between mb-1">
              <Text className="font-bold text-black dark:text-white font-serif text-lg">
                {exp.company}
              </Text>
              <Text className="text-gray-600 dark:text-gray-400 font-serif italic">
                {exp.startDate} - {exp.endDate || "Present"}
              </Text>
            </View>
            <Text className="font-serif italic mb-1 text-gray-700 dark:text-gray-300">
              {exp.position}
            </Text>
            <Text className="text-gray-800 dark:text-gray-200 font-serif leading-5">
              {exp.description}
            </Text>
          </View>
        ))}
      </View>
    )}

    {data.education && data.education.length > 0 && (
      <View className="mb-6">
        <Text className="text-lg font-serif font-bold border-b border-gray-300 mb-2 uppercase">
          Education
        </Text>
        {data.education.map((edu, index) => (
          <View key={index} className="mb-2">
            <View className="flex-row justify-between">
              <Text className="font-bold text-black dark:text-white font-serif">
                {edu.institution}
              </Text>
              <Text className="text-gray-600 dark:text-gray-400 font-serif italic">
                {edu.startDate} - {edu.endDate || "Present"}
              </Text>
            </View>
            <Text className="font-serif text-gray-800 dark:text-gray-200">
              {edu.degree}
            </Text>
          </View>
        ))}
      </View>
    )}

    {/* Projects */}
    {data.projects && data.projects.length > 0 && (
      <View className="mb-6">
        <Text className="text-lg font-serif font-bold border-b border-gray-300 mb-2 uppercase">
          Projects
        </Text>
        {data.projects.map((proj, index) => (
          <View key={index} className="mb-4">
            <Text className="font-bold text-black dark:text-white font-serif text-base">
              {proj.name}
            </Text>
            <Text className="text-gray-800 dark:text-gray-200 font-serif leading-5">
              {proj.description}
            </Text>
            {proj.technologies && proj.technologies.length > 0 && (
              <Text className="text-gray-500 font-serif text-xs mt-1">
                Tech: {proj.technologies.join(", ")}
              </Text>
            )}
          </View>
        ))}
      </View>
    )}

    {data.skills && data.skills.length > 0 && (
      <View className="mb-6">
        <Text className="text-lg font-serif font-bold border-b border-gray-300 mb-2 uppercase">
          Skills
        </Text>
        <Text className="font-serif text-gray-800 dark:text-gray-200">
          {data.skills
            .map((s) => (typeof s === "string" ? s : s.name))
            .join(" • ")}
        </Text>
      </View>
    )}
  </View>
);

const MinimalTemplate = ({ data }: { data: ResumeData }) => (
  <View className="flex-1 px-2">
    <View className="mb-8">
      <Text className="text-5xl font-light text-slate-900 dark:text-white mb-2 tracking-tight">
        {data.profile?.fullName || "Your Name"}
      </Text>
      <Text className="text-slate-500 dark:text-slate-400 text-sm tracking-widest uppercase">
        {data.profile?.email} • {data.profile?.location}
      </Text>
    </View>

    <View className="flex-row">
      <View className="flex-1 pr-4">
        {data.summary && (
          <View className="mb-8">
            <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              About
            </Text>
            <Text className="text-slate-800 dark:text-slate-200 leading-6">
              {data.summary}
            </Text>
          </View>
        )}

        {data.experience && data.experience.length > 0 && (
          <View className="mb-8">
            <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Experience
            </Text>
            {data.experience.map((exp, index) => (
              <View
                key={index}
                className="mb-6 relative pl-4 border-l border-slate-200 dark:border-slate-800"
              >
                <Text className="font-bold text-slate-900 dark:text-white mb-1">
                  {exp.position}
                </Text>
                <Text className="text-slate-500 text-xs mb-2 uppercase">
                  {exp.company} • {exp.startDate} - {exp.endDate}
                </Text>
                <Text className="text-slate-700 dark:text-slate-300 leading-5 text-sm">
                  {exp.description}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <View className="mb-8">
            <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Projects
            </Text>
            {data.projects.map((proj, index) => (
              <View
                key={index}
                className="mb-6 relative pl-4 border-l border-slate-200 dark:border-slate-800"
              >
                <Text className="font-bold text-slate-900 dark:text-white mb-1">
                  {proj.name}
                </Text>
                <Text className="text-slate-700 dark:text-slate-300 leading-5 text-sm">
                  {proj.description}
                </Text>
                {proj.technologies && proj.technologies.length > 0 && (
                  <Text className="text-slate-400 text-xs mt-1">
                    {proj.technologies.join(", ")}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}
      </View>

      <View className="w-1/3 pl-4 border-l border-slate-100 dark:border-slate-800">
        {data.skills && data.skills.length > 0 && (
          <View className="mb-8">
            <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              Skills
            </Text>
            <View className="gap-2">
              {data.skills.map((skill, index) => (
                <Text
                  key={index}
                  className="text-slate-700 dark:text-slate-300 text-sm font-medium"
                >
                  {typeof skill === "string" ? skill : skill.name}
                </Text>
              ))}
            </View>
          </View>
        )}

        {data.education && data.education.length > 0 && (
          <View className="mb-8">
            <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              Education
            </Text>
            {data.education.map((edu, index) => (
              <View key={index} className="mb-4">
                <Text className="font-bold text-slate-900 dark:text-white text-sm">
                  {edu.institution}
                </Text>
                <Text className="text-slate-600 dark:text-slate-400 text-xs mt-1">
                  {edu.degree}
                </Text>
                <Text className="text-slate-400 text-xs mt-1">
                  {edu.endDate}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  </View>
);

export const ResumePreviewModal = ({
  visible,
  onClose,
  data,
}: PreviewModalProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<
    "modern" | "classic" | "minimal"
  >("modern");
  const [isExporting, setIsExporting] = useState(false);

  const handlePortfolioPress = () => {
    Linking.openURL("https://arhanansari.vercel.app"); // Replace with actual portfolio URL
  };

  const handleExportWord = async () => {
    setIsExporting(true);
    try {
      await WordService.generateAndShare(data, selectedTemplate);
    } catch (error) {
      Alert.alert(
        "Export Failed",
        "Could not generate the Word document. Please try again.",
      );
    } finally {
      setIsExporting(false);
    }
  };

  const renderTemplate = () => {
    switch (selectedTemplate) {
      case "classic":
        return <ClassicTemplate data={data} />;
      case "minimal":
        return <MinimalTemplate data={data} />;
      case "modern":
      default:
        return <ModernTemplate data={data} />;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
        <View className="flex-row justify-between items-center px-4 py-3 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
          <Text className="text-lg font-bold dark:text-white">
            Resume Preview
          </Text>
          <View className="flex-row gap-2">
            <Button
              title={isExporting ? "Generating..." : "Export Word"}
              variant="outline"
              onPress={handleExportWord}
              loading={isExporting}
              size="sm"
              className="border-blue-200 dark:border-blue-800"
            />
            <Button title="Close" variant="ghost" onPress={onClose} size="sm" />
          </View>
        </View>

        <View className="px-4 py-2 bg-slate-100 dark:bg-slate-800 flex-row items-center justify-between">
          <Text className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Template:
          </Text>
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => setSelectedTemplate("modern")}
              className={`px-3 py-1 rounded-full ${selectedTemplate === "modern" ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700"}`}
            >
              <Text
                className={`text-xs font-bold ${selectedTemplate === "modern" ? "text-white" : "text-slate-600 dark:text-slate-300"}`}
              >
                Modern
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedTemplate("classic")}
              className={`px-3 py-1 rounded-full ${selectedTemplate === "classic" ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700"}`}
            >
              <Text
                className={`text-xs font-bold ${selectedTemplate === "classic" ? "text-white" : "text-slate-600 dark:text-slate-300"}`}
              >
                Classic
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedTemplate("minimal")}
              className={`px-3 py-1 rounded-full ${selectedTemplate === "minimal" ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700"}`}
            >
              <Text
                className={`text-xs font-bold ${selectedTemplate === "minimal" ? "text-white" : "text-slate-600 dark:text-slate-300"}`}
              >
                Minimal
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          className="flex-1 p-6"
          contentContainerStyle={{ paddingBottom: 50 }}
        >
          {renderTemplate()}

          {/* Footer */}
          <View className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 items-center gap-2">
            <Text className="text-slate-400 text-xs mb-1">
              Generated by ResuMate App
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};
