import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  LogOut, 
  Sun, 
  Moon, 
  Tag, 
  ShieldCheck, 
  ChevronDown,
  CheckCircle2
} from 'lucide-react';

export default function UserProfileDropdown({ onOpenTagManager }) {
  const { user, logout, darkMode, toggleDarkMode } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="relative inline-block text-left">
      
      {/* Avatar Icon Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 p-1 rounded-xl bg-[#f4efe6] hover:bg-[#e8decb] dark:bg-stone-950 dark:hover:bg-stone-800/80 border border-[#e6ded1] dark:border-stone-800 transition-all cursor-pointer shadow-sm group"
        title="User Options"
      >
        <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow-sm">
          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-stone-400 group-hover:text-stone-700 dark:group-hover:text-stone-200 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu Popup */}
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <div 
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40"
          />

          {/* Menu Card Container */}
          <div className="absolute right-0 top-full mt-2 w-64 bg-[#fffefb] dark:bg-stone-900 border border-[#e6ded1] dark:border-stone-800 p-3.5 rounded-2xl shadow-xl z-50 animate-fade-in space-y-3 transition-colors">
            
            {/* Header: User Profile Details */}
            <div className="p-3 bg-[#f8f4ec] dark:bg-stone-950 rounded-xl border border-[#e6ded1] dark:border-stone-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#eee6d8] dark:bg-indigo-950 border border-[#ddcfba] dark:border-indigo-500/40 flex items-center justify-center font-bold text-stone-800 dark:text-indigo-300 text-xs shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate leading-tight">{user.name}</p>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400 truncate mt-0.5">{user.email}</p>
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-[#e6ded1] dark:border-stone-800 flex items-center justify-between text-[10px]">
                <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active Session
                </span>
                <span className="font-mono text-stone-500 dark:text-stone-400 font-bold">JWT Verified</span>
              </div>
            </div>

            {/* Menu Items */}
            <div className="space-y-1">
              
              {/* Category & Tag Manager */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  if (onOpenTagManager) onOpenTagManager();
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-[#f4efe6] dark:hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <Tag className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>Manage Categories & Tags</span>
              </button>

              {/* Theme Switcher Toggle */}
              <button
                onClick={() => {
                  toggleDarkMode();
                }}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-[#f4efe6] dark:hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  {darkMode ? (
                    <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <Moon className="w-4 h-4 text-indigo-600 shrink-0" />
                  )}
                  <span>{darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}</span>
                </div>
                <span className="text-[10px] font-mono text-stone-500 bg-[#e8decb] dark:bg-stone-800 border border-[#ddcfba] dark:border-stone-700 px-1.5 py-0.5 rounded font-bold">
                  {darkMode ? 'Dark' : 'Light'}
                </span>
              </button>

            </div>

            {/* Sign Out Action */}
            <div className="pt-2 border-t border-[#e6ded1] dark:border-stone-800">
              <button
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>Sign Out of Account</span>
              </button>
            </div>

          </div>
        </>
      )}

    </div>
  );
}
