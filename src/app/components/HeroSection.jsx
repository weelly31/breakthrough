"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, MapPin, CalendarDays } from 'lucide-react';

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${(i * 17.37) % 100}%`,
  top: `${(i * 29.13 + 11) % 100}%`,
  duration: 3 + (i % 5) * 0.8,
  delay: (i % 4) * 0.35,
}));

export default function HeroSection({ heroImage, onRegister }) {
  const scrollToAbout = () => {
    const el = document.querySelector('#about');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroImage} alt="Youth Camp Hero" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/90" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {PARTICLES.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-amber-400/30 rounded-full"
            style={{ left: particle.left, top: particle.top }}
            animate={{ y: [-20, 20], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: particle.duration, repeat: Infinity, delay: particle.delay }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-amber-400 tracking-[0.3em] uppercase text-sm font-medium mb-6"
        >
          Youth Camp 2026
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-black text-white tracking-tight leading-none mb-8 text-center whitespace-nowrap text-[min(8vw,7rem)] ml-[calc(50%-50vw)] w-screen"
        >
          BREAKTHROUGH
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-6 text-white/70 text-sm mb-10"
        >
          <span className="flex items-center gap-2">
            <CalendarDays size={16} className="text-amber-400" /> May 1–3, 2026
          </span>
          <span className="flex items-center gap-2">
            <MapPin size={16} className="text-amber-400" /> Methodist Prayer Garden, Taytay, Rizal
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <button
            onClick={onRegister}
            className="bg-amber-500 hover:bg-amber-400 text-slate-900 px-8 py-4 rounded-full font-bold text-sm tracking-wider transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/25"
          >
            REGISTER NOW
          </button>
          <button
            onClick={scrollToAbout}
            className="border border-white/30 hover:border-white/60 text-white px-8 py-4 rounded-full font-medium text-sm tracking-wider transition-all duration-300"
          >
            LEARN MORE
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 hover:text-white transition-colors"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown size={28} />
      </motion.button>
    </section>
  );
}