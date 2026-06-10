"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import FAQSection from '@/components/Faq';
import HowItWorks from '@/components/HowItWork';
import Testimonials from '@/components/Testimonials';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks/>
      <Testimonials/>
      <FAQSection/>
      <CTA />
      <Footer />
    </div>
  );
};

export default Home;
