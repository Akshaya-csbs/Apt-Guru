import { Award, Brain, ChevronRight, Zap, Sparkles, Plus, MessageSquare, Trash2 } from "lucide-react";
import { ChatSession } from "../../lib/chatHistory";

interface SidebarProps {
  xp?: number;
  onAction?: (actionText: string) => void;
  sessions?: ChatSession[];
  currentSessionId?: string;
  onNewChat?: () => void;
  onSwitchSession?: (session: ChatSession) => void;
  onDeleteSession?: (id: string, e: React.MouseEvent) => void;
}

export default function Sidebar({
  xp = 450,
  onAction,
  sessions = [],
  currentSessionId,
  onNewChat,
  onSwitchSession,
  onDeleteSession,
}: SidebarProps) {
  let levelName = "Beginner";
  let levelNum = 1;
  let nextThreshold = 500;

  if (xp >= 2000) { levelName = "Master"; levelNum = 4; nextThreshold = 5000; }
  else if (xp >= 1000) { levelName = "Pro"; levelNum = 3; nextThreshold = 2000; }
  else if (xp >= 500) { levelName = "Intermediate"; levelNum = 2; nextThreshold = 1000; }

  const prevThreshold = levelNum === 1 ? 0 : levelNum === 2 ? 500 : levelNum === 3 ? 1000 : 2000;
  const progress = Math.max(0, Math.min(100, ((xp - prevThreshold) / (nextThreshold - prevThreshold)) * 100));

  function relativeTime(ts: number) {
    const diff = Date.now() - ts;
    if (diff < 60000) return "just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return new Date(ts).toLocaleDateString();
  }

  return (
    <div className="w-72 h-[100dvh] bg-black border-r border-[#262626] flex flex-col hidden md:flex relative z-20 shadow-2xl">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl opacity-40" />

      {/* ── Header ── */}
      <div className="px-5 pt-8 pb-4 flex items-center gap-3 border-b border-[#1e1e1e] shrink-0">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center shadow-lg relative shrink-0">
          <Brain size={22} className="text-white" />
          <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-pink-500 border-2 border-black" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-1.5">
            AptGuru <Sparkles size={14} className="text-pink-500" />
          </h1>
          <p className="text-[11px] text-neutral-500 font-medium">AI Aptitude Tutor</p>
        </div>
      </div>

      {/* ── New Chat button ── */}
      <div className="px-4 pt-4 pb-2 shrink-0">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold hover:opacity-90 transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
        >
          <Plus size={16} /> New Chat
        </button>
      </div>

      {/* ── Chat History ── */}
      <div className="px-4 pt-1 pb-2 shrink-0">
        <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.18em] mb-2 ml-1">Chat History</p>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-3 space-y-1 pb-3">
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-neutral-600 gap-2">
            <MessageSquare size={24} />
            <p className="text-xs">No chats yet</p>
          </div>
        ) : (
          sessions.map(s => (
            <div
              key={s.id}
              onClick={() => onSwitchSession?.(s)}
              className={`group flex items-start gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                s.id === currentSessionId
                  ? "bg-purple-500/10 border border-purple-500/30"
                  : "hover:bg-[#141414] border border-transparent hover:border-[#2a2a2a]"
              }`}
            >
              <MessageSquare
                size={13}
                className={`mt-0.5 shrink-0 ${s.id === currentSessionId ? "text-purple-400" : "text-neutral-600"}`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{s.title}</p>
                <p className="text-[10px] text-neutral-500 mt-0.5">
                  {relativeTime(s.updatedAt)} · {s.messages.length} msg
                </p>
              </div>
              {onDeleteSession && (
                <button
                  onClick={e => onDeleteSession(s.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-neutral-600 hover:text-red-400 transition-all shrink-0"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
}
