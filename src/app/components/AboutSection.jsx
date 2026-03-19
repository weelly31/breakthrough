"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Flame } from 'lucide-react';

const highlights = [
  { icon: Heart, title: 'Faith', desc: 'Deepen your relationship with Christ through worship and reflection.' },
  { icon: Users, title: 'Fellowship', desc: 'Build lifelong friendships with fellow young believers.' },
  { icon: Flame, title: 'Adventure', desc: 'Experience thrilling activities and unforgettable memories.' },
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
              <img src="img/journey.jpg" alt="Youth Camp Fellowship" className="w-full h-[400px] md:h-[500px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />
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
            <p className="text-amber-600 tracking-[0.2em] uppercase text-sm font-semibold mb-3">Welcome, Campers!</p>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-6">
              An Unforgettable Journey Awaits
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              Get ready for Youth Camp 2026 this May! Together, let's embark on a journey of faith, 
              friendship, and adventure. May this experience strengthen our hearts, deepen our connection 
              with Christ, and bring us lasting joy as we grow in His love. We can't wait to see you there!
            </p>
            <p className="text-slate-500 leading-relaxed mb-10">
             This 3-day camp is created to lead young people into a powerful breakthrough — overcoming struggles, breaking chains, 
             and stepping into the life God has called them to live. Through inspiring messages, passionate worship, and 
             meaningful fellowship, you will leave renewed, strengthened, and ready to walk in faith and freedom.
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
      </div>
    </section>
  );
}