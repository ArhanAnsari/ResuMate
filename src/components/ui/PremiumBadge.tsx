import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

type PlanTier = "pro" | "premium";

interface PremiumBadgeProps {
  tier?: PlanTier;
  size?: "sm" | "md";
}

interface LockedFeatureProps {
  tier?: PlanTier;
  onPress?: () => void;
  children: React.ReactNode;
  dimmed?: boolean;
}

export const PremiumBadge = ({
  tier = "premium",
  size = "md",
}: PremiumBadgeProps) => {
  const isPremium = tier === "premium";
  const label = isPremium ? "PREMIUM" : "PRO";
  const bgClass = isPremium ? "bg-violet-600" : "bg-indigo-600";

  return (
    <View
      className={`${bgClass} px-${size === "sm" ? "2" : "3"} py-0.5 rounded-full flex-row items-center gap-1`}
    >
      <Ionicons name="sparkles" size={size === "sm" ? 10 : 12} color="white" />
      <Text
        className={`text-white font-bold ${size === "sm" ? "text-xs" : "text-xs"} tracking-wider`}
      >
        {label}
      </Text>
    </View>
  );
};

export const LockedFeature = ({
  tier = "premium",
  onPress,
  children,
  dimmed = true,
}: LockedFeatureProps) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.85}
    className="relative"
    disabled={!onPress}
  >
    <View className={dimmed ? "opacity-40" : undefined}>{children}</View>
    <View className="absolute inset-0 items-center justify-center">
      <View className="bg-violet-600/90 px-4 py-2 rounded-xl flex-row items-center gap-2 shadow-lg shadow-violet-900/30">
        <Ionicons name="lock-closed" size={14} color="white" />
        <Text className="text-white text-sm font-bold">
          {tier === "pro" ? "Pro Feature" : "Premium Feature"}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

interface UpgradeBannerProps {
  title?: string;
  subtitle?: string;
  onPress?: () => void;
  tier?: PlanTier;
}

export const UpgradeBanner = ({
  title = "Unlock AI-Powered Features",
  subtitle = "Get ATS scoring, cover letters & more",
  onPress,
  tier = "premium",
}: UpgradeBannerProps) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.9}
    className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-4 mx-0 overflow-hidden"
    style={{
      backgroundColor: "#4F46E5",
    }}
  >
    <View className="flex-row items-center justify-between">
      <View className="flex-1 pr-4">
        <View className="flex-row items-center gap-2 mb-1">
          <Ionicons name="sparkles" size={16} color="#FCD34D" />
          <Text className="text-yellow-300 text-xs font-bold tracking-wider">
            {tier.toUpperCase()}
          </Text>
        </View>
        <Text className="text-white font-bold text-base mb-0.5">{title}</Text>
        <Text className="text-indigo-200 text-xs">{subtitle}</Text>
      </View>
      <View className="bg-white/20 px-3 py-2 rounded-xl">
        <Text className="text-white font-bold text-sm">Upgrade</Text>
      </View>
    </View>
  </TouchableOpacity>
);
