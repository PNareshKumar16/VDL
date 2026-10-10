import React, { useState, useEffect } from 'react';
import { Search, Filter, Terminal, Sparkles, RefreshCw, Layers, ShieldCheck, Flame } from 'lucide-react';
import { challengeService } from '../services/challengeService';
import { submissionService } from '../services/submissionService';
import { authService } from '../services/authService';
import ChallengeCard from '../components/ChallengeCard';
import StatsOverview from '../components/StatsOverview';

export default function Dashboard() {
  const [challenges, setChallenges] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(authService.getStoredUser());

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedBugType, setSelectedBugType] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (selectedLanguage) filters.language = selectedLanguage;
      if (selectedDifficulty) filters.difficulty = selectedDifficulty;
      if (selectedBugType) filters.bugType = selectedBugType;

      const data = await challengeService.getChallenges(filters);
      setChallenges(data);

      if (authService.getToken()) {
        try {
          const subs = await submissionService.getUserSubmissions();
          setSubmissions(subs);
        } catch {
          // ignore submission error if guest
        }
      }
    } catch (err) {
      console.error("Failed to load challenges:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedLanguage, selectedDifficulty, selectedBugType]);

  const filteredChallenges = challenges.filter(c => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.bugType.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      
      {/* Hero Header */}
      <div className="relative border-b border-slate-800/80 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono mb-4 shadow-glow">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>INTERACTIVE SOCRATIC CODE LAB</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Master Software Debugging through <span className="gradient-text">Interactive Fault Injection</span>
          </h1>

          <p className="max-w-3xl text-slate-400 text-base sm:text-lg leading-relaxed">
            Select a broken codebase across Concurrency, Off-by-One, Memory Leaks, or Null References. Test your fixes in the virtual sandbox and consult the Socratic AI Mentor for 3-tier guided hints.
          </p>
        </div>

        {/* Decorative Grid Glow Background */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Top Stats Overview */}
        <StatsOverview challenges={challenges} user={user} submissions={submissions} />

        {/* Search & Filtering Bar */}
        <div className="glass-panel p-4 rounded-2xl mb-8 flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-800">
          
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search challenges by title, bug domain..."
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:border-indigo-500 outline-none transition-colors"
            />
          </div>

          {/* Filter Selectors */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-start md:justify-end">
            
            {/* Language Filter */}
            <select
              value={selectedLanguage}
              onChange={e => setSelectedLanguage(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:border-indigo-500 outline-none"
            >
              <option value="">All Languages</option>
              <option value="JAVA">Java</option>
              <option value="PYTHON">Python</option>
              <option value="C">C</option>
            </select>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={e => setSelectedDifficulty(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:border-indigo-500 outline-none"
            >
              <option value="">All Difficulties</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>

            {/* Bug Type Filter */}
            <select
              value={selectedBugType}
              onChange={e => setSelectedBugType(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:border-indigo-500 outline-none"
            >
              <option value="">All Bug Types</option>
              <option value="LOGICAL">Logical</option>
              <option value="CONCURRENCY">Concurrency</option>
              <option value="OFF_BY_ONE">Off-by-One</option>
              <option value="NULL_REFERENCE">Null Reference</option>
              <option value="RUNTIME">Runtime Exception</option>
            </select>

            {/* Refresh Button */}
            <button
              onClick={fetchDashboardData}
              title="Refresh Challenges"
              className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

          </div>
        </div>

        {/* Challenge Cards Grid */}
        {loading ? (
          <div className="py-24 text-center text-indigo-400 flex flex-col items-center space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin" />
            <span className="font-mono text-sm">Fetching Sandbox Challenges...</span>
          </div>
        ) : filteredChallenges.length === 0 ? (
          <div className="py-20 text-center text-slate-500 bg-slate-900/40 border border-slate-800/60 rounded-2xl">
            No debugging challenges found matching your filter criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChallenges.map(challenge => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
