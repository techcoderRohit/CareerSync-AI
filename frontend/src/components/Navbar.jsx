'use client';

import React, { useState, useEffect } from 'react';
import { Briefcase, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    if (pathname !== '/') return;

    const handleScroll = () => {
      const featuresElement = document.getElementById('features');
      if (!featuresElement) return;

      const scrollPosition = window.scrollY;
      const featuresTop = featuresElement.offsetTop - 150; // offset for navbar

      if (scrollPosition >= featuresTop) {
        setActiveSection('features');
      } else {
        setActiveSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const getLinkClass = (href) => {
    let isActive = false;

    if (pathname === '/') {
      if (href === '/') {
        isActive = activeSection === 'home';
      } else if (href === '/#features') {
        isActive = activeSection === 'features';
      }
    } else {
      isActive = pathname === href;
    }

    return `text-sm font-semibold pb-1 transition-all duration-300 border-b-2 ${
      isActive 
        ? 'text-violet-600 border-violet-600' 
        : 'text-gray-600 hover:text-violet-600 border-transparent hover:border-violet-600'
    }`;
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-violet-50 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          
          {/* 1. Logo Section */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 lg:w-9 lg:h-9 bg-violet-600 rounded-lg flex items-center justify-center shadow-lg shadow-violet-200">
              <Briefcase className="text-white" size={18} />
            </div>
            <span className="text-lg lg:text-xl font-bold tracking-tight text-gray-900">
              CareerSync <span className="text-violet-600">AI</span>
            </span>
          </Link>

          {/* 2. Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className={getLinkClass('/')}>
              Home
            </Link>
            <Link href="/#features" className={getLinkClass('/#features')}>
              Features
            </Link>
            <Link href="/jobs" className={getLinkClass('/jobs')}>
              Jobs
            </Link>
            <Link href="/analyzer" className={getLinkClass('/analyzer')}>
              Resume Analyzer
            </Link>
            <Link href="/contact" className={getLinkClass('/contact')}>
              Contact
            </Link>
          </div>

          {/* 3. Right Side Buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/auth/login" className="px-5 py-2.5 text-sm font-bold text-gray-700 hover:text-violet-600 transition-all">
              Login
            </Link>
            <Link href="/auth/signup" className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-violet-100 transition-all active:scale-95">
              Get Started
            </Link>
          </div>

          {/* 4. Mobile Hamburger Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-gray-600 p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* 5. Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden bg-violet-50 border-b border-gray-100 absolute w-full left-0 p-6 space-y-5 shadow-xl animate-fade-in">
          <Link href="/" className={`block text-base ${pathname === '/' && activeSection === 'home' ? 'font-bold text-violet-600' : 'font-semibold text-gray-700'}`}>Home</Link>
          <Link href="/#features" className={`block text-base ${pathname === '/' && activeSection === 'features' ? 'font-bold text-violet-600' : 'font-semibold text-gray-700 hover:text-violet-600'}`}>Features</Link>
          <Link href="/jobs" className={`block text-base ${pathname === '/jobs' ? 'font-bold text-violet-600' : 'font-semibold text-gray-700'}`}>Jobs</Link>
          <Link href="/analyzer" className={`block text-base ${pathname === '/analyzer' ? 'font-bold text-violet-600' : 'font-semibold text-gray-700'}`}>Resume Analyzer</Link>
          <Link href="/contact" className={`block text-base ${pathname === '/contact' ? 'font-bold text-violet-600' : 'font-semibold text-gray-700'}`}>Contact</Link>
          
          <div className="pt-4 flex flex-col gap-3">
            <Link href="/auth/login" className="w-full py-3.5 text-center text-gray-700 font-bold border border-gray-100 rounded-xl bg-gray-50">
              Login
            </Link>
            <Link href="/auth/signup" className="w-full py-3.5 text-center bg-violet-600 text-white font-bold rounded-xl shadow-lg">
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
