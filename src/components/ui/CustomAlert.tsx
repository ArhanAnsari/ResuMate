import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: "default" | "destructive" | "success";
}

export function CustomAlert({
  visible,
  title,
  message,
  onCancel,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "default",
}: CustomAlertProps) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 justify-center items-center bg-black/50 px-4">
        <View className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-slate-800">
          <Text className="text-xl font-bold text-slate-900 dark:text-white mb-2 text-center">
            {title}
          </Text>
          <Text className="text-slate-600 dark:text-slate-400 text-center mb-6 leading-6">
            {message}
          </Text>

          <View className="flex-row space-x-3 gap-3">
            <TouchableOpacity
              className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800"
              onPress={onCancel}
            >
              <Text className="text-center font-semibold text-slate-900 dark:text-white">
                {cancelText}
              </Text>
            </TouchableOpacity>

            {onConfirm && (
              <TouchableOpacity
                className={`flex-1 py-3 rounded-xl ${
                  type === "destructive"
                    ? "bg-red-500"
                    : type === "success"
                      ? "bg-green-500"
                      : "bg-blue-600"
                }`}
                onPress={onConfirm}
              >
                <Text className="text-center font-semibold text-white">
                  {confirmText}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}
