import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ImageSlider() {
  const slides = [
    {
      url: '/todo_hero.jpg',
      title: 'Workspace Inbox',
      subtitle: 'Zero-friction task capture with linear priority tags & due dates'
    },
    {
      url: '/todo_kanban.jpg',
      title: 'Kanban Focus Boards',
      subtitle: 'Organize focus areas into To Do, Urgent Focus, and Completed columns'
    },
    {
      url: '/todo_analytics.jpg',
      title: 'Productivity Metrics',
      subtitle: 'Real-time calculation of completion rate, overdue tasks, and workload stats'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  return (
    <div className="relative group rounded-2xl p-1 bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden max-w-4xl mx-auto">
      
      {/* Slide Container */}
      <div className="relative h-64 sm:h-96 w-full rounded-xl overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.url}
              alt={slide.title}
              className="w-full h-full object-cover transform transition-transform duration-1000 scale-100 group-hover:scale-105"
            />
            {/* Dark Gradient Overlay & Caption */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-6 sm:p-8 text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 mb-1">
                Feature Preview 0{index + 1}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                {slide.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
                {slide.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Manual Arrow Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-xl bg-slate-950/70 border border-slate-700/80 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-900 cursor-pointer"
        title="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-xl bg-slate-950/70 border border-slate-700/80 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-900 cursor-pointer"
        title="Next Slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots Indicator Navigation */}
      <div className="absolute bottom-4 right-6 z-20 flex items-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${
              index === currentIndex ? 'w-6 bg-indigo-500' : 'w-1.5 bg-slate-600 hover:bg-slate-400'
            }`}
          />
        ))}
      </div>

    </div>
  );
}
