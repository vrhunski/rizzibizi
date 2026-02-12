
import React, { useState, useCallback } from 'react';
import { AppState, QuizSession, DifficultyLevel, ConfidenceLevel } from './types';
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
        userConfidences: new Array(questions.length).fill('neutral'),
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

  const handleFinish = (answers: number[], confidences: ConfidenceLevel[], times: number[]) => {
    setSession(prev => prev ? { 
      ...prev, 
      userAnswers: answers, 
      userConfidences: confidences,
      questionTimes: times,
      endTime: Date.now() 
    } : null);
    setState(AppState.RESULTS);
  };

  const handleRestart = useCallback(() => {
    setSession(null);
    setState(AppState.SETUP);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleRestart}>
            <div className="bg-emerald-700 p-2 rounded-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Rizzi<span className="text-emerald-700">Bizzi</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-sm text-slate-500 font-medium">Science of Learning</span>
            <div className="h-8 w-px bg-emerald-100 hidden sm:block"></div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-md">
              Gemini 3 Powered
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3">
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
      <footer className="bg-emerald-50/30 border-t border-emerald-100 py-8 mt-auto">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-sm text-emerald-800/60 font-medium">
            &copy; {new Date().getFullYear()} RizziBizzi. Optimized for Cognitive Retention.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
