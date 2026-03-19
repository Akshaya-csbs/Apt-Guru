import { Bot, Lightbulb, Sparkles, User, BrainCircuit, Calculator, BookOpen, BarChart3, Brain } from "lucide-react";
import { useEffect, useRef } from "react";

export type Message = {
  id: string;
  role: "user" | "bot";
  content: string;
  imageUrl?: string;
  isLogicStep?: boolean;
};

export default function ChatArea({ messages, isTyping, onTopicSelect }: { messages: Message[], isTyping: boolean, onTopicSelect?: (topic: string) => void }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-6 scroll-smooth">
      <div className="max-w-4xl mx-auto space-y-8">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center py-10 opacity-80 animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 mb-4 rounded-[1.5rem] bg-gradient-to-tr from-[#f09433]/10 via-[#dc2743]/10 to-[#bc1888]/10 flex items-center justify-center p-1 relative overflow-hidden">
               <div className="absolute inset-0 bg-black/40 backdrop-blur-xl"></div>
               <BrainCircuit size={40} className="text-pink-500 relative z-10 animate-float" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Welcome to AptGuru!</h2>
            <p className="text-neutral-300 text-center max-w-sm mb-8 text-sm leading-relaxed">
              Select a topic below to start your personalized learning journey, or ask a specific question.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl px-2">
              {/* Quantitative */}
              <div onClick={() => onTopicSelect?.("Quantitative Aptitude")} className="bg-[#121212] p-5 rounded-3xl border border-[#262626] cursor-pointer relative overflow-hidden group hover:-translate-y-1 hover:border-pink-500/40 transition-all flex flex-col">
                <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-500 flex items-center justify-center mb-4 z-10">
                  <Calculator size={20} />
                </div>
                <h4 className="font-bold text-white mb-1 z-10">Quantitative Aptitude</h4>
                <p className="text-[11px] text-neutral-300 z-10">Percentages, Ratio, Time & Work</p>
              </div>

              {/* Logical */}
              <div onClick={() => onTopicSelect?.("Logical Reasoning")} className="bg-[#121212] p-5 rounded-3xl border border-[#262626] cursor-pointer relative overflow-hidden group hover:-translate-y-1 hover:border-purple-500/40 transition-all flex flex-col">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-500 flex items-center justify-center mb-4 z-10">
                  <Brain size={20} />
                </div>
                <h4 className="font-bold text-white mb-1 z-10">Logical Reasoning</h4>
                <p className="text-[11px] text-neutral-300 z-10">Puzzles, Seating Arrangements, Blood Relations</p>
              </div>

              {/* Verbal */}
              <div onClick={() => onTopicSelect?.("Verbal Ability")} className="bg-[#121212] p-5 rounded-3xl border border-[#262626] cursor-pointer relative overflow-hidden group hover:-translate-y-1 hover:border-orange-500/40 transition-all flex flex-col">
                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-center justify-center mb-4 z-10">
                  <BookOpen size={20} />
                </div>
                <h4 className="font-bold text-white mb-1 z-10">Verbal Ability</h4>
                <p className="text-[11px] text-neutral-300 z-10">Synonyms, Antonyms, Reading Comprehension</p>
              </div>

              {/* Data */}
              <div onClick={() => onTopicSelect?.("Data Interpretation")} className="bg-[#121212] p-5 rounded-3xl border border-[#262626] cursor-pointer relative overflow-hidden group hover:-translate-y-1 hover:border-cyan-500/40 transition-all flex flex-col">
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 flex items-center justify-center mb-4 z-10">
                  <BarChart3 size={20} />
                </div>
                <h4 className="font-bold text-white mb-1 z-10">Data Interpretation</h4>
                <p className="text-[11px] text-neutral-400 z-10">Graphs, Tables, Caselets</p>
              </div>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-3`}>
            {/* Avatar */}
            <div className="flex-shrink-0 mt-1">
              {msg.role === 'user' ? (
                <div className="w-8 h-8 rounded-full bg-[#262626] flex items-center justify-center text-white">
                  <User size={14} />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shadow-md">
                  <Bot size={16} />
                </div>
              )}
            </div>

            {/* Content Bubble */}
            <div className={`max-w-[85%] sm:max-w-2xl flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} mt-1`}>
              
              {/* If it has an image */}
              {msg.imageUrl && (
                <div className="mb-2 max-w-xs sm:max-w-sm overflow-hidden rounded-3xl border border-[#262626]">
                  <img src={msg.imageUrl} alt="User upload" className="w-full h-auto" />
                </div>
              )}

              {msg.content && (
                <div className={`
                  px-5 py-3.5 rounded-3xl text-[15px] leading-relaxed relative
                  ${msg.role === 'user' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-tr-md font-medium' 
                    : msg.isLogicStep 
                      ? 'bg-[#121212] border border-[#262626] text-white rounded-tl-md w-full'
                      : 'bg-[#262626] text-white rounded-tl-md w-full'
                  }
                `}>
                  
                  {/* AI Extra UI decorations */}
                  {msg.role === 'bot' && (
                    <div className="prose prose-invert prose-sm md:prose-base prose-slate max-w-none text-white">
                      {msg.isLogicStep && (
                        <div className="flex items-center gap-1.5 text-pink-500 font-bold mb-4 text-[11px] uppercase tracking-wider bg-pink-500/10 inline-flex px-3 py-1.5 rounded-full">
                          <Lightbulb size={12} className="animate-pulse" /> Step-by-step Solution
                        </div>
                      )}
                      
                      {/* Simple markdown rendering */}
                      <div className="space-y-4">
                        {msg.content.split('\n\n').map((paragraph, i) => {
                          if (paragraph.startsWith('**Shortcut:**') || paragraph.startsWith('💡 **Shortcut:**') || paragraph.startsWith('💡 Shortcut:')) {
                            return (
                              <div key={i} className="bg-gradient-to-r from-orange-500/10 to-transparent p-4 rounded-xl border-l-[3px] border-orange-500 flex items-start gap-3 my-5">
                                <div className="text-orange-400 mt-0.5"><Sparkles size={18} /></div>
                                <div className="text-neutral-200 text-[15px] font-medium leading-relaxed">{paragraph.replace(/\*\*Shortcut:\*\*|💡 \*\*Shortcut:\*\*|💡 Shortcut:/g, '')}</div>
                              </div>
                            );
                          }

                          if (paragraph.startsWith('**Why other options are wrong:**')) {
                            return (
                              <div key={i} className="bg-red-500/5 border border-red-500/10 p-4 rounded-xl mt-6">
                                <h4 className="text-red-400 font-bold text-sm mb-2 flex items-center gap-1.5"><BrainCircuit size={16} /> Why other options are wrong:</h4>
                                <div className="space-y-2 text-neutral-300">
                                  {paragraph.replace('**Why other options are wrong:**', '').split('\n').filter(Boolean).map((line, j) => {
                                    const boldLineParts = line.split(/\*\*(.*?)\*\*/g);
                                    return (
                                      <p key={j} className="text-[14px]">
                                         {boldLineParts.map((part, k) => k % 2 === 1 ? <strong key={k} className="text-white font-bold">{part}</strong> : part)}
                                      </p>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          }

                          if (paragraph.startsWith('📖 **Let me tell you a story...**')) {
                            return (
                              <div key={i} className="mb-4">
                                <span className="text-pink-400 font-bold text-lg flex items-center gap-2 mb-2">📖 Let me tell you a story...</span>
                              </div>
                            );
                          }

                          if (paragraph.startsWith('🧠 **1 Concept → 2 Problems → 1 Shortcut**')) {
                            return (
                              <div key={i} className="mb-4">
                                <span className="text-purple-400 font-bold text-lg flex items-center gap-2 mb-2">🧠 1 Concept → 2 Problems → 1 Shortcut</span>
                              </div>
                            );
                          }

                          if (paragraph.startsWith('💡 **Hint:**')) {
                            return (
                              <div key={i} className="bg-gradient-to-r from-yellow-500/10 to-transparent p-4 rounded-xl border-l-[3px] border-yellow-500 flex items-start gap-3 my-2 shadow-sm">
                                <div className="text-yellow-400 mt-0.5"><Lightbulb size={18} /></div>
                                <div className="text-neutral-200 text-[15px] font-medium leading-relaxed">{paragraph.replace('💡 **Hint:**', '').trim()}</div>
                              </div>
                            );
                          }
                          
                          // Handle bold text rendering simply
                          const boldParts = paragraph.split(/\*\*(.*?)\*\*/g);
                          return (
                            <p key={i}>
                              {boldParts.map((part, j) => j % 2 === 1 ? <strong key={j} className="text-white font-bold">{part}</strong> : part)}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {msg.role === 'user' && (
                    <span className="whitespace-pre-wrap">{msg.content}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-3 mt-1">
             <div className="flex-shrink-0">
               <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shadow-md animate-pulse">
                 <Bot size={16} />
               </div>
             </div>
             <div className="bg-[#262626] rounded-3xl rounded-tl-md px-5 py-3 h-[42px] flex items-center gap-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-[bounce_1s_infinite]"></div>
               <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-[bounce_1s_infinite_200ms]"></div>
               <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-[bounce_1s_infinite_400ms]"></div>
             </div>
          </div>
        )}
        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
}
