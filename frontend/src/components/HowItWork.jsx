import React from 'react';
import Image from 'next/image';
import { UserPlus, FileUp, Cpu, Briefcase, ArrowRight } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      id: '01',
      title: 'Create Your Account',
      description: 'Sign up and build your student profile to access personalized placement tools and opportunities.',
      icon: <UserPlus className="text-violet-600" size={32} />,
      delay: '0ms'
    },
    {
      id: '02',
      title: 'Upload Your Resume',
      description: 'Upload your existing resume or create a professional ATS-friendly resume using our smart builder.',
      icon: <FileUp className="text-blue-500" size={32} />,
      delay: '200ms'
    },
    {
      id: '03',
      title: 'Get AI Analysis',
      description: 'Receive ATS scores, keyword optimization tips, resume improvements, and skill gap analysis instantly.',
      icon: <Cpu className="text-purple-500" size={32} />,
      delay: '400ms'
    },
    {
      id: '04',
      title: 'Apply for Jobs',
      description: 'Explore recommended jobs, track applications, prepare for interviews, and get placement-ready faster.',
      icon: <Briefcase className="text-violet-500" size={32} />,
      delay: '600ms'
    }
  ];

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header Section */}
        <div className="text-center space-y-4 mb-20 animate-fade-up">
          <div className="inline-flex items-center gap-2 bg-violet-50 text-violet-600 px-4 py-2 rounded-full text-xs font-bold border border-violet-100">
            ⚡ Simple & Smart Process
          </div>
          <h2 className="text-4xl lg:text-6xl font-black text-gray-900 tracking-tight">
            How <span className="text-violet-600">CareerSync AI</span> Works
          </h2>
          <p className="text-gray-500 font-medium max-w-xl mx-auto leading-relaxed">
            Get placement-ready in just a few simple steps using AI-powered career tools designed for students.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting Arrows (Desktop Only) */}
          <div className="hidden lg:block absolute top-1/4 left-0 w-full z-0">
             <div className="flex justify-around items-center px-20">
                {[1, 2, 3].map((i) => (
                   <div key={i} className="flex items-center gap-2">
                     <div className="h-[2px] w-12 border-t-2 border-dashed border-violet-100"></div>
                     <div className="w-8 h-8 rounded-full bg-violet-50 flex items-center justify-center border border-violet-100">
                       <ArrowRight size={14} className="text-violet-400" />
                     </div>
                     <div className="h-[2px] w-12 border-t-2 border-dashed border-violet-100"></div>
                   </div>
                ))}
             </div>
          </div>

          {steps.map((step, index) => (
            <div 
              key={index} 
              className="relative z-10 group bg-violet-50/50 border border-violet-100/50 p-8 rounded-[32px] shadow-sm hover:shadow-xl hover:shadow-violet-900/5 hover:bg-white hover:border-violet-200/80 transition-all duration-500 animate-fade-up"
              style={{ animationDelay: step.delay }}
            >
              {/* Step Number Badge */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-12 h-12 bg-violet-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg shadow-violet-200 border-4 border-white">
                {step.id}
              </div>

              <div className="flex flex-col items-center text-center space-y-6 pt-4">
                {/* Icon Container */}
                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center relative shadow-sm border border-violet-100/80 group-hover:bg-violet-50/50 transition-colors">
                   <div className="absolute inset-0 bg-violet-100/30 rounded-full animate-ping opacity-20 group-hover:opacity-40"></div>
                   {step.icon}
                   <div className="absolute bottom-1 right-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-violet-400 rounded-full"></div>
                   </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-extrabold text-gray-950">{step.title}</h3>
                  <p className="text-gray-500 text-sm font-medium leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Animated Bottom Line */}
                <div className="w-12 h-1.5 bg-violet-100 rounded-full overflow-hidden">
                  <div className="w-0 group-hover:w-full h-full bg-violet-600 transition-all duration-500"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;