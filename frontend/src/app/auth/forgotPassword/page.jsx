"use client";

import React, { useState } from 'react';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';

import toast from 'react-hot-toast';

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/forgot-password`, { email });
      
      // Show Success Toast
      toast.success('OTP sent successfully!');

      // Save email in localStorage to use in verify page
      localStorage.setItem('resetEmail', email);
      
      // Wait a bit and redirect to verify page
      setTimeout(() => {
        router.push('/auth/verifyEmail');
      }, 1500);
    } catch (err) {
      const errMsg = err.response?.data?.error || err.message || 'Something went wrong';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans text-gray-900 relative overflow-hidden">
      
      {/* Background Decor - Desktop & Mobile optimized */}
      <div className="absolute top-[-5%] right-[-10%] sm:top-[-10%] sm:right-[-5%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-violet-100/40 rounded-full blur-[80px] sm:blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-[-5%] left-[-10%] sm:bottom-[-10%] sm:left-[-5%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-blue-100/40 rounded-full blur-[80px] sm:blur-[120px] -z-10"></div>

      {/* Main Responsive Card */}
      <div className="bg-white rounded-[32px] sm:rounded-[48px] p-6 sm:p-12 lg:p-14 w-full max-w-md lg:max-w-lg shadow-[0_15px_50px_rgba(0,0,0,0.03)] border border-gray-50 animate-fade-up relative">
        
        {/* Back to Login - Desktop view (Top Left) */}
        <div className="hidden sm:block mb-8">
          <Link 
            href="/auth/login" 
            className="inline-flex items-center gap-2 text-gray-500 hover:text-violet-600 transition-colors font-semibold text-sm group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back to Login
          </Link>
        </div>

        {/* Top Icon Section */}
        <div className="flex flex-col items-center text-center space-y-6 sm:space-y-8">
          {/* Mail Icon Container */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-violet-50 rounded-full flex items-center justify-center shadow-inner">
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-violet-600 rounded-full flex items-center justify-center shadow-lg shadow-violet-200">
              <Mail className="text-white" size={28} />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
              Reset Your Password
            </h1>
            <p className="text-gray-500 text-sm sm:text-base font-medium leading-relaxed max-w-[260px] sm:max-w-xs mx-auto">
              Enter your registered email and we'll send you an OTP code.
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium animate-shake text-center">
            {error}
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mt-8 sm:mt-12 space-y-5 sm:space-y-6">
          <div className="relative group">
            <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-600 transition-colors">
              <Mail size={20} />
            </div>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email" 
              className="w-full pl-11 sm:pl-14 pr-4 sm:pr-5 py-4 sm:py-4.5 border border-gray-200 bg-gray-50/50 sm:bg-white rounded-xl sm:rounded-2xl text-gray-900 focus:ring-4 focus:ring-violet-600/5 focus:border-violet-600 outline-none transition-all placeholder:text-gray-400 font-medium text-sm sm:text-base"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg shadow-violet-500/30 py-4 sm:py-4.5 rounded-xl sm:rounded-2xl font-bold transition-all hover:scale-[1.01] active:scale-[0.99] text-base sm:text-lg flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Sending OTP...
              </>
            ) : 'Send Reset OTP'}
          </button>
        </form>

        {/* Bottom Navigation - Mobile only (Centered) */}
        <div className="mt-8 sm:hidden text-center">
          <Link 
            href="/auth/login" 
            className="inline-flex items-center gap-2 text-gray-500 hover:text-violet-600 transition-colors font-bold text-sm"
          >
            Back to Login
          </Link>
        </div>

        {/* Footer info - Visible only on Desktop */}
        <p className="hidden sm:block text-center mt-8 text-xs text-gray-400 font-medium">
          Didn't receive the email? Check your spam folder.
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;