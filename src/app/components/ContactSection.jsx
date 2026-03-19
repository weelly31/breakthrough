"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, Phone } from 'lucide-react';
import { toast } from 'sonner';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
const CONTACT_RECEIVER_EMAIL = process.env.NEXT_PUBLIC_CONTACT_RECEIVER_EMAIL || 'weellandrade31@gmail.com';

export default function ContactSection({ onRegister }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all fields.');
      return;
    }

    const isEmailValid = /\S+@\S+\.\S+/.test(form.email);
    if (!isEmailValid) {
      toast.error('Please enter a valid email address.');
      return;
    }

    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      toast.error('Email is not configured yet. Please set EmailJS environment variables.');
      return;
    }

    setSending(true);
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
          to_email: CONTACT_RECEIVER_EMAIL,
          reply_to: form.email,
        },
        EMAILJS_PUBLIC_KEY,
      );

      setForm({ name: '', email: '', message: '' });
      toast.success('Message sent! We\'ll get back to you soon.');
    } catch (error) {
      const status = error?.status;
      const text = error?.text;

      if (status === 412 && text?.includes('Invalid grant')) {
        toast.error('Email service needs reconnection. Please reconnect Gmail in EmailJS first.');
        console.error('EmailJS send failed:', error);
        return;
      }

      if (error instanceof EmailJSResponseStatus) {
        const details = text ? ` ${text}` : '';
        toast.error(`Failed to send message (${status}).${details}`);
      } else if (status || text) {
        const prefix = status ? `(${status}) ` : '';
        toast.error(`Failed to send message ${prefix}${text || ''}`.trim());
      } else {
        toast.error('Failed to send message. Please try again.');
      }

      console.error('EmailJS send failed:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-slate-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-amber-400 tracking-[0.2em] uppercase text-sm font-semibold mb-3">Get In Touch</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Contact & Register</h2>
          <p className="text-slate-400 text-lg mb-6">
            Have questions? Reach out and we'll help you get started on this amazing journey.
          </p>
          <button
            onClick={onRegister}
            className="bg-amber-500 hover:bg-amber-400 text-slate-900 px-8 py-4 rounded-full font-bold text-sm tracking-wider transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/25"
          >
            Register for Camp →
          </button>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-8"
          >
            <div>
              <h3 className="text-xl font-bold text-white mb-6">Camp Details</h3>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin size={18} className="text-amber-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Venue</p>
                    <p className="text-slate-400 text-sm">Methodist Prayer Garden & Conference Site, Tikling, Taytay, Rizal</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone size={18} className="text-amber-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Registration Fee</p>
                    <p className="text-slate-400 text-sm">₱500 per person</p>
                  </div>
                </div>
                {/* <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail size={18} className="text-amber-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Email</p>
                    <p className="text-slate-400 text-sm">youthcamp2026@church.com</p>
                  </div>
                </div> */}
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-300 font-medium mb-2 block">Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your full name"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-300 font-medium mb-2 block">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-300 font-medium mb-2 block">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us what you'd like to know or register for camp..."
                  rows={5}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-amber-500 transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-3 rounded-xl transition-all duration-300"
              >
                <Send size={16} /> {sending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}