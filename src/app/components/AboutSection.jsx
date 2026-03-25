"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Flame, Backpack, CheckCircle2 } from 'lucide-react';

const whatToBring = [
  'Own beddings (Blanket, banig, or sleeping bag)',
  'Personal hygiene kit',
  'Extra clothes',
  'Bible, notebook, and pen',
];

const whoCanJoin = [
  'All youth and young professionals — whether your faith is on fire, growing, or just starting, this retreat is for you',
  'Anyone ready to experience breakthrough, grow closer to God, and be inspired',
];

const highlights = [
  { icon: Heart, title: 'Encounter', desc: 'A personal encounter with God where walls fall, fears break, and faith rises.' },
  { icon: Users, title: 'Community', desc: 'Connect with fellow youth and young professionals of The Living Saviour Christian Fellowship.' },
  { icon: Flame, title: 'Purpose', desc: 'Step into His purpose and walk in renewed faith, strength, and freedom.' },
];

export default function AboutSection({ aboutImage }) {
  return (
    <section id="about" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img src={aboutImage} alt="Summer Retreat Fellowship" className="w-full h-100 md:h-125 object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-slate-900/30 to-transparent" />
            </div>
            {/* Decorative accent */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-amber-400/20 rounded-2xl -z-10" />
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-slate-200 rounded-2xl -z-10" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-amber-600 tracking-[0.2em] uppercase text-sm font-semibold mb-3">About the Retreat</p>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-6">
              Let Faith Arise
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              Feeling on fire, or feeling distant from God? This Summer Retreat 2026 is for you! A powerful encounter where walls fall, fears break, and faith rises. Come ready to experience breakthrough, deepen your walk with God, and step into His purpose.
            </p>
            <p className="text-slate-500 leading-relaxed mb-10">
              The Living Saviour Christian Fellowship invites all our youth and young professionals to join this first-ever retreat. Whether your faith is on fire, growing, or just starting — your breakthrough starts here. Let your faith arise!
            </p>

            <div className="grid sm:grid-cols-3 gap-6">
              {highlights.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="text-center sm:text-left">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-50 text-amber-600 mb-3">
                    <Icon size={22} />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* What to Bring & Who Can Join */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-20 grid md:grid-cols-2 gap-8"
        >
          {/* What to Bring */}
          <div className="bg-amber-50 rounded-2xl p-8 border border-amber-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Backpack size={20} className="text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">What to Bring</h3>
            </div>
            <ul className="space-y-3">
              {whatToBring.map((item) => (
                <li key={item} className="flex items-start gap-3 text-slate-600 text-sm leading-relaxed">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-amber-400/20 flex items-center justify-center shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 block" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Who Can Join */}
          <div className="bg-slate-900 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <CheckCircle2 size={20} className="text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Who Can Join?</h3>
            </div>
            <ul className="space-y-4">
              {whoCanJoin.map((item) => (
                <li key={item} className="flex items-start gap-3 text-slate-300 text-sm leading-relaxed">
                  <CheckCircle2 size={16} className="text-amber-400 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-amber-400 text-sm font-semibold italic">
              Your breakthrough starts here. Let your faith arise!
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}