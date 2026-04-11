import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY is not defined");
}

export const aiClient = new GoogleGenAI({
    apiKey: apiKey,
});

export const AI_MODEL_NAME = 'gemini-3-flash-preview';