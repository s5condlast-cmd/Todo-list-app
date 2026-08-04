import React, { useState } from 'react';
import { Calendar, Edit3, Trash2, Check, AlertCircle, Clock } from 'lucide-react';

export default function TaskItem({ task, onToggleComplete, onEdit, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];
  const isOverdue = !task.is_complete && task.due_date && task.due_date < todayStr;
  const isDueToday = !task.is_complete && task.due_date && task.due_date === todayStr;

  const priorityStyles = {
    urgent: 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-500/30',
    high: 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-500/30',
    medium: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-500/30',
    low: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30'
  };

  return (
    <div className={`p-3.5 sm:p-4 mb-2.5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 border transition-all ${
      task.is_complete 
        ? 'opacity-65 bg-[#f4efe6] dark:bg-stone-900/30 border-[#e6ded1] dark:border-stone-800/80' 
        : isOverdue 
        ? 'border-red-300 dark:border-stone-700 bg-red-50/50 dark:bg-stone-900' 
        : 'bg-[#fffefb] dark:bg-stone-900 border-[#e6ded1] dark:border-stone-800 shadow-sm'
    }`}>
      
      {/* Left: Checkbox + Title/Desc Details */}
      <div className="flex items-start gap-3 w-full sm:w-auto min-w-0">
        
        {/* Toggle Checkbox */}
        <button
          onClick={() => onToggleComplete(task)}
          className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
            task.is_complete
              ? 'bg-emerald-600 border-emerald-500 text-white'
              : 'border-[#ddcfba] dark:border-stone-700 hover:border-indigo-500 hover:bg-[#f2ece1] dark:hover:bg-indigo-500/10'
          }`}
        >
          {task.is_complete && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* Task Details */}
        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className={`font-semibold text-xs sm:text-sm leading-tight text-left ${
              task.is_complete ? 'line-through text-stone-400 dark:text-stone-500' : 'text-stone-900 dark:text-stone-100'
            }`}>
              {task.title}
            </h3>

            {/* Priority Badge */}
            <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border uppercase tracking-wider leading-none shrink-0 ${
              priorityStyles[task.priority] || priorityStyles.medium
            }`}>
              {task.priority}
            </span>
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 max-w-xl text-left leading-normal">
              {task.description}
            </p>
          )}

          {/* Tags & Due Date Footer */}
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            
            {/* Due Date Indicator */}
            {task.due_date && (
              <div className={`inline-flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-md border font-medium leading-none ${
                isOverdue
                  ? 'bg-red-100 dark:bg-stone-800 text-red-700 dark:text-stone-300 border-red-300 dark:border-stone-700'
                  : isDueToday
                  ? 'bg-amber-100 dark:bg-stone-800 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-slate-700'
                  : 'bg-[#f4efe6] dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-[#e6ded1] dark:border-stone-700/80'
              }`}>
                {isOverdue ? (
                  <AlertCircle className="w-3 h-3 text-red-600 dark:text-stone-400 shrink-0" />
                ) : isDueToday ? (
                  <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
                ) : (
                  <Calendar className="w-3 h-3 text-stone-400 shrink-0" />
                )}
                <span>
                  {isOverdue ? `Overdue: ${task.due_date}` : isDueToday ? 'Due Today' : `Due: ${task.due_date}`}
                </span>
              </div>
            )}

            {/* Tags */}
            {task.tags && task.tags.map(tag => (
              <span
                key={tag.id}
                className="inline-flex items-center text-[10px] px-2 py-0.5 rounded-md font-semibold border leading-none"
                style={{ 
                  backgroundColor: `${tag.color}15`, 
                  borderColor: tag.color,
                  color: tag.color 
                }}
              >
                #{tag.name}
              </span>
            ))}

          </div>
        </div>

      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
        
        {/* Edit Button */}
        <button
          onClick={() => onEdit(task)}
          className="p-1.5 text-stone-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-[#f4efe6] dark:hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
          title="Edit Task"
        >
          <Edit3 className="w-3.5 h-3.5" />
        </button>

        {/* Delete Button with Confirmation */}
        {confirmDelete ? (
          <div className="flex items-center gap-1 bg-red-50 dark:bg-stone-900 border border-red-300 dark:border-stone-700 p-1 rounded-xl animate-fade-in">
            <span className="text-[11px] text-red-700 dark:text-stone-300 px-1 font-semibold">Delete?</span>
            <button
              onClick={() => onDelete(task.id)}
              className="px-2 py-0.5 text-[10px] bg-red-600 hover:bg-red-500 text-white font-bold rounded cursor-pointer"
            >
              Yes
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="px-2 py-0.5 text-[10px] bg-[#e8decb] dark:bg-stone-800 hover:bg-[#ddcfba] dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-medium rounded cursor-pointer"
            >
              No
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="p-1.5 text-stone-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-[#f4efe6] dark:hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
            title="Delete Task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}

      </div>

    </div>
  );
}
