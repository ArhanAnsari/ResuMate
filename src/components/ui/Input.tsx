import clsx from "clsx";
import { Text, TextInput, TextInputProps, View } from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export const Input = ({
  label,
  error,
  containerClassName,
  className,
  ...props
}: InputProps) => {
  return (
    <View className={clsx("mb-4", containerClassName)}>
      {label && (
        <Text className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
          {label}
        </Text>
      )}
      <TextInput
        placeholderTextColor={"#94A3B8"}
        className={clsx(
          "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-base text-slate-900 dark:text-white",
          "focus:border-blue-500 dark:focus:border-blue-400",
          error && "border-red-500 dark:border-red-500",
          className,
        )}
        {...props}
      />
      {error && <Text className="text-red-500 text-xs mt-1 ml-1">{error}</Text>}
    </View>
  );
};
