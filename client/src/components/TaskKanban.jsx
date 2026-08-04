import React from 'react';
import TaskItem from './TaskItem';
import { Layers, Clock, CheckCircle2 } from 'lucide-react';

export default function TaskKanban({ tasks, onToggleComplete, onEdit, onDelete }) {
  const todoTasks = tasks.filter(t => !t.is_complete && t.priority !== 'urgent');
  const inProgressTasks = tasks.filter(t => !t.is_complete && t.priority === 'urgent');
  const completedTasks = tasks.filter(t => t.is_complete);

  // Single Unified Brand Color Accent (Indigo)
  const columns = [
    { 
      id: 'todo', 
      title: 'To Do', 
      icon: Layers, 
      tasks: todoTasks
    },
    { 
      id: 'in_progress', 
      title: 'Urgent Focus', 
      icon: Clock, 
      tasks: inProgressTasks
    },
    { 
      id: 'completed', 
      title: 'Completed', 
      icon: CheckCircle2, 
      tasks: completedTasks
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6">
      {columns.map(col => {
        const Icon = col.icon;
        return (
          <div 
            key={col.id} 
            className="bg-[#f4efe6]/80 dark:bg-stone-900/60 border border-[#e6ded1] dark:border-stone-800 rounded-2xl p-3.5 flex flex-col min-h-[420px] transition-colors"
          >
            
            {/* Column Header - Single Unified Indigo Brand Color */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#e6ded1] dark:border-stone-800">
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-bold text-xs text-stone-900 dark:text-stone-100 uppercase tracking-wider">
                  {col.title}
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                {col.tasks.length}
              </span>
            </div>

            {/* Column Items */}
            <div className="flex-1 space-y-2.5 overflow-y-auto">
              {col.tasks.length === 0 ? (
                <div className="h-full min-h-[200px] flex items-center justify-center border-2 border-dashed border-[#e6ded1] dark:border-stone-800 rounded-xl p-4">
                  <p className="text-xs text-stone-400 dark:text-stone-500 italic font-medium">No tasks in this column</p>
                </div>
              ) : (
                col.tasks.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggleComplete={onToggleComplete}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))
              )}
            </div>

          </div>
        );
      })}
    </div>
  );
}
