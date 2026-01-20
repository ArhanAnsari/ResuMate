import { APP_CONFIG } from "@/src/core/config/app";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GEMINI_API_KEY_KEY = "gemini_api_key";

interface GenerationResponse {
  text: string;
  error?: string;
}

export const AIService = {
  async getApiKey(): Promise<string | null> {
    return AsyncStorage.getItem(GEMINI_API_KEY_KEY);
  },

  async setApiKey(key: string): Promise<void> {
    return AsyncStorage.setItem(GEMINI_API_KEY_KEY, key);
  },

  async generate(prompt: string): Promise<GenerationResponse> {
    const apiKey = await this.getApiKey();
    if (!apiKey) {
      throw new Error("Please configure your Gemini API Key in settings.");
    }

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${APP_CONFIG.GEMINI.MODEL_ID}:generateContent?key=${apiKey}`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.error?.message || "Gemini API Error");
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) throw new Error("No content generated");

      return { text };
    } catch (error: any) {
      console.error("AI Service Error:", error);
      return { text: "", error: error.message };
    }
  },

  async enhanceResumeSection(
    sectionText: string,
    type: "summary" | "education" | "work",
  ): Promise<string> {
    const prompts = {
      summary: `Rewrite this resume professional summary to be more impactful and concise. Use action verbs. Text: "${sectionText}"`,
      education: `Format and improve this education detail. Highlight key achievements. Text: "${sectionText}"`,
      work: `Rewrite these work experience bullet points to be results-oriented (STAR method). Text: "${sectionText}"`,
    };

    const res = await this.generate(prompts[type] || prompts.summary);
    return res.text;
  },
};
