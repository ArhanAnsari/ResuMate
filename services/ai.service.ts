import AsyncStorage from "@react-native-async-storage/async-storage";
import { APP_CONFIG } from "../src/core/config/app";
import { appwrite } from "../src/services/appwrite/client";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent";

export const AIService = {
  async getApiKey(): Promise<string | null> {
    return AsyncStorage.getItem(APP_CONFIG.GEMINI.API_KEY_STORAGE_KEY);
  },

  async setApiKey(key: string): Promise<void> {
    return AsyncStorage.setItem(APP_CONFIG.GEMINI.API_KEY_STORAGE_KEY, key);
  },

  async generateContent(prompt: string, context?: any): Promise<string> {
    const apiKey = await this.getApiKey();

    // First try the local API Key if available
    if (apiKey) {
      try {
        const systemContext = `You are a professional resume writer. 
        Help the user write content for their resume. 
        Keep it concise, professional, and action-oriented. 
        Output ONLY the requested content, no conversational filler.`;

        const fullPrompt = `${systemContext}\n\nContext: ${JSON.stringify(context || {})}\n\nTask: ${prompt}`;

        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: fullPrompt }],
              },
            ],
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error?.message || "Failed to generate content locally",
          );
        }

        return data.candidates[0]?.content?.parts[0]?.text?.trim() || "";
      } catch (error: any) {
        console.error("Local AI Generation Error:", error);
        throw new Error(error.message || "Local AI Generation failed");
      }
    }

    // Fallback to Appwrite Function
    try {
      const systemContext = `You are a professional resume writer. 
      Help the user write content for their resume. 
      Keep it concise, professional, and action-oriented. 
      Output ONLY the requested content, no conversational filler.`;

      const fullPrompt = `${systemContext}\n\nContext: ${JSON.stringify(context || {})}\n\nTask: ${prompt}`;

      const execution = await appwrite.functions.createExecution(
        APP_CONFIG.APPWRITE.FUNCTIONS.AI_GENERATE,
        JSON.stringify({
          prompt: fullPrompt,
          model: APP_CONFIG.GEMINI.MODEL_ID,
        }),
      );

      if (execution.status === "failed") {
        console.error("Appwrite function execution failed:", execution.errors);
        throw new Error("Server execution failed: " + execution.errors);
      }

      const response = JSON.parse(execution.responseBody);
      if (response.error) {
        throw new Error(response.error);
      }

      return response.text?.trim() || "";
    } catch (error: any) {
      console.error("Server AI Generation Error:", error);
      throw new Error(error.message || "Server AI Generation failed");
    }
  },
};
