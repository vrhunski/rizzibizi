
import React, { useState, useEffect } from 'react';
import { Question, ConfidenceLevel } from '../types';
import { ChevronRight, ChevronLeft, Hourglass, BrainCircuit, Code, Zap, BookOpen } from 'lucide-react';
import Prism from 'prismjs';

// Import essential languages for quiz-time highlighting
import 'https://esm.sh/prismjs@1.29.0/components/prism-java';

interface Props {
  questions: Question[];
  onFinish: (answers: number[], confidences: ConfidenceLevel[], times: number[]) => void;
}

const QuizScreen: React.FC<Props> = ({ questions, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(questions.length).fill(-1));
  const [confidences, setConfidences] = useState<ConfidenceLevel[]>(new Array(questions.length).fill('neutral'));
  const [questionTimes, setQuestionTimes] = useState<number[]>(new Array(questions.length).fill(0));
  const [step, setStep] = useState<'answer' | 'confidence'>('answer');

  useEffect(() => {
    const interval = setInterval(() => {
      setQuestionTimes(prev => {
        const updated = [...prev];
        updated[currentIndex] += 1;
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  useEffect(() => {
    if (step === 'answer') {
      setTimeout(() => Prism.highlightAll(), 0);
    }
  }, [currentIndex, step]);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleSelectOption = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = optionIndex;
    setAnswers(newAnswers);
    setStep('confidence');
  };

  const handleSelectConfidence = (level: ConfidenceLevel) => {
    const newConf = [...confidences];
    newConf[currentIndex] = level;
    setConfidences(newConf);
    
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setStep('answer');
    } else {
      onFinish(answers, newConf, questionTimes);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const cleanCode = (code: string) => {
    if (!code) return '';
    return code
      .replace(/^```(?:\w+)?\n?/, '')
      .replace(/\n?```$/, '')
      .replace(/\r\n/g, '\n')
      .trim();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1 pr-6">
          <div className="text-xs font-black text-emerald-800 uppercase tracking-widest whitespace-nowrap">
            {currentIndex + 1} / {questions.length}
          </div>
          <div className="w-full h-1.5 bg-emerald-50 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-700 transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="flex items-center gap-4 border-l border-emerald-50 pl-6">
          <div className="flex items-center gap-2 text-emerald-700 text-sm font-bold bg-emerald-50 px-3 py-1.5 rounded-xl">
            <Hourglass className="w-3.5 h-3.5" />
            <span>{formatTime(questionTimes[currentIndex])}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-emerald-100 shadow-sm overflow-hidden min-h-[550px] flex flex-col transition-all duration-300">
        <div className="p-8 sm:p-12 flex-grow flex flex-col">
          {step === 'answer' ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-8">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Contextual Analysis</span>
                
                {currentQuestion.type === 'logic' ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-100 shadow-sm">
                    <Zap className="w-3 h-3" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Logic Challenge</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100 shadow-sm">
                    <BookOpen className="w-3 h-3" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Conceptual</span>
                  </div>
                )}
              </div>

              <h3 className="text-2xl font-black text-[#1E2D24] leading-tight">
                {currentQuestion.question}
              </h3>

              <div className="rounded-2xl overflow-hidden border border-emerald-900/10 shadow-lg my-6">
                 <div className="bg-[#121816] px-4 py-2 border-b border-white/5 flex items-center gap-2 text-[9px] font-black uppercase text-emerald-400/60 tracking-widest">
                  <Code className="w-3 h-3" /> Logical Blueprint
                </div>
                <pre className="language-java !m-0 !p-6 !text-xs !rounded-none">
                  <code className="language-java">
                    {cleanCode(currentQuestion.codeExample || '')}
                  </code>
                </pre>
              </div>

              <div className="grid gap-3 pt-4">
                {currentQuestion.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className="group flex items-center gap-5 p-5 rounded-2xl border-2 text-left transition-all border-emerald-50 hover:border-emerald-500 hover:bg-emerald-50/5 hover:scale-[1.01]"
                  >
                    <div className="w-8 h-8 rounded-xl border-2 flex items-center justify-center flex-shrink-0 font-black text-xs border-emerald-100 text-emerald-200 group-hover:border-emerald-500 group-hover:text-emerald-500 transition-colors">
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="font-bold text-[#1E2D24] group-hover:text-emerald-900">{option}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center justify-center text-center py-10 space-y-10">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-10 animate-pulse"></div>
                <div className="relative p-6 bg-white rounded-3xl border border-emerald-50 text-emerald-700 shadow-xl">
                    <BrainCircuit className="w-14 h-14" />
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-black text-[#1E2D24] mb-3 tracking-tight">Metacognitive Check</h3>
                <p className="text-slate-500 text-sm font-medium">How certain are you of this logical mapping?</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
                {[
                  { id: 'low', label: 'Intuition / Guess', sub: 'Low Confidence', color: 'bg-red-50 text-red-700 border-red-100 hover:bg-red-100 hover:scale-105' },
                  { id: 'neutral', label: 'Educated Bet', sub: 'Partial Certainty', color: 'bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100 hover:scale-105' },
                  { id: 'high', label: 'Concrete Mastery', sub: 'Full Certainty', color: 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100 hover:scale-105' }
                ].map((level) => (
                  <button
                    key={level.id}
                    onClick={() => handleSelectConfidence(level.id as ConfidenceLevel)}
                    className={`flex-1 p-6 rounded-3xl border-2 font-black transition-all text-center ${level.color}`}
                  >
                    <div className="text-sm uppercase tracking-widest">{level.label}</div>
                    <div className="text-[9px] opacity-60 mt-1 uppercase tracking-tighter">{level.sub}</div>
                  </button>
                ))}
              </div>
              <button onClick={() => setStep('answer')} className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] hover:text-emerald-600 transition-colors">
                Re-evaluate Decision
              </button>
            </div>
          )}
        </div>

        <div className="p-10 bg-emerald-50/20 border-t border-emerald-50/50 flex items-center justify-between">
          <button
            onClick={() => { setStep('answer'); if (currentIndex > 0) setCurrentIndex(currentIndex - 1); }}
            disabled={currentIndex === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black uppercase tracking-widest transition-all text-[10px] ${
              currentIndex === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-emerald-700 hover:text-emerald-900 bg-white border border-emerald-100 shadow-sm'
            }`}
          >
            <ChevronLeft className="w-4 h-4" /> Rewind
          </button>
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-black text-emerald-800/40 uppercase tracking-[0.3em]">
              Deep Learning Engine Engaged
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizScreen;
