import {
  EducationItem,
  ExperienceItem,
  ProjectItem,
  ResumeData,
  ResumeProfile,
  SkillItem,
} from "@/interfaces/resume";
import { ResumeService } from "@/services/resume.service";
import { generateId } from "@/utils/id"; // I need to create this util
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ResumeState {
  resumes: Record<string, ResumeData>;
  activeResumeId: string | null;
  isSyncing: boolean;

  // Actions
  syncResumes: (userId: string) => Promise<void>;
  createResume: (title?: string) => string;
  deleteResume: (id: string) => void;
  setActiveResume: (id: string) => void;
  updateProfile: (data: Partial<ResumeProfile>) => void;

  // Array management actions
  addEducation: (item: Omit<EducationItem, "id">) => void;
  updateEducation: (id: string, item: Partial<EducationItem>) => void;
  removeEducation: (id: string) => void;

  addExperience: (item: Omit<ExperienceItem, "id">) => void;
  updateExperience: (id: string, item: Partial<ExperienceItem>) => void;
  removeExperience: (id: string) => void;

  addProject: (item: Omit<ProjectItem, "id">) => void;
  updateProject: (id: string, item: Partial<ProjectItem>) => void;
  removeProject: (id: string) => void;

  addSkill: (item: Omit<SkillItem, "id">) => void;
  removeSkill: (id: string) => void;
}

const DEFAULT_PROFILE: ResumeProfile = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
};

