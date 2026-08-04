import React, { useState } from 'react';
import { Plus } from 'lucide-react';

export default function QuickTaskInput({ onQuickCreate }) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onQuickCreate({ title: title.trim(), priority });
    setTitle('');
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="mb-4 bg-[#fffefb] dark:bg-stone-900 border border-[#e6ded1] dark:border-stone-800 focus-within:border-indigo-500/60 rounded-xl p-2.5 flex items-center gap-3 shadow-sm transition-all"
    >
      <div className="w-5 h-5 rounded-md border border-[#ddcfba] dark:border-stone-700 flex items-center justify-center text-stone-400 dark:text-stone-500 shrink-0">
        <Plus className="w-3.5 h-3.5" />
      </div>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new task... (Press Enter to save)"
        className="w-full bg-transparent text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none"
      />

      <div className="flex items-center gap-2 shrink-0">
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="bg-[#f4efe6] dark:bg-stone-950 border border-[#e6ded1] dark:border-stone-800 text-[11px] text-stone-800 dark:text-stone-200 rounded-md px-2 py-1 focus:outline-none cursor-pointer font-semibold"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>

        <button
          type="submit"
          disabled={!title.trim()}
          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-xs rounded-md transition-all cursor-pointer"
        >
          Add
        </button>
      </div>
    </form>
  );
}
