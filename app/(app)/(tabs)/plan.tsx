import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FEATURES = [
  { icon: "document-text-outline", label: "Unlimited resumes" },
  { icon: "layers-outline", label: "All 8 templates" },
  { icon: "download-outline", label: "PDF & Word (.docx) export" },
  { icon: "sparkles-outline", label: "Unlimited AI requests" },
  { icon: "analytics-outline", label: "ATS Score analysis" },
  { icon: "mail-outline", label: "Cover Letter generator" },
  { icon: "search-outline", label: "Keyword Match tool" },
  { icon: "mic-outline", label: "Interview Prep tool" },
  { icon: "flash-outline", label: "Priority AI processing" },
  { icon: "star-outline", label: "Early access features" },
] as const;

export default function PlanScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="px-5 pt-4 pb-5 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <View className="flex-row items-center gap-3 mb-1">
          <View className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 items-center justify-center">
            <Ionicons name="gift-outline" size={18} color="#4F46E5" />
          </View>
          <Text className="text-2xl font-bold text-slate-900 dark:text-white">
            Free for Everyone
          </Text>
        </View>
        <Text className="text-slate-500 text-sm">
          All features are now free — no subscriptions needed
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner */}
        <View className="bg-indigo-600 rounded-2xl p-5 mb-6 items-center">
          <Text className="text-4xl mb-2">🎉</Text>
          <Text className="text-white font-bold text-xl text-center mb-1">
            ResuMate is 100% Free
          </Text>
          <Text className="text-indigo-200 text-sm text-center">
            Every feature is unlocked for all users — forever.
          </Text>
        </View>

        {/* Feature list */}
        <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Everything Included
        </Text>
        <View className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          {FEATURES.map((feature, index) => (
            <View
              key={feature.label}
              className={`flex-row items-center gap-3 px-4 py-3.5 ${
                index < FEATURES.length - 1
                  ? "border-b border-slate-100 dark:border-slate-800"
                  : ""
              }`}
            >
              <View className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 items-center justify-center">
                <Ionicons
                  name={feature.icon as any}
                  size={16}
                  color="#4F46E5"
                />
              </View>
              <Text className="flex-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
                {feature.label}
              </Text>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
