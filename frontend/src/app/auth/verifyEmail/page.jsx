"use client";

import React, { useRef, useState, useEffect } from 'react';
import { ShieldCheck, ArrowLeft, Loader2, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const VerifyEmailPage = () => {
  const router = useRouter();
  const inputRefs = useRef([]);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  
  // Timer State
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  // Reset Password State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('resetEmail');
    if (savedEmail) {
      setEmail(savedEmail);
    } else {
      router.push('/auth/forgotPassword');
    }
  }, [router]);

  // Timer Logic
  useEffect(() => {
    let interval;
    if (timer > 0 && !isVerified) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer, isVerified]);

  const handleInputChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    
    setLoading(true);
    setError('');
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/forgot-password`, { email });
      toast.success('OTP resent successfully!');
      setTimer(60);
      setCanResend(false);
      setOtp(new Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } catch (err) {
      const errMsg = err.response?.data?.error || err.message || 'Failed to resend OTP';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setError('');
    const otpValue = otp.join("");
    
    if (otpValue.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/verify-otp`, {
        email,
        otp: otpValue
      });

      setIsVerified(true);
      toast.success('OTP verified successfully!');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/reset-password`, {
        email,
        newPassword
      });

      setResetSuccess(true);
      toast.success('Password reset successful!');
      localStorage.removeItem('resetEmail');
      
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (resetSuccess) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-[48px] p-12 w-full max-w-lg shadow-[0_15px_50px_rgba(0,0,0,0.03)] border border-gray-50 text-center space-y-6 animate-fade-up">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="text-green-600 w-10 h-10" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-950">Password Reset Successful!</h1>
          <p className="text-gray-500 font-medium">Your password has been updated. Redirecting you to login...</p>
          <div className="pt-4">
            <Loader2 className="animate-spin mx-auto text-violet-600" size={32} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans text-gray-900 relative overflow-hidden">
      
      <div className="absolute top-[-5%] right-[-10%] sm:top-[-10%] sm:right-[-5%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-violet-100/40 rounded-full blur-[80px] sm:blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-[-5%] left-[-10%] sm:bottom-[-10%] sm:left-[-5%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-blue-100/40 rounded-full blur-[80px] sm:blur-[120px] -z-10"></div>

      <div className="bg-white rounded-[32px] sm:rounded-[48px] p-6 sm:p-12 lg:p-14 w-full max-w-md lg:max-w-lg shadow-[0_15px_50px_rgba(0,0,0,0.03)] border border-gray-50 animate-fade-up relative">
        
        <div className="hidden sm:block mb-8">
          <Link 
            href={isVerified ? "#" : "/auth/forgotPassword"} 
            onClick={() => isVerified && setIsVerified(false)}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-violet-600 transition-colors font-semibold text-sm group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            {isVerified ? 'Back to OTP' : 'Back'}
          </Link>
        </div>

        <div className="flex flex-col items-center text-center space-y-6 sm:space-y-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-violet-50 rounded-full flex items-center justify-center shadow-inner">
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-violet-600 rounded-full flex items-center justify-center shadow-lg shadow-violet-200">
              {isVerified ? <Lock className="text-white w-6 h-6 sm:w-8 sm:h-8" /> : <ShieldCheck className="text-white w-6 h-6 sm:w-8 sm:h-8" />}
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
              {isVerified ? 'Set New Password' : 'Verify Your Email'}
            </h1>
            <p className="text-gray-500 text-sm sm:text-base font-medium leading-relaxed max-w-[260px] sm:max-w-xs mx-auto">
              {isVerified 
                ? 'Create a strong password for your account' 
                : <>Enter the verification code sent to <span className="text-violet-600 font-bold">{email}</span></>
              }
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium animate-shake text-center">
            {error}
          </div>
        )}

        {!isVerified ? (
          /* OTP Form */
          <form onSubmit={handleVerifySubmit} className="mt-8 sm:mt-12 space-y-8">
            <div className="flex justify-between gap-2 sm:gap-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-10 h-12 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold border border-gray-300 bg-gray-50/50 sm:bg-white rounded-lg sm:rounded-xl focus:ring-4 focus:ring-violet-600/5 focus:border-violet-600 outline-none transition-all text-violet-600"
                />
              ))}
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500 font-medium">
                {timer > 0 ? (
                  <>Resend code in <span className="text-violet-600 font-bold">{timer}s</span></>
                ) : (
                  <>
                    Didn't receive the code?{' '}
                    <button 
                      type="button" 
                      onClick={handleResendOTP}
                      disabled={!canResend || loading}
                      className="text-violet-600 font-bold hover:underline disabled:opacity-50 disabled:no-underline"
                    >
                      Resend OTP
                    </button>
                  </>
                )}
              </p>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg shadow-violet-500/30 py-4 sm:py-4.5 rounded-xl sm:rounded-2xl font-bold transition-all hover:scale-[1.01] active:scale-[0.99] text-base sm:text-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Verifying...
                </>
              ) : 'Verify OTP'}
            </button>
          </form>
        ) : (
          /* Reset Password Form */
          <form onSubmit={handleResetSubmit} className="mt-8 sm:mt-12 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">New Password</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-600 transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-violet-600/5 focus:border-violet-600 outline-none transition-all font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Confirm Password</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-600 transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-violet-600/5 focus:border-violet-600 outline-none transition-all font-medium"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg shadow-violet-500/30 py-4 sm:py-4.5 rounded-xl sm:rounded-2xl font-bold transition-all hover:scale-[1.01] active:scale-[0.99] text-base sm:text-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Resetting Password...
                </>
              ) : 'Reset Password'}
            </button>
          </form>
        )}

        <div className="mt-8 sm:hidden text-center">
          <Link 
            href="/auth/forgotPassword" 
            className="inline-flex items-center gap-2 text-gray-500 hover:text-violet-600 transition-colors font-bold text-sm"
          >
            Back
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;