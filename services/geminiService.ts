
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const submitIdeaFunctionDeclaration: FunctionDeclaration = {
  name: 'submitIdea',
  parameters: {
    type: Type.OBJECT,
    description: 'Call this function when the user has provided a site name, their email, and a clear description of their website idea.',
    properties: {
      siteName: {
        type: Type.STRING,
        description: 'The name of the website or project.',
      },
      email: {
        type: Type.STRING,
        description: 'The user\'s contact email address.',
      },
      idea: {
        type: Type.STRING,
        description: 'The detailed description of the website idea.',
      },
    },
    required: ['siteName', 'email', 'idea'],
  },
};

export const evaluateIdea = async (ideaText: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: "You are a senior tech strategist. Analyze this idea. Provide a score 1-10 and brief market/tech feedback.",
    },
    contents: `Evaluate: "${ideaText}"`,
  });
  return response.text || "No evaluation provided.";
};

export const generateStarterCode = async (ideaText: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    config: {
      systemInstruction: "Generate clean HTML/Tailwind CSS boilerplate for this idea. Return only the code.",
    },
    contents: `Create prototype for: "${ideaText}"`,
  });
  return response.text || "Code generation failed.";
};

export const chatRefineIdea = async (history: any[]): Promise<any> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: "You are a Product Consultant. Your goal is to collect three things from the user: 1) A Project/Site Name, 2) Their Email, 3) A clear Description of their idea. Engage in friendly conversation to gather these. Once you have all three, use the 'submitIdea' tool. Do not submit until you have all details clearly.",
      tools: [{ functionDeclarations: [submitIdeaFunctionDeclaration] }],
    },
    contents: history,
  });
  return response;
};
