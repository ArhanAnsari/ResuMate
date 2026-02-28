import { useEffect, useRef } from "react";
import { Animated, View, ViewStyle } from "react-native";

interface SkeletonProps {
  width?: number | `${number}%` | "auto";
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
  className?: string;
}

const SkeletonItem = ({
  width = "100%",
  height = 16,
  borderRadius = 8,
  style,
}: SkeletonProps) => {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 950,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 950,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const opacity = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: "#CBD5E1",
          opacity,
        },
        style,
      ]}
    />
  );
};

export const SkeletonResumeCard = () => (
  <View className="bg-white dark:bg-slate-800 rounded-2xl p-4 mb-4 border border-slate-100 dark:border-slate-700">
    <View className="flex-row justify-between items-center mb-3">
      <SkeletonItem width="60%" height={18} borderRadius={8} />
      <SkeletonItem width={64} height={28} borderRadius={14} />
    </View>
    <SkeletonItem
      width="40%"
      height={12}
      borderRadius={6}
      style={{ marginBottom: 12 }}
    />
    <View className="flex-row gap-2">
      <SkeletonItem width={72} height={24} borderRadius={12} />
      <SkeletonItem width={72} height={24} borderRadius={12} />
    </View>
  </View>
);

export const SkeletonText = ({ lines = 3 }: { lines?: number }) => (
  <View className="gap-2">
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonItem
        key={i}
        width={i === lines - 1 ? "70%" : "100%"}
        height={14}
        borderRadius={6}
        style={{ marginBottom: 4 }}
      />
    ))}
  </View>
);

export const SkeletonAvatar = ({ size = 48 }: { size?: number }) => (
  <SkeletonItem width={size} height={size} borderRadius={size / 2} />
);

export default SkeletonItem;
