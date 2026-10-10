import React, { useState, useEffect } from 'react';
import { History, X, CheckCircle2, XCircle, Clock, Code, Sparkles, Loader2 } from 'lucide-react';
import { submissionService } from '../services/submissionService';

export default function SubmissionHistoryModal({ isOpen, onClose, challengeId, onSelectSubmission }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && challengeId) {
      setLoading(true);
      submissionService.getChallengeSubmissions(challengeId)
        .then(res => setSubmissions(res))
        .catch(err => console.error("Error fetching submission history:", err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, challengeId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden glass-panel">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Submission History</h3>
              <p className="text-xs text-slate-400">Past evaluation runs for this challenge</p>
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
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-3 font-mono text-xs">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-2 text-indigo-400">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Loading submissions history...</span>
            </div>
          ) : submissions.length === 0 ? (
            <div className="py-12 text-center text-slate-500 bg-slate-950/40 rounded-xl border border-slate-800/50">
              No submissions recorded yet for this challenge.
            </div>
          ) : (
            submissions.map((sub, idx) => {
              const isPassed = sub.status === 'PASSED';
              return (
                <div
                  key={sub.id || idx}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                    isPassed
                      ? 'bg-emerald-950/20 border-emerald-900/40'
                      : 'bg-slate-950/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {isPassed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`font-bold ${isPassed ? 'text-emerald-300' : 'text-rose-400'}`}>
                          {sub.status}
                        </span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400 text-[11px]">
                          {sub.submittedAt ? new Date(sub.submittedAt).toLocaleString() : 'Recent'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 mt-1 text-[11px] text-slate-400">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{sub.executionTimeMs} ms</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Sparkles className="w-3 h-3 text-purple-400" />
                          <span>{sub.hintsUsedCount} Hints</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (onSelectSubmission) onSelectSubmission(sub.submittedCode);
                      onClose();
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors border border-slate-700"
                  >
                    <Code className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Load Code</span>
                  </button>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
