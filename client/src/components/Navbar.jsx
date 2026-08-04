import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckSquare, Moon, Sun, LogOut, User, Tag } from 'lucide-react';

export default function Navbar({ onOpenAuth, onOpenTagManager }) {
  const { user, logout, darkMode, toggleDarkMode } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/90 border-b border-slate-800 backdrop-blur-md mb-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <CheckSquare className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-base text-slate-100 leading-tight">
              TaskPulse
            </h1>
          </div>
        </div>

        {/* Controls & Profile */}
        <div className="flex items-center gap-2.5">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors cursor-pointer text-slate-400 hover:text-slate-200"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-slate-300" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {user ? (
            <>
              {/* Tag Manager Button */}
              <button
                onClick={onOpenTagManager}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors cursor-pointer text-slate-300"
              >
                <Tag className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Tags</span>
              </button>

              {/* User Avatar & Logout */}
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-indigo-950 border border-indigo-500/40 flex items-center justify-center font-semibold text-indigo-300 text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-medium text-slate-300 hidden md:inline">{user.name}</span>
                </div>

                <button
                  onClick={logout}
                  className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              Sign In
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
