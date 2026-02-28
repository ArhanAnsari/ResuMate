import { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface ATSRingProps {
  score: number; // 0–100
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
}

const scoreColor = (score: number) => {
  if (score >= 80) return "#10B981"; // green
  if (score >= 60) return "#F59E0B"; // amber
  return "#EF4444"; // red
};

const scoreLabel = (score: number) => {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Needs Work";
};

export const ATSRing = ({
  score,
  size = 88,
  strokeWidth = 8,
  showLabel = true,
}: ATSRingProps) => {
  const animatedScore = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedScore, {
      toValue: score,
      duration: 1200,
      useNativeDriver: false,
    }).start();
  }, [score]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const color = scoreColor(score);

  const strokeDashoffset = animatedScore.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  const AnimatedCircle = Animated.createAnimatedComponent(Circle);

  return (
    <View className="items-center">
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size} style={{ position: "absolute" }}>
          {/* Track */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />
        </Svg>
        <Svg
          width={size}
          height={size}
          style={{ position: "absolute", transform: [{ rotate: "-90deg" }] }}
        >
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </Svg>
        {/* Center label */}
        <View
          style={{
            position: "absolute",
            width: size,
            height: size,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color, fontSize: size * 0.22, fontWeight: "800" }}>
            {score}
          </Text>
          <Text
            style={{
              color: "#94A3B8",
              fontSize: size * 0.1,
              fontWeight: "600",
              marginTop: 1,
            }}
          >
            /100
          </Text>
        </View>
      </View>
      {showLabel && (
        <Text style={{ color, fontSize: 12, fontWeight: "700", marginTop: 6 }}>
          {scoreLabel(score)}
        </Text>
      )}
    </View>
  );
};
