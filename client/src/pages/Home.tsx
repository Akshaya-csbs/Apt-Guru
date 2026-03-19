import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import ChatArea, { Message } from "../components/chat/ChatArea";
import ChatInput from "../components/chat/ChatInput";
import { getMockAIResponse } from "../lib/mockAI";
import { Sparkles, AlignLeft, Brain } from "lucide-react";

export type LearningMode = "Solve" | "Learn" | "Quiz" | "ELI10";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mode, setMode] = useState<LearningMode>("Solve");
  const [xp, setXp] = useState(450);

  const handleSendMessage = async (text: string, file?: File | null, fileUrl?: string) => {
    // Construct user message
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      imageUrl: fileUrl,
    };

    setMessages(prev => [...prev, newMessage]);
    setIsTyping(true);

    try {
      const isImage = file?.type.startsWith('image/') || false;
      const responseText = await getMockAIResponse(text, isImage, mode === "ELI10");

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: responseText,
        isLogicStep: true,
      };

      setMessages(prev => [...prev, botMessage]);
      setXp(prev => prev + 15); // Reward 15 XP for every interaction
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="relative flex h-[100dvh] w-full bg-black overflow-hidden font-outfit selection:bg-pink-500/30">
      {/* Dynamic Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* Mobile Header (Pushed down slightly to avoid OS/iframe clipping) */}
      <div className="md:hidden absolute top-0 mt-2 left-0 right-0 h-16 bg-black/80 backdrop-blur-md border-b border-[#262626] flex items-center justify-between px-4 z-20">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white font-bold shadow-md">
             <Brain size={16} className="fill-none stroke-[2.5]" />
           </div>
           <h1 className="text-lg font-bold text-white flex items-center gap-1">AptGuru <Sparkles size={14} className="text-pink-500" /></h1>
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-[#262626] text-white rounded-lg"
        >
          <AlignLeft size={20} />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}>
          <div className="h-full w-80 max-w-[80vw] bg-black shadow-2xl border-r border-[#262626]" onClick={e => e.stopPropagation()}>
            <Sidebar xp={xp} onAction={(t) => { handleSendMessage(t); setSidebarOpen(false); }} />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <Sidebar xp={xp} onAction={handleSendMessage} />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-[100dvh] pt-20 md:pt-0 relative z-10 bg-black overflow-hidden">
        
        {/* Top bar indicators */}
        <div className="flex justify-between items-center px-4 py-3 md:p-6 md:pt-10 md:pb-2 gap-4 border-b border-[#262626] md:border-none">
           <div className="flex gap-1.5 md:gap-2 bg-[#121212] p-1 rounded-xl md:rounded-2xl border border-[#262626] overflow-x-auto no-scrollbar">
              {(["Solve", "Learn", "Quiz", "ELI10"] as LearningMode[]).map((m) => (
                <button 
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-3 md:px-4 py-1.5 rounded-lg md:rounded-xl text-xs md:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                    mode === m 
                      ? 'bg-gradient-to-r from-[#f09433]/20 to-[#dc2743]/20 border border-pink-500/50 text-white shadow-sm' 
                      : 'text-neutral-400 hover:text-white hover:bg-[#1a1a1a] border border-transparent'
                  }`}
                >
                  {m === "ELI10" ? "Explain Like I'm 10" : m}
                </button>
              ))}
           </div>
           
           <div className="flex gap-2 shrink-0">
             <div className="w-10 h-10 rounded-xl md:rounded-2xl bg-[#121212] border border-[#262626] flex flex-col items-center justify-center shadow-sm cursor-pointer hover:bg-[#1a1a1a] transition-colors">
               <span className="text-[10px] font-bold text-neutral-400">Streak</span>
               <span className="text-sm font-bold text-pink-500 leading-none">🔥5</span>
             </div>
           </div>
        </div>

        <ChatArea messages={messages} isTyping={isTyping} onTopicSelect={(topic) => handleSendMessage(`I want to structure my learning today. Teach me about ${topic}.`)} />
        
        <div className="mt-auto z-20">
          <ChatInput onSendMessage={handleSendMessage} />
          <p className="text-center text-[10px] text-slate-400 mb-2 font-medium pb-2 sm:pb-0">
            AptGuru can make mistakes. Consider verifying important logic.
          </p>
        </div>
      </div>
    </div>
  );
}
