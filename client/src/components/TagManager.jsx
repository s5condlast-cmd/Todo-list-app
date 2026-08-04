import React, { useState } from 'react';
import { X, Tag, Trash2, Plus, AlertCircle } from 'lucide-react';
import { api } from '../api';

export default function TagManager({ isOpen, onClose, tags, onTagCreated, onTagDeleted, showToast }) {
  const [tagName, setTagName] = useState('');
  const [tagColor, setTagColor] = useState('#6366f1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const colorPresets = [
    '#6366f1', // Indigo
    '#ec4899', // Pink
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#ef4444', // Red
    '#8b5cf6', // Purple
    '#06b6d4', // Cyan
    '#3b82f6'  // Blue
  ];

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!tagName.trim()) return;

    setError('');
    setLoading(true);
    try {
      const res = await api.createTag({ name: tagName.trim(), color: tagColor });
      onTagCreated(res.tag);
      setTagName('');
      showToast(`Tag "${res.tag.name}" created!`);
    } catch (err) {
      setError(err.message || 'Failed to create tag');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    try {
      await api.deleteTag(id);
      onTagDeleted(id);
      showToast(`Tag "${name}" removed`);
    } catch (err) {
      showToast(err.message || 'Failed to delete tag', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#fffefb] dark:bg-stone-900 border border-[#e6ded1] dark:border-stone-800 p-6 rounded-2xl shadow-2xl transition-colors">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#e6ded1] dark:border-stone-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">Manage Categories & Tags</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-900 dark:hover:text-white rounded-xl hover:bg-[#f4efe6] dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-3 p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Create Form */}
        <form onSubmit={handleCreate} className="space-y-3 mb-6 bg-[#f8f4ec] dark:bg-stone-950/60 p-4 rounded-xl border border-[#e6ded1] dark:border-stone-800">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1">
              New Tag Name
            </label>
            <input
              type="text"
              required
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              placeholder="e.g., Finance, School, Feature"
              className="w-full px-3 py-2 bg-[#fffefb] dark:bg-stone-900 border border-[#ddcfba] dark:border-stone-800 rounded-xl text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1">
              Tag Color
            </label>
            <div className="flex items-center gap-2">
              {colorPresets.map(c => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setTagColor(c)}
                  className={`w-6 h-6 rounded-full transition-all cursor-pointer ${
                    tagColor === c ? 'ring-2 ring-indigo-600 ring-offset-2 dark:ring-offset-stone-900 scale-110' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Tag</span>
          </button>
        </form>

        {/* Existing Tags List */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
            Your Existing Tags ({tags.length})
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {tags.length === 0 ? (
              <p className="text-xs text-stone-400 dark:text-stone-500 italic">No custom tags created yet.</p>
            ) : (
              tags.map(t => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-2.5 bg-[#f8f4ec] dark:bg-stone-950 border border-[#e6ded1] dark:border-stone-800 rounded-xl"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: t.color }}
                    />
                    <span className="text-xs font-semibold text-stone-800 dark:text-stone-200">#{t.name}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(t.id, t.name)}
                    className="p-1.5 text-stone-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-[#e8decb] dark:hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
