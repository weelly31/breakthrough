"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Music, Users, Flame, BookOpen } from 'lucide-react';

const activities = [
  {
    icon: Music,
    title: 'Worship Sessions',
    description: 'Experience the presence of God through heartfelt music, prayer, and deep reflection. Let your spirit soar as we praise together.',
  },
  {
    icon: Users,
    title: 'Team Building Games',
    description: 'Engage in exciting games designed to build trust, strengthen friendships, and promote teamwork among campers.',
  },
  {
    icon: Flame,
    title: 'Campfire Nights',
    description: 'Gather around the fire for stories, songs, and unforgettable moments under the stars with your camp family.',
  },
  {
    icon: BookOpen,
    title: 'Bible Study Groups',
    description: 'Deepen your faith through interactive group discussions and reflections on God\'s word with experienced mentors.',
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
          <p className="text-amber-600 tracking-[0.2em] uppercase text-sm font-semibold mb-3">What We Do</p>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Camp Activities</h2>
          <p className="text-slate-500 text-lg">
            From high-energy games to soul-stirring worship, every moment at camp is designed to draw you closer to God and each other.
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
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />
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