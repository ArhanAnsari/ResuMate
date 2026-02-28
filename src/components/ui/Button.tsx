import { Ionicons } from "@expo/vector-icons";
import clsx from "clsx";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "premium"
    | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: "left" | "right";
}

export const Button = ({
  title,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className,
  icon,
  iconPosition = "left",
}: ButtonProps) => {
  const variants: Record<string, string> = {
    primary: "bg-indigo-600 active:bg-indigo-700",
    secondary: "bg-emerald-500 active:bg-emerald-600",
    outline: "border-2 border-indigo-600 dark:border-indigo-400 bg-transparent",
    ghost: "bg-transparent active:bg-slate-100 dark:active:bg-slate-800",
    premium: "bg-violet-600 active:bg-violet-700",
    danger: "bg-red-500 active:bg-red-600",
  };
  const sizes: Record<string, string> = {
    sm: "px-4 py-2 gap-1.5",
    md: "px-6 py-3.5 gap-2",
    lg: "px-8 py-4 gap-2.5",
  };
  const textSizes: Record<string, string> = {
    sm: "text-sm font-semibold",
    md: "text-base font-bold",
    lg: "text-lg font-bold",
  };
  const textColors: Record<string, string> = {
    primary: "text-white",
    secondary: "text-white",
    outline: "text-indigo-600 dark:text-indigo-400",
    ghost: "text-slate-700 dark:text-slate-300",
    premium: "text-white",
    danger: "text-white",
  };
  const spinnerColors: Record<string, string> = {
    primary: "white",
    secondary: "white",
    outline: "#4F46E5",
    ghost: "#64748B",
    premium: "white",
    danger: "white",
  };
  const iconColors: Record<string, string> = {
    primary: "white",
    secondary: "white",
    outline: "#4F46E5",
    ghost: "#64748B",
    premium: "white",
    danger: "white",
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.82}
      className={clsx(
        "flex-row items-center justify-center rounded-xl",
        variants[variant],
        sizes[size],
        (disabled || loading) && "opacity-50",
        className,
      )}
    >
      {loading ? (
        <ActivityIndicator color={spinnerColors[variant]} size="small" />
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <Ionicons
              name={icon}
              size={size === "sm" ? 15 : size === "lg" ? 20 : 18}
              color={iconColors[variant]}
            />
          )}
          <Text className={clsx(textSizes[size], textColors[variant])}>
            {title}
          </Text>
          {icon && iconPosition === "right" && (
            <Ionicons
              name={icon}
              size={size === "sm" ? 15 : size === "lg" ? 20 : 18}
              color={iconColors[variant]}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
};
