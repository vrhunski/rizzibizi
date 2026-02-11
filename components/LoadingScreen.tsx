
import React, { useState, useEffect } from 'react';
import { BrainCircuit, Sparkles } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  const [loadingText, setLoadingText] = useState("Analyzing your study material...");
  const texts = [
    "Analyzing your study material...",
    "Extracting key concepts...",
    "Formulating tricky questions...",
    "Generating detailed explanations...",
    "Reviewing code snippets...",
    "Preparing your daily test..."
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % texts.length;
      setLoadingText(texts[i]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-8 animate-pulse">
      <div className="relative">
        <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 animate-pulse"></div>
        <div className="relative bg-white p-8 rounded-full border border-indigo-100 shadow-2xl">
          <BrainCircuit className="w-20 h-20 text-indigo-600 animate-bounce" />
          <div className="absolute -top-2 -right-2">
            <Sparkles className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
      </div>
      
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-slate-800">AI is thinking...</h3>
        <p className="text-slate-500 font-medium transition-all duration-500">{loadingText}</p>
      </div>

      <div className="w-64 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-indigo-500 animate-[loading_4s_ease-in-out_infinite]" style={{ width: '40%' }}></div>
      </div>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(150%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
