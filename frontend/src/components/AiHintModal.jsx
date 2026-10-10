import React, { useState } from 'react';
import { Sparkles, HelpCircle, AlertCircle, Code, Lightbulb, X, Loader2, Award, Copy, Check } from 'lucide-react';
import { aiService } from '../services/aiService';

export default function AiHintModal({ isOpen, onClose, challengeId, currentCode, errorMessage, onHintReceived }) {
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [hintResponse, setHintResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleRequestHint = async (level) => {
    setSelectedLevel(level);
    setLoading(true);
    try {
      const res = await aiService.getSocraticHint(challengeId, currentCode, level, errorMessage);
      setHintResponse(res);
      if (onHintReceived) {
        onHintReceived(level);
      }
    } catch (err) {
      console.error("Failed to fetch AI hint:", err);
    } finally {
      setLoading(false);
    }
  };

  const copySnippet = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden glass-panel">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-purple-900/30">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400 ai-glow">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Socratic AI Mentor
                <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Interactive Guidance
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Multi-tier pedagogical debugging assistance designed to help you discover the fix yourself.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Level Selector Buttons */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-slate-400 mb-3">
              Select Socratic Hint Tier:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Level 1: Nudge */}
              <button
                onClick={() => handleRequestHint(1)}
                className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden group ${
                  selectedLevel === 1 && hintResponse
                    ? 'bg-indigo-950/40 border-indigo-500 shadow-glow'
                    : 'bg-slate-950/50 border-slate-800 hover:border-indigo-500/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono font-bold text-indigo-400">LEVEL 1</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    FREE (0 PTS)
                  </span>
                </div>
                <div className="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors">
                  Nudge Hint
                </div>
                <div className="text-[11px] text-slate-400 mt-1 leading-snug">
                  Points to the line or general logic section without revealing solution.
                </div>
              </button>

              {/* Level 2: Diagnostic */}
              <button
                onClick={() => handleRequestHint(2)}
                className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden group ${
                  selectedLevel === 2 && hintResponse
                    ? 'bg-amber-950/40 border-amber-500 shadow-glow'
                    : 'bg-slate-950/50 border-slate-800 hover:border-amber-500/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono font-bold text-amber-400">LEVEL 2</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                    -5 PTS
                  </span>
                </div>
                <div className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                  Diagnostic
                </div>
                <div className="text-[11px] text-slate-400 mt-1 leading-snug">
                  Explains conceptually why the failure or exception occurs.
                </div>
              </button>

              {/* Level 3: Actionable */}
              <button
                onClick={() => handleRequestHint(3)}
                className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden group ${
                  selectedLevel === 3 && hintResponse
                    ? 'bg-purple-950/40 border-purple-500 shadow-glow'
                    : 'bg-slate-950/50 border-slate-800 hover:border-purple-500/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono font-bold text-purple-400">LEVEL 3</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                    -10 PTS
                  </span>
                </div>
                <div className="font-bold text-sm text-white group-hover:text-purple-300 transition-colors">
                  Actionable Guard
                </div>
                <div className="text-[11px] text-slate-400 mt-1 leading-snug">
                  Suggests concrete guard pattern or syntax without giving full code.
                </div>
              </button>

            </div>
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="p-8 bg-slate-950/70 border border-purple-500/20 rounded-xl flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
              <div className="text-sm font-mono text-purple-300 animate-pulse">
                Analyzing submitted code AST & formulating Socratic insight...
              </div>
            </div>
          )}

          {/* Hint Result Card */}
          {!loading && hintResponse && (
            <div className="p-5 bg-slate-950 border border-purple-500/30 rounded-xl space-y-4 shadow-xl">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-amber-400" />
                  <span className="font-bold text-base text-white">
                    {hintResponse.title}
                  </span>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-purple-900/40 text-purple-300 border border-purple-700/50">
                  {hintResponse.hintLevelName}
                </span>
              </div>

              {/* Socratic Hint Body Text */}
              <div className="text-sm text-slate-200 leading-relaxed space-y-2">
                <p>{hintResponse.hintText}</p>
              </div>

              {/* Pedagogical Learning Goal */}
              {hintResponse.pedagogicalGoal && (
                <div className="p-3 bg-indigo-950/30 border border-indigo-800/40 rounded-lg text-xs text-indigo-300 flex items-start space-x-2">
                  <Award className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">Learning Goal:</strong> {hintResponse.pedagogicalGoal}
                  </div>
                </div>
              )}

              {/* Code Guard Snippet (for Level 3) */}
              {hintResponse.codeSnippet && (
                <div className="relative bg-slate-900 rounded-lg p-3 border border-slate-800 font-mono text-xs text-purple-200 overflow-x-auto">
                  <div className="flex items-center justify-between mb-1 text-[10px] text-slate-500 font-bold uppercase">
                    <span>Suggested Guard Pattern:</span>
                    <button
                      onClick={() => copySnippet(hintResponse.codeSnippet)}
                      className="flex items-center space-x-1 text-purple-400 hover:text-purple-300"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Copied!' : 'Copy Snippet'}</span>
                    </button>
                  </div>
                  <pre className="text-emerald-400">{hintResponse.codeSnippet}</pre>
                </div>
              )}

            </div>
          )}

          {!hintResponse && !loading && (
            <div className="p-8 text-center text-slate-500 bg-slate-950/40 border border-slate-800/50 rounded-xl">
              Select a hint level above to receive personalized Socratic guidance from the AI Mentor.
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
