
import { GoogleGenAI, Type } from "@google/genai";
import { Question, DifficultyLevel, ConfidenceLevel } from "../types";

export interface SessionContext {
  difficulty: DifficultyLevel;
  topics: string[];
  userAnsweredCorrectly: boolean;
  userConfidence: ConfidenceLevel;
  overallScore: string; // e.g., "7/10"
}

export const generateQuiz = async (markdownContent: string, difficulty: DifficultyLevel, questionCount: number): Promise<Question[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const difficultyPrompts = {
    [DifficultyLevel.JUNIOR]: "Focus on core mechanics, predictable syntax, and 'How does this work?' questions.",
    [DifficultyLevel.MEDIUM]: "Focus on integration, trade-offs, and 'Which approach is better for X?' questions.",
    [DifficultyLevel.SENIOR]: "Focus on architectural failure points, edge-case debugging, and 'Why did this crash under load?' scenarios."
  };

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are a Senior Learning Scientist and Technical Interviewer. Your goal is to create a quiz that maximizes "Active Recall" and "Desirable Difficulty".

    Material to analyze:
    ${markdownContent}
    
    Target Difficulty: ${difficulty}
    Difficulty Focus: ${difficultyPrompts[difficulty]}
    
    STRICT QUESTION CLASSIFICATION:
    - You must assign a 'type' to every question: 'logic' or 'conceptual'.
    - 'logic': The student MUST analyze the provided code blueprint to find the answer (tracing, debugging, output prediction).
    - 'conceptual': The question is about theory, best practices, or "Why" (the code blueprint is for visual context/reference).

    STRICT CONSTRUCTION RULES:
    1. EVERY SINGLE QUESTION (${questionCount} out of ${questionCount}) MUST include a 'codeExample' (Logical Blueprint) in Java.
    2. Snippets must be multi-line, properly indented, and highly readable.
    3. Ensure a mix of both 'logic' and 'conceptual' questions based on the material.
    4. Distractors MUST be plausible misconceptions.

    Requirements:
    - Generate exactly ${questionCount} questions.
    - Provide 4 options per question.
    - Provide a 'correctAnswerIndex' (0-3).
    - Provide an 'explanation' detailing WHY the correct answer is correct.`,
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
            codeExample: { type: Type.STRING },
            type: { type: Type.STRING, enum: ['logic', 'conceptual'] }
          },
          required: ["question", "options", "correctAnswerIndex", "explanation", "codeExample", "type"]
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

export const getClarification = async (
  question: Question, 
  userQuery: string, 
  context: SessionContext
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Socratic Assistant.
    Question: "${question.question}"
    Type: "${question.type}"
    Blueprint: "${question.codeExample}"
    User Query: "${userQuery}"
    Goal: Explain the mental model clearly. Use Markdown.`,
  });
  return response.text || "I'm sorry, I couldn't generate a clarification at this time.";
};

export const generateSummary = async (questions: Question[], difficulty: DifficultyLevel): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  const context = questions.map(q => `Topic: ${q.question}\nExplanation: ${q.explanation}`).join('\n\n');
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Based on the following quiz results, create a "Retention-First Mastery Guide" in Markdown.
    Difficulty: ${difficulty}
    Context: ${context}
    Include a "Mental Hook" and "Senior Perspective" for each core topic.`,
  });
  return response.text || "Could not generate summary.";
};
