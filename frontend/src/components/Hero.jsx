import React from 'react';
import Image from 'next/image';
import { ArrowRight, MessageSquare, Star, Zap } from 'lucide-react';

const Hero = () => {
    return (
        <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-40 px-4 overflow-hidden bg-violet-50">
            {/* Background Aesthetic Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-50/40 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[10%] right-[-10%] w-[400px] h-[400px] bg-blue-50/40 rounded-full blur-[100px]"></div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">

                {/* Left Side: Content */}
                <div className="space-y-8 lg:space-y-10 text-center lg:text-left animate-fade-up">
                    <div className="inline-flex items-center gap-2 bg-violet-50/80 backdrop-blur-sm text-violet-700 px-5 py-2.5 rounded-full text-xs lg:text-sm font-bold tracking-wide border border-violet-400 shadow-sm">
                        <Zap size={14} className="fill-violet-600" />
                        <span>AI-Powered Placement Preparation Platform</span>
                    </div>

                    <div className="space-y-6">
                        <h1 className="text-4xl sm:text-6xl lg:text-[5.5rem] font-black text-gray-950 leading-[1.1] tracking-tight">
                            Launch Your <br className="hidden sm:block" />
                            Career with <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600">AI Support</span>
                        </h1>

                        <p className="text-gray-600 text-lg lg:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
                            CareerSync AI helps students build ATS-friendly resumes, track applications, and prepare for interviews using powerful AI tools.
                        </p>
                    </div>

                    <div className="flex items-center justify-center lg:justify-start gap-6 pt-6">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center overflow-hidden">
                                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                                </div>
                            ))}
                        </div>
                        <div className="text-sm">
                            <div className="flex items-center gap-1 text-amber-500">
                                <Star size={14} className="fill-amber-500" />
                                <Star size={14} className="fill-amber-500" />
                                <Star size={14} className="fill-amber-500" />
                                <Star size={14} className="fill-amber-500" />
                                <Star size={14} className="fill-amber-500" />
                            </div>
                            <p className="text-gray-500 font-bold mt-0.5">Trusted by 10,000+ students</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5 pt-4">
                        <button className="group w-full sm:w-auto bg-gradient-to-r from-violet-600 to-purple-600 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl shadow-violet-200 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3">
                            Get Started Free 
                            <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="w-full sm:w-auto border-2 border-gray-100 bg-white/50 backdrop-blur-sm hover:border-violet-400 hover:bg-violet-50/30 text-gray-700 font-bold px-10 py-5 rounded-2xl text-lg transition-all flex items-center justify-center gap-2">
                            Explore Features
                        </button>
                    </div>
                </div>

                {/* Right Side: Illustration & Pop-up Cards */}
                <div className="relative h-[450px] sm:h-[550px] lg:h-[700px] mt-12 lg:mt-0 flex items-center justify-center">
                    
                    {/* Glowing Effect Background */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/10 to-transparent rounded-full blur-[100px] animate-pulse"></div>

                    {/* Main Character */}
                    <div className="relative w-full h-[90%] z-10 animate-float-slow">
                        <Image
                            src="/images/img.png"
                            alt="AI Placement Support"
                            fill
                            className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.05)]"
                            priority
                        />
                    </div>

                    {/* Interactive Floating UI elements */}
                    <div className="hidden sm:block absolute top-[15%] left-[5%] bg-white/90 backdrop-blur-md p-5 rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.08)] z-20 animate-pop-in [animation-delay:1s] opacity-0 [animation-fill-mode:forwards] border border-white/50 group hover:scale-105 transition-transform cursor-default">
                        <div className="text-center space-y-3">
                            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">ATS Score</span>
                            <div className="relative w-20 h-20 flex items-center justify-center mx-auto">
                                <svg className="w-full h-full rotate-[-90deg]">
                                    <circle cx="50%" cy="50%" r="38%" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                                    <circle cx="50%" cy="50%" r="38%" fill="none" stroke="#7c3aed" strokeWidth="8" strokeDasharray="100 100" strokeDashoffset="15" strokeLinecap="round" />
                                </svg>
                                <span className="absolute text-xl font-black text-gray-950">85%</span>
                            </div>
                        </div>
                    </div>

                    <div className="hidden sm:block absolute bottom-[20%] right-[0%] bg-white/90 backdrop-blur-md p-4 lg:p-5 rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.08)] z-20 animate-pop-in [animation-delay:1.4s] opacity-0 [animation-fill-mode:forwards] border border-white/50 w-48 lg:w-60 group hover:scale-105 transition-transform cursor-default">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-200">
                                <MessageSquare className="text-white" size={20} />
                            </div>
                            <div className="space-y-1.5 flex-1 min-w-0">
                                <p className="text-xs font-black text-gray-950 truncate">Interview Ready</p>
                                <div className="w-full h-2 bg-violet-50 rounded-full overflow-hidden">
                                    <div className="w-[75%] h-full bg-gradient-to-r from-violet-500 to-violet-600 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;