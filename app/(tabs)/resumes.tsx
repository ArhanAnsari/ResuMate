import { COLORS } from '@/src/core/theme';
import { useResumeStore } from '@/src/features/resume/store/resumeStore';
import { PremiumButton } from '@/src/shared/components/ui/PremiumButton';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ResumesScreen() {
  const router = useRouter();
  const resumes = useResumeStore((state) => state.resumes);
  const activeResumeId = useResumeStore((state) => state.activeResumeId);
  const setActiveResume = useResumeStore((state) => state.setActiveResume);
  const createResume = useResumeStore((state) => state.createResume);
  const deleteResume = useResumeStore((state) => state.deleteResume);

  const resumeList = useMemo(() => Object.values(resumes), [resumes]);

  const handleCreateNew = () => {
    const newId = createResume('New Resume');
    setActiveResume(newId);
    router.push('/(tabs)/index');
  };

  const handleSelectResume = (id: string) => {
    setActiveResume(id);
    router.push('/(tabs)/index');
  };

  const handleDeleteResume = (id: string) => {
    deleteResume(id);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-6 py-4 border-b border-border bg-surface flex-row justify-between items-center">
        <Text className="text-2xl font-bold text-text">My Resumes</Text>
        <PremiumButton 
          title="New" 
          size="sm" 
          onPress={handleCreateNew} 
        />
      </View>

      <FlatList
        data={resumeList}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
        ListEmptyComponent={
            <View className="items-center justify-center mt-20">
                <Text className="text-textSecondary text-base text-center mb-4">You haven't created any resumes yet.</Text>
                <PremiumButton title="Create Your First Resume" onPress={handleCreateNew} />
            </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => handleSelectResume(item.id)}
            className={`
                bg-surface p-4 rounded-xl mb-4 border
                ${activeResumeId === item.id ? 'border-primary border-2' : 'border-border'}
                shadow-sm
            `}
          >
            <View className="flex-row justify-between items-center mb-2">
                <Text className="text-lg font-semibold text-text" numberOfLines={1}>
                    {item.title || 'Untitled Resume'}
                </Text>
                <View className="flex-row gap-2">
                    {activeResumeId === item.id && (
                        <View className="bg-primary/10 px-2 py-1 rounded-md">
                            <Text className="text-primary text-xs font-medium">Active</Text>
                        </View>
                    )}
                    <TouchableOpacity 
                        onPress={() => handleDeleteResume(item.id)}
                        className="bg-error/10 p-1.5 rounded-md"
                    >
                         <MaterialIcons name="delete-outline" size={18} color={COLORS.error} />
                    </TouchableOpacity>
                </View>
            </View>
            
            <View className="flex-row items-center">
                <MaterialIcons name="access-time" size={14} color={COLORS.textTertiary} />
                <Text className="text-textTertiary text-sm ml-1">
                    Last modified: {new Date(item.lastModified).toLocaleDateString()}
                </Text>
            </View>

            <View className="mt-4 flex-row gap-2">
                 <View className="bg-background px-3 py-1 rounded-full">
                    <Text className="text-textSecondary text-xs">
                        {(item.experience?.length || 0) > 0 ? `${item.experience.length} Exp` : 'No Exp'}
                    </Text>
                 </View>
                 <View className="bg-background px-3 py-1 rounded-full">
                    <Text className="text-textSecondary text-xs">
                        {(item.education?.length || 0) > 0 ? `${item.education.length} Edu` : 'No Edu'}
                    </Text>
                 </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
