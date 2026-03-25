"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Sparkles, MapPin, CalendarDays } from 'lucide-react';
import confetti from 'canvas-confetti';

const SG_LEADER_OPTIONS = [
  'PTR. ALLEN',
  'KIM',
  'KEVIN',
  'JOYCE',
  'MJ',
  'JZ',
  'ROUIE',
  'IAN',
  'SHEELAH',
  'LUIZ',
  'BEA',
  'MARIE JOYCE',
  'NO SG LEADER YET',
  'FROM OTHER CHURCH',
];

const CHRISTIAN_DURATION_OPTIONS = [
  '0 - 1 YEAR',
  '2 - 5 YEARS',
  '6 - 10 YEARS',
  '10 YEARS ABOVE',
];

const initialForm = {
  full_name: '', preferred_name: '', phone: '', age: '', gender: '',
  church: '', small_group_leader: '', other_church: '', christian_duration: '',
  emergency_contact_name: '', emergency_contact_number: '', emergency_contact_relation: '',
};

const UPPERCASE_FIELDS = new Set([
  'full_name',
  'preferred_name',
  'church',
  'other_church',
  'emergency_contact_name',
  'emergency_contact_relation',
]);

const PHONE_FIELDS = new Set(['phone', 'emergency_contact_number']);

function sanitizePhoneInput(value) {
  const input = String(value ?? '');
  const hasLeadingPlus = input.startsWith('+');
  const digitsOnly = input.replace(/\D/g, '');
  return hasLeadingPlus ? `+${digitsOnly}` : digitsOnly;
}

function normalizePhilippineMobile(value) {
  const cleaned = String(value ?? '').trim().replace(/[\s()-]/g, '');
  if (/^09\d{9}$/.test(cleaned)) return `+63${cleaned.slice(1)}`;
  if (/^\+639\d{9}$/.test(cleaned)) return cleaned;
  if (/^639\d{9}$/.test(cleaned)) return `+${cleaned}`;
  return null;
}

function isValidName(value) {
  return /^[A-Za-z\s]+$/.test(String(value ?? '').trim());
}

