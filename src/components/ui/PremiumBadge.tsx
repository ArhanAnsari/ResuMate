import { Text, View } from "react-native";

// Legacy premium badge — kept for backward compatibility.
// ResuMate is now 100% free; all features are unlocked.

interface PremiumBadgeProps {
  tier?: "pro" | "premium";
  size?: "sm" | "md";
}

export const PremiumBadge = ({
  tier = "premium",
  size = "md",
}: PremiumBadgeProps) => {
  const label = tier === "premium" ? "PREMIUM" : "PRO";
  const bgColor = tier === "premium" ? "#7C3AED" : "#4F46E5";

  return (
    <View
      style={{
        backgroundColor: bgColor,
        paddingHorizontal: size === "sm" ? 8 : 12,
        paddingVertical: 2,
        borderRadius: 999,
      }}
    >
      <Text style={{ color: "white", fontWeight: "700", fontSize: 10 }}>
        {label}
      </Text>
    </View>
  );
};

// LockedFeature and UpgradeBanner removed — all features are now free.
