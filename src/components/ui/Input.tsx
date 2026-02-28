import { Ionicons } from "@expo/vector-icons";
import clsx from "clsx";
import { useState } from "react";
import {
    Text,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    View,
} from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
}

export const Input = ({
  label,
  error,
  hint,
  containerClassName,
  className,
  secureTextEntry,
  leftIcon,
  rightIcon,
  onRightIconPress,
  ...props
}: InputProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPassword = secureTextEntry === true;

  return (
    <View className={clsx("mb-4", containerClassName)}>
      {label && (
        <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-0.5">
          {label}
        </Text>
      )}
      <View
        className={clsx(
          "flex-row items-center rounded-xl",
          "bg-white dark:bg-slate-800/80",
          "border",
          error
            ? "border-red-400 dark:border-red-500"
            : "border-slate-200 dark:border-slate-700",
        )}
      >
        {leftIcon && (
          <View className="pl-4">
            <Ionicons name={leftIcon} size={18} color="#94A3B8" />
          </View>
        )}
        <TextInput
          placeholderTextColor="#94A3B8"
          secureTextEntry={isPassword && !isPasswordVisible}
          className={clsx(
            "flex-1 px-4 py-3.5 text-base text-slate-900 dark:text-white",
            leftIcon && "pl-2",
            (isPassword || rightIcon) && "pr-2",
            className,
          )}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible((v) => !v)}
            className="pr-4 p-1"
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#94A3B8"
            />
          </TouchableOpacity>
        )}
        {rightIcon && !isPassword && (
          <TouchableOpacity onPress={onRightIconPress} className="pr-4 p-1">
            <Ionicons name={rightIcon} size={20} color="#94A3B8" />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text className="text-red-500 dark:text-red-400 text-xs mt-1.5 ml-1">
          {error}
        </Text>
      )}
      {hint && !error && (
        <Text className="text-slate-400 text-xs mt-1.5 ml-1">{hint}</Text>
      )}
    </View>
  );
};
