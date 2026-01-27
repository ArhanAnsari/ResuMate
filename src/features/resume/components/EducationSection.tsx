import { EducationItem } from "@/interfaces/resume";
import { PremiumButton } from "@/shared/components/ui/PremiumButton";
import { PremiumInput } from "@/shared/components/ui/PremiumInput";
import { useResumeStore } from "@/store/resumeStore";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import DraggableFlatList, {
    RenderItemParams,
    ScaleDecorator,
} from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const EMPTY_EDUCATION: EducationItem[] = [];

export const EducationSection: React.FC = () => {
  const activeResumeId = useResumeStore((state) => state.activeResumeId);

  const educationList = useResumeStore((state) => {
    if (!activeResumeId || !state.resumes[activeResumeId])
      return EMPTY_EDUCATION;
    return state.resumes[activeResumeId].education || EMPTY_EDUCATION;
  });

  const addEducation = useResumeStore((state) => state.addEducation);
  const updateEducation = useResumeStore((state) => state.updateEducation);
  const removeEducation = useResumeStore((state) => state.removeEducation);
  const reorderEducation = useResumeStore((state) => state.reorderEducation);

  const handleAddNew = () => {
    addEducation({
      institution: "",
      degree: "",
      startDate: "",
    });
  };

  const renderItem = ({
    item,
    drag,
    isActive,
  }: RenderItemParams<EducationItem>) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity
          onLongPress={drag}
          disabled={isActive}
          activeOpacity={1}
          style={{ opacity: isActive ? 0.9 : 1 }}
        >
          <EducationItemCard
            item={item}
            isActive={isActive}
            onUpdate={(data) => updateEducation(item.id, data)}
            onDelete={() => removeEducation(item.id)}
          />
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  return (
    <View className="bg-card p-4 rounded-2xl border border-border">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-bold text-foreground">Education</Text>
        <PremiumButton
          title="+ Add"
          size="sm"
          variant="secondary"
          onPress={handleAddNew}
        />
      </View>

      <View
        style={{
          height: Math.max(100, Math.min(educationList.length * 350, 600)),
        }}
      >
        {educationList.length > 0 ? (
          <GestureHandlerRootView style={{ flex: 1 }}>
            <DraggableFlatList
              data={educationList}
              onDragEnd={({ data }) => reorderEducation(data)}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              scrollEnabled={true}
              nestedScrollEnabled={true}
            />
          </GestureHandlerRootView>
        ) : (
          <Text className="text-muted-foreground italic text-center py-4">
            No education added yet.
          </Text>
        )}
      </View>
    </View>
  );
};

const EducationItemCard: React.FC<{
  item: EducationItem;
  isActive: boolean;
  onUpdate: (data: Partial<EducationItem>) => void;
  onDelete: () => void;
}> = ({ item, isActive, onUpdate, onDelete }) => {
  return (
    <View
      className={`mb-4 p-4 rounded-xl border ${isActive ? "bg-primary/5 border-primary shadow-lg" : "bg-muted/30 border-border"}`}
    >
      <View className="flex-row justify-between items-center mb-2">
        <View className="flex-row items-center gap-2">
          <Ionicons name="menu" size={20} color="#94A3B8" />
          <Text className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Entry
          </Text>
        </View>
        <TouchableOpacity
          onPress={onDelete}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text className="text-destructive font-medium text-sm">Remove</Text>
        </TouchableOpacity>
      </View>

      <PremiumInput
        label="Institution / University"
        value={item.institution}
        onChangeText={(text) => onUpdate({ institution: text })}
      />

      <PremiumInput
        label="Degree"
        value={item.degree}
        onChangeText={(text) => onUpdate({ degree: text })}
        placeholder="e.g. Bachelor of Science"
      />

      <View className="flex-row gap-4">
        <View className="flex-1">
          <PremiumInput
            label="Start Date"
            value={item.startDate}
            onChangeText={(text) => onUpdate({ startDate: text })}
            placeholder="YYYY-MM"
          />
        </View>
        <View className="flex-1">
          <PremiumInput
            label="End Date"
            value={item.endDate || ""}
            onChangeText={(text) => onUpdate({ endDate: text })}
            placeholder="YYYY-MM or Present"
          />
        </View>
      </View>
    </View>
  );
};
