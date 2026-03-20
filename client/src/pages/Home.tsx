import { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/layout/Sidebar";
import ChatArea, { Message } from "../components/chat/ChatArea";
import ChatInput from "../components/chat/ChatInput";
import { getMockAIResponse } from "../lib/mockAI";
import {
  getAllSessions, saveSession, createSession, deleteSession, deriveTitle, ChatSession
} from "../lib/chatHistory";
import {
  Sparkles, Brain, BookOpen, BarChart3, Calculator,
  AlignLeft, Plus, Trash2, MessageSquare, X
} from "lucide-react";

export type LearningMode = "Solve" | "Learn" | "Quiz" | "ELI10";

export default function Home() {
  const [sessions, setSessions]       = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession>(() => {
    const existing = getAllSessions();
    return existing.length > 0 ? existing[0] : createSession();
  });
  const [messages, setMessages]       = useState<Message[]>(currentSession.messages);
  const [isTyping, setIsTyping]       = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [mode, setMode]               = useState<LearningMode>("Solve");
  const [xp, setXp]                   = useState(450);
  const [activeTab, setActiveTab]     = useState<"chat"|"topics"|"progress">("chat");

  // Load sessions list on mount
  useEffect(() => {
    setSessions(getAllSessions());
  }, []);

  // Auto-save whenever messages change
  useEffect(() => {
    if (messages.length === 0) return;
    const firstUser = messages.find(m => m.role === "user")?.content || "";
    const updated: ChatSession = {
      ...currentSession,
      messages,
      title: deriveTitle(firstUser),
      updatedAt: Date.now(),
    };
    setCurrentSession(updated);
    saveSession(updated);
    setSessions(getAllSessions());
  }, [messages]);

  const startNewChat = useCallback(() => {
    const session = createSession();
    setCurrentSession(session);
    setMessages([]);
    setHistoryOpen(false);
  }, []);

  const switchSession = useCallback((session: ChatSession) => {
    setCurrentSession(session);
    setMessages(session.messages);
    setHistoryOpen(false);
  }, []);

  const removeSession = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteSession(id);
    const remaining = getAllSessions();
    setSessions(remaining);
    if (currentSession.id === id) {
      const next = remaining[0] ?? createSession();
      setCurrentSession(next);
      setMessages(next.messages);
    }
  }, [currentSession.id]);

  const handleSendMessage = async (text: string, file?: File | null, fileUrl?: string) => {
    if (!text.trim() && !file) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      imageUrl: fileUrl,
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    setActiveTab("chat");
    try {
      const responseText = await getMockAIResponse(text, mode, file);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: responseText,
        isLogicStep: true,
      }]);
      setXp(prev => prev + 15);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const modeColors: Record<LearningMode, string> = {
    Solve: "from-pink-600 to-rose-500",
    Learn: "from-purple-600 to-indigo-500",
    Quiz:  "from-orange-500 to-amber-400",
    ELI10: "from-cyan-500 to-sky-400",
  };

  function relativeTime(ts: number) {
    const diff = Date.now() - ts;
    if (diff < 60000) return "just now";
    if (diff < 3600000) return `${Math.floor(diff/60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff/3600000)}h ago`;
    return new Date(ts).toLocaleDateString();
  }

  return (
    <div className="flex h-[100dvh] w-full bg-black overflow-hidden font-outfit text-white">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-purple-700/20 rounded-full blur-[100px]" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-pink-700/20 rounded-full blur-[100px]" />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex shrink-0">
        <Sidebar
          xp={xp}
          onAction={handleSendMessage}
          sessions={sessions}
          currentSessionId={currentSession.id}
          onNewChat={startNewChat}
          onSwitchSession={switchSession}
          onDeleteSession={removeSession}
        />
      </div>

      {/* Mobile Stats Slide-over */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}>
          <div className="absolute left-0 top-0 h-full w-72 bg-[#0a0a0a] border-r border-[#262626] shadow-2xl" onClick={e => e.stopPropagation()}>
            <Sidebar 
              onAction={(t) => { handleSendMessage(t); setSidebarOpen(false); }}
              sessions={sessions}
              currentSessionId={currentSession.id}
              onNewChat={() => { startNewChat(); setSidebarOpen(false); }}
              onSwitchSession={(s) => { switchSession(s); setSidebarOpen(false); }}
              onDeleteSession={removeSession}
            />
          </div>
        </div>
      )}

      {/* Chat History Panel */}
      {historyOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={() => setHistoryOpen(false)}>
          <div
            className="absolute right-0 top-0 h-full w-80 max-w-[90vw] bg-[#0a0a0a] border-l border-[#262626] shadow-2xl flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Panel header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-[#1e1e1e]">
              <h2 className="text-sm font-bold text-white">Chat History</h2>
              <div className="flex gap-2">
                <button
                  onClick={startNewChat}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-pink-600 to-rose-500 text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all"
                >
                  <Plus size={13}/> New Chat
                </button>
                <button onClick={() => setHistoryOpen(false)} className="p-1.5 text-neutral-500 hover:text-white">
                  <X size={16}/>
                </button>
              </div>
            </div>

            {/* Session list */}
            <div className="flex-1 overflow-y-auto py-2">
              {sessions.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-neutral-600 gap-2">
                  <MessageSquare size={28}/>
                  <p className="text-xs">No chats yet</p>
                </div>
              )}
              {sessions.map(s => (
                <div
                  key={s.id}
                  onClick={() => switchSession(s)}
                  className={`group flex items-start gap-3 mx-2 px-3 py-3 rounded-xl cursor-pointer transition-all mb-1 ${
                    s.id === currentSession.id
                      ? "bg-pink-500/10 border border-pink-500/30"
                      : "hover:bg-[#1a1a1a] border border-transparent"
                  }`}
                >
                  <MessageSquare size={15} className={s.id === currentSession.id ? "text-pink-500 mt-0.5 shrink-0" : "text-neutral-600 mt-0.5 shrink-0"} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{s.title}</p>
                    <p className="text-[10px] text-neutral-500 mt-0.5">{relativeTime(s.updatedAt)} · {s.messages.length} messages</p>
                  </div>
                  <button
                    onClick={(e) => removeSession(s.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-neutral-600 hover:text-red-400 transition-all shrink-0"
                  >
                    <Trash2 size={13}/>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── MAIN CONTENT ─── */}
      <div className="flex flex-1 flex-col h-full min-w-0 relative z-10 overflow-hidden">

        {/* Top Header */}
        <header className="shrink-0 flex items-center justify-between px-3 py-2.5 bg-black/90 backdrop-blur-md border-b border-[#1e1e1e] z-20 gap-2">
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center shadow-lg">
              <Brain size={16} className="text-white" />
            </div>
            <h1 className="text-sm font-extrabold text-white flex items-center gap-1">
              AptGuru <Sparkles size={10} className="text-pink-500" />
            </h1>
          </div>

          {/* Mode pills */}
          <div className="flex-1 flex justify-center overflow-x-auto no-scrollbar px-1">
            <div className="flex gap-0.5 bg-[#111] p-1 rounded-xl border border-[#262626]">
              {(["Solve","Learn","Quiz","ELI10"] as LearningMode[]).map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap ${
                    mode === m
                      ? `bg-gradient-to-r ${modeColors[m]} text-white shadow-sm`
                      : "text-neutral-500 hover:text-white"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* History button */}
            <button
              onClick={() => setHistoryOpen(true)}
              className="p-2 bg-[#1a1a1a] text-neutral-400 hover:text-white rounded-xl border border-[#262626] transition-colors relative"
              title="Chat History"
            >
              <MessageSquare size={16}/>
              {sessions.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full text-[9px] text-white font-bold flex items-center justify-center">
                  {sessions.length > 9 ? "9+" : sessions.length}
                </span>
              )}
            </button>
            {/* New Chat */}
            <button
              onClick={startNewChat}
              className="p-2 bg-[#1a1a1a] text-neutral-400 hover:text-white rounded-xl border border-[#262626] transition-colors"
              title="New Chat"
            >
              <Plus size={16}/>
            </button>
            {/* Hamburger (stats sidebar, mobile only) */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 bg-[#1a1a1a] text-neutral-400 hover:text-white rounded-xl border border-[#262626] transition-colors"
            >
              <AlignLeft size={16}/>
            </button>
          </div>
        </header>

        {/* Chat Messages — takes all remaining space */}
        <div className="flex-1 min-h-0 flex flex-col relative w-full">
          <ChatArea
            messages={messages}
            isTyping={isTyping}
            onTopicSelect={topic => handleSendMessage(`Teach me everything about ${topic} step by step.`)}
          />
        </div>

        {/* Chat Input — pinned to bottom */}
        <div className="shrink-0 bg-black border-t border-[#1e1e1e] pb-1">
          <div className="w-full max-w-6xl mx-auto">
            <ChatInput onSendMessage={handleSendMessage} />
            <p className="text-center text-[9px] text-neutral-700 -mt-1 pb-1">
              AptGuru can make mistakes. Verify important answers.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
