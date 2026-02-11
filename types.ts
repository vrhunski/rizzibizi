
export enum DifficultyLevel {
  JUNIOR = 'Junior Developer',
  MEDIUM = 'Medium Developer',
  SENIOR = 'Senior Developer'
}

export type FeedbackCategory = 'unclear' | 'incorrect' | 'improvement';

export interface FollowUpResponse {
  questionId: string;
  userQuery: string;
  aiResponse: string;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  codeExample?: string;
}

export interface QuizSession {
  questions: Question[];
  userAnswers: number[];
  questionTimes: number[]; // Time in seconds spent on each question
  startTime: number;
  difficulty: DifficultyLevel;
  endTime?: number;
}

export enum AppState {
  SETUP = 'SETUP',
  LOADING = 'LOADING',
  QUIZ = 'QUIZ',
  RESULTS = 'RESULTS'
}
