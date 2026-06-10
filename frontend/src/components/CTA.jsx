import React from 'react';
import Image from 'next/image';
import { Rocket } from 'lucide-react';
import Link from 'next/link';

const CTA = () => {
  return (
    <section className="bg-violet-50 pb-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-violet-600 rounded-[48px] p-8 lg:p-16 shadow-2xl shadow-violet-200 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden">
          
          {/* Background Decor */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

          <div className="flex flex-col lg:flex-row items-center gap-10 text-center lg:text-left relative z-10">
            {/* Illustration */}
            <div className="w-48 h-48 lg:w-56 lg:h-56 relative">
              <Image 
                src="/images/grad-cap.png"
                alt="Placement Journey"
                fill
                sizes="(max-width: 1024px) 192px, 224px"
                className="object-contain drop-shadow-2xl"
              />
            </div>
            
            {/* Text Content */}
            <div className="space-y-4 max-w-xl">
              <h2 className="text-3xl lg:text-5xl font-black text-white leading-tight">
                Ready to Start Your <br /> <span className="text-violet-200">Placement Journey?</span>
              </h2>
              <p className="text-violet-100 text-lg font-medium opacity-90">
                Join thousands of students using AI-powered tools to get placement-ready and land your dream job faster.
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="relative z-10 w-full lg:w-auto">
              <Link href="/auth/signup" className="bg-white text-violet-600 hover:bg-violet-50 px-10 py-5 rounded-[24px] font-black text-xl shadow-xl flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 whitespace-nowrap group">
                  <Rocket size={24} className="group-hover:rotate-12 transition-transform" /> 
                  Get Started Free
              </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
