import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useResumeStore } from "@/src/store/useResumeStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
    Alert,
    FlatList,
    RefreshControl,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ResumeDashboard() {
  const { user } = useAuthStore();
  const { resumes, fetchResumes, deleteResume, isLoading } = useResumeStore();
  const router = useRouter();

  useEffect(() => {
    if (user?.$id) {
      fetchResumes(user.$id);
    }
  }, [user]);

  const handleDelete = (id: string) => {
    Alert.alert("Delete Resume", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteResume(id) },
    ]);
  };

  const renderItem = ({ item }: { item: any }) => (
    <Card className="mb-4">
      <View className="flex-row justify-between items-start">
        <View>
          <Text className="text-lg font-bold text-slate-900 dark:text-white">
            {item.title}
          </Text>
          <Text className="text-sm text-slate-500 mt-1">
            Last updated: {new Date(item.$updatedAt).toLocaleDateString()}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => handleDelete(item.$id)}
          className="p-2"
        >
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
      <View className="flex-row mt-4 space-x-2">
        <Button
          title="Edit"
          variant="outline"
          size="sm"
          onPress={() => router.push(`/(app)/resume/${item.$id}`)}
          className="flex-1"
        />
        <Button
          title="PDF"
          variant="ghost"
          size="sm"
          onPress={() =>
            Alert.alert("Coming Soon", "PDF Export will differ by template.")
          }
        />
      </View>
    </Card>
  );

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
    </SafeAreaView>
  );
}
