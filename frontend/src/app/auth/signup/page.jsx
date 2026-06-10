"use client";

import React, { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { User, Mail, Building2, Lock, Briefcase, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const SignUpPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    collegeName: '',
    skills: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      const msg = 'Passwords do not match';
      setError(msg);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        fullName: formData.fullName,
        email: formData.email,
        collegeName: formData.collegeName,
        skills: formData.skills,
        password: formData.password,
      });

      // Success Toast
      toast.success('Account created successfully! Please login.');

      // Wait and redirect
      setTimeout(() => {
        router.push('/auth/login');
      }, 1500);
    } catch (err) {
      const errMsg = err.response?.data?.error || err.message || 'Something went wrong';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    // overflow-x-hidden zaroori hai mobile animations ke liye
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans text-gray-900 overflow-x-hidden relative">
      
      {/* Background Decorative Shapes - Reduced size for mobile */}
      <div className="absolute top-[-5%] right-[-10%] w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-violet-100/50 rounded-full blur-[80px] sm:blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-[-5%] left-[-10%] w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-blue-100/50 rounded-full blur-[80px] sm:blur-[120px] -z-10"></div>

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-stretch relative z-10">
        
        {/* Left Side: Desktop Only Branding & Illustration */}
        <div className="hidden lg:flex flex-col h-full py-8 justify-between">
          
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-200">
              <Briefcase className="text-white" size={22} />
            </div>
            <span className="text-2xl font-bold tracking-tight text-gray-900">CareerSync <span className="text-violet-600">AI</span></span>
          </div>

          <div className="space-y-6 max-w-lg mb-10">
            <h1 className="text-4xl xl:text-5xl font-extrabold leading-[1.1] text-gray-900">
              Start Your <br />
              <span className="text-violet-600">Placement Journey</span> <br />
              Today
            </h1>

            <p className="text-gray-500 text-lg font-semibold leading-relaxed">
              Create your free account today and get instant access to smarter resume building, ATS analysis, and personalized career guidance.
            </p>
          </div>

          {/* Illustration with CSS Float */}
          <div className="relative flex-grow min-h-[400px] w-full flex items-center justify-center">
            <div className="relative w-full h-full">
              <Image
                src="/images/img3.png" 
                alt="Student Illustration"
                fill
                sizes="50vw"
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>

        {/* Right Side: Sign Up Form Card */}
        <div className="flex flex-col justify-center w-full max-w-lg mx-auto lg:items-end lg:max-w-none">
          
          <div className="bg-white rounded-[32px] sm:rounded-[48px] p-6 sm:p-10 lg:p-14 w-full lg:max-w-lg shadow-[0_20px_70px_rgba(0,0,0,0.03)] border border-gray-50 animate-fade-up">
            
            {/* Mobile Logo: Only visible on small screens */}
            <div className="flex lg:hidden items-center gap-2 mb-6 justify-center w-full animate-fade-up">
              <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center shadow-md shadow-violet-200">
                <Briefcase className="text-white" size={18} />
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900">CareerSync <span className="text-violet-600">AI</span></span>
            </div>

            <div className="space-y-2 mb-8 text-center lg:text-left">
              <h2 className="text-xl lg:text-4xl font-extrabold text-gray-950">Create Student Account</h2>
              <p className="text-gray-500 text-sm sm:text-base font-medium">Join thousands of students preparing for placements smarter.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium animate-shake">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Full Name */}
              <div className="relative group">
                <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-600 transition-colors">
                  <User size={18} className="sm:w-5 sm:h-5" />
                </div>
                <input 
                  type="text" 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name" 
                  className="w-full pl-11 sm:pl-14 pr-4 sm:pr-5 py-3.5 sm:py-4.5 border border-gray-200 bg-white rounded-xl sm:rounded-2xl text-gray-900 focus:ring-4 focus:ring-violet-600/5 focus:border-violet-600 outline-none transition-all placeholder:text-gray-400 font-medium text-sm sm:text-base" 
                />
              </div>

              {/* Email Address */}
              <div className="relative group">
                <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-600 transition-colors">
                  <Mail size={18} className="sm:w-5 sm:h-5" />
                </div>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email address" 
                  className="w-full pl-11 sm:pl-14 pr-4 sm:pr-5 py-3.5 sm:py-4.5 border border-gray-200 bg-white rounded-xl sm:rounded-2xl text-gray-900 focus:ring-4 focus:ring-violet-600/5 focus:border-violet-600 outline-none transition-all placeholder:text-gray-400 font-medium text-sm sm:text-base" 
                />
              </div>

              {/* College Name */}
              <div className="relative group">
                <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-600 transition-colors">
                  <Building2 size={18} className="sm:w-5 sm:h-5" />
                </div>
                <input 
                  type="text" 
                  name="collegeName"
                  value={formData.collegeName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your college name" 
                  className="w-full pl-11 sm:pl-14 pr-4 sm:pr-5 py-3.5 sm:py-4.5 border border-gray-200 bg-white rounded-xl sm:rounded-2xl text-gray-900 focus:ring-4 focus:ring-violet-600/5 focus:border-violet-600 outline-none transition-all placeholder:text-gray-400 font-medium text-sm sm:text-base" 
                />
              </div>

              {/* Skills */}
              <div className="relative group">
                <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-600 transition-colors">
                  <Briefcase size={18} className="sm:w-5 sm:h-5" />
                </div>
                <input 
                  type="text" 
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="Skills (e.g. React, Node.js, Python)" 
                  className="w-full pl-11 sm:pl-14 pr-4 sm:pr-5 py-3.5 sm:py-4.5 border border-gray-200 bg-white rounded-xl sm:rounded-2xl text-gray-900 focus:ring-4 focus:ring-violet-600/5 focus:border-violet-600 outline-none transition-all placeholder:text-gray-400 font-medium text-sm sm:text-base" 
                />
              </div>

              {/* Password */}
              <div className="relative group">
                <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-600 transition-colors">
                  <Lock size={18} className="sm:w-5 sm:h-5" />
                </div>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Create a strong password" 
                  className="w-full pl-11 sm:pl-14 pr-12 sm:pr-14 py-3.5 sm:py-4.5 border border-gray-200 bg-white rounded-xl sm:rounded-2xl text-gray-900 focus:ring-4 focus:ring-violet-600/5 focus:border-violet-600 outline-none transition-all placeholder:text-gray-400 font-medium text-sm sm:text-base" 
                />
              </div>

              {/* Confirm Password */}
              <div className="relative group">
                <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-600 transition-colors">
                  <Lock size={18} className="sm:w-5 sm:h-5" />
                </div>
                <input 
                  type="password" 
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm your password" 
                  className="w-full pl-11 sm:pl-14 pr-12 sm:pr-14 py-3.5 sm:py-4.5 border border-gray-200 bg-white rounded-xl sm:rounded-2xl text-gray-900 focus:ring-4 focus:ring-violet-600/5 focus:border-violet-600 outline-none transition-all placeholder:text-gray-400 font-medium text-sm sm:text-base" 
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg shadow-violet-500/40 py-4 sm:py-4.5 rounded-xl sm:rounded-2xl font-bold transition-all hover:scale-[1.01] active:scale-[0.99] mt-2 text-base sm:text-lg flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Processing...
                  </>
                ) : 'Create My Account'}
              </button>
              
              <div className="text-center pt-2">
                <p className="text-[10px] sm:text-xs text-gray-400 leading-relaxed px-2 sm:px-6">
                  By creating an account, you agree to our <br />
                  <Link href="#" className="text-violet-600 font-bold hover:underline">Terms & Conditions</Link> and <Link href="#" className="text-violet-600 font-bold hover:underline">Privacy Policy</Link>.
                </p>
              </div>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-200 text-center">
              <p className="text-sm sm:text-base text-gray-600 font-medium">
                Already have an account? <Link href="/auth/login" className="text-violet-600 font-bold hover:underline ml-1">Login Here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;