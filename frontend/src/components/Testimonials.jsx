import React from 'react';
import Image from 'next/image';
import { Star, Quote, ArrowRight, GraduationCap, Users, BarChart3, Briefcase } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Aman Verma",
      role: "BCA Student • Frontend Developer",
      image: "/images/user1.jpg",
      text: "CareerSync AI helped me improve my resume ATS score from 52% to 87%. I started getting shortlisted for internships within weeks.",
      stars: 5
    },
    {
      name: "Priya Sharma",
      role: "MCA Student • Full Stack Developer",
      image: "/images/user2.jpg",
      text: "The AI interview preparation feature gave me confidence before placements. The suggested questions were very close to real interviews.",
      stars: 5
    },
    {
      name: "Rohit Singh",
      role: "Computer Science Student",
      image: "/images/user3.jpg",
      text: "I loved the application tracking system. Everything from resume building to job applications became super organized.",
      stars: 5
    },
    {
      name: "Sneha Gupta",
      role: "Software Engineering Student",
      image: "/images/user5.jpg",
      text: "The skill gap analysis feature showed exactly what I needed to improve for placements. It felt like having a personal mentor.",
      stars: 5
    },
    {
      name: "Aditya Mishra",
      role: "Backend Developer • Final Year Student",
      image: "/images/user4.jpg",
      text: "The resume builder templates are modern and ATS-friendly. I created a professional resume in less than 15 minutes.",
      stars: 5
    },
    {
      name: "Neha Kapoor",
      role: "UI/UX Design Student",
      image: "/images/user6.jpg",
      text: "CareerSync AI made placement preparation simple and stress-free. The dashboard and notifications kept me updated all the time.",
      stars: 5
    }
  ];

  const row1 = [testimonials[0], testimonials[1], testimonials[2]];
  const row2 = [testimonials[3], testimonials[4], testimonials[5]];

  return (
    <section className="py-20 bg-violet-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header Section */}
        <div className="text-center space-y-4 mb-12 sm:mb-16 px-4 animate-fade-up">
          <div className="inline-flex items-center gap-2 bg-violet-50 text-violet-600 px-4 py-2 rounded-full text-xs font-bold border border-violet-100">
            💬 Student Success Stories
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-tight">
            What Students Say About <span className="text-violet-600">CareerSync AI</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Thousands of students are improving resumes, cracking interviews, and getting placement-ready with AI-powered career guidance.
          </p>
        </div>

        {/* Testimonials Moving Marquee */}
        <div className="space-y-4 mb-16 relative">
          
          {/* Row 1: Scrolling Left */}
          <div className="relative w-full overflow-hidden py-4">
            {/* Glass/Gradient Overlays */}
            <div className="absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-violet-50 via-violet-50/70 to-transparent z-20 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-violet-50 via-violet-50/70 to-transparent z-20 pointer-events-none"></div>

            <div className="flex w-max animate-marquee-left hover:[animation-play-state:paused] cursor-grab active:cursor-grabbing">
              <div className="flex gap-6 pr-6">
                {row1.map((item, index) => (
                  <TestimonialCard key={`r1-1-${index}`} item={item} />
                ))}
              </div>
              <div className="flex gap-6 pr-6">
                {row1.map((item, index) => (
                  <TestimonialCard key={`r1-2-${index}`} item={item} />
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: Scrolling Right */}
          <div className="relative w-full overflow-hidden py-4">
            {/* Glass/Gradient Overlays */}
            <div className="absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-violet-50 via-violet-50/70 to-transparent z-20 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-violet-50 via-violet-50/70 to-transparent z-20 pointer-events-none"></div>

            <div className="flex w-max animate-marquee-right hover:[animation-play-state:paused] cursor-grab active:cursor-grabbing">
              <div className="flex gap-6 pr-6">
                {row2.map((item, index) => (
                  <TestimonialCard key={`r2-1-${index}`} item={item} />
                ))}
              </div>
              <div className="flex gap-6 pr-6">
                {row2.map((item, index) => (
                  <TestimonialCard key={`r2-2-${index}`} item={item} />
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Stats Row
        <div className="bg-gray-50/50 rounded-[40px] p-8 border border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16 animate-fade-up">
          <div className="flex items-center gap-4 justify-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm"><Users size={24}/></div>
            <div>
              <p className="text-2xl font-black text-gray-900">10,000+</p>
              <p className="text-xs font-bold text-gray-400 uppercase">Students Supported</p>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center border-y sm:border-y-0 sm:border-x border-gray-100 py-6 sm:py-0">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm"><Briefcase size={24}/></div>
            <div>
              <p className="text-2xl font-black text-gray-900">500+</p>
              <p className="text-xs font-bold text-gray-400 uppercase">Hiring Companies</p>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm"><BarChart3 size={24}/></div>
            <div>
              <p className="text-2xl font-black text-gray-900">85%</p>
              <p className="text-xs font-bold text-gray-400 uppercase">Success Rate</p>
            </div>
          </div>
        </div> */}

      </div>
    </section>
  );
};

const TestimonialCard = ({ item }) => (
  <div className="w-[290px] sm:w-[400px] flex-shrink-0 bg-white border border-gray-100 p-6 sm:p-8 rounded-[28px] sm:rounded-[32px] shadow-sm hover:shadow-xl hover:shadow-violet-900/5 hover:border-violet-100 transition-all duration-300 group relative">
    <div className="absolute top-6 right-8 text-gray-100 group-hover:text-violet-50 transition-colors pointer-events-none">
      <Quote size={40} className="rotate-180 fill-current" />
    </div>
    
    <div className="relative z-10 space-y-5">
      <div className="flex items-center gap-4">
        <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-violet-50 shadow-md flex-shrink-0">
          <Image src={item.image} alt={item.name} fill sizes="(max-width: 640px) 48px, 56px" className="object-cover" />
        </div>
        <div>
          <h4 className="font-bold text-gray-900 text-sm sm:text-base">{item.name}</h4>
          <p className="text-violet-600 text-[10px] sm:text-xs font-semibold">{item.role}</p>
        </div>
      </div>

      <div className="flex gap-1">
        {[...Array(item.stars)].map((_, i) => (
          <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
        ))}
      </div>

      <p className="text-gray-600 text-xs sm:text-sm font-medium leading-relaxed italic">
        "{item.text}"
      </p>
    </div>
  </div>
);

export default Testimonials;