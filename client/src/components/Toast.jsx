import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X, Sparkles } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const isError = toast.type === 'error';

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-md border animate-slide-up transition-all ${
      isError 
        ? 'bg-red-950/95 border-red-500/40 text-red-100' 
        : 'bg-indigo-600 dark:bg-indigo-600 border-indigo-400/50 text-white'
    }`}>
      {isError ? (
        <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
      ) : (
        <Sparkles className="w-5 h-5 text-amber-300 animate-pulse shrink-0" />
      )}
      <p className="text-xs sm:text-sm font-bold pr-2">{toast.message}</p>
      <button 
        onClick={onClose}
        className="p-1 hover:bg-white/20 rounded-lg transition-colors cursor-pointer text-white/80 hover:text-white"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
