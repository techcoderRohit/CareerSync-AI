"use client";

import React, { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { Mail, Lock, ArrowRight, Briefcase, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [role, setRole] = useState('student'); // 'student' or 'admin'

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);

      // Verify if the user's role matches the selected login portal
      const userRole = response.data.user?.role || 'student';
      if (userRole !== role) {
        throw new Error(`This account is not registered as an ${role === 'admin' ? 'Admin' : 'Student'}.`);
      }

      // Success Toast
      toast.success('Login successful! Welcome back.');

      // Success - Save token and user info
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Wait and redirect
      setTimeout(() => {
        if (userRole === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/dashboard');
        }
      }, 1500);
    } catch (err) {
      const errMsg = err.response?.data?.error || err.message || 'Invalid credentials';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    // overflow-x-hidden zaroori hai taaki animated images mobile par scroll na create karein
    <div className="min-h-screen bg-[#0a0b1e] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans text-white overflow-hidden relative">

      {/* Background Gradients - Decorative */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,#1e2a5e,transparent_50%)] opacity-30"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,#4e32a81a,transparent_60%)] opacity-40"></div>

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10">

        {/* Left Side: Desktop Only Illustration & Content */}
        {/* 'hidden lg:flex' ensures this only shows on desktop screens */}
        <div className="hidden lg:flex flex-col space-y-12 relative min-h-[600px]">

          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg">
              <Briefcase className="text-white" size={22} />
            </div>
            <span className="text-2xl font-bold tracking-tight">CareerSync <span className="text-violet-600">AI</span></span>
          </div>

          <div className="relative space-y-6 max-w-lg z-20">
            <h1 className="text-4xl lg:text-5xl font-extrabold leading-[1.1]">
              Launch Your Career <br />
              with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-500">AI-Powered</span> <br /> Placement Support
            </h1>

            <p className="text-gray-400 text-lg">
              Build smarter resumes, track job applications, and get placement-ready with AI assistance.
            </p>

            <div className="space-y-4">
              {["AI Resume Analysis", "ATS Score Checker", "Smart Job Recommendations"].map((feature, index) => (
                <div key={index} className="flex items-center gap-3.5 group">
                  <div className="w-5 h-5 rounded-full bg-blue-900/40 flex items-center justify-center border border-blue-500/30">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  </div>
                  <span className="text-gray-200 font-medium">{feature}</span>
                </div>
              ))}
            </div>

            <button className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-xl shadow-blue-600/20 px-10 py-4 rounded-xl text-lg font-semibold transition-all hover:scale-105 active:scale-95">
              Explore Features <ArrowRight size={20} />
            </button>
          </div>

          <div className="hidden lg:flex absolute bottom-[-135px] left-[25%] w-[125%] h-[850px] z-10 pointer-events-none">

            <div className="relative w-full h-full">
              <Image
                src="/images/img1.png"
                alt="Illustration"
                fill
                priority
                sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw 33vw"
                className="object-contain opacity-100"
              />

            </div>
          </div>
        </div>

        {/* Right Side: Responsive Login Form */}
        <div className="flex justify-center lg:justify-end relative z-20">
          {/* Card: Mobile par 'p-6' aur desktop par 'p-12' taaki space sahi dikhe */}
          <div className="bg-white rounded-[32px] sm:rounded-[40px] p-7 sm:p-10 lg:p-14 w-full max-w-md shadow-[0_20px_60px_rgba(0,0,0,0.5)] animate-fade-up">

            {/* Logo for Mobile Only */}
            <div className="flex lg:hidden items-center gap-2 mb-6 justify-center w-full animate-fade-up">
              <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center shadow-md shadow-violet-200">
                <Briefcase className="text-white" size={18} />
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900">CareerSync <span className="text-violet-600">AI</span></span>
            </div>

            <div className="space-y-2 mb-6 text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-950">
                {role === 'student' ? 'Student Login' : 'Admin Login'}
              </h2>
              <p className="text-gray-500 text-sm sm:text-base">
                {role === 'student' ? 'Welcome back! Please login to continue.' : 'Access the administrative control center.'}
              </p>
            </div>

            {/* Role Selection Slider Toggle */}
            <div className="flex bg-gray-100/80 p-1.5 rounded-2xl mb-6 border border-gray-200/50">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
                  role === 'student'
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Student Portal
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
                  role === 'admin'
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Admin Portal
              </button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium animate-shake">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-violet-600" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                  className="w-full pl-14 pr-5 py-4 border border-gray-200 bg-gray-50 rounded-2xl text-gray-900 outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 focus:bg-white transition-all placeholder:text-gray-400"
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-violet-600" size={20} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className="w-full pl-14 pr-12 py-4 border border-gray-200 bg-gray-50 rounded-2xl text-gray-900 outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 focus:bg-white transition-all placeholder:text-gray-400"
                />
              </div>

              <div className="flex items-center justify-between text-xs sm:text-sm">
                <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500" />
                  Remember me
                </label>
                <a href="/auth/forgotPassword" className="text-violet-600 font-semibold hover:underline">Forgot Password?</a>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700  hover:to-purple-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-violet-500/40 transition-all hover:scale-[1.02] active:scale-[0.98] mt-2 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Logging in...
                  </>
                ) : role === 'student' ? 'Login to Dashboard' : 'Secure Admin Login'}
              </button>


              <div className="flex items-center gap-4 my-8">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                  Or continue with
                </span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              <button 
                type="button" 
                className="bg-white w-full flex items-center justify-center gap-3 border border-gray-200 hover:border-violet-200 py-3.5 rounded-2xl font-semibold text-gray-700 hover:text-violet-600 hover:bg-violet-50/10 hover:shadow-lg hover:shadow-violet-900/5 transition-all duration-300 text-sm sm:text-base active:scale-[0.99] cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>
            </form>

            <p className="text-center mt-8 text-gray-600 text-sm">
              Don't have an account? <Link href="/auth/signup" className="text-violet-600 font-bold hover:underline">Create Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;