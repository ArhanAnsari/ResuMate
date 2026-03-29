import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { CustomAlert } from "@/src/components/ui/CustomAlert";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SkeletonResumeCard } from "@/src/components/ui/SkeletonLoader";
import { useToast } from "@/src/context/ToastContext";
import { NotificationService } from "@/src/services/notifications/NotificationService";
import { PDFService } from "@/src/services/pdf/PDFService";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useResumeStore } from "@/src/store/useResumeStore";
import { useSettingsStore } from "@/src/store/useSettingsStore";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Modal,
  RefreshControl,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const ATSBadge = ({ score }: { score?: number }) => {
  if (score === undefined || score === null) return null;
  const color =
    score >= 80 ? "#10B981" : score >= 60 ? "#F59E0B" : "#EF4444";
  const bg =
    score >= 80 ? "#ECFDF5" : score >= 60 ? "#FFFBEB" : "#FEF2F2";
  const darkBg =
    score >= 80 ? "#022C22" : score >= 60 ? "#2D1600" : "#2D0A0A";
  return (
    <View
      style={{ backgroundColor: bg }}
      className="dark:bg-opacity-20 flex-row items-center gap-1 px-2 py-0.5 rounded-full"
    >
      <View
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      <Text className="text-xs font-bold" style={{ color }}>
        ATS {score}%
      </Text>
    </View>
  );
};

