import clsx from "clsx";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  className?: string; // Custom class override
}

export const Button = ({
  title,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className,
}: ButtonProps) => {
  const baseStyles =
    "flex-row items-center justify-center rounded-xl font-semibold";

  const variants = {
    primary: "bg-blue-600 active:bg-blue-700",
    secondary: "bg-emerald-500 active:bg-emerald-600",
    outline: "border-2 border-blue-600 bg-transparent",
    ghost: "bg-transparent active:bg-gray-100 dark:active:bg-slate-800",
  };

  const sizes = {
    sm: "px-4 py-2",
    md: "px-6 py-3",
    lg: "px-8 py-4",
  };

  const textColors = {
    primary: "text-white",
    secondary: "text-white",
    outline: "text-blue-600 dark:text-blue-400",
    ghost: "text-slate-700 dark:text-slate-300",
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        disabled && "opacity-50",
        className,
      )}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === "outline" || variant === "ghost" ? "#2563EB" : "white"
          }
        />
      ) : (
        <Text className={clsx("text-base font-bold", textColors[variant])}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
