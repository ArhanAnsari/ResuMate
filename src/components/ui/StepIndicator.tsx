import { Text, TouchableOpacity, View } from "react-native";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
  onStepPress?: (index: number) => void;
}

export const StepIndicator = ({
  steps,
  currentStep,
  onStepPress,
}: StepIndicatorProps) => {
  return (
    <View className="px-4 py-3">
      {/* Scrollable dots + labels */}
      <View className="flex-row items-center justify-between">
        {steps.map((label, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <View key={index} className="flex-row items-center flex-1">
              {/* Step circle */}
              <TouchableOpacity
                onPress={() => onStepPress?.(index)}
                disabled={!onStepPress}
                className="items-center"
              >
                <View
                  className={
                    isCompleted
                      ? "w-8 h-8 rounded-full bg-indigo-600 items-center justify-center"
                      : isActive
                        ? "w-8 h-8 rounded-full bg-indigo-600 items-center justify-center ring-4 ring-indigo-100"
                        : "w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 items-center justify-center"
                  }
                >
                  {isCompleted ? (
                    <Text className="text-white text-xs font-bold">✓</Text>
                  ) : (
                    <Text
                      className={
                        isActive
                          ? "text-white text-xs font-bold"
                          : "text-slate-400 text-xs font-semibold"
                      }
                    >
                      {index + 1}
                    </Text>
                  )}
                </View>
                <Text
                  className={`text-xs mt-1 font-medium ${
                    isActive
                      ? "text-indigo-600 dark:text-indigo-400"
                      : isCompleted
                        ? "text-indigo-400 dark:text-indigo-500"
                        : "text-slate-400"
                  }`}
                  numberOfLines={1}
                >
                  {label}
                </Text>
              </TouchableOpacity>

              {/* Connector line */}
              {!isLast && (
                <View
                  className={`flex-1 h-0.5 mx-1 mb-4 ${
                    isCompleted
                      ? "bg-indigo-500"
                      : "bg-slate-200 dark:bg-slate-700"
                  }`}
                />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};
