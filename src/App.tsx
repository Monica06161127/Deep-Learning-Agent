/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { 
  BrainCircuit, 
  Search, 
  BookOpen, 
  ClipboardCheck, 
  ArrowRight, 
  Loader2, 
  RefreshCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronRight,
  Github
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import { analyzeContent } from "./services/gemini";
import { AnalysisResult, FeynmanQuizItem } from "./types";

// Design Recipe Variables
const COLORS = {
  bg: "#E6E6E6",
  card: "#151619",
  accent: "#FF6321", // Bold orange
  textPrimary: "#FFFFFF",
  textSecondary: "#8E9299",
  ink: "#141414",
};

export default function App() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<"logic" | "heuristic" | "knowledge" | "quiz">("logic");
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});

  const simulateLogs = async () => {
    const messages = [
      "🚀 [AGENT START] Initiating Deep-Learning Workflow...",
      `📊 [INPUT] Document received. Length: ${input.length} characters.`,
      "🔍 [PROCESS] Step 1: Analyzing document structure and semantic clusters...",
      "   ↳ [Thought] Scanning for key concepts and logical transitions...",
      "✅ [SUCCESS] Semantic structure parsed.",
      "🧠 [PROCESS] Step 2: Generating high-order reasoning questions...",
      "   ↳ [Thought] Identifying logical gaps in the text...",
      "✅ [SUCCESS] Deep-thinking questions generated.",
      "🌐 [PROCESS] Step 3: Executing web-based knowledge retrieval...",
      "   ↳ [Tool Call] Searching for related academic context...",
      "   ↳ [Status] Connecting to Simulated Search API...",
      "✅ [SUCCESS] External knowledge integrated into context.",
      "📝 [PROCESS] Step 4: Synthesizing Feynman-style learning package...",
      "   ↳ [Thought] Mapping extracted knowledge to pedagogical patterns...",
      "✅ [SUCCESS] Learning package finalized.",
      "🌈 [WORKFLOW COMPLETE] All tasks finished successfully."
    ];
    
    for (const msg of messages) {
      setLogs(prev => [...prev, msg].slice(-8)); // Keep more logs visible
      await new Promise(resolve => setTimeout(resolve, 600));
    }
  };

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    setLogs([]);
    simulateLogs();
    try {
      const data = await analyzeContent(input);
      setResult(data);
      setQuizScore(null);
      setQuizAnswers({});
    } catch (error) {
      console.error(error);
      alert("Analysis failed. Please check your API key if running locally.");
    } finally {
      setIsLoading(false);
    }
  };

  const submitQuiz = (feynmanQuiz: FeynmanQuizItem[]) => {
    let score = 0;
    feynmanQuiz.forEach((item, index) => {
      if (quizAnswers[index] === item.correctAnswer) {
        score++;
      }
    });
    setQuizScore(score);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F4] text-[#1A1A1A] font-sans selection:bg-[#FF6321] selection:text-white">
      {/* Header / Nav */}
      <nav className="border-b border-[#1A1A1A]/10 px-6 py-4 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#FF6321] rounded-sm flex items-center justify-center">
            <BrainCircuit className="text-white w-5 h-5" />
          </div>
          <span className="font-bold tracking-tight text-lg">DeepInsight</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="text-xs font-semibold uppercase tracking-widest text-[#1A1A1A]/60 hover:text-[#FF6321] transition-colors">Documentation</a>
          <a href="#" className="flex items-center gap-1 bg-[#1A1A1A] text-white px-4 py-2 rounded-full text-xs font-semibold hover:bg-[#FF6321] transition-all transform hover:scale-105 active:scale-95">
            <Github className="w-3.5 h-3.5" />
            GitHub
          </a>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-24">
        <AnimatePresence mode="wait">
          {!result && !isLoading ? (
            <motion.div 
              key="hero"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid lg:grid-cols-2 gap-16 items-center"
            >
              <div>
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ delay: 0.2 }}
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF6321]"
                >
                  Universal Learning Agent
                </motion.span>
                <h1 className="text-6xl lg:text-8xl font-semibold leading-[0.9] tracking-tighter mt-4 mb-8">
                  Internalize <br /> Any Knowledge.
                </h1>
                <p className="text-xl text-[#1A1A1A]/70 max-w-lg mb-12 leading-relaxed">
                  DeepInsight uses advanced heuristics to break down complex texts into logical units, forcing you to think and truly understand what you're reading.
                </p>
                
                <div className="space-y-4">
                  <div className="relative group">
                    <textarea 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Paste complex text, research abstract, or lecture notes here..."
                      className="w-full h-48 bg-white border border-[#1A1A1A]/10 rounded-2xl p-6 focus:ring-2 focus:ring-[#FF6321] focus:border-transparent outline-none transition-all shadow-sm group-hover:shadow-md text-lg leading-relaxed placeholder:text-[#1A1A1A]/30"
                    />
                    <div className="absolute bottom-4 right-4 flex gap-2">
                       <button 
                        onClick={handleAnalyze}
                        disabled={!input.trim()}
                        className="bg-[#FF6321] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#E55A1E] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl active:scale-95"
                      >
                        Start Deep Read
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-12 flex gap-8 items-center border-t border-[#1A1A1A]/10 pt-8">
                  <div className="flex -space-x-2">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />
                    ))}
                  </div>
                  <p className="text-xs text-[#1A1A1A]/50 font-medium">Used by 2,000+ engineers & students</p>
                </div>
              </div>

              <div className="hidden lg:block relative">
                 <div className="absolute inset-0 bg-gradient-to-tr from-[#FF6321]/20 to-transparent blur-3xl rounded-full" />
                 <div className="relative bg-white p-8 rounded-[40px] shadow-2xl border border-[#1A1A1A]/5 transform rotate-2">
                    <div className="space-y-6">
                       <div className="h-4 w-1/2 bg-[#1A1A1A]/10 rounded-full" />
                       <div className="space-y-2">
                          <div className="h-3 w-full bg-[#1A1A1A]/5 rounded-full" />
                          <div className="h-3 w-full bg-[#1A1A1A]/5 rounded-full" />
                          <div className="h-3 w-2/3 bg-[#1A1A1A]/5 rounded-full" />
                       </div>
                       <div className="grid grid-cols-3 gap-4 pt-4">
                          <div className="aspect-square bg-[#FF6321]/10 rounded-2xl border border-[#FF6321]/20 flex items-center justify-center">
                            <Search className="text-[#FF6321] w-6 h-6" />
                          </div>
                          <div className="aspect-square bg-blue-50 rounded-2xl border border-blue-100 flex items-center justify-center">
                            <BookOpen className="text-blue-500 w-6 h-6" />
                          </div>
                          <div className="aspect-square bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-center">
                            <ClipboardCheck className="text-emerald-500 w-6 h-6" />
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            </motion.div>
          ) : isLoading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full border-4 border-[#FF6321]/20 animate-ping" />
                <div className="bg-[#FF6321] p-6 rounded-full relative z-10">
                  <Loader2 className="w-10 h-10 text-white animate-spin" />
                </div>
              </div>
              <h2 className="text-4xl font-bold mt-8 tracking-tight">Synthesizing Core Concepts...</h2>
              
              <div className="mt-8 w-full max-w-md bg-[#1A1A1A] p-4 rounded-xl shadow-2xl border border-white/5 font-mono text-left">
                <div className="flex gap-1.5 mb-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                </div>
                <div className="space-y-1">
                  {logs.map((log, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-[10px] text-emerald-500/80 flex gap-2"
                    >
                      <span className="text-emerald-500/30">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                      <span>{log}</span>
                    </motion.div>
                  ))}
                  <motion.div 
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="w-1.5 h-3 bg-emerald-500/50 inline-block align-middle ml-1"
                  />
                </div>
              </div>

              <p className="mt-8 text-[#1A1A1A]/50 italic text-sm">"Simplification is the ultimate sophistication." — Leonardo da Vinci</p>
            </motion.div>
          ) : (
            result && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <button 
                      onClick={() => setResult(null)}
                      className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1A1A1A]/40 hover:text-[#FF6321] mb-4 transition-colors"
                    >
                      <RefreshCcw className="w-3.5 h-3.5" />
                      New Analysis
                    </button>
                    <h2 className="text-5xl font-semibold tracking-tighter">Insights Explorer</h2>
                  </div>
                  <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-[#1A1A1A]/5">
                    {[
                      { id: "logic", icon: Search, label: "Logic Map" },
                      { id: "heuristic", icon: BrainCircuit, label: "Heuristics" },
                      { id: "knowledge", icon: BookOpen, label: "Retrieval" },
                      { id: "quiz", icon: ClipboardCheck, label: "Feynman Quiz" }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                          activeTab === tab.id 
                          ? "bg-[#1A1A1A] text-white shadow-lg" 
                          : "text-[#1A1A1A]/50 hover:bg-[#1A1A1A]/5"
                        }`}
                      >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Summary Card */}
                  <div className="lg:col-span-1 space-y-6">
                    <div className="bg-[#151619] text-white p-8 rounded-[32px] shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6321]/20 blur-[60px] rounded-full -mr-16 -mt-16 group-hover:bg-[#FF6321]/40 transition-all duration-700" />
                      <div className="relative z-10">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF6321]">Core Synthesis</span>
                        <h3 className="text-2xl font-semibold mt-4 mb-6 tracking-tight">Abstract</h3>
                        <div className="text-white/70 leading-relaxed text-sm prose prose-invert">
                          <ReactMarkdown>{result.summary}</ReactMarkdown>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-[#1A1A1A]/10">
                      <h4 className="font-bold text-xs uppercase tracking-widest text-[#1A1A1A]/40 mb-4">Reading Progress</h4>
                      <div className="h-2 w-full bg-[#1A1A1A]/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: "65%" }}
                          className="h-full bg-[#FF6321]"
                        />
                      </div>
                      <p className="text-[10px] text-[#1A1A1A]/50 mt-4 font-bold uppercase">Estimated Internalization: 65%</p>
                    </div>
                  </div>

                  {/* Main Content Area */}
                  <div className="lg:col-span-2">
                    <AnimatePresence mode="wait">
                      {activeTab === "logic" && (
                        <motion.div 
                          key="logic-content"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-6"
                        >
                          {result.logicMap.map((point, i) => (
                            <div key={i} className="bg-white p-8 rounded-[32px] shadow-sm border border-[#1A1A1A]/10 flex gap-6 hover:border-[#FF6321]/30 transition-all group">
                              <div className="shrink-0 h-10 w-10 rounded-xl bg-[#1A1A1A]/5 flex items-center justify-center text-xs font-bold font-mono group-hover:bg-[#FF6321] group-hover:text-white transition-all">
                                0{i + 1}
                              </div>
                              <div className="space-y-4">
                                <h4 className="text-xl font-semibold tracking-tight">{point.argument}</h4>
                                <div className="pl-4 border-l-2 border-[#FF6321]/20">
                                  <p className="text-sm text-[#1A1A1A]/60 italic italic font-medium leading-relaxed">
                                    Evidence: {point.evidence}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}

                      {activeTab === "heuristic" && (
                        <motion.div 
                          key="heuristic-content"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="grid gap-6"
                        >
                          {result.heuristicQuestions.map((q, i) => (
                            <div key={i} className="bg-[#FF6321]/5 p-8 rounded-[32px] border border-[#FF6321]/10 flex items-start gap-6">
                              <div className="bg-white p-3 rounded-2xl shadow-sm text-[#FF6321] shrink-0 border border-[#FF6321]/10">
                                <HelpCircle className="w-6 h-6" />
                              </div>
                              <div className="space-y-3">
                                <h4 className="text-xl font-bold tracking-tight text-[#1A1A1A]">{q.question}</h4>
                                <p className="text-sm text-[#1A1A1A]/60 leading-relaxed">{q.context}</p>
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}

                      {activeTab === "knowledge" && (
                        <motion.div 
                          key="knowledge-content"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="bg-white p-10 rounded-[40px] shadow-sm border border-[#1A1A1A]/5"
                        >
                          <div className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 border border-blue-100">
                              <BookOpen className="w-6 h-6" />
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold tracking-tight">Supplementary Knowledge</h3>
                              <p className="text-xs text-[#1A1A1A]/40 font-bold uppercase tracking-widest mt-1">Simulated Context Retrieval</p>
                            </div>
                          </div>
                          <div className="prose prose-slate max-w-none prose-p:leading-relaxed prose-p:text-[#1A1A1A]/70">
                            <ReactMarkdown>{result.supplementalKnowledge}</ReactMarkdown>
                          </div>
                        </motion.div>
                      )}

                      {activeTab === "quiz" && (
                        <motion.div 
                          key="quiz-content"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-8"
                        >
                          {quizScore !== null ? (
                            <div className="bg-white p-12 rounded-[40px] shadow-xl border border-[#1A1A1A]/5 text-center space-y-6">
                              <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
                                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                              </div>
                              <div>
                                <h3 className="text-3xl font-bold tracking-tight">Quiz Results</h3>
                                <p className="text-[#1A1A1A]/50 mt-2 font-medium">You scored {quizScore} out of {result.feynmanQuiz.length}</p>
                              </div>
                              <div className="text-5xl font-bold text-[#1A1A1A]">{Math.round((quizScore/result.feynmanQuiz.length)*100)}%</div>
                              <button 
                                onClick={() => setQuizScore(null)}
                                className="bg-[#1A1A1A] text-white px-8 py-3 rounded-full font-bold hover:bg-[#FF6321] transition-all"
                              >
                                Try Again
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-12">
                              {result.feynmanQuiz.map((item, i) => (
                                <div key={i} className="bg-white p-10 rounded-[40px] shadow-sm border border-[#1A1A1A]/5 space-y-8">
                                  <div className="flex items-center gap-4">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF6321]">Question 0{i + 1}</span>
                                    <div className="h-[1px] flex-grow bg-[#1A1A1A]/5" />
                                  </div>
                                  <h4 className="text-2xl font-semibold tracking-tight">{item.question}</h4>
                                  <div className="grid md:grid-cols-2 gap-4">
                                    {item.options.map((option, optIdx) => (
                                      <button
                                        key={optIdx}
                                        onClick={() => setQuizAnswers(prev => ({...prev, [i]: option}))}
                                        className={`p-6 rounded-3xl text-left transition-all border-2 flex items-center justify-between group ${
                                          quizAnswers[i] === option 
                                          ? "bg-[#1A1A1A] border-[#1A1A1A] text-white shadow-xl scale-[1.02]" 
                                          : "bg-white border-[#1A1A1A]/5 text-white/50 hover:border-[#FF6321]/30 hover:bg-[#FF6321]/5"
                                        }`}
                                      >
                                        <span className={`font-semibold ${quizAnswers[i] === option ? "text-white" : "text-[#1A1A1A]/70"}`}>{option}</span>
                                        <ChevronRight className={`w-4 h-4 transition-transform ${quizAnswers[i] === option ? "translate-x-1" : "opacity-0 group-hover:opacity-100"}`} />
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              ))}
                              <div className="flex justify-center pt-8">
                                <button
                                  onClick={() => submitQuiz(result.feynmanQuiz)}
                                  className="bg-[#1A1A1A] text-white px-12 py-5 rounded-3xl font-bold text-lg hover:bg-[#FF6321] transition-all shadow-2xl hover:shadow-[#FF6321]/20 flex items-center gap-3"
                                >
                                  Complete Evaluation
                                  <ClipboardCheck className="w-6 h-6" />
                                </button>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-[#1A1A1A]/5 py-12 mt-24">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-2 opacity-50">
            <div className="w-6 h-6 bg-[#1A1A1A] rounded-sm flex items-center justify-center">
              <BrainCircuit className="text-white w-4 h-4" />
            </div>
            <span className="font-bold tracking-tight text-sm">DeepInsight</span>
          </div>
          <p className="text-xs text-[#1A1A1A]/30 font-medium">© 2026 DeepInsight Learning Agent. All rights reserved.</p>
          <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/40">
            <a href="#" className="hover:text-[#FF6321] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#FF6321] transition-colors">Terms</a>
            <a href="#" className="hover:text-[#FF6321] transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
