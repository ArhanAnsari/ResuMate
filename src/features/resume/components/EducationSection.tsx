import { EducationItem } from "@/interfaces/resume";
import { PremiumButton } from "@/shared/components/ui/PremiumButton";
import { PremiumInput } from "@/shared/components/ui/PremiumInput";
import { COLORS, LAYOUT, SPACING, TYPOGRAPHY } from "@/src/core/theme";
import { useResumeStore } from "@/store/resumeStore";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const EMPTY_EDUCATION: EducationItem[] = [];

export const EducationSection: React.FC = () => {
  const activeResumeId = useResumeStore((state) => state.activeResumeId);

  // Use a stable selector or handle the fallback carefully to avoid infinite loops
  const educationList = useResumeStore((state) => {
    if (!activeResumeId || !state.resumes[activeResumeId])
      return EMPTY_EDUCATION;
    return state.resumes[activeResumeId].education || EMPTY_EDUCATION;
  });

  const addEducation = useResumeStore((state) => state.addEducation);
  const updateEducation = useResumeStore((state) => state.updateEducation);
  const removeEducation = useResumeStore((state) => state.removeEducation);

  const [isAdding, setIsAdding] = useState(false);

  const handleAddNew = () => {
    addEducation({
      institution: "",
      degree: "",
      startDate: "",
    });
    // Find the newly added item logic could go here to auto-expand,
    // but simplified, we assume the user scrolls to it or we render it in edit mode.
    // For arrays, better UX is often a modal or an inline expanded card.
    // Here we will simply render the list.
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Education</Text>
        <PremiumButton
          title="+ Add"
          size="sm"
          variant="secondary"
          onPress={handleAddNew}
        />
      </View>

      {educationList &&
        educationList.map((item) => (
          <EducationItemCard
            key={item.id}
            item={item}
            onUpdate={(data) => updateEducation(item.id, data)}
            onDelete={() => removeEducation(item.id)}
          />
        ))}

      {educationList?.length === 0 && (
        <Text style={styles.emptyText}>No education added yet.</Text>
      )}
    </View>
  );
};

const EducationItemCard: React.FC<{
  item: EducationItem;
  onUpdate: (data: Partial<EducationItem>) => void;
  onDelete: () => void;
}> = ({ item, onUpdate, onDelete }) => {
  // In a real app, this might be collapsible.
  // We'll keep it expanded for "Form-first" requirements if list is short,
  // or simple fields.

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Education Entry</Text>
        <TouchableOpacity onPress={onDelete}>
          <Text style={styles.deleteText}>Remove</Text>
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

      <View style={styles.row}>
        <View style={styles.halfInput}>
          <PremiumInput
            label="Start Date"
            value={item.startDate}
            onChangeText={(text) => onUpdate({ startDate: text })}
            placeholder="YYYY-MM"
          />
        </View>
        <View style={styles.halfInput}>
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

const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: SPACING.md,
    marginBottom: SPACING.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text,
  },
  card: {
    marginBottom: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: LAYOUT.borderRadius.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.sm,
  },
  cardTitle: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  deleteText: {
    color: COLORS.error,
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
  emptyText: {
    color: COLORS.textTertiary,
    fontStyle: "italic",
    textAlign: "center",
    padding: SPACING.md,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: SPACING.md,
  },
  halfInput: {
    flex: 1,
  },
});
