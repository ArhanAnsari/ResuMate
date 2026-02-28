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
    Share,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { CopilotStep, useCopilot, walkthroughable } from "react-native-copilot";
import DraggableFlatList, {
    RenderItemParams,
    ScaleDecorator,
} from "react-native-draggable-flatlist";
import { SafeAreaView } from "react-native-safe-area-context";

const WalkthroughableText = walkthroughable(Text);
const WalkthroughableTouchableOpacity = walkthroughable(TouchableOpacity);
const WalkthroughableView = walkthroughable(View);

export default function ResumeEditor() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { start } = useCopilot();
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

  useEffect(() => {
    // Start tutorial if it's the first time (you'd usually check AsyncStorage here)
    // For now, we'll just start it after a short delay if data is loaded
    if (!loading && data) {
      setTimeout(() => {
        start();
      }, 1000);
    }
  }, [loading]);

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

  const generateCoverLetter = async () => {
    setAiLoading(true);
    try {
      const context = `Resume Data: ${JSON.stringify(data)}`;
      const result = await AIService.enhanceResumeSection(
        context,
        "cover_letter",
      );

      Alert.alert("Generated Cover Letter", result, [
        {
          text: "Share",
          onPress: () =>
            Share.share({ message: result, title: "Cover Letter" }),
        },
        { text: "Close", style: "cancel" },
      ]);
    } catch (error) {
      Alert.alert("AI Error", "Failed to generate cover letter");
    } finally {
      setAiLoading(false);
    }
  };

  const checkATSScore = async () => {
    setAiLoading(true);
    try {
      const context = `Resume Data: ${JSON.stringify(data)}`;
      const result = await AIService.enhanceResumeSection(context, "ats_score");

      Alert.alert("ATS Score Analysis", result, [
        { text: "Close", style: "cancel" },
      ]);
    } catch (error) {
      Alert.alert("AI Error", "Failed to analyze ATS score");
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
        : { institution: "", degree: "", startDate: "", endDate: "" };

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

  const renderExperienceItem = ({
    item,
    drag,
    isActive,
    getIndex,
  }: RenderItemParams<any>) => {
    const index = getIndex() ?? 0;
    return (
      <ScaleDecorator>
        <Card className={`mb-4 ${isActive ? "opacity-80 shadow-lg" : ""}`}>
          <View className="flex-row justify-between items-center mb-2">
            <TouchableOpacity onLongPress={drag} className="p-2 -ml-2">
              <Ionicons name="menu" size={20} color="#94A3B8" />
            </TouchableOpacity>
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
      </ScaleDecorator>
    );
  };

  if (loading)
    return (
      <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950 justify-center items-center gap-3">
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text className="text-slate-400 text-sm">Loading resume…</Text>
      </SafeAreaView>
    );

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
      <View className="flex-row justify-between items-center px-4 py-3 bg-white dark:bg-slate-900 z-10 border-b border-slate-200 dark:border-slate-800">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center gap-1"
        >
          <Ionicons name="chevron-back" size={20} color="#4F46E5" />
          <Text className="text-indigo-600 font-semibold text-sm">Back</Text>
        </TouchableOpacity>
        <CopilotStep
          text="Tap here to rename your resume"
          order={1}
          name="rename"
        >
          <WalkthroughableTouchableOpacity
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
          </WalkthroughableTouchableOpacity>
        </CopilotStep>
        <TouchableOpacity
          onPress={saveResume}
          disabled={isSaving}
          style={{ opacity: isSaving ? 0.6 : 1 }}
          className="flex-row items-center gap-1.5 bg-indigo-600 px-4 py-2 rounded-xl"
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Ionicons name="checkmark-circle-outline" size={16} color="white" />
          )}
          <Text className="text-white font-bold text-sm">Save</Text>
        </TouchableOpacity>
      </View>

      <View className="px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex-row gap-2.5">
        <CopilotStep
          text="Preview your resume and export it to PDF"
          order={2}
          name="preview"
        >
          <WalkthroughableView style={{ flex: 1 }}>
            <TouchableOpacity
              onPress={() => setShowPreview(true)}
              className="flex-row items-center justify-center gap-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-2.5 rounded-xl"
            >
              <Ionicons name="eye-outline" size={15} color="#64748B" />
              <Text className="text-slate-600 dark:text-slate-300 text-xs font-bold">
                Preview
              </Text>
            </TouchableOpacity>
          </WalkthroughableView>
        </CopilotStep>
        <CopilotStep
          text="Check your ATS Score or Generate a Cover Letter"
          order={3}
          name="advanced_tools"
        >
          <WalkthroughableView
            style={{ flexDirection: "row", flex: 2, gap: 8 }}
          >
            <TouchableOpacity
              onPress={checkATSScore}
              disabled={aiLoading}
              style={{ flex: 1, opacity: aiLoading ? 0.6 : 1 }}
              className="flex-row items-center justify-center gap-1.5 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 py-2.5 px-3 rounded-xl"
            >
              <Ionicons name="analytics-outline" size={15} color="#4F46E5" />
              <Text className="text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                ATS
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={generateCoverLetter}
              disabled={aiLoading}
              style={{ flex: 1, opacity: aiLoading ? 0.6 : 1 }}
              className="flex-row items-center justify-center gap-1.5 bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 py-2.5 px-3 rounded-xl"
            >
              <Ionicons name="mail-outline" size={15} color="#7C3AED" />
              <Text className="text-violet-700 dark:text-violet-300 text-xs font-bold">
                Cover Letter
              </Text>
            </TouchableOpacity>
          </WalkthroughableView>
        </CopilotStep>
      </View>

      <ScrollView className="flex-1 p-4">
        <Card className="mb-6 bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border border-white/20 dark:border-slate-800/50 shadow-lg shadow-slate-200/50 dark:shadow-none">
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

        <Card className="mb-6 bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border border-white/20 dark:border-slate-800/50 shadow-lg shadow-slate-200/50 dark:shadow-none">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold dark:text-white">
              Professional Summary
            </Text>
            <CopilotStep
              text="Use AI to enhance your summary based on your experience"
              order={3}
              name="ai_enhance"
            >
              <WalkthroughableView>
                <Button
                  title="AI Enhance"
                  size="sm"
                  variant="outline"
                  onPress={generateSummary}
                  loading={aiLoading}
                  className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                />
              </WalkthroughableView>
            </CopilotStep>
          </View>
          <Input
            multiline
            numberOfLines={6}
            value={data.summary}
            onChangeText={(t) => setData({ ...data, summary: t })}
            placeholder="Write a brief professional summary..."
            className="h-32 text-top bg-white/50 dark:bg-slate-800/50"
          />
        </Card>

        <View className="flex-row justify-between items-center mb-4 px-1">
          <Text className="text-xl font-bold dark:text-white">Experience</Text>
          <CopilotStep
            text="Add new experience entries here"
            order={4}
            name="add_experience"
          >
            <WalkthroughableTouchableOpacity
              onPress={() => handleAddItem("experience")}
              className="bg-blue-600 p-2 rounded-full shadow-md shadow-blue-500/30"
            >
              <Ionicons name="add" size={20} color="white" />
            </WalkthroughableTouchableOpacity>
          </CopilotStep>
        </View>

        <CopilotStep
          text="Long press the menu icon to drag and reorder items"
          order={5}
          name="drag_drop"
        >
          <WalkthroughableView className="flex-1">
            <DraggableFlatList
              data={data.experience || []}
              onDragEnd={({ data: newData }) =>
                setData({ ...data, experience: newData })
              }
              keyExtractor={(item, index) => `exp-${index}`}
              renderItem={renderExperienceItem}
              scrollEnabled={false}
            />
          </WalkthroughableView>
        </CopilotStep>

        <View className="flex-row justify-between items-center mb-4 mt-2 px-1">
          <Text className="text-xl font-bold dark:text-white">Education</Text>
          <TouchableOpacity
            onPress={() => handleAddItem("education")}
            className="bg-blue-600 p-2 rounded-full shadow-md shadow-blue-500/30"
          >
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {data.education?.map((item: any, index: number) => (
          <Card
            key={index}
            className="mb-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border border-white/20 dark:border-slate-800/50"
          >
            <View className="flex-row justify-end mb-2">
              <TouchableOpacity
                onPress={() => handleRemoveItem("education", index)}
              >
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
            <Input
              label="School / University"
              value={item.institution}
              onChangeText={(t) =>
                handleUpdateItem("education", index, "institution", t)
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
            className="bg-blue-600 p-2 rounded-full shadow-md shadow-blue-500/30"
          >
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <Card className="mb-6 bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border border-white/20 dark:border-slate-800/50">
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
