import { ResumeData } from "@/interfaces/resume";
import { tablesDB } from "@/libs/appwrite";
import { ID, Query } from "appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const TABLE_ID = process.env.EXPO_PUBLIC_APPWRITE_RESUMES_COLLECTION_ID!;

export const ResumeService = {
  async syncResumes(
    localResumes: Record<string, ResumeData>,
    userId: string,
  ): Promise<Record<string, ResumeData>> {
    if (!DATABASE_ID || !TABLE_ID) {
      console.warn("Sync skipped: Database configuration missing");
      return localResumes; // Offline mode effectively
    }

    try {
      // 1. Fetch remote resumes
      const response = await tablesDB.listRows({
        databaseId: DATABASE_ID,
        tableId: TABLE_ID,
        queries: [Query.equal("userId", userId)],
      });

      const remoteResumesMap: Record<string, ResumeData & { $id: string }> = {};
      response.rows.forEach((doc: any) => {
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
      const uploadPromises = Object.values(mergedResumes).map(
        async (resume) => {
          const remoteMatch = remoteResumesMap[resume.id];

          // If remote doesn't exist or local is newer, upload
          if (!remoteMatch || resume.lastModified > remoteMatch.lastModified) {
            const payload = {
              userId,
              content: JSON.stringify(resume),
              lastModified: new Date(resume.lastModified).toISOString(), // For Appwrite queries if needed
            };

            if (remoteMatch) {
              // Update
              await tablesDB.updateRow({
                databaseId: DATABASE_ID,
                tableId: TABLE_ID,
                rowId: remoteMatch.$id,
                data: payload,
              });
            } else {
              // Create
              await tablesDB.createRow({
                databaseId: DATABASE_ID,
                tableId: TABLE_ID,
                rowId: ID.unique(),
                data: payload,
              });
            }
          }
        },
      );

      await Promise.all(uploadPromises);

      return mergedResumes;
    } catch (error) {
      console.error("Sync failed:", error);
      throw error;
    }
  },
};
