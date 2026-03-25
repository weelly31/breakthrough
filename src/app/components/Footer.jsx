"use client";

import React from 'react';
import { Heart } from 'lucide-react';

export default function Footer({ onRegister }) {
  const scrollTo = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6 text-center md:text-left">
          <div className="max-w-sm">
            <p className="text-white font-bold text-base sm:text-lg tracking-wider">
              SUMMER RETREAT <span className="text-amber-400">2026</span>
            </p>
            <p className="text-slate-500 text-sm mt-1">Breakthrough · Joshua 6:20</p>
          </div>

          <div className="flex flex-wrap justify-center md:justify-end gap-x-5 gap-y-3">
            {['about', 'activities', 'gallery', 'contact'].map(section => (
              <button
                key={section}
                onClick={() => scrollTo(`#${section}`)}
                className="text-slate-400 hover:text-amber-400 text-sm capitalize transition-colors"
              >
                {section}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-white/5 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-slate-500 text-sm flex items-center justify-center sm:justify-start gap-1">
            Made with <Heart size={14} className="text-red-400" /> for the youth of Christ
          </p>
          <button
            onClick={onRegister}
            className="bg-amber-500 hover:bg-amber-400 text-slate-900 px-5 sm:px-6 py-2.5 rounded-full text-sm font-bold transition-all"
          >
            Register Now
          </button>
        </div>
      </div>
    </footer>
  );
}