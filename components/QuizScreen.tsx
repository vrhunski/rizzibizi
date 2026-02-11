
import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import { ChevronRight, ChevronLeft, CheckCircle2, Clock, Hourglass } from 'lucide-react';

interface Props {
  questions: Question[];
  onFinish: (answers: number[], questionTimes: number[]) => void;
}

const QuizScreen: React.FC<Props> = ({ questions, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(questions.length).fill(-1));
  const [questionTimes, setQuestionTimes] = useState<number[]>(new Array(questions.length).fill(0));

  // Timer logic for the current question
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
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onFinish(answers, questionTimes);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Progress & Stats */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1 pr-6">
          <div className="text-sm font-bold text-indigo-600 whitespace-nowrap">
            Question {currentIndex + 1} of {questions.length}
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 transition-all duration-300 ease-out" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-4 border-l border-slate-100 pl-6">
          <div className="flex items-center gap-2 text-indigo-600 text-sm font-bold bg-indigo-50 px-3 py-1.5 rounded-lg">
            <Hourglass className="w-4 h-4" />
            <span>{formatTime(questionTimes[currentIndex])}</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-slate-500 text-sm font-medium">
            <Clock className="w-4 h-4" />
            <span>Active</span>
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
        <div className="p-8 flex-grow">
          <h3 className="text-2xl font-bold text-slate-800 leading-snug mb-8">
            {currentQuestion.question}
          </h3>

          <div className="grid gap-3">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className={`flex items-center gap-4 p-5 rounded-xl border-2 text-left transition-all ${
                  answers[currentIndex] === idx
                    ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200'
                    : 'border-slate-100 hover:border-slate-300 bg-white'
                }`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  answers[currentIndex] === idx
                    ? 'border-indigo-500 bg-indigo-500 text-white'
                    : 'border-slate-300'
                }`}>
                  {idx === 0 ? 'A' : idx === 1 ? 'B' : idx === 2 ? 'C' : 'D'}
                </div>
                <span className={`font-medium ${
                  answers[currentIndex] === idx ? 'text-indigo-900' : 'text-slate-700'
                }`}>
                  {option}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${
              currentIndex === 0 
                ? 'text-slate-300 cursor-not-allowed' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={answers[currentIndex] === -1}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white transition-all shadow-md ${
              answers[currentIndex] === -1
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100 hover:-translate-y-0.5 active:translate-y-0'
            }`}
          >
            {currentIndex === questions.length - 1 ? (
              <>
                Finish Test
                <CheckCircle2 className="w-5 h-5" />
              </>
            ) : (
              <>
                Next Question
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizScreen;
