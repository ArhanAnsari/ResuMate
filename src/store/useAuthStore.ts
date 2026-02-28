import { appwrite } from "@/src/services/appwrite/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";
import { Models, OAuthProvider } from "react-native-appwrite";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  user: Models.User<Models.Preferences> | null;
  session: Models.Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithOAuth: (provider: OAuthProvider) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isAuthenticated: false,
      isLoading: true,

      initialize: async () => {
        try {
          const user = await appwrite.account.get();
          set({ user, isAuthenticated: true, isLoading: false });
        } catch {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const session = await appwrite.account.createEmailPasswordSession(
            email,
            password,
          );
          const user = await appwrite.account.get();
          set({ session, user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      loginWithOAuth: async (provider: OAuthProvider) => {
        try {
          // Deep-link URL that Appwrite will redirect to after OAuth.
          // expo-router handles this URL and renders app/auth/callback.tsx
          // which exchanges the one-time userId+secret for a real session.
          const callbackUrl = Linking.createURL("/auth/callback");

          const oauthUrl = await appwrite.account.createOAuth2Token(
            provider,
            callbackUrl,
            callbackUrl,
          );

          if (!oauthUrl) {
            throw new Error(
              "Could not generate OAuth URL. Check Appwrite OAuth provider settings.",
            );
          }

          // Open the system browser. The browser will redirect back to
          // callbackUrl when done; expo-router routes that to /auth/callback.
          await Linking.openURL(oauthUrl.toString());
        } catch (error) {
          throw error;
        }
      },

      register: async (email, password, name) => {
        set({ isLoading: true });
        try {
          await appwrite.account.create("unique()", email, password, name);
          await get().login(email, password);
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await appwrite.account.deleteSession("current");
          set({ user: null, session: null, isAuthenticated: false });
        } catch (error) {
          console.error(error);
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ session: state.session }),
    },
  ),
);
