"use client";

import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ActivitiesSection from './components/ActivitiesSection';
import GallerySection from './components/GallerySection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import RegisterModal from './components/RegisterModal';

const IMAGES = {
  hero: '/img/bg.png',
  about: '/img/journey.jpg',
  activities: [
    '/img/worship.jpg',
    '/img/teambuilding.jpg',
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

  return (
    <div className="min-h-screen bg-white">
      <Navbar onRegister={() => setRegisterOpen(true)} />
      <HeroSection heroImage={IMAGES.hero} onRegister={() => setRegisterOpen(true)} />
      <AboutSection aboutImage={IMAGES.about} />
      <ActivitiesSection images={IMAGES.activities} />
      <GallerySection galleryImages={IMAGES.gallery} />
      <ContactSection onRegister={() => setRegisterOpen(true)} />
      <Footer onRegister={() => setRegisterOpen(true)} />
      <RegisterModal isOpen={registerOpen} onClose={() => setRegisterOpen(false)} />
    </div>
  );
}