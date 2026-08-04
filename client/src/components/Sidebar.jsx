import React from 'react';
import { useAuth } from '../context/AuthContext';
import BrandLogo from './BrandLogo';
import { 
  Feather, 
  Inbox, 
  Sun, 
  Clock, 
  AlertCircle, 
  Plus, 
  LogOut, 
  Moon, 
  CheckCircle2,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

export default function Sidebar({
  filters,
  setFilters,
  tags,
  taskCounts,
  onOpenTagManager,
  onOpenNewTask,
  isOpenMobile,
  setIsOpenMobile,
  isCollapsed
}) {
  const { user, logout, darkMode, toggleDarkMode } = useAuth();

  if (!user) return null;

  const navItems = [
    { id: 'all', label: 'All Tasks', icon: Inbox, count: taskCounts.all || 0 },
    { id: 'pending', label: 'In Progress', icon: Clock, count: taskCounts.pending || 0 },
    { id: 'due_today', label: 'Due Today', icon: Sun, count: taskCounts.dueToday || 0 },
    { id: 'overdue', label: 'Overdue', icon: AlertCircle, count: taskCounts.overdue || 0 },
    { id: 'completed', label: 'Completed', icon: CheckCircle2, count: taskCounts.completed || 0 },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={() => setIsOpenMobile(false)}
          className="fixed inset-0 z-40 bg-stone-950/80 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Compact SaaS Sidebar Container - w-56 (224px) */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-56 bg-[#fffefb] dark:bg-stone-900 border-r border-[#e6ded1] dark:border-stone-800 flex flex-col transition-transform duration-300 ease-in-out ${
        isCollapsed ? '-translate-x-full md:-translate-x-full' : 'translate-x-0'
      } ${
        isOpenMobile ? 'translate-x-0' : ''
      }`}>
        
        {/* Main Brand Header */}
        <div className="h-14 px-3.5 border-b border-[#e6ded1] dark:border-stone-800 flex items-center justify-between shrink-0">
          <BrandLogo size="md" />
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-5">
          
          {/* Main Navigation */}
          <div>
            <p className="px-2 mb-1.5 text-[9px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
              Views
            </p>
            <nav className="space-y-0.5">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = filters.status === item.id && !filters.tagId;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setFilters(prev => ({ ...prev, status: item.id, tagId: '' }));
                      if (setIsOpenMobile) setIsOpenMobile(false);
                    }}
                    className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#f2ece1] dark:bg-indigo-600/20 text-stone-900 dark:text-indigo-300 border border-[#e2d7c5] dark:border-indigo-500/30 font-semibold'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-slate-200 hover:bg-[#f8f4ec] dark:hover:bg-stone-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-stone-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    <span className={`text-[11px] font-bold font-mono transition-colors shrink-0 ${
                      isActive 
                        ? 'text-stone-900 dark:text-indigo-300' 
                        : item.id === 'overdue' && item.count > 0
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-stone-500 dark:text-stone-400'
                    }`}>
                      {item.count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tags & Categories Section */}
          <div>
            <div className="flex items-center justify-between px-2 mb-1.5">
              <p className="text-[9px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                Categories & Tags
              </p>
              <button
                onClick={onOpenTagManager}
                className="text-stone-500 hover:text-indigo-600 dark:text-stone-400 dark:hover:text-indigo-400 text-[10px] flex items-center gap-0.5 font-medium cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>New</span>
              </button>
            </div>

            <nav className="space-y-0.5">
              {tags.map(t => {
                const isActive = filters.tagId === String(t.id);
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setFilters(prev => ({ ...prev, tagId: String(t.id) }));
                      if (setIsOpenMobile) setIsOpenMobile(false);
                    }}
                    className={`group w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#f2ece1] dark:bg-stone-800 text-stone-900 dark:text-stone-100 border border-[#e2d7c5] dark:border-stone-700 font-semibold shadow-sm'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-slate-100 hover:bg-[#f3ede2] dark:hover:bg-stone-800/60 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span 
                        className="w-2 h-2 rounded-full shrink-0 transition-transform group-hover:scale-125" 
                        style={{ backgroundColor: t.color }} 
                      />
                      <span className="truncate group-hover:translate-x-0.5 transition-transform font-medium text-xs">#{t.name}</span>
                    </div>

                    <div className="flex items-center text-slate-400 dark:text-stone-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors shrink-0">
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200" />
                      <ChevronRight className="w-3 h-3 group-hover:hidden" />
                    </div>
                  </button>
                );
              })}
              {tags.length === 0 && (
                <p className="px-2 text-[11px] text-stone-400 dark:text-stone-500 italic">No custom tags yet.</p>
              )}
            </nav>
          </div>

        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-[#e6ded1] dark:border-stone-800 bg-[#f8f4ec] dark:bg-stone-900/50 space-y-2.5 shrink-0">
          
          {/* Centered Create Task Button */}
          <button
            onClick={onOpenNewTask}
            className="w-full h-9 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-xs shadow-sm flex items-center justify-center text-center gap-1.5 cursor-pointer transition-all hover:scale-[1.01]"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span className="text-center font-bold leading-none">New Task</span>
          </button>

          {/* User Profile & Quick Settings Row */}
          <div className="pt-2 border-t border-[#e6ded1]/80 dark:border-stone-800 flex items-center justify-between gap-2">
            
            {/* User Info (Avatar + Name + Email) */}
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="w-7 h-7 rounded-full bg-[#eee6d8] dark:bg-indigo-950 border border-[#ddcfba] dark:border-indigo-500/40 flex items-center justify-center font-bold text-stone-800 dark:text-indigo-300 text-xs shrink-0 shadow-xs">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-stone-900 dark:text-stone-200 truncate leading-snug">{user.name}</p>
                <p className="text-[10px] text-stone-500 dark:text-stone-400 truncate leading-none">{user.email}</p>
              </div>
            </div>

            {/* Quick Action Icons */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={toggleDarkMode}
                className="p-1.5 text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-[#e8decb] dark:hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
                title="Toggle Light/Dark Theme"
              >
                {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-600" />}
              </button>
              <button
                onClick={logout}
                className="p-1.5 text-stone-500 hover:text-red-600 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-[#e8decb] dark:hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </aside>
    </>
  );
}
