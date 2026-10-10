import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Terminal, Lock, User, ArrowRight, Sparkles, Loader2, KeyRound } from 'lucide-react';
import { authService } from '../services/authService';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await authService.login(username, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoUsername, demoPass) => {
    setLoading(true);
    setError(null);
    try {
      await authService.login(demoUsername, demoPass);
      navigate('/');
    } catch (err) {
      setError('Demo login failed. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 relative overflow-hidden">
      
      {/* Background Neon Grid Glow */}
      <div className="absolute w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -top-48 -left-48" />
      <div className="absolute w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none -bottom-32 -right-32" />

      <div className="w-full max-w-md">
        
        {/* Logo Brand Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 p-0.5 shadow-glow mb-4">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Terminal className="w-7 h-7 text-indigo-400" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Sign In to <span className="gradient-text">Virtual Debugging Lab</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Enter your credentials to access the interactive sandbox
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-panel p-8 rounded-2xl border border-slate-800 shadow-2xl space-y-6">
          
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl text-xs font-mono">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1.5 font-mono">Username</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="e.g. student"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:border-indigo-500 outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1.5 font-mono">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:border-indigo-500 outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-glow transition-all flex items-center justify-center space-x-2 text-xs"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
              <span>Sign In to Sandbox</span>
            </button>
          </form>

          {/* Quick Demo Login Divider */}
          <div className="relative border-t border-slate-800 my-6">
            <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 px-3 bg-slate-900 text-[10px] font-mono font-bold uppercase text-slate-500">
              Quick Demo Login
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <button
              type="button"
              onClick={() => handleDemoLogin('student', 'password123')}
              disabled={loading}
              className="py-2.5 px-3 bg-slate-950 hover:bg-slate-900 border border-indigo-500/30 text-indigo-300 rounded-xl font-mono font-semibold transition-all hover:border-indigo-500 flex items-center justify-center space-x-1"
            >
              <span>Demo Student</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('admin', 'admin123')}
              disabled={loading}
              className="py-2.5 px-3 bg-slate-950 hover:bg-slate-900 border border-amber-500/30 text-amber-300 rounded-xl font-mono font-semibold transition-all hover:border-amber-500 flex items-center justify-center space-x-1"
            >
              <span>Demo Admin</span>
            </button>
          </div>

        </div>

        {/* Footer Link */}
        <div className="text-center mt-6 text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-400 font-bold hover:underline">
            Register here
          </Link>
        </div>

      </div>
    </div>
  );
}
