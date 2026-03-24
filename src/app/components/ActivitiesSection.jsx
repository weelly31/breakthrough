"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Music, Users, Flame, BookOpen } from 'lucide-react';

const activities = [
  {
    icon: Music,
    title: 'Powerful Worship',
    description: 'Experience life-changing worship and messages that stir your spirit and draw you into the presence of God.',
  },
  {
    icon: Users,
    title: 'Small Group Sessions',
    description: 'Deep and honest small group discussions where you can be real, grow in faith, and build meaningful connections.',
  },
  {
    icon: Flame,
    title: 'Fun Activities',
    description: 'Enjoy engaging activities and games designed to create lasting memories and strengthen bonds among participants.',
  },
  {
    icon: BookOpen,
    title: 'Personal Encounter with God',
    description: 'Experience a renewed and stronger faith as you step into a personal breakthrough and walk in God\'s purpose for your life.',
  },
];

export default function ActivitiesSection({ images }) {
  return (
    <section id="activities" className="py-24 md:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-amber-600 tracking-[0.2em] uppercase text-sm font-semibold mb-3">What to Expect</p>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Retreat Activities</h2>
          <p className="text-slate-500 text-lg">
            From heartfelt worship to honest small group sessions, every moment at the retreat is designed to bring you closer to God and to each other.
          </p>
        </motion.div>

        {/* Activities Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {activities.map((activity, i) => {
            const Icon = activity.icon;
            return (
              <motion.div
                key={activity.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={images[i]}
                    alt={activity.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-900/70 via-slate-900/20 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-amber-500 text-white">
                      <Icon size={20} />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{activity.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{activity.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}