
import React, { useState, useEffect } from 'react';
import { QuizSession, FollowUpResponse, Question } from '../types';
import { getClarification, generateSummary, SessionContext } from '../services/geminiService';
import { Trophy, RotateCcw, Check, X, Code, Info, ChevronDown, ChevronUp, BarChart3, Sparkles, Send, MessageSquareText, BrainCircuit, Loader2, Download, BookOpen, Clock, Copy, CheckCircle, AlertCircle, Target, Zap, FileJson } from 'lucide-react';
import Prism from 'prismjs';

// Import common languages for highlighting
import 'https://esm.sh/prismjs@1.29.0/components/prism-javascript';
import 'https://esm.sh/prismjs@1.29.0/components/prism-typescript';
import 'https://esm.sh/prismjs@1.29.0/components/prism-css';
import 'https://esm.sh/prismjs@1.29.0/components/prism-json';
import 'https://esm.sh/prismjs@1.29.0/components/prism-bash';
import 'https://esm.sh/prismjs@1.29.0/components/prism-python';
import 'https://esm.sh/prismjs@1.29.0/components/prism-java';

interface Props {
  session: QuizSession;
  onRestart: () => void;
}

const ResultsScreen: React.FC<Props> = ({ session, onRestart }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [activeTutorId, setActiveTutorId] = useState<string | null>(null);
  const [tutorResponses, setTutorResponses] = useState<Record<string, FollowUpResponse>>({});
  const [userQuery, setUserQuery] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const [summary, setSummary] = useState<string | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const text = await generateSummary(session.questions, session.difficulty);
        setSummary(text);
      } catch (err) {
        console.error("Summary generation error:", err);
      } finally {
        setIsGeneratingSummary(false);
      }
    };
    fetchSummary();
  }, [session]);

  useEffect(() => {
    if (expandedIndex !== null || summary || Object.keys(tutorResponses).length > 0) {
      setTimeout(() => Prism.highlightAll(), 0);
    }
  }, [expandedIndex, tutorResponses, summary]);

  const score = session.questions.filter((q, i) => session.userAnswers[i] === q.correctAnswerIndex).length;
  const percentage = (score / session.questions.length) * 100;
  const totalTime = Math.round(((session.endTime || Date.now()) - session.startTime) / 1000);

  const masteryStats = session.questions.reduce((acc, q, i) => {
    const isCorrect = session.userAnswers[i] === q.correctAnswerIndex;
    const conf = session.userConfidences[i];
    
    if (isCorrect && conf === 'high') acc.mastered++;
    else if (!isCorrect && conf === 'high') acc.illusions++;
    else if (isCorrect && conf === 'low') acc.lucky++;
    else acc.gaps++;
    return acc;
  }, { mastered: 0, illusions: 0, lucky: 0, gaps: 0 });

  const handleTutorToggle = (questionId: string) => {
    if (activeTutorId === questionId) {
      setActiveTutorId(null);
    } else {
      setActiveTutorId(questionId);
      setUserQuery('');
    }
  };

  const submitTutorRequest = async (question: Question, index: number) => {
    if (!userQuery.trim() || isAsking) return;
    setIsAsking(true);
    
    const context: SessionContext = {
      difficulty: session.difficulty,
      topics: session.questions.map(q => q.question.split('?')[0].substring(0, 40)),
      userAnsweredCorrectly: session.userAnswers[index] === question.correctAnswerIndex,
      userConfidence: session.userConfidences[index],
      overallScore: `${score}/${session.questions.length}`
    };

    try {
      const response = await getClarification(question, userQuery, context);
      setTutorResponses(prev => ({
        ...prev,
        [question.id]: {
          questionId: question.id,
          userQuery: userQuery,
          aiResponse: response
        }
      }));
      setActiveTutorId(null);
    } catch (err) {
      console.error("Tutor request error:", err);
      alert("Something went wrong with the AI Tutor. Please try again.");
    } finally {
      setIsAsking(false);
    }
  };

  const downloadSummary = () => {
    if (!summary) return;
    const blob = new Blob([summary], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const dateStr = new Date().toISOString().split('T')[0];
    link.download = `RizziBizzi_Mastery_Guide_${dateStr}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const cleanCode = (code: string) => {
    if (!code) return '';
    // Standardize newlines, remove Markdown markers, but strictly preserve internal indentation
    // We only trim the outside, not individual lines.
    return code
      .replace(/^```(?:\w+)?\n?/, '')
      .replace(/\n?```$/, '')
      .replace(/\r\n/g, '\n')
      .trim();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in zoom-in-95 duration-700 pb-20">
      {/* Visual Score Header */}
      <div className="bg-white rounded-[3rem] border border-emerald-100/50 shadow-2xl shadow-emerald-900/5 overflow-hidden">
        <div className="bg-[#1E2D24] p-16 text-center text-white relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
            <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          </div>
          
          <div className="inline-flex items-center justify-center p-6 bg-emerald-500/10 backdrop-blur-xl rounded-3xl mb-10 border border-white/10">
            <Trophy className="w-16 h-16 text-[#F59E0B]" />
          </div>
          
          <h2 className="text-6xl font-black mb-4 tracking-tighter">Session Finish</h2>
          
          <div className="flex flex-col items-center gap-2">
            <div className="text-2xl font-bold text-emerald-100 flex items-center gap-3">
              <span className="text-white bg-white/10 px-4 py-1 rounded-full border border-white/5">
                Score: {score} / {session.questions.length}
              </span>
              <span className="opacity-50">•</span>
              <span className="text-[#F59E0B]">{Math.round(percentage)}% Accuracy</span>
            </div>
            <p className="text-emerald-500/80 font-mono text-sm tracking-widest mt-4">TIME INVESTED: {formatTime(totalTime)}</p>
          </div>
        </div>

        {/* Mastery Matrix */}
        <div className="p-10 border-b border-emerald-50 bg-[#F9FBF9]">
           <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-[#1E2D24] rounded-xl text-white"><Target className="w-5 h-5" /></div>
              <h3 className="text-xs font-black text-[#1E2D24] uppercase tracking-[0.2em]">Metacognition Matrix</h3>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Mastered', val: masteryStats.mastered, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Illusions', val: masteryStats.illusions, color: 'text-red-600', bg: 'bg-red-50' },
                { label: 'Lucky', val: masteryStats.lucky, color: 'text-amber-600', bg: 'bg-amber-50' },
                { label: 'Gaps', val: masteryStats.gaps, color: 'text-slate-600', bg: 'bg-slate-50' },
              ].map((stat, i) => (
                <div key={i} className={`${stat.bg} p-6 rounded-[2rem] border border-black/5 text-center transition-transform hover:scale-105`}>
                  <div className={`text-4xl font-black ${stat.color} mb-1`}>{stat.val}</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
           </div>
        </div>

        <div className="p-10 flex justify-center bg-[#F9FBF9]">
          <button onClick={onRestart} className="flex items-center gap-3 px-12 py-5 bg-[#1E2D24] text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl hover:bg-[#2D4F3F] transition-all hover:-translate-y-1">
            <RotateCcw className="w-5 h-5" /> Start New Deep Dive
          </button>
        </div>
      </div>

      {/* Neural Mastery Guide */}
      <div className="bg-[#121816] rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden group">
        <div className="bg-emerald-950/40 p-10 flex flex-col md:flex-row items-center justify-between border-b border-white/5 gap-6">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-[#2D4F3F] rounded-[1.5rem] text-white shadow-inner"><BookOpen className="w-8 h-8" /></div>
            <div>
                <h3 className="text-white text-2xl font-black tracking-tight">Neural Mastery Guide</h3>
                <p className="text-emerald-500/60 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Generated by Gemini Cognitive Engine</p>
            </div>
          </div>
          
          {!isGeneratingSummary && summary && (
            <button 
                onClick={downloadSummary}
                className="flex items-center gap-3 px-8 py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all border border-white/10 shadow-xl"
            >
                <Download className="w-4 h-4" />
                Download Mastery .md
            </button>
          )}
        </div>
        <div className="p-12">
          {isGeneratingSummary ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-6">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                <span className="text-xs text-emerald-500 font-black uppercase tracking-widest">Constructing Retention Hooks...</span>
            </div>
          ) : (
            <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-wrap font-sans text-base text-emerald-50/80 leading-loose">
                    {summary}
                </div>
            </div>
          )}
        </div>
      </div>

      {/* Review Questions */}
      <div className="space-y-6">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] pl-4">Detailed Retrospective</h3>
        {session.questions.map((q, idx) => {
          const isCorrect = session.userAnswers[idx] === q.correctAnswerIndex;
          const isExpanded = expandedIndex === idx;
          const conf = session.userConfidences[idx];
          const hasResponse = tutorResponses[q.id];
          const isAskingThis = activeTutorId === q.id;
          
          return (
            <div key={idx} className={`bg-white rounded-[2.5rem] border transition-all duration-500 ${isExpanded ? 'ring-8 ring-emerald-500/5 border-emerald-200 shadow-xl' : 'border-emerald-50 hover:border-emerald-200'}`}>
              <button onClick={() => setExpandedIndex(isExpanded ? null : idx)} className="w-full text-left p-10 flex items-start gap-8">
                <div className={`mt-1.5 w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${isCorrect ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                  {isCorrect ? <Check className="w-6 h-6 stroke-[3]" /> : <X className="w-6 h-6 stroke-[3]" />}
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Query {idx + 1}</span>
                    <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-lg border ${conf === 'high' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : conf === 'neutral' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                      {conf} Confidence
                    </span>
                  </div>
                  <p className="font-extrabold text-[#1E2D24] leading-tight text-xl">{q.question}</p>
                </div>
                <div className="text-emerald-200 mt-4">{isExpanded ? <ChevronUp className="w-7 h-7" /> : <ChevronDown className="w-7 h-7" />}</div>
              </button>

              {isExpanded && (
                <div className="px-10 pb-12 pt-0 space-y-10 border-t border-emerald-50/50 mt-2 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="grid gap-3 mt-10">
                    {q.options.map((opt, oIdx) => {
                       const isSelected = session.userAnswers[idx] === oIdx;
                       const isCorrectOpt = q.correctAnswerIndex === oIdx;
                       return (
                        <div key={oIdx} className={`text-sm p-5 rounded-2xl border-2 transition-all ${isCorrectOpt ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold shadow-sm' : isSelected ? 'bg-red-50 border-red-200 text-red-900' : 'bg-[#F9FBF9] border-slate-100 text-slate-500'}`}>
                          <div className="flex items-center gap-4">
                            <span className="text-[10px] opacity-30 font-black">{String.fromCharCode(65 + oIdx)}</span>
                            {opt}
                          </div>
                        </div>
                       );
                    })}
                  </div>
                  
                  <div className="bg-[#F9FBF9] rounded-[2rem] p-8 border border-emerald-100/30 relative">
                    <h4 className="text-[10px] font-black text-emerald-900 mb-4 flex items-center gap-2 uppercase tracking-[0.2em]"><Info className="w-4 h-4" /> Concept Calibration</h4>
                    <p className="text-emerald-900/70 text-base leading-relaxed font-medium whitespace-pre-line">{q.explanation}</p>
                    
                    {!hasResponse && (
                        <button 
                            onClick={() => handleTutorToggle(q.id)} 
                            className={`mt-10 flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isAskingThis ? 'bg-[#1E2D24] text-white' : 'bg-white text-emerald-700 border border-emerald-100 shadow-sm hover:shadow-lg'}`}
                        >
                            <Sparkles className="w-4 h-4" /> 
                            {isAskingThis ? 'Exit AI Coach' : 'Socratic Clarification'}
                        </button>
                    )}
                  </div>

                  {isAskingThis && (
                    <div className="bg-emerald-100/20 p-8 rounded-[2rem] border border-emerald-200/50 space-y-6 animate-in zoom-in-95 duration-300">
                        <div className="flex items-center gap-2 text-emerald-900">
                            <BrainCircuit className="w-5 h-5" />
                            <span className="text-xs font-black uppercase tracking-widest">Socratic Assistant</span>
                        </div>
                        <textarea 
                            value={userQuery}
                            onChange={(e) => setUserQuery(e.target.value)}
                            placeholder="I'm confused about why B is wrong..."
                            className="w-full bg-white border border-emerald-100 rounded-2xl p-6 text-base focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none min-h-[120px] resize-none transition-all"
                            disabled={isAsking}
                        />
                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => handleTutorToggle(q.id)}
                                className="px-6 py-3 text-xs font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => submitTutorRequest(q, idx)}
                                disabled={!userQuery.trim() || isAsking}
                                className={`flex items-center gap-3 px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${!userQuery.trim() || isAsking ? 'bg-slate-200 text-slate-400' : 'bg-[#1E2D24] text-white shadow-xl hover:shadow-emerald-900/20'}`}
                            >
                                {isAsking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                Get Insight
                            </button>
                        </div>
                    </div>
                  )}

                  {hasResponse && (
                    <div className="bg-[#1E2D24] text-emerald-50 p-10 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-8 animate-in slide-in-from-bottom-6 duration-500">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Sparkles className="w-6 h-6 text-[#F59E0B]" />
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F59E0B]">AI Insights</h4>
                            </div>
                            <button 
                                onClick={() => copyToClipboard(hasResponse.aiResponse, q.id)}
                                className={`p-3 rounded-xl transition-all ${copiedId === q.id ? 'bg-emerald-500 text-white' : 'bg-white/5 hover:bg-white/10'}`}
                            >
                                {copiedId === q.id ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                            </button>
                        </div>
                        <div className="space-y-6">
                            <div className="bg-white/5 p-6 rounded-2xl text-xs italic border border-white/5">
                                <span className="block text-[10px] font-black uppercase text-[#F59E0B]/60 mb-2">Original Query:</span>
                                "{hasResponse.userQuery}"
                            </div>
                            <div className="text-base leading-relaxed prose prose-invert max-w-none">
                                {hasResponse.aiResponse.split('\n').map((para, pIdx) => (
                                    para.trim() ? <p key={pIdx} className="mb-4 text-emerald-50/90 leading-relaxed">{para}</p> : null
                                ))}
                            </div>
                        </div>
                    </div>
                  )}

                  {q.codeExample && (
                    <div className="rounded-[2.5rem] overflow-hidden border border-emerald-900/10 shadow-2xl">
                      <div className="bg-[#121816] px-8 py-4 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase text-[#F59E0B] tracking-widest">
                            <Code className="w-4 h-4" /> Logic Blueprint
                        </div>
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20"></div>
                        </div>
                      </div>
                      <pre className="language-java !m-0 rounded-none overflow-x-auto">
                        <code className="language-java">
                          {cleanCode(q.codeExample)}
                        </code>
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResultsScreen;
