import React, { useState } from 'react';
import { Plus, Check, Trash2, Sparkles, Play } from 'lucide-react';

export default function InteractiveSandbox() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Review Q3 Archival Product Specs', priority: 'high', complete: true },
    { id: 2, title: 'Migrate Database Schema to SQLite Indexes', priority: 'urgent', complete: false },
    { id: 3, title: 'Design Pen & Paper Editorial Layout', priority: 'medium', complete: false },
  ]);
  const [newTitle, setNewTitle] = useState('');
  const [priority, setPriority] = useState('medium');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setTasks([
      { id: Date.now(), title: newTitle.trim(), priority, complete: false },
      ...tasks
    ]);
    setNewTitle('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, complete: !t.complete } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const priorityColors = {
    urgent: 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-red-200 dark:border-red-500/30',
    high: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30',
    medium: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30',
    low: 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-[#fffdfa] dark:bg-stone-900 border-2 border-[#e2d7c3] dark:border-stone-800 rounded-2xl shadow-xl overflow-hidden text-left transition-colors">
      
      {/* Sandbox Header - Vibrant Indigo Aligned */}
      <div className="bg-[#f7f4ed] dark:bg-stone-950 px-4 py-3 border-b border-[#e2d7c3] dark:border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
            Live Sandbox Demo — Try Creating Tasks Below
          </span>
        </div>
        <span className="text-[10px] font-mono bg-indigo-50 dark:bg-stone-900 text-indigo-600 dark:text-indigo-400 px-2.5 py-0.5 rounded font-bold border border-indigo-200 dark:border-stone-800">
          No Login Required
        </span>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        
        {/* Input Bar */}
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Type a task and press Add or Enter..."
            className="flex-1 bg-[#f8f5ee] dark:bg-stone-950 border border-[#d8cebe] dark:border-stone-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-indigo-500 font-medium"
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="bg-[#f8f5ee] dark:bg-stone-950 border border-[#d8cebe] dark:border-stone-800 rounded-xl px-2.5 py-2 text-xs text-stone-800 dark:text-stone-200 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <button
            type="submit"
            disabled={!newTitle.trim()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </form>

        {/* Task Items List */}
        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {tasks.map(t => (
            <div
              key={t.id}
              className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                t.complete 
                  ? 'bg-[#f4efe6] dark:bg-stone-950/40 border-[#e6ded1] dark:border-stone-800/80 opacity-60' 
                  : 'bg-[#f8f5ee] dark:bg-stone-950 border-[#e6ded1] dark:border-stone-800 shadow-2xs'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => toggleTask(t.id)}
                  className={`w-5 h-5 rounded-md border flex items-center justify-center cursor-pointer transition-all shrink-0 ${
                    t.complete 
                      ? 'bg-indigo-600 border-indigo-500 text-white' 
                      : 'border-stone-300 dark:border-stone-700 hover:border-indigo-500 bg-[#fffdfa] dark:bg-stone-900'
                  }`}
                >
                  {t.complete && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                <span className={`text-xs sm:text-sm font-semibold truncate ${
                  t.complete ? 'line-through text-stone-400 dark:text-stone-500' : 'text-stone-900 dark:text-stone-100'
                }`}>
                  {t.title}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${priorityColors[t.priority]}`}>
                  {t.priority}
                </span>

                <button
                  onClick={() => deleteTask(t.id)}
                  className="p-1 text-stone-400 hover:text-red-600 dark:hover:text-red-400 rounded transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