export const useResumeStore = create<ResumeState>()(
  persist(
    (set, get) => ({
      resumes: {},
      activeResumeId: null,
      isSyncing: false,

      syncResumes: async (userId) => {
        set({ isSyncing: true });
        try {
          const { resumes } = get();
          const syncedResumes = await ResumeService.syncResumes(
            resumes,
            userId,
          );
          set({ resumes: syncedResumes, isSyncing: false });
        } catch (error) {
          console.error("Store Sync Error", error);
          set({ isSyncing: false });
          throw error;
        }
      },

      createResume: (title = "Untitled Resume") => {
        const id = generateId();
        const newResume: ResumeData = {
          id,
          title,
          lastModified: Date.now(),
          profile: { ...DEFAULT_PROFILE },
          education: [],
          experience: [],
          projects: [],
          skills: [],
        };

        set((state) => ({
          resumes: { ...state.resumes, [id]: newResume },
          activeResumeId: id,
        }));

        return id;
      },

      deleteResume: (id) => {
        set((state) => {
          const { [id]: deleted, ...remainingResumes } = state.resumes;
          const newActiveId =
            state.activeResumeId === id ? null : state.activeResumeId;
          return {
            resumes: remainingResumes,
            activeResumeId: newActiveId,
          };
        });
      },

      setActiveResume: (id) => {
        set({ activeResumeId: id });
      },

      updateProfile: (data) => {
        const { activeResumeId, resumes } = get();
        if (!activeResumeId || !resumes[activeResumeId]) return;

        set((state) => ({
          resumes: {
            ...state.resumes,
            [activeResumeId]: {
              ...state.resumes[activeResumeId],
              profile: { ...state.resumes[activeResumeId].profile, ...data },
              lastModified: Date.now(),
            },
          },
        }));
      },

      // --- Education Actions ---
      addEducation: (item) => {
        const { activeResumeId } = get();
        if (!activeResumeId) return;

        const newItem: EducationItem = { ...item, id: generateId() };

        set((state) => ({
          resumes: {
            ...state.resumes,
            [activeResumeId]: {
              ...state.resumes[activeResumeId],
              education: [...state.resumes[activeResumeId].education, newItem],
              lastModified: Date.now(),
            },
          },
        }));
      },

      updateEducation: (itemId, data) => {
        const { activeResumeId } = get();
        if (!activeResumeId) return;

        set((state) => ({
          resumes: {
            ...state.resumes,
            [activeResumeId]: {
              ...state.resumes[activeResumeId],
              education: state.resumes[activeResumeId].education.map((item) =>
                item.id === itemId ? { ...item, ...data } : item,
              ),
              lastModified: Date.now(),
            },
          },
        }));
      },

      removeEducation: (itemId) => {
        const { activeResumeId } = get();
        if (!activeResumeId) return;

        set((state) => ({
          resumes: {
            ...state.resumes,
            [activeResumeId]: {
              ...state.resumes[activeResumeId],
              education: state.resumes[activeResumeId].education.filter(
                (item) => item.id !== itemId,
              ),
              lastModified: Date.now(),
            },
          },
        }));
      },

      // --- Experience Actions ---
      addExperience: (item) => {
        const { activeResumeId } = get();
        if (!activeResumeId) return;

        const newItem: ExperienceItem = { ...item, id: generateId() };

        set((state) => ({
          resumes: {
            ...state.resumes,
            [activeResumeId]: {
              ...state.resumes[activeResumeId],
              experience: [
                ...state.resumes[activeResumeId].experience,
                newItem,
              ],
              lastModified: Date.now(),
            },
          },
        }));
      },

      updateExperience: (itemId, data) => {
        const { activeResumeId } = get();
        if (!activeResumeId) return;

        set((state) => ({
          resumes: {
            ...state.resumes,
            [activeResumeId]: {
              ...state.resumes[activeResumeId],
              experience: state.resumes[activeResumeId].experience.map(
                (item) => (item.id === itemId ? { ...item, ...data } : item),
              ),
              lastModified: Date.now(),
            },
          },
        }));
      },

      removeExperience: (itemId) => {
        const { activeResumeId } = get();
        if (!activeResumeId) return;

        set((state) => ({
          resumes: {
            ...state.resumes,
            [activeResumeId]: {
              ...state.resumes[activeResumeId],
              experience: state.resumes[activeResumeId].experience.filter(
                (item) => item.id !== itemId,
              ),
              lastModified: Date.now(),
            },
          },
        }));
      },

      // --- Project Actions ---
      addProject: (item) => {
        const { activeResumeId } = get();
        if (!activeResumeId) return;

        const newItem: ProjectItem = { ...item, id: generateId() };

        set((state) => ({
          resumes: {
            ...state.resumes,
            [activeResumeId]: {
              ...state.resumes[activeResumeId],
              projects: [...state.resumes[activeResumeId].projects, newItem],
              lastModified: Date.now(),
            },
          },
        }));
      },

      updateProject: (itemId, data) => {
        const { activeResumeId } = get();
        if (!activeResumeId) return;

        set((state) => ({
          resumes: {
            ...state.resumes,
            [activeResumeId]: {
              ...state.resumes[activeResumeId],
              projects: state.resumes[activeResumeId].projects.map((item) =>
                item.id === itemId ? { ...item, ...data } : item,
              ),
              lastModified: Date.now(),
            },
          },
        }));
      },

      removeProject: (itemId) => {
        const { activeResumeId } = get();
        if (!activeResumeId) return;

        set((state) => ({
          resumes: {
            ...state.resumes,
            [activeResumeId]: {
              ...state.resumes[activeResumeId],
              projects: state.resumes[activeResumeId].projects.filter(
                (item) => item.id !== itemId,
              ),
              lastModified: Date.now(),
            },
          },
        }));
      },

      // --- Skill Actions ---
      addSkill: (item) => {
        const { activeResumeId } = get();
        if (!activeResumeId) return;

        const newItem: SkillItem = { ...item, id: generateId() };

        set((state) => ({
          resumes: {
            ...state.resumes,
            [activeResumeId]: {
              ...state.resumes[activeResumeId],
              skills: [...state.resumes[activeResumeId].skills, newItem],
              lastModified: Date.now(),
            },
          },
        }));
      },

      removeSkill: (itemId) => {
        const { activeResumeId } = get();
        if (!activeResumeId) return;

        set((state) => ({
          resumes: {
            ...state.resumes,
            [activeResumeId]: {
              ...state.resumes[activeResumeId],
              skills: state.resumes[activeResumeId].skills.filter(
                (item) => item.id !== itemId,
              ),
              lastModified: Date.now(),
            },
          },
        }));
      },
    }),
    {
      name: "resume-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
