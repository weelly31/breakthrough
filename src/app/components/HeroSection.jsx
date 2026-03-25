"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, MapPin, CalendarDays } from 'lucide-react';

const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left: `${(i * 17.37) % 100}%`,
  top: `${(i * 29.13 + 11) % 100}%`,
  duration: 3 + (i % 5) * 0.8,
  delay: (i % 4) * 0.35,
  size: i % 3 === 0 ? 'w-1.5 h-1.5' : 'w-1 h-1',
}));

export default function HeroSection({ heroImage, onRegister }) {
  const scrollToAbout = () => {
    const el = document.querySelector('#about');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative h-screen min-h-175 flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroImage} alt="Summer Retreat Hero" className="w-full h-full object-cover" />
        {/* Multi-layer gradient for depth */}
        <div className="absolute inset-0 bg-linear-to-b from-slate-900/80 via-slate-900/40 to-slate-900/95" />
        <div className="absolute inset-0 bg-linear-to-r from-slate-900/40 via-transparent to-slate-900/40" />
      </div>

      {/* Ambient glow behind title */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-150 h-75 bg-amber-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {PARTICLES.map((particle) => (
          <motion.div
            key={particle.id}
            className={`absolute ${particle.size} bg-amber-400/30 rounded-full`}
            style={{ left: particle.left, top: particle.top }}
            animate={{ y: [-20, 20], opacity: [0.15, 0.7, 0.15] }}
            transition={{ duration: particle.duration, repeat: Infinity, delay: particle.delay }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">

        {/* Event badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-400/30 text-amber-300 tracking-[0.25em] uppercase text-xs font-bold px-5 py-2 rounded-full mb-8 backdrop-blur-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          Summer Retreat 2026
        </motion.div>

        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="font-black text-white tracking-tight leading-none mb-2 text-center whitespace-nowrap text-[min(8vw,7rem)] ml-[calc(50%-50vw)] w-screen drop-shadow-2xl"
        >
          BREAKTHROUGH
        </motion.h1>

        {/* Divider line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="flex items-center justify-center gap-4 mb-5"
        >
          <span className="h-px w-16 md:w-28 bg-linear-to-r from-transparent to-amber-400/60" />
          <span className="text-amber-400 text-lg">✦</span>
          <span className="h-px w-16 md:w-28 bg-linear-to-l from-transparent to-amber-400/60" />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="text-amber-300 text-xl md:text-2xl lg:text-3xl font-semibold tracking-widest uppercase mb-5 text-center"
        >
          &ldquo;Let Faith Arise&rdquo;
        </motion.p>

        {/* Scripture quote */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="text-white/80 text-sm md:text-base italic mb-10 text-center"
        >
          &ldquo;When the trumpets sounded&hellip; the wall collapsed.&rdquo; &ndash; Joshua 6:20
        </motion.p>

        {/* Event meta */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="flex flex-wrap justify-center gap-4 text-white/70 text-sm mb-10"
        >
          <span className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
            <CalendarDays size={14} className="text-amber-400" /> April 30 – May 2, 2026
          </span>
          <span className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
            <MapPin size={14} className="text-amber-400" /> Guronasyon Foundation Inc. NHS, Bilibiran, Binangonan, Rizal
          </span>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <button
            onClick={onRegister}
            className="relative overflow-hidden bg-amber-500 hover:bg-amber-400 text-slate-900 px-10 py-4 rounded-full font-black text-sm tracking-widest uppercase transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/40 hover:scale-105"
          >
            Register Now
          </button>
          <button
            onClick={scrollToAbout}
            className="border border-white/30 hover:border-amber-400/60 hover:text-amber-300 text-white px-10 py-4 rounded-full font-medium text-sm tracking-widest uppercase transition-all duration-300 backdrop-blur-sm"
          >
            Learn More
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