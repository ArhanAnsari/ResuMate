import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = ({
  icon = "documents-outline",
  title,
  subtitle,
  actionLabel,
  onAction,
}: EmptyStateProps) => (
  <View className="flex-1 items-center justify-center py-20 px-8">
    <View className="w-24 h-24 rounded-full bg-indigo-50 dark:bg-indigo-900/30 items-center justify-center mb-6">
      <Ionicons name={icon} size={44} color="#818CF8" />
    </View>
    <Text className="text-xl font-bold text-slate-800 dark:text-slate-100 text-center mb-2">
      {title}
    </Text>
    {subtitle && (
      <Text className="text-slate-500 dark:text-slate-400 text-center text-base leading-6 mb-6">
        {subtitle}
      </Text>
    )}
    {actionLabel && onAction && (
      <TouchableOpacity
        onPress={onAction}
        activeOpacity={0.8}
        className="bg-indigo-600 px-6 py-3 rounded-xl"
      >
        <Text className="text-white font-bold text-base">{actionLabel}</Text>
      </TouchableOpacity>
    )}
  </View>
);
