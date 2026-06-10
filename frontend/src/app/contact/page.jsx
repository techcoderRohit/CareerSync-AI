'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  Loader2, 
  Sparkles, 
  User, 
  MessageSquare,
  HelpCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/contact', formData);
      toast.success(response.data.message || 'Message sent successfully!');
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      const errMsg = error.response?.data?.error || error.message || 'Failed to send message. Please try again.';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const contactDetails = [
    {
      icon: <Phone className="text-violet-600" size={22} />,
      title: "Call Us",
      value: "+91 98765 43210",
      description: "Mon-Fri from 9:00 AM to 6:00 PM"
    },
    {
      icon: <Mail className="text-violet-600" size={22} />,
      title: "Email Support",
      value: "support@careersync.ai",
      description: "Response within 24 business hours"
    },
    {
      icon: <MapPin className="text-violet-600" size={22} />,
      title: "Head Office",
      value: "Sector 62, Noida, UP, India",
      description: "Visit us by prior appointment"
    },
    {
      icon: <Clock className="text-violet-600" size={22} />,
      title: "Operational Hours",
      value: "9:00 AM - 6:00 PM",
      description: "Closed on National Holidays"
    }
  ];

  return (
    <div className="min-h-screen bg-violet-50/30 flex flex-col justify-between font-sans">
      <Navbar />

      <main className="flex-grow pt-24 pb-20 sm:pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Page Title Header */}
          <div className="space-y-3 mb-12 sm:mb-16 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-violet-50 text-violet-600 px-4 py-2 rounded-full text-xs font-bold border border-violet-100">
              <Sparkles size={14} className="fill-violet-600 animate-pulse" />
              <span>Contact Us</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">
              Get in Touch <span className="text-violet-600">With Our Team</span>
            </h1>
            <p className="text-gray-500 font-medium text-base sm:text-lg">
              Have a question about resume scoring, placement modules, or need assistance? We are here to support your journey.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left: Contact Info Info Cards */}
            <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
              
              {/* Contact Details Grid */}
              <div className="bg-white border border-gray-100 p-8 rounded-[32px] shadow-sm space-y-8 flex-grow">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-gray-950">Support Channels</h2>
                  <p className="text-sm text-gray-400 font-medium leading-relaxed">
                    Choose your preferred channel of communication. Our support desk operates daily to clear backlogs.
                  </p>
                </div>

                <div className="space-y-6">
                  {contactDetails.map((detail, index) => (
                    <div key={index} className="flex gap-4 items-start">
                      <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center flex-shrink-0 shadow-inner">
                        {detail.icon}
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-gray-950 text-sm leading-snug">{detail.title}</h4>
                        <p className="text-violet-600 font-bold text-base leading-none">{detail.value}</p>
                        <p className="text-gray-400 text-xs font-semibold">{detail.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Aesthetic Card */}
              <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white p-8 rounded-[32px] shadow-lg shadow-violet-200/50 space-y-4">
                <h3 className="text-lg font-black uppercase tracking-wider">Placement Support</h3>
                <p className="text-sm opacity-90 leading-relaxed font-medium">
                  CareerSync AI helps colleges and universities streamline student training, resume scoring, and mock assessments.
                </p>
                <div className="pt-2">
                  <span className="bg-white/20 border border-white/10 text-white px-4 py-2 rounded-xl text-xs font-extrabold">
                    Enterprise Portal Available
                  </span>
                </div>
              </div>

            </div>

            {/* Right: Contact Form Card */}
            <div className="lg:col-span-7">
              <div className="bg-white border border-gray-100 p-8 sm:p-10 rounded-[32px] shadow-sm h-full">
                
                <div className="space-y-2 mb-8">
                  <h2 className="text-2xl font-bold text-gray-950">Send a Message</h2>
                  <p className="text-sm text-gray-400 font-medium leading-relaxed">
                    Fill out the form below. Your message will be saved securely in our query logs.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Full Name */}
                  <div className="space-y-2 group">
                    <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
                    <div className="relative">
                      <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-600 transition-colors" />
                      <input 
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="e.g. John Doe"
                        className="w-full pl-12 pr-5 py-4 border border-gray-200 bg-gray-50/50 hover:bg-white rounded-2xl text-gray-950 placeholder:text-gray-400 outline-none focus:ring-4 focus:ring-violet-600/5 focus:border-violet-600 focus:bg-white transition-all font-medium text-sm sm:text-base"
                        required
                      />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="space-y-2 group">
                    <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-600 transition-colors" />
                      <input 
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. john@example.com"
                        className="w-full pl-12 pr-5 py-4 border border-gray-200 bg-gray-50/50 hover:bg-white rounded-2xl text-gray-950 placeholder:text-gray-400 outline-none focus:ring-4 focus:ring-violet-600/5 focus:border-violet-600 focus:bg-white transition-all font-medium text-sm sm:text-base"
                        required
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-2 group">
                    <label className="text-sm font-bold text-gray-700 ml-1">Subject</label>
                    <div className="relative">
                      <HelpCircle size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-600 transition-colors" />
                      <input 
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="What is this inquiry about?"
                        className="w-full pl-12 pr-5 py-4 border border-gray-200 bg-gray-50/50 hover:bg-white rounded-2xl text-gray-950 placeholder:text-gray-400 outline-none focus:ring-4 focus:ring-violet-600/5 focus:border-violet-600 focus:bg-white transition-all font-medium text-sm sm:text-base"
                        required
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-2 group">
                    <label className="text-sm font-bold text-gray-700 ml-1">Message Description</label>
                    <div className="relative">
                      <MessageSquare size={18} className="absolute left-4 top-5 text-gray-400 group-focus-within:text-violet-600 transition-colors" />
                      <textarea 
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Describe your inquiry details..."
                        className="w-full pl-12 pr-5 py-4 min-h-[150px] border border-gray-200 bg-gray-50/50 hover:bg-white rounded-2xl text-gray-950 placeholder:text-gray-400 outline-none focus:ring-4 focus:ring-violet-600/5 focus:border-violet-600 focus:bg-white transition-all font-medium text-sm sm:text-base leading-relaxed"
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg shadow-violet-500/30 py-4 rounded-xl font-bold transition-all hover:scale-[1.01] active:scale-[0.99] text-base sm:text-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Sending inquiry...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Send Inquiry Message
                      </>
                    )}
                  </button>

                </form>

              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
