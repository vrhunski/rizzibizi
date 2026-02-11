
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
    { level: DifficultyLevel.JUNIOR, icon: <Baby className="w-4 h-4" />, desc: "Focus on basics" },
    { level: DifficultyLevel.MEDIUM, icon: <Briefcase className="w-4 h-4" />, desc: "Focus on application" },
    { level: DifficultyLevel.SENIOR, icon: <Zap className="w-4 h-4" />, desc: "Focus on architecture" },
  ];

  const questionCounts = [5, 10, 15, 20];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
          Welcome to RizziBizzi
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Turn your notes into a personalized interview simulation. RizziBizzi analyzes your Markdown files to build high-quality technical challenges.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 sm:p-8 space-y-8">
              {/* Step 1: Source Section */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-500" />
                    Step 1: Source Material
                  </h3>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button 
                      onClick={resetToExample}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium"
                      title="Load Default Example"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Load Example
                    </button>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors text-sm font-medium"
                    >
                      <Upload className="w-4 h-4" />
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
                    placeholder="Paste your markdown content here or upload a file..."
                    className="w-full h-80 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-mono text-sm text-slate-800 resize-none outline-none"
                  />
                  {content.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 group-hover:opacity-30 transition-opacity">
                      <FileText className="w-24 h-24" />
                    </div>
                  )}
                </div>
              </div>

              {/* Step 2: Difficulty Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-indigo-500" />
                  Step 2: Select Difficulty Level
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {difficultyOptions.map((opt) => (
                    <button
                      key={opt.level}
                      onClick={() => setDifficulty(opt.level)}
                      className={`relative p-5 text-left border-2 rounded-xl transition-all ${
                        difficulty === opt.level
                          ? 'border-indigo-500 bg-indigo-50 shadow-md ring-2 ring-indigo-100'
                          : 'border-slate-100 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className={`p-2 rounded-lg ${
                          difficulty === opt.level ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {opt.icon}
                        </div>
                        {difficulty === opt.level && (
                          <div className="w-4 h-4 rounded-full bg-indigo-500 border-2 border-white"></div>
                        )}
                      </div>
                      <div className={`font-bold ${difficulty === opt.level ? 'text-indigo-900' : 'text-slate-800'}`}>
                        {opt.level}
                      </div>
                      <div className={`text-xs mt-1 ${difficulty === opt.level ? 'text-indigo-600' : 'text-slate-400'}`}>
                        {opt.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Question Count */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <ListOrdered className="w-5 h-5 text-indigo-500" />
                  Step 3: Number of Questions
                </h3>
                <div className="flex flex-wrap gap-3">
                  {questionCounts.map((count) => (
                    <button
                      key={count}
                      onClick={() => setQuestionCount(count)}
                      className={`flex-1 min-w-[60px] py-3 px-4 rounded-xl font-bold border-2 transition-all ${
                        questionCount === count
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm'
                          : 'border-slate-100 text-slate-500 hover:border-slate-200 bg-white'
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-indigo-50 rounded-xl text-indigo-800 text-sm">
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Tip:</strong> RizziBizzi works best with structured notes including headings, bullet points, and code snippets.
                </p>
              </div>

              <button
                onClick={() => onStart(content, difficulty, questionCount)}
                disabled={!content.trim()}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${
                  content.trim() 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-0.5 shadow-indigo-200' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                }`}
              >
                <Play className="w-6 h-6 fill-current" />
                Generate {questionCount} Question {difficulty} Test
              </button>
            </div>
          </div>
        </div>

        {/* Instructions Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-600 rounded-lg">
                <BookOpenCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg">Pro Markdown Structure</h3>
            </div>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <h4 className="text-indigo-400 text-xs font-bold uppercase tracking-widest">1. Use Clear Headings</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Start sections with <code className="text-slate-200 bg-white/10 px-1 rounded">## Topic Name</code>. This helps the AI identify key study areas.
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-indigo-400 text-xs font-bold uppercase tracking-widest">2. Detailed Descriptions</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Provide 2-3 sentences per concept. The more context you provide, the deeper the questions will be.
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-indigo-400 text-xs font-bold uppercase tracking-widest">3. Include Code Snippets</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Wrap examples in triple backticks. RizziBizzi will generate "Fix the bug" or "What's the output" style questions.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-indigo-400 text-xs font-bold uppercase tracking-widest">4. Bullet Points</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Use lists for features, pros/cons, or implementation steps. Perfect for multiple-choice generation.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800">
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 italic text-slate-300 text-xs">
                "A well-structured note yields a 40% better question hit-rate."
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-2">Why RizziBizzi?</h4>
            <p className="text-slate-500 text-xs leading-relaxed">
              Generic interview prep apps ask generic questions. RizziBizzi builds questions around <strong>your</strong> specific architecture, <strong>your</strong> team's stack, and <strong>your</strong> recent study sessions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupScreen;