function Field({ label, name, type = 'text', placeholder, value, onChange, error, inputMode, pattern }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(name, e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        pattern={pattern}
        className={`w-full bg-white/5 border rounded-xl px-4 py-2.5 text-white placeholder:text-slate-500 text-sm outline-none transition-all focus:ring-2 focus:ring-amber-400/40 ${
          error ? 'border-red-400/60' : 'border-white/10 focus:border-amber-400/50'
        }`}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

export default function RegisterModal({ isOpen, onClose }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [reviewMode, setReviewMode] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (isOpen) { setForm(initialForm); setErrors({}); setSubmitError(''); setReviewMode(false); setDone(false); }
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const set = (field, val) => setForm(f => {
    let nextValue = val;

    if (PHONE_FIELDS.has(field)) {
      nextValue = sanitizePhoneInput(val);
    }

    if (UPPERCASE_FIELDS.has(field)) {
      nextValue = String(nextValue ?? '').toUpperCase();
    }

    if (field === 'small_group_leader' && val !== 'FROM OTHER CHURCH') {
      return {
        ...f,
        small_group_leader: val,
        other_church: '',
      };
    }

    return {
      ...f,
      [field]: nextValue,
    };
  });

  const validate = () => {
    const e = {};
    if (!form.full_name.trim()) e.full_name = 'Required';
    if (form.full_name.trim() && !isValidName(form.full_name)) {
      e.full_name = 'Name must contain letters and spaces only';
    }
    if (!form.preferred_name.trim()) e.preferred_name = 'Required';
    if (form.preferred_name.trim() && !isValidName(form.preferred_name)) {
      e.preferred_name = 'Preferred name must contain letters and spaces only';
    }
    if (!form.phone.trim()) e.phone = 'Required';
    if (form.phone.trim() && !normalizePhilippineMobile(form.phone)) {
      e.phone = 'Use PH mobile format: 09XXXXXXXXX, +639XXXXXXXXX, or 639XXXXXXXXX';
    }
    if (!form.age || isNaN(form.age) || +form.age < 12 || +form.age > 35) e.age = 'Age must be 12-35';
    if (!form.gender) e.gender = 'Required';
    if (!form.church.trim()) e.church = 'Required';
    if (!form.small_group_leader) e.small_group_leader = 'Required';
    if (form.small_group_leader === 'FROM OTHER CHURCH' && !form.other_church.trim()) {
      e.other_church = 'Please specify your church';
    }
    if (!form.christian_duration) e.christian_duration = 'Required';
    if (!form.emergency_contact_name.trim()) e.emergency_contact_name = 'Required';
    if (form.emergency_contact_name.trim() && !isValidName(form.emergency_contact_name)) {
      e.emergency_contact_name = 'Emergency contact name must contain letters and spaces only';
    }
    if (!form.emergency_contact_number.trim()) e.emergency_contact_number = 'Required';
    if (form.emergency_contact_number.trim() && !normalizePhilippineMobile(form.emergency_contact_number)) {
      e.emergency_contact_number = 'Use PH mobile format: 09XXXXXXXXX, +639XXXXXXXXX, or 639XXXXXXXXX';
    }
    if (!form.emergency_contact_relation.trim()) e.emergency_contact_relation = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;

    const normalizedPhone = normalizePhilippineMobile(form.phone);
    const normalizedEmergencyPhone = normalizePhilippineMobile(form.emergency_contact_number);
    if (!normalizedPhone || !normalizedEmergencyPhone) {
      setSubmitError('Please enter valid Philippine mobile numbers.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          phone: normalizedPhone,
          emergency_contact_number: normalizedEmergencyPhone,
          age: Number(form.age),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || 'Failed to submit registration.');
      }

      setSubmitting(false);
      setDone(true);
      confetti({ particleCount: 160, spread: 90, origin: { y: 0.5 }, colors: ['#f59e0b', '#fbbf24', '#fde68a', '#fff'] });
    } catch (err) {
      setSubmitError(err?.message || 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  const openReview = () => {
    if (!validate()) return;
    setSubmitError('');
    setReviewMode(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.93, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: 'spring', duration: 0.45 }}
            className="relative w-full max-w-lg bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 pt-5 sm:pt-6 pb-4 shrink-0 border-b border-white/5 gap-3">
              <div>
                <p className="text-amber-400 text-xs tracking-[0.25em] uppercase font-bold">Summer Retreat 2026</p>
                <h2 className="text-white text-lg sm:text-xl font-black leading-tight">Register Now</h2>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all">
                <X size={16} />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5">
              {done ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center py-10 gap-4"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.6 }}
                    className="w-20 h-20 rounded-full bg-amber-500/10 ring-2 ring-amber-400 flex items-center justify-center"
                  >
                    <Sparkles size={36} className="text-amber-400" />
                  </motion.div>
                  <h3 className="text-2xl font-black text-white">You&apos;re Registered! 🎉</h3>
                  <p className="text-slate-400 text-sm">Welcome, <span className="text-amber-400 font-semibold">{form.preferred_name.trim() || form.full_name}</span>! See you at the retreat!</p>
                  <div className="bg-white/5 rounded-2xl p-5 w-full text-left space-y-2 text-sm mt-2">
                    <div className="flex items-center gap-2 text-slate-400"><CalendarDays size={14} className="text-amber-400" /> April 30 – May 2, 2026</div>
                    <div className="flex items-center gap-2 text-slate-400"><MapPin size={14} className="text-amber-400" /> Guronasyon Foundation Inc. NHS, Bilibiran, Binangonan, Rizal</div>
                    <div className="flex justify-between pt-2 border-t border-white/5">
                      <span className="text-slate-400">Registration Fee</span>
                      <span className="text-amber-400 font-bold">₱500</span>
                    </div>
                  </div>
                  <button onClick={onClose} className="mt-2 bg-amber-500 hover:bg-amber-400 text-slate-900 px-8 py-3 rounded-full text-sm font-bold transition-all">
                    Close
                  </button>
                </motion.div>
              ) : reviewMode ? (
                <div className="space-y-5">
                  <div>
                    <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-3">Review Details</p>
                    <div className="bg-white/5 rounded-2xl border border-white/10 divide-y divide-white/10">
                      <div className="grid sm:grid-cols-2 gap-1 sm:gap-4 px-4 py-3 text-sm">
                        <p className="text-slate-400">Full Name</p>
                        <p className="text-white sm:text-right wrap-break-word">{form.full_name}</p>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-1 sm:gap-4 px-4 py-3 text-sm">
                        <p className="text-slate-400">Preferred Name</p>
                        <p className="text-white sm:text-right wrap-break-word">{form.preferred_name}</p>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-1 sm:gap-4 px-4 py-3 text-sm">
                        <p className="text-slate-400">Contact Number</p>
                        <p className="text-white sm:text-right break-all">{normalizePhilippineMobile(form.phone) || form.phone}</p>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-1 sm:gap-4 px-4 py-3 text-sm">
                        <p className="text-slate-400">Age / Gender</p>
                        <p className="text-white sm:text-right wrap-break-word">{form.age} / {form.gender}</p>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-1 sm:gap-4 px-4 py-3 text-sm">
                        <p className="text-slate-400">Home Church / Ministry</p>
                        <p className="text-white sm:text-right wrap-break-word">{form.church}</p>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-1 sm:gap-4 px-4 py-3 text-sm">
                        <p className="text-slate-400">Small Group Leader</p>
                        <p className="text-white sm:text-right wrap-break-word">{form.small_group_leader}</p>
                      </div>
                      {form.small_group_leader === 'FROM OTHER CHURCH' && (
                        <div className="grid sm:grid-cols-2 gap-1 sm:gap-4 px-4 py-3 text-sm">
                          <p className="text-slate-400">Other Church</p>
                          <p className="text-white sm:text-right wrap-break-word">{form.other_church || '-'}</p>
                        </div>
                      )}
                      <div className="grid sm:grid-cols-2 gap-1 sm:gap-4 px-4 py-3 text-sm">
                        <p className="text-slate-400">How long have you been a Christian?</p>
                        <p className="text-white sm:text-right wrap-break-word">{form.christian_duration}</p>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-1 sm:gap-4 px-4 py-3 text-sm">
                        <p className="text-slate-400">Emergency Contact</p>
                        <p className="text-white sm:text-right wrap-break-word">{form.emergency_contact_name}</p>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-1 sm:gap-4 px-4 py-3 text-sm">
                        <p className="text-slate-400">Emergency Number</p>
                        <p className="text-white sm:text-right break-all">{normalizePhilippineMobile(form.emergency_contact_number) || form.emergency_contact_number}</p>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-1 sm:gap-4 px-4 py-3 text-sm">
                        <p className="text-slate-400">Relationship</p>
                        <p className="text-white sm:text-right wrap-break-word">{form.emergency_contact_relation}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-400 text-xs">Please confirm your details before final submission.</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Personal Info */}
                  <div>
                    <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-3">Personal Info</p>
                    <div className="space-y-3">
                      <Field label="Full Name" name="full_name" placeholder="Juan dela Cruz" value={form.full_name} onChange={set} error={errors.full_name} />
                      <Field label="Nickname / Preferred Name" name="preferred_name" placeholder="What should we call you?" value={form.preferred_name} onChange={set} error={errors.preferred_name} />
                      <Field label="Contact Number" name="phone" type="tel" placeholder="09XXXXXXXXX" value={form.phone} onChange={set} error={errors.phone} inputMode="numeric" pattern="^\+?\d*$" />
                      <div className="grid sm:grid-cols-2 gap-3">
                        <Field label="Age" name="age" type="number" placeholder="18" value={form.age} onChange={set} error={errors.age} />
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Gender</label>
                          <div className="flex gap-2">
                            {['Male', 'Female'].map(g => (
                              <button key={g} type="button" onClick={() => set('gender', g)}
                                className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                                  form.gender === g ? 'bg-amber-500 border-amber-500 text-slate-900' : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/30'
                                }`}>
                                {g}
                              </button>
                            ))}
                          </div>
                          {errors.gender && <p className="text-red-400 text-xs mt-1">{errors.gender}</p>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Group Info */}
                  <div>
                    <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-3">Group & Faith Info</p>
                    <div className="space-y-3">
                      <Field
                        label="Home Church / Ministry"
                        name="church"
                        placeholder="Enter your church or ministry"
                        value={form.church}
                        onChange={set}
                        error={errors.church}
                      />

                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Small Group Leader</label>
                        <select
                          value={form.small_group_leader}
                          onChange={(e) => set('small_group_leader', e.target.value)}
                          className={`w-full bg-white/5 border rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-all focus:ring-2 focus:ring-amber-400/40 ${
                            errors.small_group_leader ? 'border-red-400/60' : 'border-white/10 focus:border-amber-400/50'
                          }`}
                        >
                          <option value="" className="text-slate-900">Select SG Leader</option>
                          {SG_LEADER_OPTIONS.map((leader) => (
                            <option key={leader} value={leader} className="text-slate-900">
                              {leader}
                            </option>
                          ))}
                        </select>
                        {errors.small_group_leader && <p className="text-red-400 text-xs mt-1">{errors.small_group_leader}</p>}
                      </div>

                      {form.small_group_leader === 'FROM OTHER CHURCH' && (
                        <Field
                          label="From Other Church (Please specify)"
                          name="other_church"
                          placeholder="Type your church name"
                          value={form.other_church}
                          onChange={set}
                          error={errors.other_church}
                        />
                      )}

                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">How long have you been a Christian?</label>
                        <select
                          value={form.christian_duration}
                          onChange={(e) => set('christian_duration', e.target.value)}
                          className={`w-full bg-white/5 border rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-all focus:ring-2 focus:ring-amber-400/40 ${
                            errors.christian_duration ? 'border-red-400/60' : 'border-white/10 focus:border-amber-400/50'
                          }`}
                        >
                          <option value="" className="text-slate-900">Select duration</option>
                          {CHRISTIAN_DURATION_OPTIONS.map((duration) => (
                            <option key={duration} value={duration} className="text-slate-900">
                              {duration}
                            </option>
                          ))}
                        </select>
                        {errors.christian_duration && <p className="text-red-400 text-xs mt-1">{errors.christian_duration}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div>
                    <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-3">Emergency Contact</p>
                    <div className="space-y-3">
                      <Field label="Name" name="emergency_contact_name" placeholder="Full name" value={form.emergency_contact_name} onChange={set} error={errors.emergency_contact_name} />
                      <div className="grid sm:grid-cols-2 gap-3">
                        <Field label="Contact Number" name="emergency_contact_number" type="tel" placeholder="09XXXXXXXXX" value={form.emergency_contact_number} onChange={set} error={errors.emergency_contact_number} inputMode="numeric" pattern="^\+?\d*$" />
                        <Field label="Relationship" name="emergency_contact_relation" placeholder="e.g. Parent" value={form.emergency_contact_relation} onChange={set} error={errors.emergency_contact_relation} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {!done && (
              <div className="shrink-0 px-4 sm:px-6 py-4 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-slate-500 text-xs">Fee: <span className="text-amber-400 font-bold">₱500</span></p>
                  {submitError && <p className="text-red-400 text-xs mt-1">{submitError}</p>}
                </div>
                <div className="flex flex-col sm:flex-row w-full sm:w-auto items-stretch sm:items-center gap-2">
                  {reviewMode && (
                    <button
                      onClick={() => setReviewMode(false)}
                      disabled={submitting}
                      className="border border-white/20 hover:border-white/40 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
                    >
                      Back to Edit
                    </button>
                  )}
                  <button
                    onClick={reviewMode ? submit : openReview}
                    disabled={submitting}
                    className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-70 text-slate-900 px-7 py-2.5 rounded-full text-sm font-bold transition-all"
                  >
                    {submitting
                      ? <><Loader2 size={15} className="animate-spin" /> Submitting...</>
                      : reviewMode
                        ? <><Sparkles size={15} /> Final Submit</>
                        : <><Sparkles size={15} /> Review Details</>}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
