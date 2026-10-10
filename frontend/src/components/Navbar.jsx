import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Terminal, Award, Sparkles, User as UserIcon, LogOut, ShieldAlert, Code2, PlusCircle, CheckCircle } from 'lucide-react';
import { authService } from '../services/authService';

export default function Navbar({ onOpenAdminModal }) {
  const [user, setUser] = useState(authService.getStoredUser());
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleAuthChange = () => {
      setUser(authService.getStoredUser());
    };
    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 w-full glass-panel border-b border-gray-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 p-0.5 shadow-glow group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Terminal className="w-5 h-5 text-indigo-400 group-hover:text-cyan-400 transition-colors" />
              </div>
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                VIRTUAL DEBUGGING <span className="gradient-text font-black">LAB</span>
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 block -mt-1">
                Socratic AI Sandbox
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/' 
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              Challenges
            </Link>

            {user && user.role === 'ADMIN' && (
              <button
                onClick={onOpenAdminModal}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-all"
              >
                <PlusCircle className="w-4 h-4 text-amber-400" />
                <span>Add Challenge</span>
              </button>
            )}
          </div>

          {/* Right Section: User Info & Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                
                {/* Points Pill */}
                <div className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/30 px-3 py-1.5 rounded-full shadow-inner">
                  <Award className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-amber-300">
                    {user.points || 0} PTS
                  </span>
                </div>

                {/* User Role Badge */}
                <div className="flex items-center space-x-2 bg-slate-900 border border-gray-800 px-3 py-1.5 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-indigo-600/30 flex items-center justify-center text-xs font-bold text-indigo-300">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-semibold text-gray-200 leading-none">
                      {user.username}
                    </div>
                    <div className="text-[9px] font-mono uppercase text-indigo-400 mt-0.5">
                      {user.role}
                    </div>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-glow transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
