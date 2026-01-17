import { databases } from '@/src/core/api/appwrite';
import { ResumeData } from '@/src/types/resume';
import { ID, Query } from 'appwrite';

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_RESUMES_COLLECTION_ID!;

export const ResumeService = {
  async syncResumes(localResumes: Record<string, ResumeData>, userId: string): Promise<Record<string, ResumeData>> {
    if (!DATABASE_ID || !COLLECTION_ID) {
      console.warn('Sync skipped: Database configuration missing');
      return localResumes; // Offline mode effectively
    }

    try {
      // 1. Fetch remote resumes
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [Query.equal('userId', userId)]
      );

      const remoteResumesMap: Record<string, ResumeData & { $id: string }> = {};
      response.documents.forEach((doc: any) => {
        // Parse the JSON content field where we store the full object
        // We assume we store a 'content' string attribute with JSON
        if (doc.content) {
            try {
                const parsed = JSON.parse(doc.content);
                remoteResumesMap[parsed.id] = { ...parsed, $id: doc.$id }; // Keep Appwrite ID
            } catch (e) {
                console.error("Failed to parse resume", doc.$id);
            }
        }
      });

      // 2. Merge Strategies (Simple: Last Modified Wins)
      const mergedResumes = { ...localResumes };

      // Check remotes against locals
      for (const [id, remoteResume] of Object.entries(remoteResumesMap)) {
        const localResume = mergedResumes[id];
        
        if (!localResume) {
          // New from cloud
          const { $id, ...cleanResume } = remoteResume; 
          mergedResumes[id] = cleanResume;
        } else if (remoteResume.lastModified > localResume.lastModified) {
          // Cloud is newer
           const { $id, ...cleanResume } = remoteResume;
           mergedResumes[id] = cleanResume;
        }
      }

      // 3. Push updates to cloud (Upsert)
      const uploadPromises = Object.values(mergedResumes).map(async (resume) => {
         const remoteMatch = remoteResumesMap[resume.id];
         
         // If remote doesn't exist or local is newer, upload
         if (!remoteMatch || resume.lastModified > remoteMatch.lastModified) {
            const payload = {
                userId,
                content: JSON.stringify(resume),
                lastModified: new Date(resume.lastModified).toISOString() // For Appwrite queries if needed
            };

            if (remoteMatch) {
                // Update
                await databases.updateDocument(DATABASE_ID, COLLECTION_ID, remoteMatch.$id, payload);
            } else {
                // Create
                await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), payload);
            }
         }
      });

      await Promise.all(uploadPromises);

      return mergedResumes;

    } catch (error) {
      console.error('Sync failed:', error);
      throw error;
    }
  }
};
