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
    },
    FUNCTIONS: {
      AI_GENERATE: "697472580038b88c51d2",
    },
  },
  GEMINI: {
    MODEL_ID: "gemini-3-pro-preview",
    API_KEY_STORAGE_KEY: "gemini_api_key",
  },
  LINKS: {
    PRIVACY: "https://example.com/privacy",
    TERMS: "https://example.com/terms",
  },
};
