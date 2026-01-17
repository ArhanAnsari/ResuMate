import { COLORS, SPACING } from '@/src/core/theme';
import { useResumeStore } from '@/src/features/resume/store/resumeStore';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function PreviewModal() {
  const router = useRouter();
  const activeResumeId = useResumeStore((state) => state.activeResumeId);
  const resume = useResumeStore((state) => 
    activeResumeId ? state.resumes[activeResumeId] : null
  );

  if (!resume) {
    return (
      <View style={styles.container}>
        <Text>No active resume to preview.</Text>
      </View>
    );
  }

  const { profile, education } = resume;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Preview </Text>
        <MaterialIcons 
            name="close" 
            size={24} 
            color={COLORS.text} 
            onPress={() => router.back()}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Header Section */}
        <View style={styles.section}>
          <Text style={styles.name}>{profile.fullName || 'Your Name'}</Text>
          <Text style={styles.contact}>
            {profile.email} {profile.phone ? `• ${profile.phone}` : ''} {profile.location ? `• ${profile.location}` : ''}
          </Text>
        </View>

        {/* Education Section */}
        {education && education.length > 0 && (
            <View style={styles.section}>
                <Text style={styles.sectionHeader}>Education</Text>
                {education.map((edu) => (
                    <View key={edu.id} style={styles.item}>
                        <View style={styles.row}>
                            <Text style={styles.institution}>{edu.institution}</Text>
                            <Text style={styles.date}>{edu.startDate} - {edu.endDate || 'Present'}</Text>
                        </View>
                        <Text style={styles.degree}>{edu.degree}</Text>
                        {edu.description && <Text style={styles.description}>{edu.description}</Text>}
                    </View>
                ))}
            </View>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.xl, // Safe area
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  content: {
    padding: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  contact: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: SPACING.sm,
    paddingBottom: SPACING.xs,
    textTransform: 'uppercase',
  },
  item: {
    marginBottom: SPACING.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  institution: {
    fontWeight: 'bold',
    fontSize: 15,
    color: COLORS.text,
  },
  date: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  degree: {
    fontSize: 14,
    color: COLORS.text,
    fontStyle: 'italic',
  },
  description: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 18,
  },
});
