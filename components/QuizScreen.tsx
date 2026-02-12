
import React, { useState, useEffect } from 'react';
import { Question, ConfidenceLevel } from '../types';
import { ChevronRight, ChevronLeft, CheckCircle2, Hourglass, BrainCircuit } from 'lucide-react';

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

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleSelectOption = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = optionIndex;
    setAnswers(newAnswers);
    setStep('confidence'); // Push to metacognition step
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

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1 pr-6">
          <div className="text-xs font-black text-emerald-800 uppercase tracking-widest whitespace-nowrap">
            {currentIndex + 1} / {questions.length}
          </div>
          <div className="w-full h-1.5 bg-emerald-50 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-600 transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="flex items-center gap-4 border-l border-emerald-50 pl-6">
          <div className="flex items-center gap-2 text-emerald-700 text-sm font-bold bg-emerald-50 px-3 py-1.5 rounded-xl">
            <Hourglass className="w-3.5 h-3.5" />
            <span>{formatTime(questionTimes[currentIndex])}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-emerald-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
        <div className="p-8 sm:p-12 flex-grow flex flex-col">
          {step === 'answer' ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-2xl font-bold text-slate-800 leading-snug mb-10">
                {currentQuestion.question}
              </h3>
              <div className="grid gap-3">
                {currentQuestion.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className="flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all border-emerald-50 hover:border-emerald-200 hover:bg-emerald-50/10"
                  >
                    <div className="w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 font-bold text-xs border-emerald-100 text-emerald-300">
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="font-medium text-slate-600">{option}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center justify-center text-center py-10 space-y-8">
              <div className="p-4 bg-emerald-50 rounded-full text-emerald-700">
                <BrainCircuit className="w-12 h-12" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Confidence Check</h3>
                <p className="text-slate-500">How certain are you of this answer?</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                {[
                  { id: 'low', label: 'Guessing', color: 'bg-red-50 text-red-700 border-red-100 hover:bg-red-100' },
                  { id: 'neutral', label: 'Unsure', color: 'bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100' },
                  { id: 'high', label: 'Certain', color: 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100' }
                ].map((level) => (
                  <button
                    key={level.id}
                    onClick={() => handleSelectConfidence(level.id as ConfidenceLevel)}
                    className={`flex-1 p-5 rounded-2xl border-2 font-bold transition-all ${level.color}`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setStep('answer')}
                className="text-slate-400 text-xs hover:text-slate-600"
              >
                Change Answer
              </button>
            </div>
          )}
        </div>

        <div className="p-8 bg-emerald-50/30 border-t border-emerald-50 flex items-center justify-between">
          <button
            onClick={() => { setStep('answer'); handlePrev(); }}
            disabled={currentIndex === 0}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all text-sm ${
              currentIndex === 0 ? 'text-slate-200 cursor-not-allowed' : 'text-emerald-700 hover:text-emerald-900'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <div className="text-[10px] font-black text-emerald-800/20 uppercase tracking-[0.2em]">
            Metacognition Mode Active
          </div>
        </div>
      </div>
    </div>
  );
  
  function handlePrev() {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  }
};

export default QuizScreen;
