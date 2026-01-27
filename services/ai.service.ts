import AsyncStorage from "@react-native-async-storage/async-storage";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent";
// Fixed: Use a constant string for the storage key to avoid undefined issues
const API_KEY_STORAGE_KEY = process.env.EXPO_GEMINI_API_KEY!;

export const AIService = {
  async getApiKey(): Promise<string | null> {
    return AsyncStorage.getItem(API_KEY_STORAGE_KEY);
  },

  async setApiKey(key: string): Promise<void> {
    return AsyncStorage.setItem(API_KEY_STORAGE_KEY, key);
  },

  async generateContent(prompt: string, context?: any): Promise<string> {
    const apiKey = await this.getApiKey();
    if (!apiKey) {
      throw new Error("Gemini API Key not found. Please set it in Settings.");
    }

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
        throw new Error(data.error?.message || "Failed to generate content");
      }

      return data.candidates[0]?.content?.parts[0]?.text?.trim() || "";
    } catch (error: any) {
      console.error("AI Generation Error:", error);
      throw new Error(error.message || "AI Generation failed");
    }
  },
};
