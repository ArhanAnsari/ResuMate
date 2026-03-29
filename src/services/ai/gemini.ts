import { APP_CONFIG } from "@/src/core/config/app";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { appwrite } from "../appwrite/client";

interface GenerationResponse {
  text: string;
  error?: string;
}

export const AIService = {
  /**
   * Generates content.
   * Priority:
   * 1. User's local API Key (Direct Call)
   * 2. Appwrite Function (Server-side Key)
   */
  async getApiKey(): Promise<string | null> {
    // Priority: user's own key
    const storedKey = await AsyncStorage.getItem(
      APP_CONFIG.GEMINI.API_KEY_STORAGE_KEY,
    );
    return storedKey || null;
  },

  async getStoredApiKey(): Promise<string | null> {
    return AsyncStorage.getItem(APP_CONFIG.GEMINI.API_KEY_STORAGE_KEY);
  },

  async setApiKey(key: string): Promise<void> {
    return AsyncStorage.setItem(APP_CONFIG.GEMINI.API_KEY_STORAGE_KEY, key);
  },

  async generate(prompt: string): Promise<GenerationResponse> {
    try {
      // 1. Try Local Key
      const localKey = await this.getApiKey();

      if (localKey) {
        return await this.generateLocal(prompt, localKey);
      }

      // 2. Fallback to Appwrite Function
      return await this.generateServer(prompt);
    } catch (error: any) {
      console.error("AI Service Error:", error);
      return { text: "", error: error.message || "Failed to generate content" };
    }
  },

  async generateLocal(
    prompt: string,
    apiKey: string,
  ): Promise<GenerationResponse> {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${APP_CONFIG.GEMINI.MODEL_ID}:generateContent?key=${apiKey}`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          },
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.error?.message || "Gemini API Error (Local)");
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("No content from Gemini");

      return { text };
    } catch (e: any) {
      console.warn("Local Generation Failed, falling back...", e);
      throw e; // Or return error to let caller decide
    }
  },

  async generateServer(prompt: string): Promise<GenerationResponse> {
    const execution = await appwrite.functions.createExecution(
      APP_CONFIG.APPWRITE.FUNCTIONS.AI_GENERATE,
      JSON.stringify({
        prompt,
        model: APP_CONFIG.GEMINI.MODEL_ID,
      }),
      false, // async (false = wait for result)
    );

    if (execution.status === "failed") {
      console.log("Function execution failed:", execution);
      throw new Error(execution.responseBody || "Function execution failed");
    }

    const data = JSON.parse(execution.responseBody);

    if (data.error) {
      throw new Error(data.error);
    }

    return { text: data.text };
  },

  async enhanceResumeSection(
    sectionText: string,
    type: "summary" | "education" | "work" | "cover_letter" | "ats_score",
  ): Promise<string> {
    const prompts: Record<string, string> = {
      summary: `Rewrite this resume professional summary to be more impactful and concise. Use action verbs. Text: "${sectionText}"`,
      education: `Format and improve this education detail. Highlight key achievements. Text: "${sectionText}"`,
      work: `Rewrite these work experience bullet points to be results-oriented (STAR method). Text: "${sectionText}"`,
      cover_letter: `Write a compelling, personalized cover letter based on this resume data. Keep it under 300 words, professional tone, and highlight top skills. Resume Data: ${sectionText}`,
      ats_score: `Analyze this resume for ATS (Applicant Tracking System) compatibility. Give a score out of 100, list missing keywords, formatting issues, and specific improvement suggestions. Resume Data: ${sectionText}`,
    };

    const res = await this.generate(prompts[type] ?? prompts.summary);
    return res.text;
  },
};
