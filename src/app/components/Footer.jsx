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
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <p className="text-white font-bold text-lg tracking-wider">
              YOUTH CAMP <span className="text-amber-400">2026</span>
            </p>
            <p className="text-slate-500 text-sm mt-1">Breakthrough · Colossians 1:17-18</p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {['about', 'activities', 'speakers', 'schedule', 'contact'].map(section => (
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

        <div className="border-t border-white/5 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm flex items-center gap-1">
            Made with <Heart size={14} className="text-red-400" /> for the youth of Christ
          </p>
          <button
            onClick={onRegister}
            className="bg-amber-500 hover:bg-amber-400 text-slate-900 px-6 py-2.5 rounded-full text-sm font-bold transition-all"
          >
            Register Now
          </button>
        </div>
      </div>
    </footer>
  );
}