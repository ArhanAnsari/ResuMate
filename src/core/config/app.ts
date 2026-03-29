export const APP_CONFIG = {
  APPWRITE: {
    ENDPOINT: "https://sgp.cloud.appwrite.io/v1",
    PROJECT_ID: "696b4ec8000780f22834", // Use the Project ID
    DATABASE_ID: "696dc447003d007add37",
    COLLECTION: {
      RESUMES: "resumes",
      PROFILES: "profiles",
    },
    BUCKET: {
      EXPORTS: "exports",
      AVATARS: "avatars",
    },
    FUNCTIONS: {
      AI_GENERATE: "69c8dca3003bf4ff9089",
    },
  },
  GEMINI: {
    MODEL_ID: "gemini-2.5-flash",
    API_KEY_STORAGE_KEY: "gemini_api_key",
  },
  LINKS: {
    PRIVACY: "https://resumate.appwrite.network/privacy",
    TERMS: "https://resumate.appwrite.network/terms",
  },
  REVENUECAT: {
    // Replace with your actual RevenueCat API keys from app.revenuecat.com
    IOS_API_KEY: "appl_YOUR_IOS_API_KEY",
    ANDROID_API_KEY: "goog_YOUR_ANDROID_API_KEY",
    ENTITLEMENTS: {
      PRO: "pro",
      PREMIUM: "premium",
    },
  },
};
