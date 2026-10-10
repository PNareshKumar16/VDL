import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Layers, History, Sparkles, CheckCircle2, ShieldAlert, Cpu, Bug, RotateCcw } from 'lucide-react';
import { challengeService } from '../services/challengeService';
import { submissionService } from '../services/submissionService';
import CodeEditor from '../components/CodeEditor';
import ConsoleOutput from '../components/ConsoleOutput';
import AiHintModal from '../components/AiHintModal';
import SubmissionHistoryModal from '../components/SubmissionHistoryModal';

export default function Workspace() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [challenge, setChallenge] = useState(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);

  // Execution states
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);

  // Left panel active tab
  const [leftTab, setLeftTab] = useState('problem'); // 'problem', 'testcases'

  // Modals
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [hintsUsedCount, setHintsUsedCount] = useState(0);

  useEffect(() => {
    loadChallenge();
  }, [id]);

  const loadChallenge = async () => {
    setLoading(true);
    try {
      const data = await challengeService.getChallengeById(id);
      setChallenge(data);
      setCode(data.buggyCode);
    } catch (err) {
      console.error("Error loading challenge:", err);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleRunCode = async () => {
    setIsExecuting(true);
    try {
      const res = await submissionService.runCode(challenge.id, code);
      setExecutionResult(res);
    } catch (err) {
      console.error("Error running code:", err);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSubmitCode = async () => {
    setIsSubmitting(true);
    try {
      const res = await submissionService.submitCode(challenge.id, code, hintsUsedCount);
      setExecutionResult(res);
      if (res.status === 'PASSED') {
        setChallenge(prev => ({ ...prev, isSolved: true }));
      }
    } catch (err) {
      console.error("Error submitting code:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetCode = () => {
    if (challenge && challenge.buggyCode) {
      setCode(challenge.buggyCode);
      setExecutionResult(null);
    }
  };

  if (loading || !challenge) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-indigo-400 font-mono">
        Loading Virtual Workspace Sandbox...
      </div>
    );
  }

  const testCasesList = challenge.testCasesJson ? JSON.parse(challenge.testCasesJson) : [];

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-950 text-slate-100 overflow-hidden">
      
      {/* Top Workspace Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 shrink-0">
        
        <div className="flex items-center space-x-3">
          <Link
            to="/"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="h-4 w-[1px] bg-slate-800" />
          <div>
            <h2 className="text-sm font-bold text-white flex items-center space-x-2">
              <span>{challenge.title}</span>
              {challenge.isSolved && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              )}
            </h2>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsHistoryModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono font-medium text-slate-300 transition-colors border border-slate-700"
          >
            <History className="w-3.5 h-3.5 text-indigo-400" />
            <span>History</span>
          </button>
        </div>

      </div>

      {/* Main Split-Pane Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        
        {/* LEFT PANE (4 Cols): Problem Statement & Details */}
        <div className="lg:col-span-4 flex flex-col bg-slate-900/60 border-r border-slate-800 overflow-hidden">
          
          {/* Left Panel Tabs */}
          <div className="flex items-center border-b border-slate-800 bg-slate-950 px-3">
            <button
              onClick={() => setLeftTab('problem')}
              className={`flex items-center space-x-1.5 py-3 px-3 text-xs font-bold border-b-2 transition-colors ${
                leftTab === 'problem'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Problem Statement</span>
            </button>

            <button
              onClick={() => setLeftTab('testcases')}
              className={`flex items-center space-x-1.5 py-3 px-3 text-xs font-bold border-b-2 transition-colors ${
                leftTab === 'testcases'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Test Suite ({testCasesList.length})</span>
            </button>
          </div>

          {/* Left Panel Content */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            
            {leftTab === 'problem' && (
              <>
                {/* Meta Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 uppercase">
                    {challenge.language}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 uppercase">
                    {challenge.difficulty}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-purple-500/10 text-purple-300 border border-purple-500/30 uppercase">
                    {challenge.bugType} BUG
                  </span>
                </div>

                {/* Description Body */}
                <div className="space-y-3">
                  <h3 className="text-xs font-mono uppercase font-bold text-slate-400 tracking-wider">
                    Debug Scenario
                  </h3>
                  <div className="text-sm text-slate-300 leading-relaxed space-y-3">
                    <p>{challenge.description}</p>
                  </div>
                </div>

                {/* Expected Behavior */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="text-xs font-mono uppercase font-bold text-emerald-400">
                    Expected Output Requirement:
                  </h4>
                  <code className="block font-mono text-xs text-emerald-300 bg-slate-900 p-2 rounded border border-slate-800">
                    {challenge.expectedOutput}
                  </code>
                </div>

                {/* Socratic Mentor Tip */}
                <div className="p-4 bg-purple-950/30 border border-purple-900/40 rounded-xl space-y-2">
                  <div className="flex items-center space-x-2 text-purple-300 font-bold text-xs">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>Socratic Mentor Tip</span>
                  </div>
                  <p className="text-xs text-purple-200/80 leading-relaxed">
                    Stuck diagnosing runtime failures? Click <strong className="text-purple-300">"Ask AI Mentor"</strong> above the editor for step-by-step guided insights!
                  </p>
                </div>
              </>
            )}

            {leftTab === 'testcases' && (
              <div className="space-y-4">
                <h3 className="text-xs font-mono uppercase font-bold text-slate-400">
                  Automated Sandbox Test Cases
                </h3>
                {testCasesList.map((tc, idx) => (
                  <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs space-y-2">
                    <div className="font-bold text-indigo-300">{tc.name}</div>
                    <div className="text-slate-400">
                      <span className="text-slate-600 block text-[10px]">INPUT:</span>
                      <code>{tc.input}</code>
                    </div>
                    <div className="text-emerald-400">
                      <span className="text-slate-600 block text-[10px]">EXPECTED:</span>
                      <code>{tc.expectedOutput}</code>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

        {/* RIGHT PANE (8 Cols): Monaco Editor (Top) & Terminal Console (Bottom) */}
        <div className="lg:col-span-8 flex flex-col h-full bg-slate-950 overflow-hidden">
          
          {/* Top 60%: Code Editor */}
          <div className="h-[60%] p-2">
            <CodeEditor
              code={code}
              onChange={(val) => setCode(val || '')}
              language={challenge.language}
              onRun={handleRunCode}
              onSubmit={handleSubmitCode}
              onOpenAiHint={() => setIsAiModalOpen(true)}
              onReset={handleResetCode}
              isExecuting={isExecuting}
              isSubmitting={isSubmitting}
              pointsReward={challenge.pointsReward}
            />
          </div>

          {/* Bottom 40%: Console Terminal */}
          <div className="h-[40%] p-2 pt-0">
            <ConsoleOutput
              executionResult={executionResult}
              isExecuting={isExecuting || isSubmitting}
            />
          </div>

        </div>

      </div>

      {/* Socratic AI Hint Drawer Modal */}
      <AiHintModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        challengeId={challenge.id}
        currentCode={code}
        errorMessage={executionResult?.consoleOutput}
        onHintReceived={(level) => setHintsUsedCount(prev => prev + 1)}
      />

      {/* Submission History Modal */}
      <SubmissionHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        challengeId={challenge.id}
        onSelectSubmission={(pastCode) => setCode(pastCode)}
      />

    </div>
  );
}
