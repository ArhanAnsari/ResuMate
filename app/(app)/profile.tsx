import { Card } from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";
import { useToast } from "@/src/context/ToastContext";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useProfileStore } from "@/src/store/useProfileStore";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { user } = useAuthStore();
  const { profile, fetchProfile, updateProfile, uploadAvatar, isLoading } =
    useProfileStore();
  const { showToast } = useToast();
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    bio: "",
    location: "",
    phone: "",
    website: "",
  });

  useEffect(() => {
    if (user?.$id) {
      fetchProfile(user.$id);
    }
  }, [user]);

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || "",
        bio: profile.bio || "",
        location: profile.location || "",
        phone: profile.phone || "",
        website: profile.website || "",
      });
    } else if (user?.name) {
      // Pre-fill name from Auth if no profile exists
      setFormData((prev) => ({ ...prev, fullName: user.name }));
    }
  }, [profile, user]);

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && user?.$id) {
        await uploadAvatar(user.$id, result.assets[0].uri);
        showToast("Profile picture updated", "success");
      }
    } catch (error) {
      showToast("Failed to pick image", "error");
    }
  };

  const handleSave = async () => {
    if (!user?.$id) return;

    try {
      await updateProfile(user.$id, formData);
      showToast("Profile updated successfully", "success");
    } catch (error) {
      showToast("Failed to update profile", "error");
    }
  };

  if (isLoading && !profile) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950 justify-center items-center">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
            <Ionicons
              name="arrow-back"
              size={24}
              className="text-slate-900 dark:text-white"
            />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-slate-900 dark:text-white">
            Edit Profile
          </Text>
          <TouchableOpacity onPress={handleSave} disabled={isLoading}>
            <Text
              className={`font-semibold ${isLoading ? "text-slate-400" : "text-blue-600"}`}
            >
              {isLoading ? "Saving..." : "Save"}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 p-4">
          {/* Avatar Placeholder */}
          <View className="items-center mb-6">
            <TouchableOpacity
              onPress={handlePickImage}
              className="w-24 h-24 bg-slate-200 dark:bg-slate-800 rounded-full items-center justify-center mb-2 overflow-hidden border-2 border-slate-100 dark:border-slate-700 relative"
            >
              {profile?.avatarUrl ? (
                <Image
                  source={{ uri: profile.avatarUrl }}
                  className="w-full h-full"
                  contentFit="cover"
                  transition={1000}
                />
              ) : (
                <Text className="text-3xl font-bold text-slate-400">
                  {formData.fullName?.[0]?.toUpperCase() ||
                    user?.name?.[0]?.toUpperCase() ||
                    "?"}
                </Text>
              )}
              {isLoading && (
                <View className="absolute inset-0 bg-black/30 justify-center items-center">
                  <ActivityIndicator color="white" />
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePickImage} className="mb-1">
              <Text className="text-blue-600 font-medium text-sm">
                Change Photo
              </Text>
            </TouchableOpacity>
            <Text className="text-sm text-slate-500">{user?.email}</Text>
          </View>

          <Card className="mb-6 space-y-4 gap-4">
            <Input
              label="Full Name"
              value={formData.fullName}
              onChangeText={(t) =>
                setFormData((prev) => ({ ...prev, fullName: t }))
              }
              placeholder="John Doe"
            />

            <Input
              label="Bio"
              value={formData.bio}
              onChangeText={(t) => setFormData((prev) => ({ ...prev, bio: t }))}
              placeholder="Tell us about yourself..."
              multiline
              numberOfLines={4}
              className="h-24 text-top"
            />

            <Input
              label="Location"
              value={formData.location}
              onChangeText={(t) =>
                setFormData((prev) => ({ ...prev, location: t }))
              }
              placeholder="City, Country"
            />

            <Input
              label="Phone"
              value={formData.phone}
              onChangeText={(t) =>
                setFormData((prev) => ({ ...prev, phone: t }))
              }
              placeholder="+1 234 567 890"
              keyboardType="phone-pad"
            />

            <Input
              label="Website / Portfolio"
              value={formData.website}
              onChangeText={(t) =>
                setFormData((prev) => ({ ...prev, website: t }))
              }
              placeholder="https://example.com"
              autoCapitalize="none"
            />
          </Card>

          <View className="h-20" />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
