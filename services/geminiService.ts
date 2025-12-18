
import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion, CulturalFact } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateQuizQuestion = async (topic: string, language: string): Promise<QuizQuestion> => {
  if (!process.env.API_KEY) {
    return {
      question: `What is the ${language} word for "Welcome"?`,
      options: ["Akwaaba", "Maakye", "Yaa agya", "Medaase"],
      correctAnswer: "Akwaaba",
      explanation: "Akwaaba means Welcome. Maakye is Good Morning."
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
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
    
    const text = response.text;
    if(!text) throw new Error("No response text");
    const jsonStr = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(jsonStr) as QuizQuestion;
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

export const explainConstitutionArticle = async (chapter: string, article: string): Promise<string> => {
  if (!process.env.API_KEY) return "The AI is currently resting. Please try again later.";
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Explain Chapter ${chapter}, Article ${article} of the 1992 Constitution of Ghana in simple, easy-to-understand terms for a student. Keep it concise and focus on practical meaning.`
    });
    return response.text || "No explanation available.";
  } catch (e) {
    return "Failed to fetch explanation. Please refer to the official text.";
  }
};

export const generateCuisineInfo = async (language: string): Promise<CulturalFact> => {
  if (!process.env.API_KEY) {
    return {
      title: "Waakye",
      content: "A nutritious breakfast dish made of rice and beans, often served with shito (hot pepper sauce).",
      category: "Food",
      recipe: ["Rice", "Beans", "Millet stalks", "Shito", "Wele"]
    };
  }
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Describe a famous traditional dish from the region where ${language} is spoken in Ghana. Include its history and a simple list of main ingredients.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            recipe: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["title", "content", "recipe"]
        }
      }
    });
    const text = response.text;
    if(!text) throw new Error("No response text");
    const jsonStr = text.replace(/```json\n?|\n?```/g, '').trim();
    const data = JSON.parse(jsonStr);
    return { ...data, category: "Food" };
  } catch (error) {
    return { title: "Jollof Rice", content: "Ghanaian Jollof is legendary and highly contested across West Africa.", category: "Food" };
  }
};

export const generateCulturalFact = async (language: string, category: string = "All"): Promise<CulturalFact> => {
  if (!process.env.API_KEY) {
    return {
      title: "Adinkra Symbols",
      content: "Gye Nyame is a popular Adinkra symbol meaning 'Except God', symbolizing the omnipotence of God.",
      category: "History"
    };
  }

  try {
    const catConstraint = category === "All" ? "proverb, history, or food" : category;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Tell me a short, interesting cultural fact about ${catConstraint} related to the ${language} speaking people of Ghana. Focus on engaging content for tourists and learners.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                content: { type: Type.STRING },
                category: { type: Type.STRING, enum: ["Proverb", "History", "Food", "Landmark"] }
            },
            required: ["title", "content", "category"]
        }
      }
    });

    const text = response.text;
    if(!text) throw new Error("No response text");
    const jsonStr = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(jsonStr) as CulturalFact;
  } catch (error) {
    console.error("Gemini API Error:", error);
     return {
      title: "Fufu & Light Soup",
      content: "A staple dish among the Akan, made from pounded cassava and plantain.",
      category: "Food"
    };
  }
};

export const generateLandmark = async (language: string): Promise<CulturalFact> => {
  if (!process.env.API_KEY) {
    return {
      title: "Elmina Castle",
      content: "A historic fortress in Elmina, Ghana, known for its role in the transatlantic slave trade and its beautiful coastal architecture.",
      category: "Landmark",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Elmina+Castle"
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find a famous historical or tourist landmark in the region of Ghana where ${language} is primarily spoken. Provide its name, a brief history/description, and ensure you fetch its Google Maps location URL.`,
      config: {
        tools: [{googleMaps: {}}],
      },
    });

    const text = response.text || "A beautiful place to visit in Ghana.";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    let mapUrl = "";
    
    for (const chunk of chunks) {
      if (chunk.maps?.uri) {
        mapUrl = chunk.maps.uri;
        break;
      }
    }

    return {
      title: text.split('\n')[0].replace(/#/g, '').trim() || "Historic Landmark",
      content: text,
      category: "Landmark",
      mapUrl: mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(text.split('\n')[0])}`
    };
  } catch (error) {
    console.error("Gemini Maps Error:", error);
    return {
      title: "Cape Coast Castle",
      content: "A major landmark in the Central Region, reflecting Ghana's complex history.",
      category: "Landmark",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Cape+Coast+Castle"
    };
  }
};

export interface PronunciationFeedback {
  score: number;
  feedback: string;
  isExcellent: boolean;
}

export const analyzePronunciation = async (
  nativeWord: string, 
  audioBase64: string, 
  mimeType: string
): Promise<PronunciationFeedback> => {
  if (!process.env.API_KEY) {
    return { score: 85, feedback: "Great job! You sound almost like a local speaker.", isExcellent: true };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      contents: [
        {
          parts: [
            { text: `The user is trying to pronounce the Ghanaian word "${nativeWord}". Analyze their audio and rate their accuracy from 0 to 100. Provide short, encouraging feedback.` },
            {
              inlineData: {
                mimeType: mimeType,
                data: audioBase64
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            feedback: { type: Type.STRING },
            isExcellent: { type: Type.BOOLEAN }
          },
          required: ["score", "feedback", "isExcellent"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No feedback generated");
    const jsonStr = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(jsonStr) as PronunciationFeedback;
  } catch (error) {
    console.error("Pronunciation Analysis Error:", error);
    return { score: 70, feedback: "Nice effort! Try to emphasize the vowels a bit more.", isExcellent: false };
  }
};
