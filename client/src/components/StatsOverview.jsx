import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, Layers, ArrowUpRight } from 'lucide-react';

export default function StatsOverview({ tasks, onFilterClick }) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.is_complete).length;
  const pending = tasks.filter(t => !t.is_complete).length;
  
  const todayStr = new Date().toISOString().split('T')[0];
  const overdue = tasks.filter(t => !t.is_complete && t.due_date && t.due_date < todayStr).length;

  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* 1. Total Tasks Card */}
      <div 
        onClick={() => onFilterClick && onFilterClick('all')}
        className="group bg-[#fffdfa] dark:bg-stone-900 border border-[#e6ded1] dark:border-stone-800 rounded-2xl p-4 hover:border-indigo-500/40 cursor-pointer transition-all duration-300 relative overflow-hidden shadow-sm"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Total Tasks
          </span>
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Layers className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline justify-between">
          <p className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">{total}</p>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 flex items-center gap-1">
            <span>Workspace</span>
            <ArrowUpRight className="w-3 h-3 text-indigo-500" />
          </span>
        </div>

        <div className="w-full h-1 bg-[#f4efe6] dark:bg-stone-800 rounded-full mt-3 overflow-hidden">
          <div className="h-full bg-indigo-500 rounded-full" style={{ width: '100%' }} />
        </div>
      </div>

      {/* 2. In Progress Card */}
      <div 
        onClick={() => onFilterClick && onFilterClick('pending')}
        className="group bg-[#fffdfa] dark:bg-stone-900 border border-[#e6ded1] dark:border-stone-800 rounded-2xl p-4 hover:border-indigo-500/40 cursor-pointer transition-all duration-300 relative overflow-hidden shadow-sm"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            In Progress
          </span>
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline justify-between">
          <p className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">{pending}</p>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
            Active Focus
          </span>
        </div>

        <div className="w-full h-1 bg-[#f4efe6] dark:bg-stone-800 rounded-full mt-3 overflow-hidden">
          <div 
            className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
            style={{ width: `${total > 0 ? (pending / total) * 100 : 0}%` }} 
          />
        </div>
      </div>

      {/* 3. Completed Card */}
      <div 
        onClick={() => onFilterClick && onFilterClick('completed')}
        className="group bg-[#fffdfa] dark:bg-stone-900 border border-[#e6ded1] dark:border-stone-800 rounded-2xl p-4 hover:border-indigo-500/40 cursor-pointer transition-all duration-300 relative overflow-hidden shadow-sm"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Completed
          </span>
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline justify-between">
          <p className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">{completed}</p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
            {percent}% Done
          </span>
        </div>

        <div className="w-full h-1 bg-[#f4efe6] dark:bg-stone-800 rounded-full mt-3 overflow-hidden">
          <div 
            className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
            style={{ width: `${percent}%` }} 
          />
        </div>
      </div>

      {/* 4. Overdue Card */}
      <div 
        onClick={() => onFilterClick && onFilterClick('overdue')}
        className="group bg-[#fffdfa] dark:bg-stone-900 border border-[#e6ded1] dark:border-stone-800 rounded-2xl p-4 hover:border-indigo-500/40 cursor-pointer transition-all duration-300 relative overflow-hidden shadow-sm"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Overdue Deadlines
          </span>
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline justify-between">
          <p className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">{overdue}</p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
            {overdue > 0 ? 'Action Needed' : 'All Clear'}
          </span>
        </div>

        <div className="w-full h-1 bg-[#f4efe6] dark:bg-stone-800 rounded-full mt-3 overflow-hidden">
          <div 
            className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
            style={{ width: overdue > 0 ? '100%' : '0%' }} 
          />
        </div>
      </div>

    </div>
  );
}
