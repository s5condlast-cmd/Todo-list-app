import React, { useState } from 'react';
import ImageSlider from './ImageSlider';
import BrandMarquee from './BrandMarquee';
import InteractiveSandbox from './InteractiveSandbox';
import { 
  CheckSquare, 
  Sparkles, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  Kanban, 
  Tag, 
  Database, 
  Lock,
  Terminal,
  Feather,
  BookOpen,
  PenTool,
  Bookmark,
  CheckCircle2
} from 'lucide-react';

export default function LandingPage({ onInstantDemo, onOpenAuth }) {
  const [activeTab, setActiveTab] = useState('schema');

  const features = [
    {
      icon: PenTool,
      title: "Linear Ink Fast Entry",
      desc: "Capture thoughts at the speed of a fountain pen. Press Enter to record tasks directly into your inbox."
    },
    {
      icon: Kanban,
      title: "Dual Desk & Board Views",
      desc: "Transition gracefully between structured parchment lists and 3-column Kanban desk boards."
    },
    {
      icon: Tag,
      title: "Hand-Crafted Category Tags",
      desc: "Organize projects with custom wax-seal color tags and editorial category markers."
    },
    {
      icon: Lock,
      title: "Cryptographic JWT Security",
      desc: "Archival multi-user privacy with 256-bit JWT authorization and salted bcrypt encryption."
    },
    {
      icon: Database,
      title: "Relational SQL Foundation",
      desc: "SQLite relational database backend optimized with targeted B-tree indexes."
    },
    {
      icon: ShieldCheck,
      title: "Priority & Overdue Markers",
      desc: "Discreet indicators for pressing deadlines and high-priority workloads."
    }
  ];

  const apiEndpoints = [
    { method: "POST", path: "/api/auth/register", desc: "Create new user account" },
    { method: "POST", path: "/api/auth/login", desc: "Authenticate & return JWT token" },
    { method: "GET", path: "/api/tasks", desc: "Query user tasks with filters & sorting" },
    { method: "POST", path: "/api/tasks", desc: "Create task with priority & category tags" },
    { method: "PUT", path: "/api/tasks/:id", desc: "Update task details or toggle completion" },
    { method: "DELETE", path: "/api/tasks/:id", desc: "Delete task" }
  ];

  return (
    <div className="min-h-screen bg-[#f7f4ed] dark:bg-stone-950 text-[#1c1917] dark:text-stone-100 flex flex-col font-sans overflow-x-hidden relative bg-paper-grid transition-colors selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Soft Indigo Ambient Glow Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-indigo-500/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Aligned Landing Page Header Topbar - Height h-14 (56px) Matching Home Topbar */}
      <header className="sticky top-0 z-40 bg-[#fffdfa]/95 dark:bg-stone-950/90 border-b border-[#e2d7c3] dark:border-stone-800/80 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          
          {/* Brand Logo & Crest - Solid Indigo Badge + White Feather */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 border border-indigo-500/50 text-white flex items-center justify-center font-bold shadow-md shrink-0 hover:scale-105 transition-transform">
              <Feather className="w-4.5 h-4.5 text-white stroke-[2.2]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif-luxury italic text-lg font-extrabold text-[#1c1917] dark:text-stone-100 tracking-tight">TaskPulse</span>
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-stone-900 border border-indigo-200 dark:border-stone-800 px-2 py-0.5 rounded">
                EDITION v1.0
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
            <a href="#sandbox" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Paper Sandbox</a>
            <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Craftsmanship</a>
            <a href="#showcase" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Desk Showcase</a>
            <a href="#architecture" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Architecture</a>
          </nav>

          {/* Right Action CTA Buttons */}
          <div className="flex items-center gap-2.5">
            
            {/* Quick Demo Button - Indigo Primary CTA */}
            <button
              onClick={onInstantDemo}
              className="h-9 px-4 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 hover:scale-[1.01] border border-indigo-500/50"
            >
              <PenTool className="w-3.5 h-3.5 text-white" />
              <span>Instant Demo</span>
            </button>

            {/* Sign In Button */}
            <button
              onClick={onOpenAuth}
              className="h-9 px-3.5 text-xs font-bold text-stone-800 dark:text-stone-200 hover:text-indigo-600 dark:hover:text-white rounded-xl border border-[#e2d7c3] dark:border-stone-800 bg-[#fffdfa] dark:bg-stone-900 hover:bg-[#f1ebd8] dark:hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Sign In
            </button>

          </div>

        </div>
      </header>

      {/* Hero Section - Aligned Topview */}
      <section className="pt-12 pb-12 px-4 sm:px-6 text-center max-w-5xl mx-auto animate-slide-up relative z-10">
        
        {/* Top Editorial Crest Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-stone-900 border border-indigo-200 dark:border-stone-800 text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-6 shadow-xs">
          <Bookmark className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span className="font-mono text-[11px] tracking-wider uppercase">Archival Task Management — Pen & Paper Aesthetic</span>
        </div>

        {/* Luxury Hero Title */}
        <h1 className="font-serif-luxury text-4xl sm:text-6xl font-semibold text-[#1c1917] dark:text-stone-100 tracking-tight leading-[1.15] max-w-4xl mx-auto mb-6">
          Crafted for thinkers who value <span className="italic font-bold text-indigo-600 dark:text-indigo-400 underline decoration-indigo-200 dark:decoration-indigo-900 underline-offset-8">clarity, depth, and speed.</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-lg text-stone-700 dark:text-stone-300 max-w-2xl mx-auto mb-10 leading-relaxed font-sans font-medium">
          TaskPulse blends the tactile elegance of classic paper journals with high-performance SQLite relational architecture and instant JWT synchronization.
        </p>

        {/* Hero Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-12">
          <button
            onClick={onInstantDemo}
            className="w-full sm:w-auto h-11 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2.5 cursor-pointer transition-all hover:scale-[1.01] border border-indigo-500/50"
          >
            <PenTool className="w-4 h-4 text-white" />
            <span>Launch Instant Demo Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenAuth}
            className="w-full sm:w-auto h-11 px-8 rounded-xl border border-[#e2d7c3] dark:border-stone-800 hover:border-indigo-500 bg-[#fffdfa] dark:bg-stone-900/80 text-stone-900 dark:text-stone-200 font-bold text-sm cursor-pointer transition-all"
          >
            Create Personal Journal Account
          </button>
        </div>

        {/* Interactive Pen & Paper Scratchpad Preview */}
        <div id="sandbox" className="pt-2 mb-14">
          <InteractiveSandbox />
        </div>

        {/* Parchment Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto py-6 border-y border-[#e2d7c3] dark:border-stone-800/80 my-10 bg-[#fffdfa]/80 dark:bg-stone-900/40 rounded-2xl p-4 shadow-sm">
          <div>
            <p className="font-serif-luxury text-2xl sm:text-3xl font-extrabold text-[#1c1917] dark:text-stone-100">&lt; 10ms</p>
            <p className="text-[11px] font-mono font-bold text-stone-700 dark:text-stone-400 uppercase tracking-wider mt-1">Query Latency</p>
          </div>
          <div>
            <p className="font-serif-luxury text-2xl sm:text-3xl font-extrabold text-[#1c1917] dark:text-stone-100">100%</p>
            <p className="text-[11px] font-mono font-bold text-stone-700 dark:text-stone-400 uppercase tracking-wider mt-1">Multi-User Isolation</p>
          </div>
          <div>
            <p className="font-serif-luxury text-2xl sm:text-3xl font-extrabold text-[#1c1917] dark:text-stone-100">SQLite</p>
            <p className="text-[11px] font-mono font-bold text-stone-700 dark:text-stone-400 uppercase tracking-wider mt-1">Relational Engine</p>
          </div>
          <div>
            <p className="font-serif-luxury text-2xl sm:text-3xl font-extrabold text-[#1c1917] dark:text-stone-100">256-Bit</p>
            <p className="text-[11px] font-mono font-bold text-stone-700 dark:text-stone-400 uppercase tracking-wider mt-1">JWT Security</p>
          </div>
        </div>

        {/* Desk Showcase Carousel */}
        <div id="showcase" className="pt-6">
          <div className="text-center mb-6">
            <h2 className="font-serif-luxury text-2xl font-bold text-[#1c1917] dark:text-stone-200">Editorial Desk Showcase</h2>
            <p className="text-xs font-medium text-stone-600 dark:text-stone-400 font-sans">Structured parchment lists, Kanban desk focus, and metrics</p>
          </div>
          <ImageSlider />
        </div>

      </section>

      {/* Continuous Moving Brand Names Marquee Ticker */}
      <BrandMarquee />

      {/* Craftsmanship Feature Grid Section */}
      <section id="features" className="py-20 bg-[#f1ebd8]/70 dark:bg-stone-900/50 border-t border-[#e2d7c3] dark:border-stone-800/80 px-4 sm:px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="font-serif-luxury text-3xl font-bold text-[#1c1917] dark:text-stone-100 mb-2">Designed with meticulous craftsmanship</h2>
            <p className="text-xs text-stone-700 dark:text-stone-300 font-sans font-medium">Every element tailored for deliberate productivity and focus.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="slate-card slate-card-hover p-6 space-y-3 bg-[#fffdfa] dark:bg-stone-900 border-[#e2d7c3] dark:border-stone-800 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-[#1c1917] dark:text-stone-100">{f.title}</h3>
                  <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-normal">{f.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Architecture & API Code Inspector Window */}
      <section id="architecture" className="py-20 px-4 sm:px-6 max-w-5xl mx-auto w-full relative z-10">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="font-serif-luxury text-3xl font-bold text-[#1c1917] dark:text-stone-100 mb-2">Architecture & Data Blueprint</h2>
          <p className="text-xs text-stone-700 dark:text-stone-300 font-sans font-medium">Inspecting relational models and RESTful endpoint specifications</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              activeTab === 'schema' 
                ? 'bg-indigo-600 text-white shadow-md border border-indigo-500' 
                : 'bg-[#fffdfa] dark:bg-stone-900 text-stone-800 dark:text-stone-200 border border-[#e2d7c3] dark:border-stone-800 hover:border-indigo-500'
            }`}
          >
            Database Schema & Indexes
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              activeTab === 'api' 
                ? 'bg-indigo-600 text-white shadow-md border border-indigo-500' 
                : 'bg-[#fffdfa] dark:bg-stone-900 text-stone-800 dark:text-stone-200 border border-[#e2d7c3] dark:border-stone-800 hover:border-indigo-500'
            }`}
          >
            REST API Specifications
          </button>
        </div>

        {/* Adaptive Code Inspector Window */}
        <div className="min-h-[360px] flex flex-col justify-start">
          {activeTab === 'schema' ? (
            <div className="slate-card p-6 bg-[#fffdfa] dark:bg-stone-900 font-mono text-xs sm:text-sm text-[#1c1917] dark:text-stone-100 space-y-4 border-2 border-[#e2d7c3] dark:border-stone-800 shadow-xl rounded-2xl animate-fade-in min-h-[360px] flex flex-col justify-between transition-colors">
              
              {/* Header Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-[#e6ded1] dark:border-stone-800 text-indigo-600 dark:text-indigo-400 font-bold shrink-0">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-stone-900 dark:text-stone-100 font-extrabold">sqlite3 tasks.db — Archival Relational Schema</span>
                </div>
                <span className="text-[10px] bg-indigo-50 dark:bg-stone-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-stone-800 px-2.5 py-0.5 rounded font-bold">SQLITE ENGINE</span>
              </div>

              {/* Schema Lines */}
              <div className="space-y-2.5 pt-1 flex-1">
                <div className="bg-[#f8f5ee] dark:bg-stone-950/80 p-2.5 rounded-xl border border-[#e6ded1] dark:border-stone-800">
                  <span className="text-indigo-600 dark:text-indigo-400 font-extrabold text-sm mr-2">users:</span>
                  <span className="text-stone-900 dark:text-stone-100 font-medium">id (INTEGER PRIMARY KEY), email (TEXT UNIQUE), password_hash (TEXT), name (TEXT)</span>
                </div>

                <div className="bg-[#f8f5ee] dark:bg-stone-950/80 p-2.5 rounded-xl border border-[#e6ded1] dark:border-stone-800">
                  <span className="text-indigo-600 dark:text-indigo-400 font-extrabold text-sm mr-2">tasks:</span>
                  <span className="text-stone-900 dark:text-stone-100 font-medium">id (INTEGER PRIMARY KEY), user_id (FK), title, description, is_complete, due_date, priority</span>
                </div>

                <div className="bg-[#f8f5ee] dark:bg-stone-950/80 p-2.5 rounded-xl border border-[#e6ded1] dark:border-stone-800">
                  <span className="text-indigo-600 dark:text-indigo-400 font-extrabold text-sm mr-2">tags:</span>
                  <span className="text-stone-900 dark:text-stone-100 font-medium">id (INTEGER PRIMARY KEY), user_id (FK), name, color</span>
                </div>

                <div className="bg-[#f8f5ee] dark:bg-stone-950/80 p-2.5 rounded-xl border border-[#e6ded1] dark:border-stone-800">
                  <span className="text-indigo-600 dark:text-indigo-400 font-extrabold text-sm mr-2">task_tags:</span>
                  <span className="text-stone-900 dark:text-stone-100 font-medium">task_id (FK), tag_id (FK)</span>
                </div>
              </div>

              {/* Performance Index Definitions */}
              <div className="pt-3 text-indigo-600 dark:text-indigo-400 font-bold border-t border-[#e6ded1] dark:border-stone-800 space-y-1 shrink-0">
                <p className="text-[11px] text-stone-500 dark:text-stone-400 uppercase tracking-widest font-sans mb-1 font-bold">Performance Indexes:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="bg-indigo-50 dark:bg-indigo-950/50 p-2.5 rounded-xl border border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 font-mono font-bold text-xs">
                    CREATE INDEX idx_tasks_user_id ON tasks(user_id);
                  </div>
                  <div className="bg-indigo-50 dark:bg-indigo-950/50 p-2.5 rounded-xl border border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 font-mono font-bold text-xs">
                    CREATE INDEX idx_tasks_due_date ON tasks(due_date);
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="slate-card p-5 bg-[#fffdfa] dark:bg-stone-900 space-y-2 border-2 border-[#e2d7c3] dark:border-stone-800 rounded-2xl animate-fade-in min-h-[360px] flex flex-col justify-center transition-colors">
              {apiEndpoints.map((ep, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-[#f8f5ee] dark:bg-stone-950 rounded-xl border border-[#e6ded1] dark:border-stone-800 text-xs font-mono">
                  <div className="flex items-center gap-3">
                    <span className={`font-extrabold px-2.5 py-1 rounded text-[11px] ${
                      ep.method === 'GET' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40' :
                      ep.method === 'POST' ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-500/40' :
                      ep.method === 'PUT' ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40' :
                      'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-500/40'
                    }`}>
                      {ep.method}
                    </span>
                    <span className="text-stone-900 dark:text-stone-100 font-bold text-sm">{ep.path}</span>
                  </div>
                  <span className="text-stone-600 dark:text-stone-300 font-sans text-xs font-medium hidden sm:inline">{ep.desc}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </section>

      {/* Editorial Footer */}
      <footer className="mt-auto py-10 border-t border-[#e2d7c3] dark:border-stone-800/80 bg-[#fffdfa] dark:bg-stone-950 text-center text-xs text-stone-600 dark:text-stone-400 relative z-10">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Feather className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span className="font-serif-luxury italic text-sm font-bold text-[#1c1917] dark:text-stone-200">TaskPulse Edition</span>
            <span>— Full Architecture Reference</span>
          </div>
          <p>© 2026 TaskPulse. Designed with warm paper aesthetic & Node/SQLite backend.</p>
        </div>
      </footer>

    </div>
  );
}
