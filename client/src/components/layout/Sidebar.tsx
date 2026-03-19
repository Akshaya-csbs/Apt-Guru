import { Award, Brain, ChevronRight, Zap, Sparkles } from "lucide-react";

export default function Sidebar({ xp = 450, onAction }: { xp?: number, onAction?: (actionText: string) => void }) {
  let levelName = "Beginner";
  let levelNum = 1;
  let nextThreshold = 500;
  
  if (xp >= 2000) { levelName = "Master"; levelNum = 4; nextThreshold = 5000; }
  else if (xp >= 1000) { levelName = "Pro"; levelNum = 3; nextThreshold = 2000; }
  else if (xp >= 500) { levelName = "Intermediate"; levelNum = 2; nextThreshold = 1000; }
  else { levelName = "Beginner"; levelNum = 1; nextThreshold = 500; }

  const prevThreshold = levelNum === 1 ? 0 : levelNum === 2 ? 500 : levelNum === 3 ? 1000 : 2000;
  const progress = Math.max(0, Math.min(100, ((xp - prevThreshold) / (nextThreshold - prevThreshold)) * 100));

  return (
    <div className="w-80 h-[100dvh] bg-black border-r border-[#262626] flex flex-col hidden md:flex relative z-20 shadow-2xl">
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-1000 animate-pulse-soft pointer-events-none"></div>
      
      {/* Fixed Sticky Header */}
      <div className="px-6 pt-10 pb-6 flex items-center gap-3 z-30 bg-black border-b border-[#262626]/50">
        <div className="w-[3.25rem] h-[3.25rem] rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center shadow-lg relative shrink-0">
          <Brain size={28} className="text-white fill-none stroke-[2.5]" />
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-pink-500 border-[2.5px] border-black"></div>
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-1.5">
            AptGuru <Sparkles size={18} className="text-pink-500" />
          </h1>
          <p className="text-sm text-neutral-400 font-medium tracking-wide">AI Aptitude Tutor</p>
        </div>
      </div>

      {/* Independently Scrollable Body */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-6 pt-6 pb-6 relative z-10 w-full">
        <div className="absolute bottom-40 left-0 -ml-16 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-1000 pointer-events-none"></div>

      <div className="mb-8 p-4 bg-[#121212] rounded-2xl border border-[#262626] z-10 relative shadow-sm">
        <div className="absolute -top-3 -right-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#f09433] to-[#dc2743] border-2 border-black flex items-center justify-center text-white shadow-sm animate-float">
            <Award size={16} className="fill-white" />
          </div>
        </div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-bold text-white">Level {levelNum}: {levelName}</span>
          <span className="text-sm font-bold text-pink-500">{xp} <span className="text-xs text-neutral-500">/{nextThreshold} XP</span></span>
        </div>
        <div className="w-full bg-[#262626] rounded-full h-2.5 mb-2 overflow-hidden border border-black/50">
          <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-[#f09433] h-full rounded-full transition-all duration-1000 relative" style={{ width: `${progress}%` }}>
            <div className="absolute top-0 right-0 bottom-0 left-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[stripes_1s_linear_infinite]" />
          </div>
        </div>
        <p className="text-[11px] text-neutral-400 font-medium">{nextThreshold - xp} XP to unlock next badge</p>
      </div>

        <div className="space-y-6 z-10">
          <div>
            <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] mb-3 ml-1">Daily Challenges</h3>
            <ul className="space-y-3">
            <li onClick={() => onAction?.("Start daily challenge: Speed Math")} className="flex items-center p-3 rounded-xl bg-[#121212] border border-[#262626] hover:border-pink-500/40 hover:shadow-[0_4px_20px_rgba(236,72,153,0.15)] shadow-sm cursor-pointer transition-all duration-300 hover:-translate-y-1 group/item">
                <div className="w-9 h-9 rounded-lg bg-black text-pink-500 flex items-center justify-center mr-3 group-hover/item:text-pink-400 transition-colors">
                  <Zap size={18} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-white transition-colors group-hover/item:text-pink-100">Speed Math</h4>
                  <p className="text-[11px] text-neutral-400 font-medium mt-0.5">20/20 completed</p>
                </div>
                <div className="bg-pink-500/10 text-pink-500 text-[10px] font-bold px-2 py-1 rounded-md border border-pink-500/20">
                  DONE
                </div>
              </li>
              <li onClick={() => onAction?.("Start daily challenge: Logical Puzzles")} className="flex items-center p-3 rounded-xl bg-[#121212] border border-[#262626] hover:border-pink-500/40 hover:shadow-[0_4px_20px_rgba(236,72,153,0.15)] shadow-sm cursor-pointer transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group/item">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-pink-500/10 to-transparent rounded-bl-[2rem] -mr-4 -mt-4 transition-transform group-hover/item:scale-110"></div>
                <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#f09433] to-[#bc1888] text-white shadow-sm flex items-center justify-center mr-3 z-10">
                  <Brain size={18} />
                </div>
                <div className="flex-1 z-10">
                  <h4 className="text-sm font-bold text-white transition-colors group-hover/item:text-pink-100">Logical Puzzles</h4>
                  <p className="text-[11px] text-pink-400 font-semibold mt-0.5">2/5 Focus Time...</p>
                </div>
                <ChevronRight size={18} className="text-neutral-500 z-10 group-hover/item:text-pink-400 transition-colors" />
              </li>
            </ul>
          </div>

        {/* Timed Quiz Engine / Progress */}
        <div className="mt-8 relative hidden md:block group cursor-pointer transition-all duration-300 hover:-translate-y-1">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-60 transition duration-500"></div>
          <div className="relative p-4 bg-black border border-[#262626] group-hover:border-pink-500/40 rounded-2xl group-hover:shadow-[0_8px_30px_rgba(236,72,153,0.2)] transition-all">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-2 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
              </span>
              Live Quiz Engine
            </h3>
            <p className="text-[11px] text-neutral-400 mb-3 font-medium leading-relaxed group-hover:text-neutral-300 transition-colors">
              Test your Quantitative speed! 15 questions in 10 minutes. 
            </p>
            <button onClick={() => onAction?.("Start 10-minute Quantitative Mock Test")} className="w-full py-2 bg-[#121212] border border-[#262626] group-hover:bg-[#1a1a1a] group-hover:border-pink-500/50 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2">
              Start Mock Test 
              <span className="opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all font-normal">⏱️</span>
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
