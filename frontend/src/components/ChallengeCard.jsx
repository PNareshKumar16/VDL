import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Award, ArrowRight, CheckCircle2, ShieldAlert, Cpu, Bug, Zap, Layers } from 'lucide-react';

export default function ChallengeCard({ challenge }) {
  const { id, title, description, language, difficulty, bugType, pointsReward, isSolved } = challenge;

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'EASY':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'MEDIUM':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'HARD':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const getBugTypeIcon = (type) => {
    switch (type) {
      case 'CONCURRENCY':
        return <Cpu className="w-3.5 h-3.5 text-cyan-400" />;
      case 'OFF_BY_ONE':
        return <Layers className="w-3.5 h-3.5 text-amber-400" />;
      case 'NULL_REFERENCE':
        return <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />;
      case 'LOGICAL':
        return <Bug className="w-3.5 h-3.5 text-rose-400" />;
      default:
        return <Zap className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col justify-between relative group overflow-hidden">
      
      {/* Background Accent Glow on Hover */}
      <div className="absolute -right-12 -top-12 w-32 h-32 bg-indigo-600/10 rounded-full blur-2xl group-hover:bg-indigo-600/25 transition-all duration-300 pointer-events-none" />

      <div>
        {/* Card Header Tags */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 uppercase">
              {language}
            </span>
            <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold border uppercase ${getDifficultyColor(difficulty)}`}>
              {difficulty}
            </span>
          </div>

          {/* Points Pill */}
          <div className="flex items-center space-x-1 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold text-amber-300">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>+{pointsReward || 100} PTS</span>
          </div>
        </div>

        {/* Bug Category Pill */}
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 mb-3">
          {getBugTypeIcon(bugType)}
          <span>{bugType} BUG</span>
        </div>

        {/* Challenge Title */}
        <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1 mb-2">
          {title}
        </h3>

        {/* Description Summary */}
        <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed mb-6">
          {description}
        </p>
      </div>

      {/* Card Footer Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
        
        {isSolved ? (
          <span className="flex items-center space-x-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>SOLVED</span>
          </span>
        ) : (
          <span className="text-xs font-mono text-slate-500">
            Ready to debug
          </span>
        )}

        <Link
          to={`/workspace/${id}`}
          className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-glow transition-all group-hover:translate-x-0.5"
        >
          <span>{isSolved ? 'Review Code' : 'Start Debugging'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
}
