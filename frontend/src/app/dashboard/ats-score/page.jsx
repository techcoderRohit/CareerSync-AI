"use client";

import React from 'react';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';

export default function AtsScorePage() {
  return (
    <div className="animate-fade-up">
      <h1 className="text-[2.5rem] font-extrabold mb-2 text-slate-900 tracking-tight">ATS Score Analysis</h1>
      <p className="text-slate-500 text-[1.1rem] mb-10">Detailed breakdown of how your resume performs against Applicant Tracking Systems.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Score Overview */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-[0_10px_25px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-[250px] h-[250px] rounded-full bg-[conic-gradient(#7c3aed_85%,#e2e8f0_0)] flex items-center justify-center relative shadow-[0_0_40px_rgba(124,58,237,0.1)]">
            <div className="absolute w-[210px] h-[210px] bg-white rounded-full"></div>
            <div className="relative z-10 text-center">
              <div className="text-5xl font-black text-slate-900 leading-none">85<span className="text-3xl">%</span></div>
              <div className="text-slate-500 font-bold uppercase tracking-widest mt-2 text-sm">Excellent</div>
            </div>
          </div>
          <p className="mt-8 text-center text-slate-600 font-medium leading-relaxed max-w-sm">
            Your resume is well-optimized! It passes most ATS checks but could use some minor tweaks in the experience section to hit 90%+.
          </p>
        </div>

        {/* Detailed Breakdown */}
        <div className="flex flex-col gap-6">
          
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-[0_10px_25px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-3 mb-5">
              <CheckCircle className="text-emerald-500" size={24} />
              <h3 className="text-xl font-bold text-slate-900">Strengths</h3>
            </div>
            <ul className="list-none p-0 m-0 text-slate-600 font-medium flex flex-col gap-3">
              <li className="flex gap-3 items-start">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0"></div>
                <span>Strong keyword match for "Frontend Developer" roles.</span>
              </li>
              <li className="flex gap-3 items-start">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0"></div>
                <span>Perfect contact information formatting.</span>
              </li>
              <li className="flex gap-3 items-start">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0"></div>
                <span>Action verbs used effectively in bullet points.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-[0_10px_25px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-3 mb-5">
              <AlertTriangle className="text-amber-500" size={24} />
              <h3 className="text-xl font-bold text-slate-900">Areas for Improvement</h3>
            </div>
            <ul className="list-none p-0 m-0 text-slate-600 font-medium flex flex-col gap-3">
              <li className="flex gap-3 items-start">
                <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0"></div>
                <span>Quantify your achievements (e.g., "Increased performance by 20%").</span>
              </li>
              <li className="flex gap-3 items-start">
                <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0"></div>
                <span>Missing exact matches for "React Hooks" and "Redux Toolkit".</span>
              </li>
            </ul>
          </div>

          <button className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-violet-600/20 hover:-translate-y-0.5 hover:shadow-violet-600/30 flex items-center justify-center w-full">
            Get AI Suggestions
          </button>

        </div>
      </div>
    </div>
  );
}
