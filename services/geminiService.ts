import { GoogleGenAI, Type, SchemaType } from "@google/genai";
import { QuizQuestion, CulturalFact } from '../types';

// Safely get key, fallback if missing to prevent crash on initialization
const apiKey = process.env.API_KEY || 'dummy_key_for_build';
const ai = new GoogleGenAI({ apiKey });

export const generateQuizQuestion = async (topic: string, language: string): Promise<QuizQuestion> => {
  if (!process.env.API_KEY) {
    // Fallback Mock Data if no key
    return {
      question: `What is the ${language} word for "Welcome"?`,
      options: ["Akwaaba", "Maakye", "Yaa agya", "Medaase"],
      correctAnswer: "Akwaaba",
      explanation: "Akwaaba means Welcome. Maakye is Good Morning."
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a beginner multiple-choice quiz question about "${topic}" in the Ghanaian language "${language}".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.STRING },
            explanation: { type: Type.STRING }
          },
          required: ["question", "options", "correctAnswer", "explanation"]
        }
      }
    });
    
    // Parse the response manually if needed, or cast it if using the helper
    const text = response.text;
    if(!text) throw new Error("No response text");
    return JSON.parse(text) as QuizQuestion;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      question: `Translate "Water" to ${language}`,
      options: ["Nsuo", "Aduane", "Kente", "Obroni"],
      correctAnswer: "Nsuo",
      explanation: "Nsuo means Water."
    };
  }
};

export const generateCulturalFact = async (language: string): Promise<CulturalFact> => {
  if (!process.env.API_KEY) {
    return {
      title: "Adinkra Symbols",
      content: "Gye Nyame is a popular Adinkra symbol meaning 'Except God', symbolizing the omnipotence of God.",
      category: "History"
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Tell me a short, interesting cultural fact, proverb, or food tip related to the ${language} speaking people of Ghana.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                content: { type: Type.STRING },
                category: { type: Type.STRING, enum: ["Proverb", "History", "Food"] }
            }
        }
      }
    });

    const text = response.text;
    if(!text) throw new Error("No response text");
    return JSON.parse(text) as CulturalFact;

  } catch (error) {
    console.error("Gemini API Error:", error);
     return {
      title: "Fufu & Light Soup",
      content: "A staple dish among the Akan, made from pounded cassava and plantain.",
      category: "Food"
    };
  }
};

export const getConversationScenario = async (topic: string, language: string): Promise<{userRole: string, aiRole: string, openingLine: string}> => {
    // Using a simpler mock/fallback for conversation setup to save tokens/latency in demo
     return {
        userRole: "Customer",
        aiRole: "Market Vendor",
        openingLine: language === 'Twi' ? "Maakye! Wo tɔ deɛn?" : "Hello! What are you buying?"
     };
}
