import React from 'react';
import { Database, ShieldCheck, Cpu, Code2, Server, Feather, Lock, KeyRound } from 'lucide-react';

export default function BrandMarquee() {
  const techStack = [
    { name: "TaskPulse Archival", icon: Feather },
    { name: "Node.js Core", icon: Server },
    { name: "Express.js REST", icon: Code2 },
    { name: "SQLite Engine", icon: Database },
    { name: "React 18 SPA", icon: Cpu },
    { name: "Tailwind CSS", icon: ShieldCheck },
    { name: "JWT Authorization", icon: Lock },
    { name: "Google 2FA TOTP", icon: KeyRound },
  ];

  return (
    <div className="py-8 bg-[#fffdfa] dark:bg-stone-950 border-y border-[#e2d7c3] dark:border-stone-800/80 overflow-hidden relative">
      <div className="max-w-5xl mx-auto px-4 mb-4 text-center">
        <span className="inline-block text-[11px] font-mono font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-stone-900 border border-indigo-200 dark:border-stone-800 px-3.5 py-1 rounded-full shadow-xs">
          Powered by Modern Full-Stack Technologies
        </span>
      </div>

      <div className="flex overflow-hidden group select-none">
        <div className="flex animate-marquee shrink-0 items-center justify-around gap-8 whitespace-nowrap">
          {techStack.concat(techStack).map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#f7f4ed] dark:bg-stone-900 border border-[#e2d7c3] dark:border-stone-800 text-stone-900 dark:text-stone-100 font-bold text-xs shadow-xs hover:border-indigo-500 transition-colors"
              >
                <Icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span className="tracking-tight font-semibold">{item.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
