
import React, { useState, useEffect } from 'react';
import { QuizSession, FollowUpResponse } from '../types';
import { getClarification, generateSummary } from '../services/geminiService';
import { Trophy, RotateCcw, Check, X, Code, Info, ChevronDown, ChevronUp, BarChart3, Sparkles, Send, MessageSquareText, BrainCircuit, Loader2, Download, BookOpen, Clock, Copy, CheckCircle, AlertCircle } from 'lucide-react';
import Prism from 'prismjs';

// Import common languages for highlighting
import 'https://esm.sh/prismjs@1.29.0/components/prism-javascript';
import 'https://esm.sh/prismjs@1.29.0/components/prism-typescript';
import 'https://esm.sh/prismjs@1.29.0/components/prism-css';
import 'https://esm.sh/prismjs@1.29.0/components/prism-json';
import 'https://esm.sh/prismjs@1.29.0/components/prism-bash';
import 'https://esm.sh/prismjs@1.29.0/components/prism-python';

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
  const [showDownloadConfirm, setShowDownloadConfirm] = useState(false);
  
  const [summary, setSummary] = useState<string | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const text = await generateSummary(session.questions, session.difficulty);
        setSummary(text);
      } catch (err) {
        console.error("Failed to generate summary", err);
      } finally {
        setIsGeneratingSummary(false);
      }
    };
    fetchSummary();
  }, [session]);

  useEffect(() => {
    if (expandedIndex !== null || summary) {
      Prism.highlightAll();
    }
  }, [expandedIndex, tutorResponses, summary]);

  const calculateScore = () => {
    let score = 0;
    session.questions.forEach((q, i) => {
      if (session.userAnswers[i] === q.correctAnswerIndex) score++;
    });
    return score;
  };

  const parseCodeSnippet = (snippet: string) => {
    const langMatch = snippet.match(/```(\w+)/);
    const language = langMatch ? langMatch[1] : 'javascript';
    const cleanCode = snippet.replace(/```(?:\w+)?\n([\s\S]*?)\n```/g, '$1').trim();
    return { language, cleanCode };
  };

  const handleTutorToggle = (e: React.MouseEvent, questionId: string) => {
    e.stopPropagation();
    if (activeTutorId === questionId) {
      setActiveTutorId(null);
    } else {
      setActiveTutorId(questionId);
      setUserQuery('');
    }
  };

  const submitToTutor = async (question: any) => {
    if (!userQuery.trim()) return;
    
    setIsAsking(true);
    try {
      const response = await getClarification(question, userQuery);
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
      console.error(err);
    } finally {
      setIsAsking(false);
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleDownloadClick = () => {
    setShowDownloadConfirm(true);
  };

  const confirmDownload = () => {
    if (!summary) return;
    const blob = new Blob([summary], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const date = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `RizziBizzi_Cheatsheet_${session.difficulty.replace(/\s+/g, '_')}_${date}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowDownloadConfirm(false);
  };

  const score = calculateScore();
  const percentage = (score / session.questions.length) * 100;
  const totalTimeSeconds = Math.round(((session.endTime || Date.now()) - session.startTime) / 1000);

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in zoom-in-95 duration-500 pb-20">
      {/* Download Confirmation Modal */}
      {showDownloadConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="flex items-center gap-3 text-indigo-600 mb-4">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Download Cheatsheet?</h3>
            </div>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              This will save your AI-generated mastery guide as a Markdown (.md) file to your device. You can open it with any text editor or note-taking app.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDownloadConfirm(false)}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDownload}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
              >
                Download Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Score Summary Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-10 text-center text-white">
          <div className="inline-flex items-center justify-center p-4 bg-white/20 backdrop-blur-md rounded-2xl mb-6">
            <Trophy className="w-12 h-12 text-yellow-300" />
          </div>
          <h2 className="text-4xl font-black mb-2 tracking-tight">Quiz Complete!</h2>
          <p className="text-indigo-100 font-medium opacity-90">Completed {session.difficulty} Challenge.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div className="p-8 text-center">
            <div className="text-4xl font-bold text-slate-800 mb-1">{score}/{session.questions.length}</div>
            <div className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Score</div>
          </div>
          <div className="p-8 text-center bg-slate-50/50">
            <div className="text-4xl font-bold text-indigo-600 mb-1">{Math.round(percentage)}%</div>
            <div className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Accuracy</div>
          </div>
          <div className="p-8 text-center">
            <div className="text-4xl font-bold text-slate-800 mb-1">{Math.floor(totalTimeSeconds / 60)}m {totalTimeSeconds % 60}s</div>
            <div className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Total Time</div>
          </div>
          <div className="p-8 text-center bg-indigo-50/30">
            <div className="text-lg font-bold text-indigo-900 mb-1 flex items-center justify-center gap-1">
              <BarChart3 className="w-4 h-4" />
              {session.difficulty.split(' ')[0]}
            </div>
            <div className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Level</div>
          </div>
        </div>

        <div className="p-8 border-t border-slate-100 flex justify-center">
          <button
            onClick={onRestart}
            className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:-translate-y-0.5"
          >
            <RotateCcw className="w-5 h-5" />
            New Quiz Session
          </button>
        </div>
      </div>

      {/* Mastery Cheatsheet Summary - Black Background / White Text */}
      <div className="bg-black rounded-2xl border border-slate-800 shadow-2xl overflow-hidden ring-1 ring-white/10">
        <div className="bg-slate-900/50 p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-white font-bold leading-tight">Mastery Cheatsheet</h3>
              <p className="text-slate-400 text-xs">AI-synthesized study guide for this session</p>
            </div>
          </div>
          {summary && (
            <button
              onClick={handleDownloadClick}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-indigo-900/20"
            >
              <Download className="w-3.5 h-3.5" />
              Download .md
            </button>
          )}
        </div>
        
        <div className="p-8">
          {isGeneratingSummary ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-6 bg-slate-800 rounded-md w-1/3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-slate-800 rounded-md w-full"></div>
                <div className="h-4 bg-slate-800 rounded-md w-5/6"></div>
                <div className="h-4 bg-slate-800 rounded-md w-4/6"></div>
              </div>
              <div className="pt-4 flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                <span className="text-sm text-slate-500 font-medium">Synthesizing core concepts...</span>
              </div>
            </div>
          ) : (
            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-200 selection:bg-indigo-500 selection:text-white">
                {summary}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Review Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <MessageSquareText className="w-6 h-6 text-indigo-500" />
            Detailed Review
          </h3>
          <span className="text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
            Analyze your answers
          </span>
        </div>

        <div className="space-y-4">
          {session.questions.map((q, idx) => {
            const isCorrect = session.userAnswers[idx] === q.correctAnswerIndex;
            const isExpanded = expandedIndex === idx;
            const hasResponse = tutorResponses[q.id];
            const isAskingThis = activeTutorId === q.id;
            const timeSpent = session.questionTimes[idx];

            return (
              <div 
                key={idx}
                className={`bg-white rounded-2xl border transition-all ${
                  isExpanded ? 'ring-2 ring-indigo-200 border-indigo-200 shadow-md' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="w-full text-left p-6 flex items-start gap-4"
                >
                  <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isCorrect ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {isCorrect ? <Check className="w-4 h-4 stroke-[3]" /> : <X className="w-4 h-4 stroke-[3]" />}
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded">Question {idx + 1}</span>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded">
                        <Clock className="w-2.5 h-2.5" />
                        {formatTime(timeSpent)}
                      </div>
                    </div>
                    <p className="font-semibold text-slate-800 leading-relaxed pr-8">
                      {q.question}
                    </p>
                  </div>

                  <div className="text-slate-400 flex-shrink-0 mt-1">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-6 pb-6 pt-0 space-y-6 border-t border-slate-50 mt-2 animate-in fade-in duration-300">
                    <div className="grid gap-2 mt-6">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = session.userAnswers[idx] === oIdx;
                        const isCorrectAnswer = q.correctAnswerIndex === oIdx;
                        
                        return (
                          <div key={oIdx} className={`text-sm p-3 rounded-lg border flex items-center justify-between ${
                            isCorrectAnswer ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-medium' : 
                            isSelected ? 'bg-red-50 border-red-200 text-red-800' : 'bg-slate-50 border-slate-100 text-slate-600'
                          }`}>
                            <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                            {isCorrectAnswer && <Check className="w-4 h-4" />}
                            {isSelected && !isCorrectAnswer && <X className="w-4 h-4" />}
                          </div>
                        );
                      })}
                    </div>

                    <div className="bg-indigo-50/50 rounded-xl p-5 relative group">
                      <h4 className="text-sm font-bold text-indigo-900 mb-2 flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        Original Explanation
                      </h4>
                      <p className="text-slate-700 leading-relaxed text-sm">
                        {q.explanation}
                      </p>
                      
                      {!hasResponse && (
                        <button
                          onClick={(e) => handleTutorToggle(e, q.id)}
                          className={`absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            isAskingThis ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 border border-indigo-100 hover:border-indigo-300 hover:shadow-sm'
                          }`}
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          {isAskingThis ? 'Close AI Tutor' : 'Ask AI Tutor'}
                        </button>
                      )}
                    </div>

                    {hasResponse && (
                      <div className="bg-emerald-50/50 rounded-xl p-6 border border-emerald-100 relative overflow-hidden animate-in slide-in-from-top-2">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                          <BrainCircuit className="w-12 h-12 text-emerald-600" />
                        </div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-emerald-600 rounded-lg text-white">
                              <Sparkles className="w-4 h-4" />
                            </div>
                            <h4 className="text-sm font-bold text-emerald-900">AI Tutor Clarification</h4>
                          </div>
                          <button
                            onClick={() => copyToClipboard(hasResponse.aiResponse, q.id)}
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              copiedId === q.id 
                                ? 'bg-emerald-600 text-white' 
                                : 'bg-white text-emerald-600 border border-emerald-200 hover:bg-emerald-50'
                            }`}
                          >
                            {copiedId === q.id ? (
                              <>
                                <CheckCircle className="w-3.5 h-3.5" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                Copy Response
                              </>
                            )}
                          </button>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="bg-white/60 p-3 rounded-lg border border-emerald-100/50">
                            <p className="text-xs font-semibold text-emerald-700 mb-1 uppercase tracking-wider">Your Question:</p>
                            <p className="text-slate-700 italic text-sm">"{hasResponse.userQuery}"</p>
                          </div>
                          <div className="text-slate-700 leading-relaxed text-sm prose prose-slate">
                            {hasResponse.aiResponse.split('\n').map((line, i) => (
                              <p key={i} className="mb-2">{line}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {isAskingThis && !hasResponse && (
                      <div className="bg-slate-50 rounded-xl p-5 border border-indigo-100 animate-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center gap-2 mb-4">
                          <BrainCircuit className="w-4 h-4 text-indigo-600" />
                          <h5 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Follow-up Clarification</h5>
                        </div>
                        <div className="space-y-4">
                          <div className="relative">
                            <textarea
                              value={userQuery}
                              onChange={(e) => setUserQuery(e.target.value)}
                              disabled={isAsking}
                              placeholder="Ask the AI tutor for more detail..."
                              className={`w-full p-4 text-sm text-slate-800 border rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none min-h-[100px] transition-all ${
                                isAsking ? 'border-slate-200 bg-slate-50 opacity-60' : 'border-slate-200'
                              }`}
                            />
                            {isAsking && (
                              <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-[1px] rounded-xl">
                                <div className="bg-white/90 px-4 py-2 rounded-lg shadow-sm border border-slate-100 flex items-center gap-2">
                                  <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                                  <span className="text-xs font-bold text-slate-600">AI is thinking...</span>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex justify-end gap-3">
                            <button
                              disabled={isAsking}
                              onClick={() => setActiveTutorId(null)}
                              className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 disabled:opacity-50"
                            >
                              Cancel
                            </button>
                            <button
                              disabled={!userQuery.trim() || isAsking}
                              onClick={() => submitToTutor(q)}
                              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                                userQuery.trim() && !isAsking
                                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg'
                                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                              }`}
                            >
                              {isAsking ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Sending...
                                </>
                              ) : (
                                <>
                                  <Send className="w-4 h-4" />
                                  Ask AI
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {q.codeExample && (
                      <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                        <div className="bg-slate-800 px-4 py-2.5 flex items-center justify-between border-b border-slate-700">
                          <div className="flex items-center gap-2 text-slate-300 text-xs font-mono">
                            <Code className="w-3.5 h-3.5 text-indigo-400" />
                            <span>{parseCodeSnippet(q.codeExample).language.toUpperCase()} Snippet</span>
                          </div>
                        </div>
                        <div className="bg-slate-900 overflow-x-auto">
                          <pre className={`language-${parseCodeSnippet(q.codeExample).language} !bg-transparent`}>
                            <code className={`language-${parseCodeSnippet(q.codeExample).language}`}>
                              {parseCodeSnippet(q.codeExample).cleanCode}
                            </code>
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;
