import { useToast } from "@/src/context/ToastContext";
import { AIService } from "@/src/services/ai/gemini";
import { useResumeStore } from "@/src/store/useResumeStore";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ToolId =
  | "ats_score"
  | "cover_letter"
  | "enhance"
  | "keywords"
  | "interview";

interface AiTool {
  id: ToolId;
  icon: keyof typeof import("@expo/vector-icons/build/Icons").Ionicons.glyphMap;
  title: string;
  description: string;
  gradient: [string, string];
  needsJobDescription?: boolean;
}

const tools: AiTool[] = [
  {
    id: "ats_score",
    icon: "analytics-outline",
    title: "ATS Score",
    description:
      "Analyse your resume against ATS systems and get an instant score",
    gradient: ["#4F46E5", "#6366F1"],
    needsJobDescription: true,
  },
  {
    id: "cover_letter",
    icon: "mail-outline",
    title: "Cover Letter",
    description: "Generate a tailored cover letter for any job posting",
    gradient: ["#7C3AED", "#8B5CF6"],
    needsJobDescription: true,
  },
  {
    id: "enhance",
    icon: "sparkles-outline",
    title: "AI Enhance",
    description: "Rewrite your resume sections with impactful language",
    gradient: ["#0EA5E9", "#38BDF8"],
  },
  {
    id: "keywords",
    icon: "search-outline",
    title: "Keyword Match",
    description: "Match your resume to a job description with missing keywords",
    gradient: ["#10B981", "#34D399"],
    needsJobDescription: true,
  },
  {
    id: "interview",
    icon: "mic-outline",
    title: "Interview Prep",
    description: "Get tailored interview questions based on your resume",
    gradient: ["#F59E0B", "#FBBF24"],
  },
];

