import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, {
    createContext,
    useCallback,
    useContext,
    useRef,
    useState,
} from "react";
import { Animated, Text, View } from "react-native";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<ToastType>("info");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback(
    (msg: string, toastType: ToastType = "info") => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      setMessage(msg);
      setType(toastType);
      setVisible(true);

      // Animate In
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          speed: 12,
          bounciness: 5,
        }),
      ]).start();

      // Haptics based on type
      if (toastType === "success") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else if (toastType === "error") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } else if (toastType === "warning") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }

      // Auto hide
      timeoutRef.current = setTimeout(hideToast, 2500);
    },
    [],
  );

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setVisible(false));
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return "checkmark-circle";
      case "error":
        return "alert-circle";
      case "warning":
        return "warning";
      default:
        return "information-circle";
    }
  };

  const getColors = () => {
    switch (type) {
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      case "warning":
        return "bg-amber-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {visible && (
        <View className="absolute top-0 left-0 right-0 z-50 flex items-center pt-14 pointer-events-none">
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
            className={`flex-row items-center px-4 py-3 rounded-full shadow-lg ${getColors()}`}
          >
            <Ionicons name={getIcon()} size={20} color="white" />
            <Text className="text-white font-medium ml-2">{message}</Text>
          </Animated.View>
        </View>
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
};
