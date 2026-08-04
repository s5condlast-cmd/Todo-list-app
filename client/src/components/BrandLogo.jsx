import React from 'react';
import { Feather } from 'lucide-react';

export default function BrandLogo({ size = 'md', className = '', showText = true }) {
  const sizeMap = {
    sm: { container: 'w-7 h-7 rounded-lg', icon: 'w-3.5 h-3.5', text: 'text-sm' },
    md: { container: 'w-8.5 h-8.5 rounded-xl', icon: 'w-4 h-4', text: 'text-base' },
    lg: { container: 'w-10 h-10 rounded-2xl', icon: 'w-5 h-5', text: 'text-lg' },
    xl: { container: 'w-12 h-12 rounded-2xl', icon: 'w-6 h-6', text: 'text-2xl' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Brand Icon Badge */}
      <div className="relative group">
        <div className={`${currentSize.container} bg-indigo-600 border border-indigo-500/50 text-white flex items-center justify-center shadow-md transition-transform group-hover:scale-105 shrink-0`}>
          <Feather className={`${currentSize.icon} text-white stroke-[2.3]`} />
        </div>
        {/* Gold Micro-Sparkle Dot */}
        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-400 border-2 border-[#fffefb] dark:border-stone-900 rounded-full shadow-xs" />
      </div>

      {/* Brand Text */}
      {showText && (
        <span className={`font-extrabold ${currentSize.text} text-stone-900 dark:text-stone-100 tracking-tight leading-none`}>
          Task<span className="text-indigo-600 dark:text-indigo-400">Pulse</span>
        </span>
      )}
    </div>
  );
}
