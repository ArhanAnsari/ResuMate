import { APP_CONFIG } from "@/src/core/config/app";
import { appwrite } from "@/src/services/appwrite/client";
import { ID, Query } from "react-native-appwrite";
import { create } from "zustand";

export interface Profile {
  $id: string;
  userId: string;
  fullName: string;
  bio: string;
  location: string;
  phone: string;
  website: string;
  avatarUrl?: string; // Future proofing
}

interface ProfileState {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;

  fetchProfile: (userId: string) => Promise<void>;
  updateProfile: (
    userId: string,
    data: Partial<Omit<Profile, "$id" | "userId">>,
  ) => Promise<void>;
  createProfile: (userId: string, data: Partial<Profile>) => Promise<void>;
  uploadAvatar: (userId: string, imageUri: string) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  isLoading: false,
  error: null,

  uploadAvatar: async (userId: string, imageUri: string) => {
    set({ isLoading: true, error: null });
    try {
      const file = {
        name: `${userId}_${Date.now()}.jpg`,
        type: "image/jpeg",
        uri: imageUri,
      } as any; // Cast for RN file object

      const uploaded = await appwrite.storage.createFile(
        APP_CONFIG.APPWRITE.BUCKET.AVATARS,
        ID.unique(),
        file,
      );

      const avatarUrl = appwrite.storage.getFileView(
        APP_CONFIG.APPWRITE.BUCKET.AVATARS,
        uploaded.$id,
      );

      // We call updateProfile which handles state update
      await get().updateProfile(userId, { avatarUrl: avatarUrl.toString() });
      set({ isLoading: false });
    } catch (error: any) {
      console.error("Upload avatar error:", error);
      set({ error: error.message, isLoading: false });
    }
  },

  fetchProfile: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      // Try to find a profile with this userId
      const response = await appwrite.databases.listDocuments(
        APP_CONFIG.APPWRITE.DATABASE_ID,
        APP_CONFIG.APPWRITE.COLLECTION.PROFILES,
        [Query.equal("userId", userId)],
      );

      if (response.documents.length > 0) {
        set({
          profile: response.documents[0] as unknown as Profile,
          isLoading: false,
        });
      } else {
        // No profile found, we might want to return null or create a default one
        // For now, let's return null and let the UI decide to create one
        set({ profile: null, isLoading: false });
      }
    } catch (error: any) {
      console.error("Fetch profile error:", error);
      set({ error: error.message, isLoading: false });
    }
  },

  createProfile: async (userId: string, data: Partial<Profile>) => {
    set({ isLoading: true, error: null });
    try {
      const payload = {
        userId,
        fullName: data.fullName || "",
        bio: data.bio || "",
        location: data.location || "",
        phone: data.phone || "",
        website: data.website || "",
      };

      const doc = await appwrite.databases.createDocument(
        APP_CONFIG.APPWRITE.DATABASE_ID,
        APP_CONFIG.APPWRITE.COLLECTION.PROFILES,
        ID.unique(),
        payload,
      );
      set({ profile: doc as unknown as Profile, isLoading: false });
    } catch (error: any) {
      console.error("Create profile error:", error);
      set({ error: error.message, isLoading: false });
    }
  },

  updateProfile: async (
    userId: string,
    data: Partial<Omit<Profile, "$id" | "userId">>,
  ) => {
    set({ isLoading: true, error: null });
    const currentProfile = get().profile;

    if (!currentProfile) {
      // If no profile exists, create it
      return get().createProfile(userId, data);
    }

    try {
      const doc = await appwrite.databases.updateDocument(
        APP_CONFIG.APPWRITE.DATABASE_ID,
        APP_CONFIG.APPWRITE.COLLECTION.PROFILES,
        currentProfile.$id,
        data,
      );
      set({ profile: doc as unknown as Profile, isLoading: false });
    } catch (error: any) {
      console.error("Update profile error:", error);
      set({ error: error.message, isLoading: false });
    }
  },
}));
