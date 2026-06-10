'use client';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, Tag, Bot, Layout, ShieldCheck, LineChart, Briefcase, MousePointer2, Headset, ArrowRight } from 'lucide-react';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "1. How does the ATS score work?",
      answer: "Our AI analyzes your resume based on ATS-friendly formatting, keywords, readability, and industry standards to generate a resume compatibility score.",
      icon: <FileText size={20} />,
      color: "bg-blue-600 text-white",
      lightColor: "bg-blue-50 text-blue-600"
    },
    {
      question: "2. Is CareerSync AI free to use?",
      answer: "Yes, we offer a free tier that includes basic resume analysis and job tracking tools for students.",
      icon: <Tag size={20} />,
      color: "bg-violet-600 text-white",
      lightColor: "bg-violet-50 text-violet-600"
    },
    {
      question: "3. How does AI help in placement preparation?",
      answer: "Our AI generates mock interview questions, provides feedback on your answers, and suggests skill improvements.",
      icon: <Bot size={20} />,
      color: "bg-emerald-500 text-white",
      lightColor: "bg-emerald-50 text-emerald-600"
    },
    {
      question: "4. Can I create an ATS-friendly resume on this platform?",
      answer: "Absolutely! We provide professional templates that are pre-optimized for Applicant Tracking Systems.",
      icon: <Layout size={20} />,
      color: "bg-orange-400 text-white",
      lightColor: "bg-orange-50 text-orange-600"
    },
    {
      question: "5. Will my resume and personal data remain secure?",
      answer: "Security is our priority. We use industry-standard encryption to ensure your data stays private and safe.",
      icon: <ShieldCheck size={20} />,
      color: "bg-pink-500 text-white",
      lightColor: "bg-pink-50 text-pink-600"
    },
    {
      question: "6. Can I track my job applications?",
      answer: "Yes, our dashboard allows you to organize and track the status of every application in real-time.",
      icon: <LineChart size={20} />,
      color: "bg-violet-500 text-white",
      lightColor: "bg-violet-50 text-violet-600"
    },
    {
      question: "7. Does CareerSync AI support internship opportunities?",
      answer: "Yes, our smart job recommendations include both full-time roles and internships tailored to your profile.",
      icon: <Briefcase size={20} />,
      color: "bg-amber-500 text-white",
      lightColor: "bg-amber-50 text-amber-600"
    },
    {
      question: "8. Do I need technical skills to use this platform?",
      answer: "Not at all. The platform is designed with a user-friendly interface that anyone can navigate easily.",
      icon: <MousePointer2 size={20} />,
      color: "bg-cyan-400 text-white",
      lightColor: "bg-cyan-50 text-cyan-600"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header Section */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 bg-violet-50 text-violet-600 px-4 py-2 rounded-full text-xs font-bold border border-violet-100">
            ❓ Frequently Asked Questions
          </div>
          <h2 className="text-4xl lg:text-6xl font-black text-gray-900 tracking-tight">
            Got Questions? <span className="text-violet-600">We've Got Answers</span>
          </h2>
          <p className="text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about CareerSync AI, resume analysis, ATS scoring, and placement preparation.
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              className={`p-6 rounded-[24px] cursor-pointer transition-all duration-300 border ${
                openIndex === index 
                ? 'bg-violet-50/50 border-violet-200 shadow-lg shadow-violet-900/5' 
                : 'bg-violet-50/20 border-violet-100/60 hover:bg-white hover:border-violet-200 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${openIndex === index ? faq.color : faq.lightColor} rounded-xl flex items-center justify-center transition-colors`}>
                    {faq.icon}
                  </div>
                  <span className={`text-lg font-bold ${openIndex === index ? 'text-violet-700' : 'text-gray-900'}`}>
                    {faq.question}
                  </span>
                </div>
                {openIndex === index ? <ChevronUp className="text-violet-700" /> : <ChevronDown className="text-gray-400" />}
              </div>

              {openIndex === index && (
                <div className="mt-4 pl-16">
                  <p className="text-gray-600 font-medium leading-relaxed animate-fade-in">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA Card */}
        <div className="mt-16 bg-violet-50 border border-violet-100 rounded-[32px] p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 animate-fade-up">
          <div className="flex flex-col lg:flex-row items-center gap-8 text-center lg:text-left">
            <div className="relative w-40 h-40">
               {/* Replace with actual 3D icon path */}
               <div className="w-full h-full bg-violet-600 rounded-3xl flex items-center justify-center text-white text-5xl font-black shadow-2xl">FAQ</div>
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl lg:text-4xl font-black text-gray-900">
                Still Have <span className="text-violet-600">Questions?</span>
              </h3>
              <p className="text-gray-500 font-medium max-w-sm">
                Our support team is here to help you with resume building, placements, and career guidance.
              </p>
            </div>
          </div>
          <button className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-violet-100 flex items-center gap-3 transition-all hover:scale-105 active:scale-95">
            <Headset size={20} /> Contact Support <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </section>
  );
};

export default FAQSection;