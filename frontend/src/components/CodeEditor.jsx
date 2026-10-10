import React from 'react';
import Editor from '@monaco-editor/react';
import { Code2, RotateCcw, Play, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';

export default function CodeEditor({
  code,
  onChange,
  language = 'java',
  onRun,
  onSubmit,
  onOpenAiHint,
  onReset,
  isExecuting,
  isSubmitting,
  pointsReward = 100
}) {
  const mapLanguage = (lang) => {
    if (!lang) return 'java';
    const l = lang.toLowerCase();
    if (l === 'c') return 'c';
    if (l === 'python') return 'python';
    return 'java';
  };

  const handleEditorWillMount = (monaco) => {
    monaco.editor.defineTheme('cyber-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6b7280', fontStyle: 'italic' },
        { token: 'keyword', foreground: '818cf8', fontStyle: 'bold' },
        { token: 'string', foreground: '34d399' },
        { token: 'number', foreground: 'fbbf24' },
        { token: 'type', foreground: '38bdf8' },
      ],
      colors: {
        'editor.background': '#0f172a',
        'editor.foreground': '#e2e8f0',
        'editor.lineHighlightBackground': '#1e293b80',
        'editorCursor.foreground': '#6366f1',
        'editorLineNumber.foreground': '#475569',
        'editorLineNumber.activeForeground': '#818cf8',
      }
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Editor Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/90 border-b border-slate-800 select-none">
        
        {/* Left: Language Indicator & Actions */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20">
            <Code2 className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-mono font-bold uppercase text-indigo-300">
              {language}
            </span>
          </div>

          <button
            onClick={onReset}
            title="Reset code to original buggy template"
            className="flex items-center space-x-1.5 px-2.5 py-1 text-xs font-medium text-gray-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Code</span>
          </button>
        </div>

        {/* Right: AI Hint & Run/Submit Action Buttons */}
        <div className="flex items-center space-x-2">
          
          {/* Ask AI Mentor Button */}
          <button
            onClick={onOpenAiHint}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-purple-200 bg-gradient-to-r from-purple-600/30 to-indigo-600/30 hover:from-purple-600/50 hover:to-indigo-600/50 border border-purple-500/40 rounded-lg shadow-glow transition-all ai-glow"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-300 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Ask AI Mentor</span>
          </button>

          {/* Run Tests Button */}
          <button
            onClick={onRun}
            disabled={isExecuting || isSubmitting}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold text-gray-200 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 rounded-lg border border-slate-700 transition-all"
          >
            {isExecuting ? (
              <Loader2 className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" />
            )}
            <span>Run Tests</span>
          </button>

          {/* Submit Solution Button */}
          <button
            onClick={onSubmit}
            disabled={isExecuting || isSubmitting}
            className="flex items-center space-x-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 rounded-lg shadow-glow-emerald border border-emerald-400/30 transition-all"
          >
            {isSubmitting ? (
              <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            )}
            <span>Submit Solution</span>
          </button>

        </div>
      </div>

      {/* Monaco Code Editor Canvas */}
      <div className="flex-1 w-full relative min-h-[350px]">
        <Editor
          height="100%"
          language={mapLanguage(language)}
          value={code}
          onChange={onChange}
          theme="cyber-dark"
          beforeMount={handleEditorWillMount}
          options={{
            fontSize: 14,
            fontFamily: '"JetBrains Mono", "Fira Code", monospace',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            lineNumbers: 'on',
            renderLineHighlight: 'all',
            padding: { top: 12, bottom: 12 },
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
          }}
          loading={
            <div className="flex items-center justify-center h-full bg-slate-950 text-indigo-400 space-x-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-mono">Initializing Monaco Editor...</span>
            </div>
          }
        />
      </div>
    </div>
  );
}
