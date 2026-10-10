import React, { useState } from 'react';
import { PlusCircle, X, Code2, Bug, Award, FileText, CheckCircle2, Loader2 } from 'lucide-react';
import { challengeService } from '../services/challengeService';

export default function AdminChallengeModal({ isOpen, onClose, onChallengeCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    language: 'JAVA',
    difficulty: 'MEDIUM',
    bugType: 'LOGICAL',
    buggyCode: 'public class DebugTarget {\n    public static void main(String[] args) {\n        // Enter buggy code here\n    }\n}',
    solutionCode: 'public class DebugTarget {\n    public static void main(String[] args) {\n        // Enter fixed solution code here\n    }\n}',
    expectedOutput: 'Expected Result',
    pointsReward: 100,
    testCasesJson: JSON.stringify([
      { name: 'Standard Case', input: 'Input Data', expectedOutput: 'Expected Result' }
    ], null, 2)
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await challengeService.createChallenge(formData);
      if (onChallengeCreated) onChallengeCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create challenge.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden glass-panel">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-amber-900/30">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-600/20 border border-amber-500/30 text-amber-400">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Admin Challenge Creator</h3>
              <p className="text-xs text-slate-400">Author a new debugging challenge for students</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 max-h-[80vh] overflow-y-auto space-y-4 text-xs">
          
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Challenge Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:border-amber-500 outline-none"
                placeholder="e.g. Memory Leak in ThreadPool Executor"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Points Reward</label>
              <input
                type="number"
                required
                value={formData.pointsReward}
                onChange={e => setFormData({ ...formData, pointsReward: parseInt(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:border-amber-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Programming Language</label>
              <select
                value={formData.language}
                onChange={e => setFormData({ ...formData, language: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:border-amber-500 outline-none"
              >
                <option value="JAVA">JAVA</option>
                <option value="PYTHON">PYTHON</option>
                <option value="C">C</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Difficulty Level</label>
              <select
                value={formData.difficulty}
                onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:border-amber-500 outline-none"
              >
                <option value="EASY">EASY</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HARD">HARD</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Bug Category</label>
              <select
                value={formData.bugType}
                onChange={e => setFormData({ ...formData, bugType: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:border-amber-500 outline-none"
              >
                <option value="LOGICAL">LOGICAL</option>
                <option value="CONCURRENCY">CONCURRENCY</option>
                <option value="RUNTIME">RUNTIME</option>
                <option value="SYNTAX">SYNTAX</option>
                <option value="MEMORY_LEAK">MEMORY_LEAK</option>
                <option value="NULL_REFERENCE">NULL_REFERENCE</option>
                <option value="OFF_BY_ONE">OFF_BY_ONE</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Description & Problem Statement</label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:border-amber-500 outline-none"
              placeholder="Explain the buggy behavior, symptoms, and requirements..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-rose-400 font-bold mb-1">Buggy Code Template (Student View)</label>
              <textarea
                rows={6}
                required
                value={formData.buggyCode}
                onChange={e => setFormData({ ...formData, buggyCode: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 font-mono rounded-lg p-2.5 text-rose-200 focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-emerald-400 font-bold mb-1">Solution Code (Hidden from Students)</label>
              <textarea
                rows={6}
                required
                value={formData.solutionCode}
                onChange={e => setFormData({ ...formData, solutionCode: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 font-mono rounded-lg p-2.5 text-emerald-200 focus:border-amber-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Expected Output String</label>
            <input
              type="text"
              required
              value={formData.expectedOutput}
              onChange={e => setFormData({ ...formData, expectedOutput: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:border-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Test Cases JSON</label>
            <textarea
              rows={4}
              required
              value={formData.testCasesJson}
              onChange={e => setFormData({ ...formData, testCasesJson: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 font-mono rounded-lg p-2.5 text-cyan-300 focus:border-amber-500 outline-none"
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold flex items-center space-x-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>Save Challenge</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
