"use client";

import Image from 'next/image';
import React from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, ChevronDown, MapPin } from 'lucide-react';

export default function HeroSection({ heroImage, onRegister }) {
  const scrollToAbout = () => {
    const el = document.querySelector('#about');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-svh overflow-hidden bg-[#09141a] pt-20 sm:pt-28">
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt="Breakthrough Summer Retreat poster background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#8eb8d4]/30 via-transparent via-35% to-[#2f190d]/30" />
        <div className="absolute inset-0 bg-linear-to-b from-[#07131e]/36 via-transparent to-[#130a06]/62" />
        <div className="absolute inset-0 bg-linear-to-r from-[#07131e]/22 via-transparent to-[#1c140f]/26" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-linear-to-b from-[#d4e8f5]/18 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-[#d89d6f]/42 to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-5rem)] w-full max-w-375 flex-col justify-center gap-5 px-4 pb-5 sm:min-h-[calc(100svh-7rem)] sm:justify-between sm:gap-0 sm:px-6 sm:pb-10 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="pt-4 text-center text-white"
        >
        
          <p className="mt-2 text-[13px] font-semibold uppercase tracking-[0.48em] text-white/95 sm:text-xl sm:tracking-[0.72em]">
             The Living Saviour Christian Fellowship
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, delay: 0.12 }}
          className="flex flex-col items-center justify-center pt-1 text-center sm:flex-1 sm:pt-0"
        >
          <div className="flex w-full justify-center px-1 sm:px-4">
            <h1 className="poster-title uppercase text-center text-white drop-shadow-[0_18px_28px_rgba(0,0,0,0.25)]">
              Breakthrough
            </h1>
          </div>
          <p className="mt-3 text-[clamp(1.35rem,4vw,4rem)] font-black uppercase tracking-[-0.04em] text-white sm:mt-4">
            Let Faith Arise
          </p>
          <div className="mt-3.5 w-full max-w-240 rounded-[1.75rem] border border-white/12 bg-linear-to-br from-black/38 via-black/24 to-[#9c693d]/20 px-4 py-4 shadow-[0_24px_60px_rgba(0,0,0,0.22)] backdrop-blur-xs sm:mt-5 sm:px-6 sm:py-5">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-linear-to-r from-transparent to-[#f1d2a8] sm:w-16" />
              <p className="text-xs font-black uppercase tracking-[0.35em] text-[#f8e4c9] sm:text-sm">
                Joshua 6:20
              </p>
              <span className="h-px w-10 bg-linear-to-l from-transparent to-[#f1d2a8] sm:w-16" />
            </div>
            <p className="mx-auto mt-3 max-w-215 px-1 text-sm leading-snug text-white/95 sm:text-lg md:text-[1.5rem] md:leading-tight">
              &ldquo;When the trumpets sounded, the army shouted, and at the sound of the trumpet,
              when the men gave a loud shout, the wall collapsed.&rdquo;
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.28 }}
          className="mx-auto flex w-full max-w-5xl flex-col items-center gap-3 pb-3 text-center sm:gap-4 sm:pb-8"
        >
          <div className="flex w-full flex-col items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/92 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-3 sm:text-sm sm:tracking-[0.22em]">
            <span className="inline-flex w-full max-w-sm items-center justify-center gap-2 rounded-full border border-white/28 bg-black/16 px-4 py-2 text-center backdrop-blur-[2px] sm:w-auto">
              <CalendarDays size={14} className="text-[#f0d5b5]" />
              April 30 - May 2, 2026
            </span>
            <span className="inline-flex w-full max-w-sm items-center justify-center gap-2 rounded-[1.25rem] border border-white/28 bg-black/16 px-4 py-2 text-center backdrop-blur-[2px] sm:w-auto sm:max-w-md sm:px-5">
              <MapPin size={14} className="mt-0.5 shrink-0 text-[#f0d5b5]" />
              <span className="leading-tight tracking-[0.12em] sm:text-left sm:tracking-[0.16em]">
                <span className="block">Guronasyon Foundation Inc. NHS</span>
              </span>
            </span>
          </div>

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <button
              onClick={onRegister}
              className="rounded-full border border-[#f7b24d]/70 bg-[#f59e0b] px-9 py-3 text-xs font-black uppercase tracking-[0.26em] text-[#1f1308] shadow-[0_18px_35px_rgba(245,158,11,0.35)] transition-all duration-300 hover:scale-[1.05] hover:bg-[#f7aa22] hover:shadow-[0_24px_45px_rgba(245,158,11,0.45)]"
            >
              Register Now
            </button>
            <button
              onClick={scrollToAbout}
              className="rounded-full border border-white/45 bg-white/10 px-9 py-3 text-xs font-black uppercase tracking-[0.26em] text-white shadow-[0_14px_30px_rgba(0,0,0,0.16)] backdrop-blur-[3px] transition-all duration-300 hover:scale-[1.03] hover:border-[#f6d39d]/75 hover:bg-white/16 hover:text-[#fff2dc]"
            >
              Learn More
            </button>
          </div>
        </motion.div>
      </div>

      <motion.button
        onClick={scrollToAbout}
        className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 text-white/60 transition-colors hover:text-white sm:bottom-6"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        aria-label="Scroll to about section"
      >
        <ChevronDown size={28} />
      </motion.button>
    </section>
  );
}