import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || "";

export const getGeminiClient = (): GoogleGenAI | null => {
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not configured in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};
