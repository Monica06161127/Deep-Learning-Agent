import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const GENAI_KEY = process.env.GEMINI_API_KEY || "";

export const ai = new GoogleGenAI({ apiKey: GENAI_KEY });

export async function analyzeContent(content: string): Promise<AnalysisResult> {
  const prompt = `Analyze the following technical or complex content and provide a structured learning breakdown.
  
  Content: ${content}
  
  Please provide:
  1. A concise summary of the core message.
  2. A "Logic Map": Identify the main arguments and the evidence supporting them.
  3. "Heuristic Questions": 3-5 deep, open-ended questions that challenge the reader's understanding.
  4. "Supplementary Knowledge": Simulated web-retrieval info that complements the content (e.g., related research, historical context, or practical applications).
  5. A "Feynman Quiz": 3-5 multiple-choice questions designed to test if the user has internalized the knowledge.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          logicMap: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                argument: { type: Type.STRING },
                evidence: { type: Type.STRING },
              },
              required: ["argument", "evidence"],
            },
          },
          heuristicQuestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                context: { type: Type.STRING },
              },
              required: ["question", "context"],
            },
          },
          supplementalKnowledge: { type: Type.STRING },
          feynmanQuiz: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                correctAnswer: { type: Type.STRING },
                explanation: { type: Type.STRING },
              },
              required: ["question", "options", "correctAnswer", "explanation"],
            },
          },
        },
        required: ["summary", "logicMap", "heuristicQuestions", "supplementalKnowledge", "feynmanQuiz"],
      },
    },
  });

  if (!response.text) {
    throw new Error("Failed to get analysis from AI.");
  }

  return JSON.parse(response.text.trim()) as AnalysisResult;
}