export default function AIHub() {
  const { resumes } = useResumeStore();
  const { showToast } = useToast();

  const [activeTool, setActiveTool] = useState<ToolId | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedResume = resumes[0];
  const DEFAULT_JOB_CONTEXT = "General software engineering role";

  const handleTool = async (toolId: ToolId) => {
    if (!selectedResume) {
      showToast("Create a resume first", "error");
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setActiveTool(toolId);
    setResult("");
    setJobDescription("");
  };

  const runAnalysis = async () => {
    if (!selectedResume || !activeTool) return;
    setLoading(true);
    setResult("");
    try {
      const resumeText = JSON.stringify(selectedResume);
      let output = "";

      if (activeTool === "ats_score") {
        const context = `Resume: ${resumeText}\nJob description: ${jobDescription || DEFAULT_JOB_CONTEXT}`;
        output = await AIService.enhanceResumeSection(context, "ats_score");
      } else if (activeTool === "enhance") {
        output = await AIService.enhanceResumeSection(
          selectedResume.summary || resumeText,
          "summary",
        );
      } else if (activeTool === "cover_letter") {
        const context = jobDescription
          ? `Resume: ${resumeText}\nJob description: ${jobDescription}`
          : resumeText;
        output = await AIService.enhanceResumeSection(context, "cover_letter");
      } else if (activeTool === "keywords") {
        const context = `Resume: ${resumeText}\nJob description: ${jobDescription || DEFAULT_JOB_CONTEXT}`;
        output = await AIService.enhanceResumeSection(context, "keywords");
      } else if (activeTool === "interview") {
        const context = `Resume: ${resumeText}${jobDescription ? `\nJob description: ${jobDescription}` : ""}`;
        output = await AIService.enhanceResumeSection(context, "interview");
      }

      setResult(output);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      showToast("AI analysis failed. Check your API key in Settings.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="px-5 pt-4 pb-5 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <View className="flex-row items-center gap-3 mb-1">
          <View className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/30 items-center justify-center">
            <Ionicons name="sparkles" size={18} color="#7C3AED" />
          </View>
          <Text className="text-2xl font-bold text-slate-900 dark:text-white">
            AI Hub
          </Text>
        </View>
        <Text className="text-slate-500 text-sm">
          Supercharge your job search with AI — all tools free
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Tool cards */}
        <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Available Tools
        </Text>

        {tools.map((tool) => {
          const isActive = activeTool === tool.id;

          return (
            <TouchableOpacity
              key={tool.id}
              activeOpacity={0.88}
              onPress={() => handleTool(tool.id)}
              className={`mb-3 rounded-2xl overflow-hidden border ${
                isActive
                  ? "border-indigo-300 dark:border-indigo-700"
                  : "border-slate-200 dark:border-slate-800"
              } bg-white dark:bg-slate-900`}
            >
              <View className="p-4">
                <View className="flex-row items-start justify-between">
                  <View
                    className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                    style={{ backgroundColor: tool.gradient[0] + "18" }}
                  >
                    <Ionicons
                      name={tool.icon}
                      size={20}
                      color={tool.gradient[0]}
                    />
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-1">
                      <Text className="text-base font-bold text-slate-900 dark:text-white">
                        {tool.title}
                      </Text>
                      <View
                        className="px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: "#10B98115" }}
                      >
                        <Text
                          className="text-xs font-bold"
                          style={{ color: "#10B981" }}
                        >
                          Free
                        </Text>
                      </View>
                    </View>
                    <Text className="text-sm text-slate-500 dark:text-slate-400">
                      {tool.description}
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={isActive ? "#4F46E5" : "#94A3B8"}
                  />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Active tool panel */}
        {activeTool && (
          <View className="mt-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <View className="px-4 pt-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Text className="text-base font-bold text-slate-900 dark:text-white">
                {tools.find((t) => t.id === activeTool)?.title}
              </Text>
            </View>
            <View className="p-4">
              {tools.find((t) => t.id === activeTool)?.needsJobDescription && (
                <>
                  <Text className="text-sm text-slate-500 mb-2">
                    Job description{" "}
                    {activeTool === "keywords" || activeTool === "cover_letter"
                      ? "(recommended)"
                      : "(optional — improves accuracy)"}
                  </Text>
                  <TextInput
                    className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white text-sm min-h-[80px]"
                    placeholder="Paste job description here…"
                    placeholderTextColor="#94A3B8"
                    multiline
                    value={jobDescription}
                    onChangeText={setJobDescription}
                    textAlignVertical="top"
                  />
                </>
              )}

              {activeTool === "enhance" && (
                <Text className="text-sm text-slate-500 mb-3">
                  Resume:{" "}
                  <Text className="font-semibold text-slate-700 dark:text-slate-200">
                    {selectedResume?.title}
                  </Text>
                </Text>
              )}

              <TouchableOpacity
                onPress={runAnalysis}
                disabled={loading || !selectedResume}
                className="mt-3 bg-indigo-600 py-3 rounded-xl flex-row items-center justify-center gap-2"
                style={{ opacity: loading || !selectedResume ? 0.6 : 1 }}
              >
                {loading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Ionicons name="sparkles" size={16} color="white" />
                )}
                <Text className="text-white font-bold text-sm">
                  {loading ? "Analysing…" : "Run Analysis"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Result */}
            {result ? (
              <View className="mx-4 mb-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
                <Text className="text-xs font-bold text-indigo-600 mb-2">
                  Result
                </Text>
                <Text className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  {result}
                </Text>
              </View>
            ) : null}
          </View>
        )}

        {/* Free banner */}
        <View className="mt-4 bg-indigo-600 rounded-2xl p-5">
          <View className="flex-row items-center gap-2 mb-2">
            <Text className="text-xl">🎉</Text>
            <Text className="text-white font-bold text-base">
              All Tools Are Free
            </Text>
          </View>
          <Text className="text-indigo-200 text-sm">
            ResuMate is now 100% free for everyone. Enjoy all AI-powered tools
            with no restrictions.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
