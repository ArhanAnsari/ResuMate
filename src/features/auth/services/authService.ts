import {
  LoginCredentials,
  RegisterCredentials,
  UserProfile,
} from "@/interfaces/auth"; // Need to create types
import { account } from "@/src/core/api/appwrite"; // Ensure this path is correct
import { ID, Models } from "appwrite";

export const AuthService = {
  async login(credentials: LoginCredentials): Promise<UserProfile> {
    try {
      // Check for existing session and delete it to ensure a clean login
      try {
        // We attempt to get the current session first or just try to delete it.
        // Trying to delete 'current' is the safest way to ensure no active session conficts.
        await account.deleteSession({ sessionId: "current" });
      } catch (e) {
        // Ignore error if no session exists or if fails for other reasons
        // (we just continue to try creating a new one)
      }

      // Create session
      await account.createEmailPasswordSession({
        email: credentials.email,
        password: credentials.password,
      });

      // Get account details
      const user = await account.get();
      return mapAppwriteUserToProfile(user);
    } catch (error: any) {
      console.error("Login failed:", error);
      throw new Error(error.message || "Login failed");
    }
  },

  async register(credentials: RegisterCredentials): Promise<UserProfile> {
    try {
      // Clear any existing session before starting registration flow
      try {
        await account.deleteSession({ sessionId: "current" });
      } catch (e) {
        // Ignore if no session
      }

      // Create account
      await account.create({
        userId: ID.unique(),
        email: credentials.email,
        password: credentials.password,
        name: credentials.name,
      });

      // Auto login after register
      await account.createEmailPasswordSession({
        email: credentials.email,
        password: credentials.password,
      });

      const user = await account.get();
      return mapAppwriteUserToProfile(user);
    } catch (error: any) {
      console.error("Registration failed:", error);
      throw new Error(error.message || "Registration failed");
    }
  },

  async logout(): Promise<void> {
    try {
      await account.deleteSession({ sessionId: "current" });
    } catch (error) {
      console.error("Logout failed:", error);
      // We generally want to clear local state even if server logout fails
    }
  },

  async getCurrentUser(): Promise<UserProfile | null> {
    try {
      const user = await account.get();
      return mapAppwriteUserToProfile(user);
    } catch (error) {
      // Not logged in or network error
      return null;
    }
  },
};

// Helper to sanitize Appwrite user object
function mapAppwriteUserToProfile(
  user: Models.User<Models.Preferences>,
): UserProfile {
  return {
    id: user.$id,
    name: user.name,
    email: user.email,
    registrationDate: user.registration,
    lastLogin: user.status ? Date.now() : undefined, // Appwrite doesn't expose lastLogin directly on User model typically without extra setup, but status indicates active
  };
}
