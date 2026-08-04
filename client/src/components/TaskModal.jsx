import React, { useState, useEffect } from 'react';
import { X, Calendar, Tag, AlertCircle } from 'lucide-react';

export default function TaskModal({ isOpen, onClose, onSave, task, tags }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setDueDate(task.due_date || '');
      setPriority(task.priority || 'medium');
      setSelectedTagIds(task.tags ? task.tags.map(t => t.id) : []);
    } else {
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('medium');
      setSelectedTagIds([]);
    }
    setError('');
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      due_date: dueDate || null,
      priority,
      tagIds: selectedTagIds
    });
    onClose();
  };

  const toggleTag = (id) => {
    setSelectedTagIds(prev => 
      prev.includes(id) ? prev.filter(tId => tId !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#fffefb] dark:bg-stone-900 border border-[#e6ded1] dark:border-stone-800 p-6 sm:p-8 rounded-2xl shadow-2xl transition-colors">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e6ded1] dark:border-stone-800 pb-4 mb-5">
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-900 dark:hover:text-white rounded-xl hover:bg-[#f4efe6] dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Title Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
              Task Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Complete database migration..."
              className="w-full px-4 py-2.5 bg-[#f8f4ec] dark:bg-stone-950 border border-[#d8cebe] dark:border-stone-800 rounded-xl text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-indigo-500 text-sm font-medium"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add key notes, steps, or instructions..."
              className="w-full px-4 py-2.5 bg-[#f8f4ec] dark:bg-stone-950 border border-[#d8cebe] dark:border-stone-800 rounded-xl text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-indigo-500 text-sm font-medium resize-none"
            />
          </div>

          {/* Row: Due Date + Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Due Date */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                Due Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-4 h-4 text-stone-400 pointer-events-none" />
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#f8f4ec] dark:bg-stone-950 border border-[#d8cebe] dark:border-stone-800 rounded-xl text-stone-900 dark:text-stone-100 text-sm font-medium focus:outline-none focus:border-indigo-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 bg-[#f8f4ec] dark:bg-stone-950 border border-[#d8cebe] dark:border-stone-800 rounded-xl text-stone-900 dark:text-stone-100 text-sm font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

          </div>

          {/* Tags Multi-select */}
          {tags.length > 0 && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-stone-500" />
                <span>Categories / Tags</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {tags.map(t => {
                  const isSelected = selectedTagIds.includes(t.id);
                  return (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => toggleTag(t.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        isSelected
                          ? 'text-white shadow-md'
                          : 'bg-[#f4efe6] dark:bg-stone-950 text-stone-700 dark:text-stone-400 border-[#e6ded1] dark:border-stone-800 hover:border-stone-400'
                      }`}
                      style={{
                        backgroundColor: isSelected ? t.color : undefined,
                        borderColor: isSelected ? t.color : undefined
                      }}
                    >
                      {isSelected ? `✓ ${t.name}` : `+ ${t.name}`}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e6ded1] dark:border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white rounded-xl hover:bg-[#f4efe6] dark:hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white shadow-md transition-all cursor-pointer"
            >
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
