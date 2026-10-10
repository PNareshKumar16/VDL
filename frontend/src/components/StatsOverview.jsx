import React from 'react';
import { Award, CheckCircle2, Flame, Sparkles, Terminal } from 'lucide-react';

export default function StatsOverview({ challenges = [], user = null, submissions = [] }) {
  const solvedCount = challenges.filter(c => c.isSolved).length;
  const totalCount = challenges.length;
  const points = user ? user.points : 0;
  
  // Calculate hints used
  const hintsCount = submissions.reduce((acc, sub) => acc + (sub.hintsUsedCount || 0), 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      
      {/* Stat 1: Challenges Solved */}
      <div className="glass-card rounded-2xl p-5 border border-indigo-500/20 flex items-center justify-between">
        <div>
          <span className="text-xs font-mono font-bold uppercase text-slate-400">Solved Ratio</span>
          <div className="text-2xl font-black text-white mt-1">
            {solvedCount} <span className="text-sm font-normal text-slate-500">/ {totalCount}</span>
          </div>
          <div className="text-[11px] text-indigo-400 mt-1 font-medium">
            {totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0}% Sandbox Completion
          </div>
        </div>
        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-glow">
          <CheckCircle2 className="w-6 h-6" />
        </div>
      </div>

      {/* Stat 2: Total Points */}
      <div className="glass-card rounded-2xl p-5 border border-amber-500/20 flex items-center justify-between">
        <div>
          <span className="text-xs font-mono font-bold uppercase text-slate-400">Total Score</span>
          <div className="text-2xl font-black text-amber-300 mt-1">
            {points} <span className="text-xs font-bold text-amber-400">PTS</span>
          </div>
          <div className="text-[11px] text-amber-400/80 mt-1 font-medium">
            Rank: Level {Math.floor(points / 100) + 1} Debugger
          </div>
        </div>
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <Award className="w-6 h-6 animate-pulse" />
        </div>
      </div>

      {/* Stat 3: Streak */}
      <div className="glass-card rounded-2xl p-5 border border-rose-500/20 flex items-center justify-between">
        <div>
          <span className="text-xs font-mono font-bold uppercase text-slate-400">Debugging Streak</span>
          <div className="text-2xl font-black text-rose-300 mt-1">
            {solvedCount > 0 ? '3 Days' : '0 Days'}
          </div>
          <div className="text-[11px] text-rose-400/80 mt-1 font-medium">
            Keep debugging daily!
          </div>
        </div>
        <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
          <Flame className="w-6 h-6" />
        </div>
      </div>

      {/* Stat 4: AI Hints Consumed */}
      <div className="glass-card rounded-2xl p-5 border border-purple-500/20 flex items-center justify-between">
        <div>
          <span className="text-xs font-mono font-bold uppercase text-slate-400">AI Hints Used</span>
          <div className="text-2xl font-black text-purple-300 mt-1">
            {hintsCount} <span className="text-xs font-normal text-slate-500">Hints</span>
          </div>
          <div className="text-[11px] text-purple-400/80 mt-1 font-medium">
            Socratic Guidance
          </div>
        </div>
        <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 ai-glow">
          <Sparkles className="w-6 h-6" />
        </div>
      </div>

    </div>
  );
}
