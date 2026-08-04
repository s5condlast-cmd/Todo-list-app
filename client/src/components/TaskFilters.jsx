import React from 'react';
import { Search, Filter, ArrowUpDown, Tag, LayoutList, Kanban } from 'lucide-react';

export default function TaskFilters({
  filters,
  setFilters,
  tags,
  viewMode,
  setViewMode
}) {
  return (
    <div className="bg-[#fffefb] dark:bg-stone-900 border border-[#e6ded1] dark:border-stone-800 rounded-xl p-3 mb-4 space-y-3 transition-colors">
      
      {/* Top Row: Search + View Switcher */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-stone-400" />
          <input
            type="text"
            placeholder="Filter tasks..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-full pl-8 pr-3 py-1.5 bg-[#f4efe6] dark:bg-stone-950 border border-[#e6ded1] dark:border-stone-800 rounded-lg text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-indigo-500 font-medium"
          />
        </div>

        {/* View Switcher Tabs (List / Kanban) */}
        <div className="flex items-center bg-[#f4efe6] dark:bg-stone-950 p-1 rounded-lg border border-[#e6ded1] dark:border-stone-800 text-xs shrink-0">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              viewMode === 'list'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <LayoutList className="w-3.5 h-3.5" />
            <span>List</span>
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              viewMode === 'kanban'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            <span>Board</span>
          </button>
        </div>

      </div>

      {/* Bottom Row: Priority, Tags & Sorting */}
      <div className="flex flex-wrap items-center gap-3 text-xs pt-1 border-t border-[#e6ded1] dark:border-stone-800">
        
        {/* Priority Filter */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-stone-400" />
          <select
            value={filters.priority}
            onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
            className="bg-[#f4efe6] dark:bg-stone-950 border border-[#e6ded1] dark:border-stone-800 rounded-md px-2 py-1 text-stone-800 dark:text-stone-200 focus:outline-none focus:border-indigo-500 cursor-pointer font-semibold"
          >
            <option value="">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Tag Filter */}
        {tags.length > 0 && (
          <div className="flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={filters.tagId}
              onChange={(e) => setFilters(prev => ({ ...prev, tagId: e.target.value }))}
              className="bg-[#f4efe6] dark:bg-stone-950 border border-[#e6ded1] dark:border-stone-800 rounded-md px-2 py-1 text-stone-800 dark:text-stone-200 focus:outline-none focus:border-indigo-500 cursor-pointer font-semibold"
            >
              <option value="">All Tags</option>
              {tags.map(t => (
                <option key={t.id} value={t.id}>
                  #{t.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Sorting */}
        <div className="flex items-center gap-1.5 ml-auto">
          <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
          <select
            value={filters.sort}
            onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
            className="bg-[#f4efe6] dark:bg-stone-950 border border-[#e6ded1] dark:border-stone-800 rounded-md px-2 py-1 text-stone-800 dark:text-stone-200 focus:outline-none focus:border-indigo-500 cursor-pointer font-semibold"
          >
            <option value="createdAt">Sort: Date Created</option>
            <option value="dueDate">Sort: Due Date</option>
            <option value="priority">Sort: Priority</option>
          </select>
        </div>

      </div>

    </div>
  );
}
