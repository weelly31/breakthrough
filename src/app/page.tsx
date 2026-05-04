"use client";

import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ActivitiesSection from './components/ActivitiesSection';
import PlaylistSection from './components/PlaylistSection';
import GallerySection from './components/GallerySection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import RegisterModal from './components/RegisterModal';

const REGISTRATION_CLOSED = true;

function RegistrationClosedModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 text-center shadow-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-400">Announcement</p>
        <h3 className="mt-3 text-2xl font-black uppercase text-white">Registration Closed</h3>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          The retreat has officially concluded, and registration is now closed.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          Thank you for your support, participation, and prayers. We are grateful for the opportunity to come together in faith and fellowship.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          May this experience continue to inspire us all to grow deeper in our relationship with God and to live out His purpose in our daily lives.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          Please stay tuned for future event announcements.
        </p>

        <button
          onClick={onClose}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-amber-500 px-6 py-2.5 text-sm font-bold text-slate-900 transition-colors hover:bg-amber-400"
        >
          Close
        </button>
      </div>
    </div>
  );
}

const IMAGES = {
  hero: '/img/5.png',
  about: '/img/journey.jpg',
  activities: [
    '/img/worship.jpg',
    '/img/activities.jpg',
    '/img/campfire.jpg',
    '/img/fellowship.jpg',
  ],
  gallery: [
    '/img/gallery1.jpg',
    '/img/gallery2.jpg',
    '/img/gallery3.jpg',
    '/img/gallery4.jpg',
    '/img/gallery5.jpg',
    '/img/gallery7.jpg',
    '/img/gallery6.jpg',
  ],
};

export default function Home() {
  const [registerOpen, setRegisterOpen] = useState(false);
  const [closedNoticeOpen, setClosedNoticeOpen] = useState(false);

  const handleRegisterClick = () => {
    if (REGISTRATION_CLOSED) {
      setClosedNoticeOpen(true);
      return;
    }

    setRegisterOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar onRegister={handleRegisterClick} />
      <HeroSection heroImage={IMAGES.hero} onRegister={handleRegisterClick} />
      <AboutSection aboutImage={IMAGES.about} />
      <ActivitiesSection images={IMAGES.activities} />
      <PlaylistSection />
      <GallerySection galleryImages={IMAGES.gallery} />
      <ContactSection onRegister={handleRegisterClick} />
      <Footer onRegister={handleRegisterClick} />
      <RegisterModal isOpen={registerOpen} onClose={() => setRegisterOpen(false)} />
      <RegistrationClosedModal isOpen={closedNoticeOpen} onClose={() => setClosedNoticeOpen(false)} />
    </div>
  );
}