import { ResumePreviewModal } from "@/src/components/ResumePreviewModal";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";
import { APP_CONFIG } from "@/src/core/config/app";
import { AIService } from "@/src/services/ai/gemini";
import { appwrite } from "@/src/services/appwrite/client";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ResumeEditor() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [resume, setResume] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Renaming state
  const [isRenaming, setIsRenaming] = useState(false);
  const [tempTitle, setTempTitle] = useState("");

  useEffect(() => {
    fetchResume();
  }, [id]);

  const fetchResume = async () => {
    try {
      const doc = await appwrite.databases.getDocument(
        APP_CONFIG.APPWRITE.DATABASE_ID,
        APP_CONFIG.APPWRITE.COLLECTION.RESUMES,
        id as string,
      );
      setResume(doc);
      setTempTitle(doc.title);
      setData(JSON.parse(doc.data));
    } catch (error) {
      Alert.alert("Error", "Failed to load resume");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!tempTitle.trim()) {
      Alert.alert("Error", "Title cannot be empty");
      return;
    }
    try {
      await appwrite.databases.updateDocument(
        APP_CONFIG.APPWRITE.DATABASE_ID,
        APP_CONFIG.APPWRITE.COLLECTION.RESUMES,
        id as string,
        { title: tempTitle },
      );
      setResume({ ...resume, title: tempTitle });
      setIsRenaming(false);
    } catch (error: any) {
      Alert.alert("Error", "Failed to rename resume");
    }
  };

  const saveResume = async () => {
    setIsSaving(true);
    try {
      await appwrite.databases.updateDocument(
        APP_CONFIG.APPWRITE.DATABASE_ID,
        APP_CONFIG.APPWRITE.COLLECTION.RESUMES,
        id as string,
        { data: JSON.stringify(data) },
      );
      Alert.alert("Saved", "Resume updated successfully");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const generateSummary = async () => {
    setAiLoading(true);
    try {
      // Construct prompt based on other data
      const context = `Experience: ${JSON.stringify(data.experience)}. Skills: ${JSON.stringify(data.skills)}`;
      const result = await AIService.enhanceResumeSection(context, "summary");

      Alert.alert(
        "AI Enhancement",
        `Here is the improved summary:\n\n${result}`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Apply Change",
            onPress: () => setData({ ...data, summary: result }),
          },
        ],
      );
    } catch (error) {
      Alert.alert("AI Error", "Failed to generate summary");
      console.error(error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleAddItem = (section: "experience" | "education") => {
    const newItem =
      section === "experience"
        ? {
            position: "",
            company: "",
            startDate: "",
            endDate: "",
            description: "",
          }
        : { school: "", degree: "", startDate: "", endDate: "" };

    setData({ ...data, [section]: [newItem, ...(data[section] || [])] });
  };

  const handleRemoveItem = (
    section: "experience" | "education",
    index: number,
  ) => {
    const list = [...(data[section] || [])];
    list.splice(index, 1);
    setData({ ...data, [section]: list });
  };

  const handleUpdateItem = (
    section: "experience" | "education",
    index: number,
    field: string,
    value: string,
  ) => {
    const list = [...(data[section] || [])];
    list[index] = { ...list[index], [field]: value };
    setData({ ...data, [section]: list });
  };

  const addSkill = () =>
    setData({ ...data, skills: [...(data.skills || []), ""] });

  const removeSkill = (index: number) => {
    const newSkills = [...(data.skills || [])];
    newSkills.splice(index, 1);
    setData({ ...data, skills: newSkills });
  };

  if (loading)
    return (
      <View className="flex-1 justify-center">
        <ActivityIndicator />
      </View>
    );

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
      <View className="flex-row justify-between items-center px-4 py-2 bg-white dark:bg-slate-900 shadow-sm z-10">
        <Button
          title="Back"
          variant="ghost"
          onPress={() => router.back()}
          size="sm"
        />
        <TouchableOpacity
          onPress={() => setIsRenaming(true)}
          className="flex-row items-center"
        >
          <Text
            className="font-bold text-lg dark:text-white truncate max-w-[150px] mr-2"
            numberOfLines={1}
          >
            {resume?.title}
          </Text>
          <Ionicons name="pencil" size={14} color="#64748B" />
        </TouchableOpacity>
        <Button
          title="Save"
          onPress={saveResume}
          loading={isSaving}
          size="sm"
        />
      </View>

      <View className="px-4 py-2">
        <Button
          title="Preview Resume"
          variant="outline"
          onPress={() => setShowPreview(true)}
        />
      </View>

      <ScrollView className="flex-1 p-4">
        <Card className="mb-6">
          <Text className="text-xl font-bold mb-4 dark:text-white">
            Personal Information
          </Text>
          <Input
            label="Full Name"
            value={data.profile?.fullName}
            onChangeText={(t) =>
              setData({ ...data, profile: { ...data.profile, fullName: t } })
            }
          />
          <Input
            label="Email"
            value={data.profile?.email}
            keyboardType="email-address"
            onChangeText={(t) =>
              setData({ ...data, profile: { ...data.profile, email: t } })
            }
          />
          <Input
            label="Phone"
            value={data.profile?.phone}
            keyboardType="phone-pad"
            onChangeText={(t) =>
              setData({ ...data, profile: { ...data.profile, phone: t } })
            }
          />
          <Input
            label="Location"
            value={data.profile?.location}
            onChangeText={(t) =>
              setData({ ...data, profile: { ...data.profile, location: t } })
            }
          />
        </Card>

        <Card className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold dark:text-white">
              Professional Summary
            </Text>
            <Button
              title="AI Enhance"
              size="sm"
              variant="outline"
              onPress={generateSummary}
              loading={aiLoading}
            />
          </View>
          <Input
            multiline
            numberOfLines={6}
            value={data.summary}
            onChangeText={(t) => setData({ ...data, summary: t })}
            placeholder="Write a brief professional summary..."
            className="h-32 text-top"
          />
        </Card>

        <View className="flex-row justify-between items-center mb-4 px-1">
          <Text className="text-xl font-bold dark:text-white">Experience</Text>
          <TouchableOpacity
            onPress={() => handleAddItem("experience")}
            className="bg-blue-600 p-2 rounded-full"
          >
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {data.experience?.map((item: any, index: number) => (
          <Card key={index} className="mb-4">
            <View className="flex-row justify-end mb-2">
              <TouchableOpacity
                onPress={() => handleRemoveItem("experience", index)}
              >
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
            <Input
              label="Job Title"
              value={item.position}
              onChangeText={(t) =>
                handleUpdateItem("experience", index, "position", t)
              }
              placeholder="e.g. Senior Developer"
            />
            <Input
              label="Company"
              value={item.company}
              onChangeText={(t) =>
                handleUpdateItem("experience", index, "company", t)
              }
              placeholder="e.g. Tech Corp"
            />
            <View className="flex-row space-x-4 gap-4">
              <View className="flex-1">
                <Input
                  label="Start Date"
                  value={item.startDate}
                  onChangeText={(t) =>
                    handleUpdateItem("experience", index, "startDate", t)
                  }
                  placeholder="MMM YYYY"
                />
              </View>
              <View className="flex-1">
                <Input
                  label="End Date"
                  value={item.endDate}
                  onChangeText={(t) =>
                    handleUpdateItem("experience", index, "endDate", t)
                  }
                  placeholder="Present"
                />
              </View>
            </View>
            <Input
              label="Description"
              multiline
              numberOfLines={3}
              value={item.description}
              onChangeText={(t) =>
                handleUpdateItem("experience", index, "description", t)
              }
              className="h-20 text-top"
            />
          </Card>
        ))}

        <View className="flex-row justify-between items-center mb-4 mt-2 px-1">
          <Text className="text-xl font-bold dark:text-white">Education</Text>
          <TouchableOpacity
            onPress={() => handleAddItem("education")}
            className="bg-blue-600 p-2 rounded-full"
          >
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {data.education?.map((item: any, index: number) => (
          <Card key={index} className="mb-4">
            <View className="flex-row justify-end mb-2">
              <TouchableOpacity
                onPress={() => handleRemoveItem("education", index)}
              >
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
            <Input
              label="School / University"
              value={item.school}
              onChangeText={(t) =>
                handleUpdateItem("education", index, "school", t)
              }
            />
            <Input
              label="Degree"
              value={item.degree}
              onChangeText={(t) =>
                handleUpdateItem("education", index, "degree", t)
              }
            />
            <View className="flex-row space-x-4 gap-4">
              <View className="flex-1">
                <Input
                  label="Start Date"
                  value={item.startDate}
                  onChangeText={(t) =>
                    handleUpdateItem("education", index, "startDate", t)
                  }
                  placeholder="YYYY"
                />
              </View>
              <View className="flex-1">
                <Input
                  label="End Date"
                  value={item.endDate}
                  onChangeText={(t) =>
                    handleUpdateItem("education", index, "endDate", t)
                  }
                  placeholder="YYYY"
                />
              </View>
            </View>
          </Card>
        ))}

        <View className="flex-row justify-between items-center mb-4 mt-2 px-1">
          <Text className="text-xl font-bold dark:text-white">Skills</Text>
          <TouchableOpacity
            onPress={addSkill}
            className="bg-blue-600 p-2 rounded-full"
          >
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <Card className="mb-6">
          {data.skills?.map((skill: string, index: number) => (
            <View key={index} className="flex-row items-center mb-3">
              <View className="flex-1">
                <Input
                  value={skill}
                  onChangeText={(t) => {
                    const newSkills = [...(data.skills || [])];
                    newSkills[index] = t;
                    setData({ ...data, skills: newSkills });
                  }}
                  placeholder="e.g. JavaScript"
                />
              </View>
              <TouchableOpacity
                onPress={() => removeSkill(index)}
                className="ml-3 p-2"
              >
                <Ionicons name="close-circle" size={24} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ))}
          {(!data.skills || data.skills.length === 0) && (
            <Text className="text-slate-400 text-center italic py-4">
              No skills added yet.
            </Text>
          )}
        </Card>

        <View className="h-20" />
      </ScrollView>

      <ResumePreviewModal
        visible={showPreview}
        onClose={() => setShowPreview(false)}
        data={data}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={isRenaming}
        onRequestClose={() => setIsRenaming(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 px-4">
          <View className="w-full bg-white dark:bg-slate-900 rounded-xl p-6 shadow-xl">
            <Text className="text-xl font-bold mb-4 dark:text-white">
              Rename Resume
            </Text>
            <Input
              value={tempTitle}
              onChangeText={setTempTitle}
              placeholder="Enter new resume title"
              autoFocus
            />
            <View className="flex-row justify-end space-x-3 gap-3 mt-6">
              <Button
                title="Cancel"
                variant="ghost"
                onPress={() => setIsRenaming(false)}
              />
              <Button title="Rename" onPress={handleRename} />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
