import { SkillItem } from "@/interfaces/resume";
import { PremiumButton } from "@/shared/components/ui/PremiumButton";
import { useResumeStore } from "@/store/resumeStore";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import DraggableFlatList, {
    RenderItemParams,
    ScaleDecorator,
} from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const EMPTY_SKILLS: SkillItem[] = [];

export const SkillsSection: React.FC = () => {
  const activeResumeId = useResumeStore((state) => state.activeResumeId);
  const skillsList = useResumeStore((state) => {
    if (!activeResumeId || !state.resumes[activeResumeId]) return EMPTY_SKILLS;
    return state.resumes[activeResumeId].skills || EMPTY_SKILLS;
  });

  const addSkill = useResumeStore((state) => state.addSkill);
  const removeSkill = useResumeStore((state) => state.removeSkill);
  const reorderSkills = useResumeStore((state) => state.reorderSkills);

  const [newSkillText, setNewSkillText] = useState("");

  const handleAddSkill = () => {
    if (!newSkillText.trim()) return;
    addSkill({ name: newSkillText.trim(), level: "intermediate" });
    setNewSkillText("");
  };

  const renderItem = ({
    item,
    drag,
    isActive,
  }: RenderItemParams<SkillItem>) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity
          onLongPress={drag}
          disabled={isActive}
          className={`flex-row items-center justify-between p-3 mb-2 rounded-xl border ${
            isActive
              ? "bg-primary/10 border-primary"
              : "bg-muted/30 border-border"
          }`}
        >
          <View className="flex-row items-center gap-3">
            <Ionicons name="menu" size={20} color="#94A3B8" />
            <Text className="text-foreground font-medium">{item.name}</Text>
          </View>
          <TouchableOpacity onPress={() => removeSkill(item.id)}>
            <Ionicons name="close-circle" size={20} color="#EF4444" />
          </TouchableOpacity>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  return (
    <View className="bg-card p-4 rounded-2xl border border-border">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-bold text-foreground">Skills</Text>
      </View>

      <View className="flex-row gap-2 mb-4">
        <TextInput
          className="flex-1 bg-muted/30 border border-input rounded-xl px-4 py-2 text-foreground"
          placeholder="Add a skill (e.g. React, Python)"
          value={newSkillText}
          onChangeText={setNewSkillText}
          onSubmitEditing={handleAddSkill}
        />
        <PremiumButton
          title="Add"
          onPress={handleAddSkill}
          size="sm"
          variant="secondary"
        />
      </View>

      <View style={{ height: Math.min(skillsList.length * 60, 300) }}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <DraggableFlatList
            data={skillsList}
            onDragEnd={({ data }) => reorderSkills(data)}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            scrollEnabled={skillsList.length > 5}
          />
        </GestureHandlerRootView>
      </View>

      {skillsList.length === 0 && (
        <Text className="text-muted-foreground italic text-center py-2">
          No skills added yet.
        </Text>
      )}
    </View>
  );
};
