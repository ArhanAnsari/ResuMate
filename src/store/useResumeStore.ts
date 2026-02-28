import { APP_CONFIG } from "@/src/core/config/app";
import { appwrite } from "@/src/services/appwrite/client";
import { ID, Query } from "react-native-appwrite";
import { create } from "zustand";

interface ResumeState {
  resumes: any[];
  isLoading: boolean;
  error: string | null;

  fetchResumes: (userId: string) => Promise<void>;
  createResume: (userId: string, title: string) => Promise<void>;
  deleteResume: (id: string) => Promise<void>;
}

export const useResumeStore = create<ResumeState>((set, get) => ({
  resumes: [],
  isLoading: false,
  error: null,

  fetchResumes: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await appwrite.databases.listDocuments(
        APP_CONFIG.APPWRITE.DATABASE_ID,
        APP_CONFIG.APPWRITE.COLLECTION.RESUMES,
        [Query.equal("userId", userId), Query.orderDesc("$createdAt")],
      );
      set({ resumes: response.documents, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createResume: async (userId: string, title: string) => {
    set({ isLoading: true, error: null });
    try {
      const initialData: any = {
        profile: {
          fullName: "Your Name",
          email: "your.email@example.com",
          phone: "+1 234 567 8900",
          location: "City, Country",
        },
        summary:
          "Driven and motivated professional with a proven track record of success. Committed to continuous learning and contributing to team goals.",
        experience: [
          {
            position: "Job Title",
            company: "Company Name",
            startDate: "Jan 2023",
            endDate: "Present",
            description:
              "Lead initiatives to improve operational efficiency. Collaborated with cross-functional teams to deliver high-quality projects on time.",
          },
        ],
        education: [
          {
            institution: "University Name",
            degree: "Bachelor of Science in Computer Science",
            startDate: "2018",
            endDate: "2022",
          },
        ],
        skills: [
          "JavaScript",
          "React Native",
          "TypeScript",
          "Problem Solving",
          "Communication",
        ],
      };

      await appwrite.databases.createDocument(
        APP_CONFIG.APPWRITE.DATABASE_ID,
        APP_CONFIG.APPWRITE.COLLECTION.RESUMES,
        ID.unique(),
        {
          userId,
          title,
          data: JSON.stringify(initialData),
          isPublic: false,
          templateId: "modern",
        },
      );
      await get().fetchResumes(userId);
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  deleteResume: async (id: string) => {
    try {
      await appwrite.databases.deleteDocument(
        APP_CONFIG.APPWRITE.DATABASE_ID,
        APP_CONFIG.APPWRITE.COLLECTION.RESUMES,
        id,
      );
      set((state) => ({
        resumes: state.resumes.filter((r) => r.$id !== id),
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },
}));
