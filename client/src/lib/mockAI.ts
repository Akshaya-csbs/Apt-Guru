import { GoogleGenerativeAI } from "@google/generative-ai";
import { APTGURU_SYSTEM_PROMPT } from "./edgeFunctionPrompt";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

function isValidResponse(text: string): boolean {
  if (!text || text.trim().length < 20) return false;
  const badPatterns = ["pollinations legacy", "being deprecated", "important notice", "<!doctype", "<html"];
  const lower = text.toLowerCase();
  return !badPatterns.some((p) => lower.includes(p));
}

export const getMockAIResponse = async (message: string, mode: string, file?: File | null): Promise<string> => {
  const systemInstruction = APTGURU_SYSTEM_PROMPT +
    `\n\nYou are in **${mode.toUpperCase()}** Mode. Strictly follow the ${mode} pedagogical rules.`;

  // 1️⃣ Gemini SDK (handles CORS correctly in browser)
  if (API_KEY) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    // Use confirmed-available models from ListModels — lite models have better free quota
    const models = ["gemini-1.5-flash", "gemini-2.0-flash-lite", "gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.0-flash-001"];
    
    for (const modelName of models) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction,
          generationConfig: { maxOutputTokens: 2048, temperature: 0.7 }
        });

        const parts: any[] = [{ text: message }];
        
        // Add image if provided
        if (file) {
          await new Promise<void>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              parts.push({
                inlineData: {
                  data: (reader.result as string).split(",")[1],
                  mimeType: file.type
                }
              });
              resolve();
            };
            reader.readAsDataURL(file);
          });
        }

        const result = await model.generateContent(parts);
        const text = result.response.text();
        if (isValidResponse(text)) {
          console.log(`✅ Gemini ${modelName} answered successfully`);
          return text;
        }
      } catch (err: any) {
        console.warn(`Gemini ${modelName} failed:`, err.message?.slice(0, 120));
      }
    }
  }

  // 2️⃣ Pollinations GET fallback (anonymous, robust against CORS)
  try {
    const promptStr = systemInstruction.slice(0, 1500) + "\n\nUser Question:\n" + message;
    const res = await fetch(`https://text.pollinations.ai/prompt/${encodeURIComponent(promptStr)}?model=openai&seed=42`);

    if (res.ok) {
      const text = await res.text();
      if (isValidResponse(text)) {
        console.log("✅ Pollinations fallback answered");
        return text;
      }
    }
    throw new Error(`Pollinations status: ${res.status}`);
  } catch (err2: any) {
    console.error("All AI services failed:", err2.message);
  }

  return "⚠️ Could not reach AI services. Please check your internet and try again.";
};
