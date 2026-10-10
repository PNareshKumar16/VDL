import React, { useState } from 'react';
import { Terminal, CheckCircle2, XCircle, Clock, AlertTriangle, Cpu, Layers } from 'lucide-react';

export default function ConsoleOutput({ executionResult, isExecuting }) {
  const [activeTab, setActiveTab] = useState('console'); // 'console', 'testcases', 'errors'

  if (isExecuting) {
    return (
      <div className="h-full bg-slate-950 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 space-y-3">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
          <Cpu className="w-6 h-6 text-indigo-400 absolute inset-0 m-auto" />
        </div>
        <div className="text-sm font-mono text-indigo-300 animate-pulse">
          Compiling & Executing Code against Virtual Sandbox Test Suite...
        </div>
      </div>
    );
  }

  if (!executionResult) {
    return (
      <div className="h-full bg-slate-950 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center text-slate-500 space-y-2 select-none">
        <Terminal className="w-8 h-8 text-slate-700" />
        <div className="text-sm font-mono text-slate-400">
          Console Terminal Ready. Click <span className="text-indigo-400 font-semibold">"Run Tests"</span> to execute code.
        </div>
      </div>
    );
  }

  const { status, consoleOutput, executionTimeMs, testCasesTotal, testCasesPassed, testCaseResults } = executionResult;

  const isPassed = status === 'PASSED';
  const hasErrors = status === 'RUNTIME_ERROR' || status === 'COMPILATION_ERROR';

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      
      {/* Console Tab Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center space-x-1">
          
          <button
            onClick={() => setActiveTab('console')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-mono font-medium transition-colors ${
              activeTab === 'console'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            <span>Console Log</span>
          </button>

          <button
            onClick={() => setActiveTab('testcases')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-mono font-medium transition-colors ${
              activeTab === 'testcases'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Test Suite ({testCasesPassed || 0}/{testCasesTotal || 0})</span>
          </button>

          {hasErrors && (
            <button
              onClick={() => setActiveTab('errors')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-mono font-medium transition-colors ${
                activeTab === 'errors'
                  ? 'bg-rose-950/60 text-rose-300 border border-rose-800/50'
                  : 'text-rose-400 hover:text-rose-300'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Stack Trace</span>
            </button>
          )}

        </div>

        {/* Execution Metrics Pills */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 text-xs font-mono text-slate-400">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{executionTimeMs || 0} ms</span>
          </div>

          <div
            className={`flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
              isPassed
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
            }`}
          >
            {isPassed ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>PASSED</span>
              </>
            ) : (
              <>
                <XCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>{status}</span>
              </>
            )}
          </div>
        </div>

      </div>

      {/* Tab Contents */}
      <div className="flex-1 p-4 font-mono text-xs overflow-y-auto bg-slate-950">
        
        {/* TAB 1: CONSOLE OUTPUT */}
        {activeTab === 'console' && (
          <pre className="whitespace-pre-wrap text-slate-300 leading-relaxed">
            {consoleOutput}
          </pre>
        )}

        {/* TAB 2: TEST CASES GRID */}
        {activeTab === 'testcases' && (
          <div className="space-y-3">
            {testCaseResults && testCaseResults.map((tc, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border transition-all ${
                  tc.passed
                    ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-200'
                    : 'bg-rose-950/20 border-rose-900/40 text-rose-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold text-sm flex items-center space-x-2">
                    {tc.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400" />
                    )}
                    <span>{tc.name}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                    tc.passed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {tc.passed ? 'Passed' : 'Failed'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2 text-xs">
                  <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold mb-1">Input Data:</span>
                    <code className="text-slate-300">{tc.input || 'N/A'}</code>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                    <span className="text-emerald-500 block text-[10px] uppercase font-bold mb-1">Expected Output:</span>
                    <code className="text-emerald-300">{tc.expectedOutput}</code>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                    <span className="text-indigo-400 block text-[10px] uppercase font-bold mb-1">Actual Output:</span>
                    <code className={tc.passed ? 'text-emerald-300' : 'text-rose-300'}>
                      {tc.actualOutput || (tc.errorMessage || 'No output')}
                    </code>
                  </div>
                </div>

                {tc.errorMessage && (
                  <div className="mt-2 text-xs text-rose-400 bg-rose-950/40 p-2 rounded border border-rose-900/50">
                    <strong>Error:</strong> {tc.errorMessage}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: STACK TRACE */}
        {activeTab === 'errors' && (
          <div className="bg-rose-950/30 border border-rose-900/50 rounded-lg p-4 text-rose-300 font-mono text-xs whitespace-pre-wrap">
            <div className="flex items-center space-x-2 text-rose-400 font-bold mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Runtime Exception Stack Trace</span>
            </div>
            {consoleOutput}
          </div>
        )}

      </div>
    </div>
  );
}
