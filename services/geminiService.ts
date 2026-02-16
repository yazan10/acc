
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, Language, Platform } from "../types";

export const analyzeProfile = async (
  input: string,
  platform: Platform,
  lang: Language
): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
    Analyze the following ${platform} account: "${input}". 
    The user wants to know why their account is not growing and getting more engagement.
    Based on typical patterns for this platform and input, generate a professional, realistic audit.
    Provide the response in ${lang === 'ar' ? 'Arabic' : lang === 'he' ? 'Hebrew' : 'English'}.
    
    Structure the response as a JSON object with:
    - growthScore (0-100)
    - problems (array of strings)
    - solutions (array of strings)
    - verdict (string, summary)
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            growthScore: { type: Type.NUMBER },
            problems: { type: Type.ARRAY, items: { type: Type.STRING } },
            solutions: { type: Type.ARRAY, items: { type: Type.STRING } },
            verdict: { type: Type.STRING }
          },
          required: ["growthScore", "problems", "solutions", "verdict"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return result as AnalysisResult;
  } catch (error) {
    console.error("Analysis Error:", error);
    throw error;
  }
};
