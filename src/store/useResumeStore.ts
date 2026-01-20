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
        // Using any temporarily or matching proper type
        profile: { fullName: "", email: "", phone: "", location: "" },
        summary: "",
        experience: [],
        education: [],
        skills: [],
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
