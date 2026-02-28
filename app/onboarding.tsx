import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    FlatList,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const ONBOARDING_KEY = "resumate_onboarding_done";

const slides = [
  {
    id: "1",
    icon: "document-text" as const,
    iconBg: "#4F46E5",
    headline: "Build Your Resume\nWith AI",
    body: "Create a professional, ATS-optimized resume in minutes — powered by Google Gemini AI.",
    accent: "#818CF8",
  },
  {
    id: "2",
    icon: "analytics" as const,
    iconBg: "#7C3AED",
    headline: "Beat the ATS\nEvery Time",
    body: "Get an instant ATS score, keyword suggestions, and role-specific improvements before you apply.",
    accent: "#A78BFA",
  },
  {
    id: "3",
    icon: "share-social" as const,
    iconBg: "#0EA5E9",
    headline: "Export & Share\nAnywhere",
    body: "One-tap PDF and Word export. Share a QR-code resume link or send directly from your phone.",
    accent: "#38BDF8",
  },
];

export default function Onboarding() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleDone = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    router.replace("/(auth)/sign-in");
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex((i) => i + 1);
    } else {
      handleDone();
    }
  };

  const handleScroll = (e: any) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const isLast = currentIndex === slides.length - 1;

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <StatusBar barStyle="light-content" />

      {/* Skip */}
      <View className="flex-row justify-end px-6 pt-2">
        <TouchableOpacity onPress={handleDone} className="py-2 px-4">
          <Text className="text-slate-400 font-medium text-base">Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        renderItem={({ item }) => (
          <View
            style={{ width }}
            className="flex-1 items-center justify-center px-10"
          >
            {/* Icon illustration */}
            <View
              className="w-40 h-40 rounded-3xl items-center justify-center mb-10"
              style={{
                backgroundColor: item.iconBg + "22",
                borderWidth: 1.5,
                borderColor: item.iconBg + "55",
              }}
            >
              <View
                className="w-24 h-24 rounded-2xl items-center justify-center"
                style={{ backgroundColor: item.iconBg }}
              >
                <Ionicons name={item.icon} size={48} color="white" />
              </View>
            </View>

            <Text className="text-4xl font-bold text-white text-center leading-tight mb-4">
              {item.headline}
            </Text>
            <Text className="text-slate-400 text-lg text-center leading-7">
              {item.body}
            </Text>
          </View>
        )}
        style={{ flex: 1 }}
      />

      {/* Bottom row */}
      <View className="px-8 pb-10 gap-6">
        {/* Dots */}
        <View className="flex-row justify-center gap-2">
          {slides.map((_, i) => (
            <View
              key={i}
              className={
                i === currentIndex
                  ? "w-6 h-2 rounded-full bg-indigo-500"
                  : "w-2 h-2 rounded-full bg-slate-600"
              }
            />
          ))}
        </View>

        {/* CTA */}
        <TouchableOpacity
          onPress={handleNext}
          activeOpacity={0.85}
          className="bg-indigo-600 rounded-2xl py-4 items-center flex-row justify-center gap-3"
        >
          <Text className="text-white font-bold text-lg">
            {isLast ? "Get Started" : "Continue"}
          </Text>
          <Ionicons
            name={isLast ? "rocket-outline" : "arrow-forward"}
            size={20}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
