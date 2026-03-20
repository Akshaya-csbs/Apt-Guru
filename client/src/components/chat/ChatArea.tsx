import { Bot, Lightbulb, BrainCircuit, Calculator, BookOpen, BarChart3, Brain, User } from "lucide-react";
import { useEffect, useRef } from "react";

// Helper: renders **bold** markdown inline into React elements
function renderInline(text: string): React.ReactNode {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="text-white font-bold">{part}</strong> : part
  );
}


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
    if (messages.length > 0 || isTyping) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  return (
    <div className="flex-1 h-full w-full overflow-y-auto no-scrollbar px-5 md:px-8 py-6 pb-20 scroll-smooth">
      <div className="w-full max-w-6xl mx-auto space-y-8">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 animate-in fade-in zoom-in duration-500">
            {/* Static icon — no glow */}
            <div className="relative mb-5">
              <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-tr from-purple-600/20 via-[#dc2743]/20 to-[#bc1888]/20 border border-purple-500/30 flex items-center justify-center relative">
                <BrainCircuit size={40} className="text-purple-400" />
              </div>
            </div>
            <h2 className="text-2xl font-extrabold text-white mb-1 tracking-tight">Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">AptGuru</span>!</h2>
            <p className="text-neutral-400 text-center max-w-xs mb-8 text-sm leading-relaxed px-4">
              Your AI-powered aptitude tutor. Pick a topic or ask any question to get started.
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
                      
                      {/* Structured AI response renderer */}
                      <div className="space-y-3 text-[14px] sm:text-[15px] leading-relaxed">
                        {(() => {
                          // Strip stray # and $ symbols that hurt readability
                          const cleaned = msg.content
                            .replace(/^#{1,6}\s+/gm, '')       // remove markdown headers
                            .replace(/\$\$?[^$\n]+\$\$?/g, matched => matched.replace(/\$/g, '').trim()) // strip $ from math
                            .trim();
                          
                          const blocks = cleaned.split('\n\n').filter(Boolean);
                          
                          return blocks.map((block, i) => {
                            const t = block.trim();

                            // Shortcut block
                            if (t.includes('Shortcut Trick') || t.includes('💡 **Shortcut') || t.startsWith('💡 Shortcut')) {
                              return (
                                <div key={i} className="bg-gradient-to-r from-orange-500/15 to-amber-500/5 p-4 rounded-2xl border-l-4 border-orange-500 flex gap-3 mt-2">
                                  <span className="text-orange-400 text-xl shrink-0">⚡</span>
                                  <div className="text-orange-100 font-medium">{renderInline(t.replace(/💡 \*\*Shortcut(?: Trick)?:\*\*|💡 Shortcut(?: Trick)?:/gi, '').trim())}</div>
                                </div>
                              );
                            }

                            // Final Answer block
                            if (t.startsWith('🎯') || t.toLowerCase().startsWith('final answer') || t.includes('🎯 **Final Answer')) {
                              return (
                                <div key={i} className="bg-gradient-to-r from-emerald-500/15 to-green-500/5 p-4 rounded-2xl border-l-4 border-emerald-500 flex gap-3 mt-2">
                                  <span className="text-emerald-400 text-xl shrink-0">🎯</span>
                                  <div className="text-emerald-100 font-semibold">{renderInline(t.replace(/🎯 \*\*Final Answer[:\*]*/gi, '').trim())}</div>
                                </div>
                              );
                            }

                            // Hint block
                            if (t.startsWith('💡 **Hint') || t.toLowerCase().startsWith('💡 hint')) {
                              return (
                                <div key={i} className="bg-gradient-to-r from-yellow-500/15 to-transparent p-4 rounded-2xl border-l-4 border-yellow-500 flex gap-3">
                                  <span className="text-yellow-400 text-xl shrink-0">💡</span>
                                  <div className="text-yellow-100 font-medium">{renderInline(t.replace(/💡 \*\*Hint[:\*]*/gi, '').trim())}</div>
                                </div>
                              );
                            }

                            // Why other options block
                            if (t.includes('Why Other Options') || t.includes('🧠 **Why')) {
                              return (
                                <div key={i} className="bg-red-500/5 border border-red-500/15 p-4 rounded-2xl mt-2">
                                  <div className="text-red-400 font-bold text-sm mb-2 flex items-center gap-1.5">🧠 Why Other Options Are Wrong</div>
                                  <div className="space-y-1.5 text-neutral-300">
                                    {t.replace(/🧠 \*\*Why Other Options Are Wrong[:\*]*/gi,'').split('\n').filter(Boolean).map((line,j) => (
                                      <p key={j} className="text-[13px]">{renderInline(line)}</p>
                                    ))}
                                  </div>
                                </div>
                              );
                            }

                            // Numbered step list — render each line as a styled step card
                            const lines = t.split('\n');
                            const isStepBlock = lines.filter(l => /^\d+\./.test(l.trim())).length >= 2;
                            if (isStepBlock) {
                              return (
                                <div key={i} className="space-y-2">
                                  {lines.map((line, j) => {
                                    const stepMatch = line.trim().match(/^(\d+)\.\s+(.*)/);
                                    if (stepMatch) {
                                      return (
                                        <div key={j} className="flex gap-3 items-start bg-[#1a1a1a] rounded-xl px-4 py-2.5 border border-[#2e2e2e]">
                                          <span className="w-6 h-6 rounded-full bg-pink-500/20 text-pink-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{stepMatch[1]}</span>
                                          <span className="text-neutral-200">{renderInline(stepMatch[2])}</span>
                                        </div>
                                      );
                                    }
                                    return line ? <p key={j} className="text-neutral-300 px-1">{renderInline(line)}</p> : null;
                                  })}
                                </div>
                              );
                            }

                            // Section header line (bold standalone line like **Understanding the Problem**)
                            if (/^\*\*[^*]+\*\*$/.test(t) || /^[🔍📊✅💡🎯🧠📖]/.test(t)) {
                              return <p key={i} className="font-bold text-white text-[15px] mt-3 mb-1">{renderInline(t)}</p>;
                            }

                            // Default paragraph
                            return (
                              <p key={i} className="text-neutral-300">
                                {renderInline(t)}
                              </p>
                            );
                          });
                        })()}
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
