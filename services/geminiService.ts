import { GoogleGenAI } from "@google/genai";
import { AnswerStyle, GenealogyWebsite } from '../types';

// FIX: Initialize the GoogleGenAI client using process.env.API_KEY as per the guidelines.
// This resolves the TypeScript error 'Property 'env' does not exist on type 'ImportMeta''
// and aligns with the requirement to source the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getGenealogyAnswer = async (
  website: GenealogyWebsite,
  answerStyle: AnswerStyle,
  question: string
): Promise<string> => {
  const model = 'gemini-2.5-flash';

  const systemInstruction = `You are an expert genealogist, specializing in helping users with questions about popular genealogy websites. Your tone should be warm, helpful, and encouraging. You must format your response in Markdown. For step-by-step answers, use numbered lists. For detailed answers, use paragraphs and headings.`;

  const userPrompt = `
    Please answer the following genealogy question.

    **Context:**
    - **Website:** ${website}
    - **Desired Answer Style:** ${answerStyle}

    **Question:**
    "${question}"

    **Instructions:**
    - Provide a helpful and accurate answer based on the user's question and context.
    - If the desired answer style is "${AnswerStyle.DETAILED}", provide a thorough, narrative-style answer explaining the 'how' and 'why'. Use Markdown for formatting.
    - If the desired answer style is "${AnswerStyle.STEP_BY_STEP}", provide a clear, concise, numbered list of actions the user should take. Use Markdown's numbered list format.
    - Tailor your response specifically to the functionality and features of the selected website: ${website}.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`An error occurred while fetching the answer: ${error.message}`);
    }
    throw new Error("An unknown error occurred while fetching the answer.");
  }
};
