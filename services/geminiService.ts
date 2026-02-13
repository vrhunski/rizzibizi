
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
    contents: `You are a Senior Learning Scientist and Technical Interviewer. Your goal is to create a quiz that maximizes "Active Recall" and "Desirable Difficulty" based on the provided material.

    Material to analyze:
    ${markdownContent}
    
    Target Difficulty: ${difficulty}
    Difficulty Focus: ${difficultyPrompts[difficulty]}
    
    STRICT QUESTION CONSTRUCTION RULES (BRAIN SCIENCE PRINCIPLES):
    1. NO ROTE DEFINITIONS: Avoid questions like "What is X?". Instead, use "Given Scenario Y, how would X behave?".
    2. FINE-GRAINED DISCRIMINATION: Distractors (wrong answers) MUST be plausible misconceptions or common mistakes developers actually make.
    3. THE 30% LOGIC CHALLENGE RULE: 
       - Exactly 30% of the ${questionCount} questions MUST be "Logic Challenges" (Code-based analysis).
       - For these 30%, you MUST provide a relevant snippet in 'codeExample'.
       - FOR THE CODE EXAMPLE: You MUST use Java syntax. It MUST be multi-line, perfectly indented, and readable. DO NOT put code on a single line.
       - For the remaining 70% of questions, the 'codeExample' field MUST be an empty string.
    4. ANCHORING: Connect new concepts to real-world performance or security implications.
    5. CLARITY: Keep the question stem concise to reduce unnecessary cognitive load.

    Requirements:
    - Generate exactly ${questionCount} questions.
    - Provide 4 options per question.
    - Provide a 'correctAnswerIndex' (0-3).
    - Provide an 'explanation' that details WHY the correct answer is correct and WHY the most likely distractor is incorrect.
    - Ensure 'codeExample' is only populated for the 30% of questions intended as Logic Challenges.`,
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
            codeExample: { type: Type.STRING, description: "Only populate for logic challenges, otherwise empty string. Must be multi-line Java." }
          },
          required: ["question", "options", "correctAnswerIndex", "explanation", "codeExample"]
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
  
  const performanceStatus = context.userAnsweredCorrectly 
    ? `The student answered CORRECTLY with ${context.userConfidence} confidence.`
    : `The student answered INCORRECTLY with ${context.userConfidence} confidence.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are the "RizziBizzi Socratic Mentor". You have a deep memory of the current study session.
    
    SESSION CONTEXT:
    - Current Difficulty: ${context.difficulty}
    - Student's Overall Performance: ${context.overallScore}
    - Topics Covered in this Session: ${context.topics.join(', ')}
    
    SPECIFIC QUESTION CONTEXT:
    - Question: "${question.question}"
    - Correct Answer: "${question.options[question.correctAnswerIndex]}"
    - Student Performance on this question: ${performanceStatus}
    
    STUDENT'S QUERY:
    "${userQuery}"
    
    YOUR TASK:
    1. Respond as a mentor who has been watching the student's entire journey. 
    2. If they got it wrong with "High Confidence", address the "Illusion of Competence" gently.
    3. Use the Socratic method: explain the underlying mental model instead of just repeating facts.
    4. Connect the explanation to other topics from the session context above.
    5. Be concise, technical, and use Markdown for all code snippets. ENSURE CODE IS MULTI-LINE AND INDENTED.`,
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
       - Provide a "Senior Perspective" (real-world high-stakes scenarios).
    3. Include 1 high-level Java code example that merges multiple concepts. Ensure multi-line formatting.
    4. Format as clean Markdown. Start with "# 🧠 Neural Mastery Guide"`,
  });

  return response.text || "Could not generate summary.";
};
