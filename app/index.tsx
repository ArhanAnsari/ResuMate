import { ActivityIndicator, Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center bg-white dark:bg-slate-900">
      <ActivityIndicator size="large" color="#2563EB" />
      <Text className="mt-4 text-slate-500 font-medium">
        Loading ResuMate...
      </Text>
    </View>
  );
}
