
import { GoogleGenAI, Type } from "@google/genai";
import { Question, DifficultyLevel } from "../types";

export const generateQuiz = async (markdownContent: string, difficulty: DifficultyLevel, questionCount: number): Promise<Question[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const difficultyPrompts = {
    [DifficultyLevel.JUNIOR]: "Focus on foundational concepts, standard syntax, and basic problem-solving expected of a Junior Developer.",
    [DifficultyLevel.MEDIUM]: "Focus on design patterns, intermediate concepts, performance considerations, and industry practices.",
    [DifficultyLevel.SENIOR]: "Focus on high-level architecture, scalability, complex edge cases, and advanced optimization."
  };

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Based on the following technical study material, generate a technical interview quiz.
    
    Material:
    ${markdownContent}
    
    Target Difficulty: ${difficulty}
    Guidance: ${difficultyPrompts[difficulty]}
    
    Requirements:
    1. Generate exactly ${questionCount} multiple-choice questions.
    2. Include 4 options per question.
    3. Provide a detailed explanation and a Markdown code example if helpful.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswerIndex: { type: Type.INTEGER },
            explanation: { type: Type.STRING },
            codeExample: { type: Type.STRING }
          },
          required: ["question", "options", "correctAnswerIndex", "explanation"]
        }
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  const rawQuestions = JSON.parse(text);
  return rawQuestions.map((q: any, index: number) => ({
    ...q,
    id: `q-${index}`
  }));
};

export const getClarification = async (question: Question, userQuery: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Context: You are a technical interview coach. A student is reviewing a quiz question and needs further clarification. Use the Socratic method when appropriate.
    
    Question: ${question.question}
    Correct Answer: ${question.options[question.correctAnswerIndex]}
    Original Explanation: ${question.explanation}
    
    Student's specific question: "${userQuery}"
    
    Task: Provide a concise, clear, and helpful response. If the user is confused, try using a metaphor first to bridge the gap. Use markdown for code.`,
  });

  return response.text || "I'm sorry, I couldn't generate a clarification at this time.";
};

export const generateSummary = async (questions: Question[], difficulty: DifficultyLevel): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const context = questions.map(q => `Topic: ${q.question}\nExplanation: ${q.explanation}`).join('\n\n');
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Based on the following quiz results, create a "Retention-First Mastery Guide".
    
    Target Level: ${difficulty}
    
    Content Context:
    ${context}
    
    Requirements:
    1. Use HEADINGS (##) for topics.
    2. FOR EACH TOPIC: 
       - Provide a "Mental Hook" (a mnemonic device or simple metaphor to remember it).
       - Provide a "Quick Re-call" (the 20% of info that gives 80% of the value).
       - Provide a "Senior Perspective" (how this concept is used in real-world high-stakes scenarios).
    3. Include 1 generic code example that merges multiple concepts.
    4. Format as clean Markdown. Start with "# 🧠 Neural Mastery Guide: [Main Topic]"`,
  });

  return response.text || "Could not generate summary.";
};
