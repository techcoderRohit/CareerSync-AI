import React from 'react';
import { Mail, Phone, MapPin, Heart, Briefcase } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-violet-50 pt-24 pb-12 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-20">
          
          {/* Column 1: Branding */}
          <div className="lg:col-span-1 space-y-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-100">
                <Briefcase className="text-white" size={22} />
              </div>
              <span className="text-xl font-black tracking-tight text-gray-950">
                CareerSync <span className="text-violet-600">AI</span>
              </span>
            </Link>
            <p className="text-gray-500 text-sm font-medium leading-relaxed">
              Helping students build ATS-friendly resumes, prepare for interviews, track applications, and become placement-ready with AI-powered career tools.
            </p>
            <div className="flex items-center gap-3">
              <SocialIcon color="hover:bg-pink-50 hover:text-pink-600">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </SocialIcon>
              <SocialIcon color="hover:bg-blue-50 hover:text-blue-600">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </SocialIcon>
              <SocialIcon color="hover:bg-sky-50 hover:text-sky-500">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
              </SocialIcon>
              <SocialIcon color="hover:bg-red-50 hover:text-red-600">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.08C5.12 19.54 12 19.54 12 19.54s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </SocialIcon>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-8">
            <h4 className="font-black text-gray-950 uppercase tracking-widest text-xs">Quick Links</h4>
            <ul className="space-y-4 text-sm font-bold text-gray-500">
              <li><Link href="/" className="hover:text-violet-600 transition-colors">Home</Link></li>
              <li><Link href="/#features" className="hover:text-violet-600 transition-colors">Features</Link></li>
              <li><Link href="/jobs" className="hover:text-violet-600 transition-colors">Jobs</Link></li>
              <li><Link href="/contact" className="hover:text-violet-600 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Column 3: Features */}
          <div className="space-y-8">
            <h4 className="font-black text-gray-950 uppercase tracking-widest text-xs">Features</h4>
            <ul className="space-y-4 text-sm font-bold text-gray-500">
              <li><Link href="/analyzer" className="hover:text-violet-600 transition-colors">AI Resume Analyzer</Link></li>
              <li><Link href="/ats-checker" className="hover:text-violet-600 transition-colors">ATS Score Checker</Link></li>
              <li><Link href="/interview-prep" className="hover:text-violet-600 transition-colors">Interview Preparation</Link></li>
              <li><Link href="/tracking" className="hover:text-violet-600 transition-colors">Job Tracking</Link></li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div className="space-y-8">
            <h4 className="font-black text-gray-950 uppercase tracking-widest text-xs">Company</h4>
            <ul className="space-y-4 text-sm font-bold text-gray-500">
              <li><Link href="/about" className="hover:text-violet-600 transition-colors">About Us</Link></li>
              <li><Link href="/privacy" className="hover:text-violet-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-violet-600 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Column 5: Contact Us */}
          <div className="space-y-8">
            <h4 className="font-black text-gray-950 uppercase tracking-widest text-xs">Contact Us</h4>
            <div className="space-y-6">
              <ContactItem icon={<Mail size={20}/>} text="careersyncai@support.com" />
              <ContactItem icon={<Phone size={20}/>} text="+91 98765 43210" />
              <ContactItem icon={<MapPin size={20}/>} text="Lucknow, India" />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 text-sm font-bold text-gray-400">
          <p>© 2026 CareerSync AI. All rights reserved.</p>
          <div className="flex items-center gap-2 text-gray-500">
            Built with <Heart size={18} className="text-red-500 fill-red-500 animate-pulse"/> for students
          </div>
          <div className="flex items-center gap-8">
            <Link href="/privacy" className="hover:text-violet-600 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-violet-600 transition-colors">Terms</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

const SocialIcon = ({ children, color }) => (
    <div className={`w-11 h-11 bg-gray-50 text-gray-500 rounded-xl flex items-center justify-center transition-all ${color} border border-gray-100/50 cursor-pointer`}>
        {children}
    </div>
);

const ContactItem = ({ icon, text }) => (
    <div className="flex items-center gap-3 text-gray-500 hover:text-violet-600 transition-colors cursor-pointer group">
        <div className="text-violet-500 group-hover:text-violet-600 transition-colors">
            {icon}
        </div>
        <span className="text-sm font-semibold">{text}</span>
    </div>
);

export default Footer;
