import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { CustomAlert } from "@/src/components/ui/CustomAlert";
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
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

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

  // Keep track of open swipeable rows to close them when another opens
  const openSwipeableRef = useRef<Swipeable | null>(null);

  useEffect(() => {
    if (user?.$id) {
      fetchResumes(user.$id);
    }
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
    setOptionsModalVisible(false); // Close options if open

    try {
      await deleteResume(resumeToDelete);
      showToast("Resume deleted successfully", "success");
    } catch (error) {
      showToast("Failed to delete resume", "error");
    }
    setResumeToDelete(null);
  };
  const handleExport = async (id: string) => {
    const resume = resumes.find((r) => r.$id === id);
    if (!resume) {
      showToast("Resume not found", "error");
      return;
    }

    setOptionsModalVisible(false);
    showToast("Generating PDF...", "info");

    try {
      await PDFService.generateAndShare(resume);
      if (hapticsEnabled)
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Send a local notification
      await NotificationService.scheduleNotification(
        "Export Successful",
        `Your resume "${resume.title}" is ready.`,
      );

      showToast("Export successful", "success");
    } catch (error) {
      showToast("Failed to export PDF", "error");
    }
  };
  const handleLongPress = (id: string, title: string) => {
    if (hapticsEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setSelectedResume({ id, title });
    setOptionsModalVisible(true);
  };

  const renderRightActions = (id: string) => {
    return (
      <TouchableOpacity
        className="bg-red-500 justify-center items-center w-20 mb-4 ml-4 rounded-lg h-5/6 self-center"
        onPress={() => confirmDelete(id)}
      >
        <Ionicons name="trash-outline" size={24} color="white" />
      </TouchableOpacity>
    );
  };

  const onSwipeableWillOpen = (swipeable: Swipeable) => {
    if (openSwipeableRef.current && openSwipeableRef.current !== swipeable) {
      openSwipeableRef.current.close();
    }
    openSwipeableRef.current = swipeable;
    if (hapticsEnabled) Haptics.selectionAsync();
  };

  const renderItem = ({ item }: { item: any }) => {
    let swipeableRef: Swipeable | null = null;
    // ... existing wrapper logic
    return (
      <Swipeable
        ref={(ref) => {
          swipeableRef = ref;
        }}
        renderRightActions={() => renderRightActions(item.$id)}
        onSwipeableWillOpen={() => {
          if (swipeableRef) {
            onSwipeableWillOpen(swipeableRef);
          }
        }}
        containerStyle={{ overflow: "visible" }}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onLongPress={() => handleLongPress(item.$id, item.title)}
          onPress={() => router.push(`/(app)/resume/${item.$id}`)}
        >
          <Card className="mb-4 bg-white dark:bg-slate-800">
            <View className="flex-row justify-between items-center">
              <View className="flex-1 pr-4">
                <Text
                  className="text-lg font-bold text-slate-900 dark:text-white"
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                <Text className="text-sm text-slate-500 mt-1">
                  Updated {new Date(item.$updatedAt).toLocaleDateString()}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
            </View>
          </Card>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950 px-4 pt-4">
      <View className="flex-row justify-between items-center mb-6">
        <View>
          <Text className="text-2xl font-bold text-slate-900 dark:text-white">
            My Resumes
          </Text>
          <Text className="text-slate-500">Welcome back, {user?.name}</Text>
        </View>
        <Button
          title="Create"
          size="sm"
          onPress={() => router.push("/(app)/(tabs)/create")}
        />
      </View>

      <FlatList
        data={resumes}
        renderItem={renderItem}
        keyExtractor={(item) => item.$id}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          !isLoading ? (
            <View className="items-center justify-center py-20">
              <Ionicons name="documents-outline" size={64} color="#CBD5E1" />
              <Text className="text-slate-400 mt-4 text-center">
                No resumes found.{"\n"}Create your first one!
              </Text>
            </View>
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => user?.$id && fetchResumes(user.$id)}
          />
        }
      />

      <CustomAlert
        visible={deleteModalVisible}
        title="Delete Resume"
        message="Are you sure you want to delete this resume? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="destructive"
        onCancel={() => setDeleteModalVisible(false)}
        onConfirm={performDelete}
      />

      {/* Quick Actions Modal */}
      <Modal
        transparent
        visible={optionsModalVisible}
        animationType="fade"
        onRequestClose={() => setOptionsModalVisible(false)}
      >
        <TouchableOpacity
          className="flex-1 justify-end bg-black/50"
          activeOpacity={1}
          onPress={() => setOptionsModalVisible(false)}
        >
          <View className="bg-white dark:bg-slate-900 rounded-t-3xl p-6 border-t border-slate-200 dark:border-slate-800">
            <Text className="text-xl font-bold text-slate-900 dark:text-white mb-4 text-center">
              {selectedResume?.title}
            </Text>

            <TouchableOpacity
              className="flex-row items-center p-4 bg-slate-100 dark:bg-slate-800 rounded-xl mb-3"
              onPress={() => {
                setOptionsModalVisible(false);
                if (selectedResume)
                  router.push(`/(app)/resume/${selectedResume.id}`);
              }}
            >
              <Ionicons
                name="create-outline"
                size={24}
                className="text-slate-900 dark:text-white mr-3"
              />
              {/* NativeWind might not apply to Ionicons directly via className, using style or color prop is better but let's try strict props */}
              <Text className="text-lg font-medium text-slate-900 dark:text-white">
                Edit Resume
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center p-4 bg-slate-100 dark:bg-slate-800 rounded-xl mb-3"
              onPress={() => {
                if (selectedResume) handleExport(selectedResume.id);
              }}
            >
              <Ionicons
                name="document-text-outline"
                size={24}
                className="text-slate-900 dark:text-white mr-3"
              />
              <Text className="text-lg font-medium text-slate-900 dark:text-white">
                Export PDF
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center p-4 bg-red-50 dark:bg-red-900/20 rounded-xl mb-6"
              onPress={() => {
                if (selectedResume) confirmDelete(selectedResume.id);
              }}
            >
              <Ionicons
                name="trash-outline"
                size={24}
                color="#EF4444"
                style={{ marginRight: 12 }}
              />
              <Text className="text-lg font-medium text-red-500">
                Delete Resume
              </Text>
            </TouchableOpacity>

            <Button
              title="Cancel"
              variant="ghost"
              onPress={() => setOptionsModalVisible(false)}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