export default function ResumeDashboard() {
  const { user } = useAuthStore();
  const { resumes, fetchResumes, deleteResume, isLoading } = useResumeStore();
  const { hapticsEnabled } = useSettingsStore();
  const { showToast } = useToast();
  const router = useRouter();

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState<string | null>(null);
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [selectedResume, setSelectedResume] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const openSwipeableRef = useRef<Swipeable | null>(null);

  useEffect(() => {
    if (user?.$id) fetchResumes(user.$id);
  }, [user]);

  const confirmDelete = (id: string) => {
    setResumeToDelete(id);
    setDeleteModalVisible(true);
    if (hapticsEnabled)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  };

  const performDelete = async () => {
    if (!resumeToDelete) return;
    setDeleteModalVisible(false);
    setOptionsModalVisible(false);
    try {
      await deleteResume(resumeToDelete);
      showToast("Resume deleted", "success");
    } catch {
      showToast("Failed to delete resume", "error");
    }
    setResumeToDelete(null);
  };

  const handleExport = async (id: string) => {
    const resume = resumes.find((r) => r.$id === id);
    if (!resume) { showToast("Resume not found", "error"); return; }
    setOptionsModalVisible(false);
    showToast("Generating PDF…", "info");
    try {
      await PDFService.generateAndShare(resume);
      if (hapticsEnabled)
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await NotificationService.scheduleNotification(
        "Export Successful",
        `"${resume.title}" is ready.`,
      );
      showToast("PDF exported!", "success");
    } catch {
      showToast("Failed to export PDF", "error");
    }
  };

  const handleLongPress = (id: string, title: string) => {
    if (hapticsEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setSelectedResume({ id, title });
    setOptionsModalVisible(true);
  };

  const onSwipeableWillOpen = (swipeable: Swipeable) => {
    if (openSwipeableRef.current && openSwipeableRef.current !== swipeable)
      openSwipeableRef.current.close();
    openSwipeableRef.current = swipeable;
    if (hapticsEnabled) Haptics.selectionAsync();
  };

  const renderRightActions = (id: string) => (
    <TouchableOpacity
      className="bg-red-500 justify-center items-center w-20 mb-3 ml-2 rounded-2xl"
      onPress={() => confirmDelete(id)}
    >
      <Ionicons name="trash-outline" size={22} color="white" />
      <Text className="text-white text-xs font-semibold mt-1">Delete</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: any }) => {
    let swipeableRef: Swipeable | null = null;
    const atsScore = item.atsScore ?? undefined;
    const updatedAgo = new Date(item.$updatedAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    return (
      <Swipeable
        ref={(ref) => { swipeableRef = ref; }}
        renderRightActions={() => renderRightActions(item.$id)}
        onSwipeableWillOpen={() => {
          if (swipeableRef) onSwipeableWillOpen(swipeableRef);
        }}
        containerStyle={{ overflow: "visible" }}
      >
        <TouchableOpacity
          activeOpacity={0.88}
          onLongPress={() => handleLongPress(item.$id, item.title)}
          onPress={() => router.push(`/(app)/resume/${item.$id}`)}
          className="mb-3"
        >
          <Card variant="elevated" className="p-0 overflow-hidden">
            {/* Accent bar */}
            <View className="h-1 bg-indigo-500 rounded-t-2xl" />
            <View className="p-4">
              <View className="flex-row justify-between items-start">
                <View className="flex-1 pr-3">
                  <Text
                    className="text-base font-bold text-slate-900 dark:text-white mb-1"
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                  <Text className="text-xs text-slate-400">
                    Updated {updatedAgo}
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  {atsScore !== undefined && <ATSBadge score={atsScore} />}
                  <View className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 items-center justify-center">
                    <Ionicons name="document-text" size={16} color="#4F46E5" />
                  </View>
                </View>
              </View>

              {/* Action row */}
              <View className="flex-row gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/50">
                <TouchableOpacity
                  onPress={() => router.push(`/(app)/resume/${item.$id}`)}
                  className="flex-1 flex-row items-center justify-center gap-1.5 bg-indigo-50 dark:bg-indigo-900/20 py-2 rounded-xl"
                >
                  <Ionicons name="create-outline" size={15} color="#4F46E5" />
                  <Text className="text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
                    Edit
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleExport(item.$id)}
                  className="flex-1 flex-row items-center justify-center gap-1.5 bg-slate-100 dark:bg-slate-700/50 py-2 rounded-xl"
                >
                  <Ionicons name="share-outline" size={15} color="#64748B" />
                  <Text className="text-slate-600 dark:text-slate-300 text-xs font-semibold">
                    Export
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleLongPress(item.$id, item.title)}
                  className="w-9 items-center justify-center bg-slate-100 dark:bg-slate-700/50 py-2 rounded-xl"
                >
                  <Ionicons name="ellipsis-horizontal" size={15} color="#64748B" />
                </TouchableOpacity>
              </View>
            </View>
          </Card>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="px-5 pt-4 pb-5 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-2xl font-bold text-slate-900 dark:text-white">
              Hello, {firstName} 👋
            </Text>
            <Text className="text-slate-500 text-sm mt-0.5">
              {resumes.length} resume{resumes.length !== 1 ? "s" : ""} · Ready to impress
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/(app)/(tabs)/create")}
            className="bg-indigo-600 w-10 h-10 rounded-full items-center justify-center shadow-md shadow-indigo-500/30"
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Quick actions */}
        <View className="flex-row gap-2 mt-4">
          <TouchableOpacity
            onPress={() => router.push("/(app)/(tabs)/create")}
            className="flex-row items-center gap-1.5 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50 px-3 py-2 rounded-xl"
          >
            <Ionicons name="add-circle-outline" size={16} color="#4F46E5" />
            <Text className="text-indigo-700 dark:text-indigo-300 text-xs font-semibold">New Resume</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/(app)/(tabs)/ai")}
            className="flex-row items-center gap-1.5 bg-violet-50 dark:bg-violet-900/30 border border-violet-100 dark:border-violet-800/50 px-3 py-2 rounded-xl"
          >
            <Ionicons name="sparkles-outline" size={16} color="#7C3AED" />
            <Text className="text-violet-700 dark:text-violet-300 text-xs font-semibold">AI Tools</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/(app)/profile")}
            className="flex-row items-center gap-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl"
          >
            <Ionicons name="person-circle-outline" size={16} color="#64748B" />
            <Text className="text-slate-600 dark:text-slate-300 text-xs font-semibold">Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={isLoading ? [] : resumes}
        renderItem={renderItem}
        keyExtractor={(item) => item.$id}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          isLoading ? (
            <View>
              <SkeletonResumeCard />
              <SkeletonResumeCard />
              <SkeletonResumeCard />
            </View>
          ) : null
        }
        ListEmptyComponent={
          !isLoading ? (
            <EmptyState
              icon="document-text-outline"
              title="No resumes yet"
              subtitle="Create your first resume in minutes with AI assistance"
              actionLabel="Create Resume"
              onAction={() => router.push("/(app)/(tabs)/create")}
            />
          ) : null
        }
        ListFooterComponent={
          resumes.length > 0 && !isLoading ? (
            <View className="mt-2 bg-indigo-600 rounded-2xl p-4 flex-row items-center gap-3">
                <Ionicons name="sparkles" size={20} color="#FDE68A" />
                <View className="flex-1">
                  <Text className="text-white font-bold text-sm">All AI Tools Are Free 🎉</Text>
                  <Text className="text-indigo-200 text-xs">ATS scoring, cover letters & interview prep</Text>
                </View>
                <TouchableOpacity onPress={() => router.push("/(app)/(tabs)/ai")} className="bg-white/20 px-3 py-1.5 rounded-lg">
                  <Text className="text-white font-bold text-xs">Try</Text>
                </TouchableOpacity>
              </View>
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => user?.$id && fetchResumes(user.$id)}
            tintColor="#4F46E5"
            colors={["#4F46E5"]}
          />
        }
      />

      {/* Delete confirm */}
      <CustomAlert
        visible={deleteModalVisible}
        title="Delete Resume"
        message="This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="destructive"
        onCancel={() => setDeleteModalVisible(false)}
        onConfirm={performDelete}
      />

      {/* Options Modal */}
      <Modal
        transparent
        visible={optionsModalVisible}
        animationType="slide"
        onRequestClose={() => setOptionsModalVisible(false)}
      >
        <TouchableOpacity
          className="flex-1 justify-end bg-black/60"
          activeOpacity={1}
          onPress={() => setOptionsModalVisible(false)}
        >
          <View className="bg-white dark:bg-slate-900 rounded-t-3xl p-6 border-t border-slate-200 dark:border-slate-800">
            {/* Handle */}
            <View className="w-12 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-5" />
            <Text className="text-lg font-bold text-slate-900 dark:text-white mb-5 text-center">
              {selectedResume?.title}
            </Text>

            {[
              {
                icon: "create-outline" as const,
                label: "Edit Resume",
                className: "bg-indigo-50 dark:bg-indigo-900/20",
                textColor: "text-indigo-700 dark:text-indigo-300",
                iconColor: "#4F46E5",
                onPress: () => {
                  setOptionsModalVisible(false);
                  if (selectedResume) router.push(`/(app)/resume/${selectedResume.id}`);
                },
              },
              {
                icon: "share-outline" as const,
                label: "Export PDF",
                className: "bg-slate-100 dark:bg-slate-800",
                textColor: "text-slate-800 dark:text-slate-200",
                iconColor: "#64748B",
                onPress: () => { if (selectedResume) handleExport(selectedResume.id); },
              },
              {
                icon: "trash-outline" as const,
                label: "Delete",
                className: "bg-red-50 dark:bg-red-900/20",
                textColor: "text-red-600",
                iconColor: "#EF4444",
                onPress: () => { if (selectedResume) confirmDelete(selectedResume.id); },
              },
            ].map((action) => (
              <TouchableOpacity
                key={action.label}
                className={`flex-row items-center gap-3 p-4 rounded-2xl mb-2 ${action.className}`}
                onPress={action.onPress}
              >
                <Ionicons name={action.icon} size={22} color={action.iconColor} />
                <Text className={`text-base font-semibold ${action.textColor}`}>
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}

            <Button
              title="Cancel"
              variant="ghost"
              onPress={() => setOptionsModalVisible(false)}
              className="mt-2"
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
