"use client";

import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Activities', href: '#activities' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar({ onRegister }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (href) => {
    const target = document.querySelector(href);
    if (!target) return;

    const doScroll = () => {
      const navEl = document.querySelector('nav');
      const navHeight = navEl ? navEl.getBoundingClientRect().height : 80;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;
      window.history.replaceState(null, '', href);
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    };

    if (mobileOpen) {
      setMobileOpen(false);
      // Wait for mobile menu close animation before scrolling.
      setTimeout(doScroll, 220);
      return;
    }

    doScroll();
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-slate-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
        <button
          onClick={() => scrollTo('#hero')}
          className="text-white font-bold text-sm sm:text-base lg:text-xl tracking-wide sm:tracking-wider text-left leading-tight max-w-[75%]"
        >
          SUMMER <span className="text-amber-400">RETREAT</span> 2026
        </button>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map(link => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="text-white/80 hover:text-amber-400 text-sm font-medium tracking-wide transition-colors duration-300"
            >
              {link.label}
            </button>
          ))}
          {/* <Link
            href="/admin"S
            className="text-white/80 hover:text-amber-400 text-sm font-medium tracking-wide transition-colors duration-300"
          >
            Admin
          </Link> */}
          <button
            onClick={onRegister}
            className="bg-amber-500 hover:bg-amber-400 text-slate-900 px-5 py-2 rounded-full text-sm font-semibold tracking-wide transition-all duration-300"
          >
            Register Now
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden text-white shrink-0"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-slate-900/98 backdrop-blur-md border-t border-white/10 overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {navLinks.map(link => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="text-white/80 hover:text-amber-400 text-left py-2 text-base font-medium tracking-wide transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onRegister();
                }}
                className="bg-amber-500 text-slate-900 px-5 py-3 rounded-full text-sm font-semibold tracking-wide mt-2"
              >
                Register Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}