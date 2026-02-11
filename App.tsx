
import React, { useState, useCallback } from 'react';
import { AppState, QuizSession, DifficultyLevel } from './types';
import { generateQuiz } from './services/geminiService';
import SetupScreen from './components/SetupScreen';
import QuizScreen from './components/QuizScreen';
import ResultsScreen from './components/ResultsScreen';
import LoadingScreen from './components/LoadingScreen';
import { GraduationCap } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.SETUP);
  const [session, setSession] = useState<QuizSession | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startQuiz = useCallback(async (markdown: string, difficulty: DifficultyLevel, count: number) => {
    setState(AppState.LOADING);
    setError(null);
    try {
      const questions = await generateQuiz(markdown, difficulty, count);
      setSession({
        questions,
        userAnswers: new Array(questions.length).fill(-1),
        questionTimes: new Array(questions.length).fill(0),
        startTime: Date.now(),
        difficulty: difficulty
      });
      setState(AppState.QUIZ);
    } catch (err) {
      console.error(err);
      setError("Failed to generate quiz. Please check your content and try again.");
      setState(AppState.SETUP);
    }
  }, []);

  const handleFinish = useCallback((answers: number[], questionTimes: number[]) => {
    setSession(prev => prev ? { 
      ...prev, 
      userAnswers: answers, 
      questionTimes: questionTimes,
      endTime: Date.now() 
    } : null);
    setState(AppState.RESULTS);
  }, []);

  const handleRestart = useCallback(() => {
    setSession(null);
    setState(AppState.SETUP);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleRestart}>
            <div className="bg-indigo-600 p-2 rounded-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Rizzi<span className="text-indigo-600">Bizzi</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-sm text-slate-500 font-medium">Daily Prep Challenge</span>
            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
            <div className="flex items-center gap-1 text-xs font-semibold text-slate-400 uppercase tracking-widest">
              Powered by Gemini 3
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3">
            <span className="font-bold">Error:</span> {error}
          </div>
        )}

        {state === AppState.SETUP && <SetupScreen onStart={startQuiz} />}
        {state === AppState.LOADING && <LoadingScreen />}
        {state === AppState.QUIZ && session && (
          <QuizScreen 
            questions={session.questions} 
            onFinish={handleFinish} 
          />
        )}
        {state === AppState.RESULTS && session && (
          <ResultsScreen 
            session={session} 
            onRestart={handleRestart} 
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} RizziBizzi AI. Master your technical interviews with custom AI-generated quizzes.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
