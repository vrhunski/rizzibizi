
import React, { useState, useRef, useEffect } from 'react';
import { FileText, Upload, Play, Info, Baby, Briefcase, Zap, ListOrdered, BookOpenCheck, RefreshCw } from 'lucide-react';
import { DifficultyLevel } from '../types';

const STORAGE_KEY = 'rizzi-bizzi-content';

const JAVA_OOP_EXAMPLE = `# Core Java & OOP Concepts

## 1. Encapsulation
Encapsulation is the process of wrapping code and data together into a single unit. We achieve this by making variables private and providing public getter and setter methods.
* **Benefit**: Better control over data and security.
* **Pro-tip**: Use it to validate data before setting it.

\`\`\`java
public class Account {
    private double balance;
    
    public void deposit(double amount) {
        if(amount > 0) this.balance += amount;
    }
    
    public double getBalance() {
        return balance;
    }
}
\`\`\`

## 2. Inheritance
Inheritance allows a class to acquire properties and behaviors of another class using the \`extends\` keyword.
* **Relationship**: It represents the "IS-A" relationship.
* **Key Concept**: Method Overriding often goes hand-in-hand with inheritance.

## 3. Polymorphism
Polymorphism allows us to perform a single action in different ways.
* **Static Polymorphism**: Method Overloading (same name, different signatures).
* **Dynamic Polymorphism**: Method Overriding (subclass provides specific implementation).

\`\`\`java
class Shape {
    void draw() { System.out.println("Drawing a shape"); }
}
class Circle extends Shape {
    @Override
    void draw() { System.out.println("Drawing a circle"); }
}
\`\`\`

## 4. Abstraction
Abstraction hides implementation details and shows only functionality.
* **Abstract Classes**: Can have both abstract and concrete methods.
* **Interfaces**: Blueprints for classes, supporting multiple inheritance in Java.`;

interface Props {
  onStart: (markdown: string, difficulty: DifficultyLevel, count: number) => void;
}

const SetupScreen: React.FC<Props> = ({ onStart }) => {
  const [content, setContent] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || JAVA_OOP_EXAMPLE;
  });
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(DifficultyLevel.MEDIUM);
  const [questionCount, setQuestionCount] = useState<number>(10);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Persist content to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, content);
  }, [content]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setContent(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const resetToExample = () => {
    if (window.confirm("Replace current content with the Java OOP example?")) {
      setContent(JAVA_OOP_EXAMPLE);
    }
  };

  const difficultyOptions = [
    { level: DifficultyLevel.JUNIOR, icon: <Baby className="w-4 h-4" />, desc: "Basics focus" },
    { level: DifficultyLevel.MEDIUM, icon: <Briefcase className="w-4 h-4" />, desc: "Application focus" },
    { level: DifficultyLevel.SENIOR, icon: <Zap className="w-4 h-4" />, desc: "Architecture focus" },
  ];

  const questionCounts = [5, 10, 15, 20];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-extrabold text-slate-800 sm:text-4xl">
          Quiet Your Mind, Focus Your Prep
        </h2>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          Turn your notes into a serene interview simulation. RizziBizzi analyzes your Markdown to build tailored challenges.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl border border-emerald-100 shadow-sm overflow-hidden">
            <div className="p-6 sm:p-8 space-y-8">
              {/* Step 1: Source Section */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-600" />
                    1. Study Material
                  </h3>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button 
                      onClick={resetToExample}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-emerald-100 rounded-xl text-emerald-700 hover:bg-emerald-50 transition-colors text-xs font-bold"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Reset
                    </button>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-emerald-700 rounded-xl text-white hover:bg-emerald-800 transition-colors text-xs font-bold shadow-md shadow-emerald-100"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Upload .md
                    </button>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    accept=".md,.txt" 
                    className="hidden" 
                  />
                </div>

                <div className="relative group">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Paste your notes here..."
                    className="w-full h-80 p-6 bg-emerald-50/20 border border-emerald-100 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-mono text-sm text-slate-700 resize-none outline-none"
                  />
                </div>
              </div>

              {/* Step 2: Difficulty Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-emerald-600" />
                  2. Targeted Depth
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {difficultyOptions.map((opt) => (
                    <button
                      key={opt.level}
                      onClick={() => setDifficulty(opt.level)}
                      className={`relative p-5 text-left border-2 rounded-2xl transition-all ${
                        difficulty === opt.level
                          ? 'border-emerald-600 bg-emerald-50/50 ring-4 ring-emerald-50'
                          : 'border-emerald-50 hover:border-emerald-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className={`p-2 rounded-lg ${
                          difficulty === opt.level ? 'bg-emerald-700 text-white' : 'bg-emerald-50 text-emerald-500'
                        }`}>
                          {opt.icon}
                        </div>
                      </div>
                      <div className={`font-bold ${difficulty === opt.level ? 'text-emerald-900' : 'text-slate-600'}`}>
                        {opt.level}
                      </div>
                      <div className={`text-[10px] uppercase tracking-wider font-bold mt-1 ${difficulty === opt.level ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {opt.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Question Count */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                  <ListOrdered className="w-5 h-5 text-emerald-600" />
                  3. Session Length
                </h3>
                <div className="flex flex-wrap gap-3">
                  {questionCounts.map((count) => (
                    <button
                      key={count}
                      onClick={() => setQuestionCount(count)}
                      className={`flex-1 min-w-[60px] py-3 px-4 rounded-xl font-bold border-2 transition-all ${
                        questionCount === count
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                          : 'border-emerald-50 text-slate-400 hover:border-emerald-100 bg-white'
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onStart(content, difficulty, questionCount)}
                disabled={!content.trim()}
                className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-xl ${
                  content.trim() 
                    ? 'bg-emerald-700 text-white hover:bg-emerald-800 hover:-translate-y-0.5 shadow-emerald-200/50' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                }`}
              >
                <Play className="w-5 h-5 fill-current" />
                Begin Session
              </button>
            </div>
          </div>
        </div>

        {/* Instructions Sidebar */}
        <div className="space-y-6">
          <div className="bg-[#2d3d36] rounded-3xl p-6 text-emerald-50 shadow-xl border border-emerald-900/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-600 rounded-xl">
                <BookOpenCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg">Markdown Guide</h3>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-1">
                <h4 className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">Structural Clarity</h4>
                <p className="text-emerald-50/60 text-xs leading-relaxed">
                  Use <code className="text-emerald-200 bg-white/5 px-1 rounded">## Headings</code> to group related technical concepts.
                </p>
              </div>
              
              <div className="space-y-1">
                <h4 className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">Practical Context</h4>
                <p className="text-emerald-50/60 text-xs leading-relaxed">
                  Describe <strong>why</strong> a technology is used, not just what it is.
                </p>
              </div>
              
              <div className="space-y-1">
                <h4 className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">Code Anchors</h4>
                <p className="text-emerald-50/60 text-xs leading-relaxed">
                  Snippets in backticks allow the AI to generate "Debug this" questions.
                </p>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-emerald-800/50">
              <div className="bg-emerald-50/5 p-4 rounded-2xl border border-emerald-800/50 italic text-emerald-100/40 text-[10px] leading-relaxed">
                "Relaxed study improves recall by up to 25%. RizziBizzi is designed for focus."
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupScreen;
