
import React, { useState, useEffect } from 'react';
import { BrainCircuit, Sparkles } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  const [loadingText, setLoadingText] = useState("Synthesizing your material...");
  const texts = [
    "Analyzing your study material...",
    "Extracting key concepts...",
    "Formulating tricky questions...",
    "Generating detailed explanations...",
    "Reviewing code snippets...",
    "Preparing your calm test..."
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % texts.length;
      setLoadingText(texts[i]);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-10 animate-in fade-in duration-1000">
      <div className="relative">
        <div className="absolute inset-0 bg-emerald-500 blur-3xl opacity-10 animate-pulse"></div>
        <div className="relative bg-white p-10 rounded-[2.5rem] border border-emerald-50 shadow-2xl">
          <BrainCircuit className="w-20 h-20 text-emerald-700 animate-pulse" />
          <div className="absolute -top-3 -right-3">
            <Sparkles className="w-10 h-10 text-amber-300 animate-bounce" />
          </div>
        </div>
      </div>
      
      <div className="text-center space-y-3">
        <h3 className="text-2xl font-black text-slate-800 tracking-tight">The AI is Focused.</h3>
        <p className="text-emerald-700/60 font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-700">{loadingText}</p>
      </div>

      <div className="w-72 h-1.5 bg-emerald-50 rounded-full overflow-hidden">
        <div className="h-full bg-emerald-700 animate-[loading_3s_ease-in-out_infinite]" style={{ width: '40%' }}></div>
      </div>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(180%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
