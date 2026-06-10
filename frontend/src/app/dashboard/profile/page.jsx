"use client";

import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, BookOpen, GraduationCap, Award, Link, Code, Save, Edit3, Camera } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    collegeName: '',
    course: '',
    graduationYear: '',
    skills: '',
    verifiedSkills: [],
    linkedinProfile: '',
    githubProfile: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data && res.data.user) {
        const u = res.data.user;
        setFormData({
          fullName: u.fullName || '',
          email: u.email || '',
          phone: u.phone || '',
          collegeName: u.collegeName || '',
          course: u.course || '',
          graduationYear: u.graduationYear || '',
          skills: u.skills || '',
          verifiedSkills: u.verifiedSkills || [],
          linkedinProfile: u.linkedinProfile || '',
          githubProfile: u.githubProfile || ''
        });
      }
    } catch (err) {
      console.error("Error fetching profile", err);
      toast.error('Failed to load profile data');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Profile saved successfully!');
      
      // Update local storage user data for TopBar
      if (res.data && res.data.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        // Force a small reload or state update for TopBar if needed
        window.dispatchEvent(new Event('storage'));
      }
      
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
        <div>
          <h1 className="text-[2.5rem] font-extrabold mb-2 text-slate-900 tracking-tight">My Profile</h1>
          <p className="text-slate-500 text-[1.1rem] m-0">Manage your personal information, education, skills, and placement preparation preferences.</p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="bg-white border border-slate-300 text-slate-700 px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm hover:bg-slate-50 flex items-center gap-2"
          >
            <Edit3 size={18} /> Edit Profile
          </button>
        )}
      </div>

      <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-[0_10px_25px_rgba(0,0,0,0.02)] max-w-5xl">
        <div className="flex flex-col sm:flex-row gap-6 mb-10 items-start sm:items-center border-b border-slate-100 pb-8">
          <div className="relative">
            <div className="w-[120px] h-[120px] rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-[3rem] font-bold text-white shadow-lg shadow-violet-600/20">
              {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : 'U'}
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full border border-slate-200 shadow-md flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors text-violet-600">
                <Camera size={18} />
                <input type="file" className="hidden" accept="image/*" onChange={(e) => toast('Photo upload coming soon!', { icon: '📸' })} />
              </label>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2 text-slate-900">{formData.fullName || 'User Name'}</h2>
            <div className="text-slate-500 font-medium mb-4">{formData.email || 'Email Address'}</div>
            {isEditing && (
              <label className="bg-slate-50 border border-slate-300 px-5 py-2.5 rounded-xl text-slate-700 text-[0.95rem] font-bold hover:bg-slate-100 transition-colors cursor-pointer inline-flex items-center gap-2">
                <Camera size={16} /> Upload Profile Photo
                <input type="file" className="hidden" accept="image/*" onChange={(e) => toast('Photo upload coming soon!', { icon: '📸' })} />
              </label>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          
          <div className="mb-2">
            <label className="block text-[0.9rem] text-slate-600 mb-2 font-bold">Full Name</label>
            <div className="relative">
              <User size={18} className="absolute left-4 top-4 text-slate-400" />
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} disabled={!isEditing} className="w-full bg-slate-50 border border-slate-300 pl-11 pr-5 py-3.5 rounded-2xl text-slate-900 focus:outline-none focus:border-violet-600 focus:bg-white focus:ring-4 focus:ring-violet-600/10 transition-all font-medium disabled:opacity-70 disabled:cursor-not-allowed" />
            </div>
          </div>

          <div className="mb-2">
            <label className="block text-[0.9rem] text-slate-600 mb-2 font-bold">Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-4 text-slate-400" />
              <input type="email" name="email" value={formData.email} onChange={handleChange} disabled className="w-full bg-slate-100 border border-slate-300 pl-11 pr-5 py-3.5 rounded-2xl text-slate-500 transition-all font-medium cursor-not-allowed" title="Email cannot be changed" />
            </div>
          </div>

          <div className="mb-2">
            <label className="block text-[0.9rem] text-slate-600 mb-2 font-bold">Phone Number</label>
            <div className="relative">
              <Phone size={18} className="absolute left-4 top-4 text-slate-400" />
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} disabled={!isEditing} placeholder="+91 xxxxxxxxxx" className="w-full bg-slate-50 border border-slate-300 pl-11 pr-5 py-3.5 rounded-2xl text-slate-900 focus:outline-none focus:border-violet-600 focus:bg-white focus:ring-4 focus:ring-violet-600/10 transition-all font-medium disabled:opacity-70 disabled:cursor-not-allowed" />
            </div>
          </div>

          <div className="mb-2">
            <label className="block text-[0.9rem] text-slate-600 mb-2 font-bold">College Name</label>
            <div className="relative">
              <BookOpen size={18} className="absolute left-4 top-4 text-slate-400" />
              <input type="text" name="collegeName" value={formData.collegeName} onChange={handleChange} disabled={!isEditing} className="w-full bg-slate-50 border border-slate-300 pl-11 pr-5 py-3.5 rounded-2xl text-slate-900 focus:outline-none focus:border-violet-600 focus:bg-white focus:ring-4 focus:ring-violet-600/10 transition-all font-medium disabled:opacity-70 disabled:cursor-not-allowed" />
            </div>
          </div>

          <div className="mb-2">
            <label className="block text-[0.9rem] text-slate-600 mb-2 font-bold">Course / Degree</label>
            <div className="relative">
              <BookOpen size={18} className="absolute left-4 top-4 text-slate-400" />
              <input type="text" name="course" value={formData.course} onChange={handleChange} disabled={!isEditing} placeholder="e.g. B.Tech Computer Science" className="w-full bg-slate-50 border border-slate-300 pl-11 pr-5 py-3.5 rounded-2xl text-slate-900 focus:outline-none focus:border-violet-600 focus:bg-white focus:ring-4 focus:ring-violet-600/10 transition-all font-medium disabled:opacity-70 disabled:cursor-not-allowed" />
            </div>
          </div>

          <div className="mb-2">
            <label className="block text-[0.9rem] text-slate-600 mb-2 font-bold">Graduation Year</label>
            <div className="relative">
              <GraduationCap size={18} className="absolute left-4 top-4 text-slate-400" />
              <input type="text" name="graduationYear" value={formData.graduationYear} onChange={handleChange} disabled={!isEditing} placeholder="e.g. 2026" className="w-full bg-slate-50 border border-slate-300 pl-11 pr-5 py-3.5 rounded-2xl text-slate-900 focus:outline-none focus:border-violet-600 focus:bg-white focus:ring-4 focus:ring-violet-600/10 transition-all font-medium disabled:opacity-70 disabled:cursor-not-allowed" />
            </div>
          </div>

          <div className="mb-2 md:col-span-2">
            <label className="block text-[0.9rem] text-slate-600 mb-2 font-bold">Skills (comma separated)</label>
            <div className="relative">
              <Award size={18} className="absolute left-4 top-4 text-slate-400" />
              <input type="text" name="skills" value={formData.skills} onChange={handleChange} disabled={!isEditing} placeholder="e.g. React, Node.js, Python, MongoDB" className="w-full bg-slate-50 border border-slate-300 pl-11 pr-5 py-3.5 rounded-2xl text-slate-900 focus:outline-none focus:border-violet-600 focus:bg-white focus:ring-4 focus:ring-violet-600/10 transition-all font-medium disabled:opacity-70 disabled:cursor-not-allowed" />
            </div>
            {formData.verifiedSkills && formData.verifiedSkills.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-xs font-bold text-slate-500 flex items-center mr-2">Verified Badges:</span>
                {formData.verifiedSkills.map((skill, idx) => (
                  <span key={idx} className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-lg text-[11px] font-extrabold uppercase tracking-wide border border-emerald-200 flex items-center gap-1 shadow-sm">
                    {skill} <span className="bg-emerald-500 text-white w-3 h-3 rounded-full flex items-center justify-center text-[8px]">✓</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="mb-2">
            <label className="block text-[0.9rem] text-slate-600 mb-2 font-bold">LinkedIn Profile URL</label>
            <div className="relative">
              <Link size={18} className="absolute left-4 top-4 text-slate-400" />
              <input type="url" name="linkedinProfile" value={formData.linkedinProfile} onChange={handleChange} disabled={!isEditing} placeholder="https://linkedin.com/in/username" className="w-full bg-slate-50 border border-slate-300 pl-11 pr-5 py-3.5 rounded-2xl text-slate-900 focus:outline-none focus:border-violet-600 focus:bg-white focus:ring-4 focus:ring-violet-600/10 transition-all font-medium disabled:opacity-70 disabled:cursor-not-allowed" />
            </div>
          </div>

          <div className="mb-2">
            <label className="block text-[0.9rem] text-slate-600 mb-2 font-bold">GitHub Profile URL</label>
            <div className="relative">
              <Code size={18} className="absolute left-4 top-4 text-slate-400" />
              <input type="url" name="githubProfile" value={formData.githubProfile} onChange={handleChange} disabled={!isEditing} placeholder="https://github.com/username" className="w-full bg-slate-50 border border-slate-300 pl-11 pr-5 py-3.5 rounded-2xl text-slate-900 focus:outline-none focus:border-violet-600 focus:bg-white focus:ring-4 focus:ring-violet-600/10 transition-all font-medium disabled:opacity-70 disabled:cursor-not-allowed" />
            </div>
          </div>

        </div>

        {isEditing && (
          <div className="mt-10 flex justify-end gap-4 border-t border-slate-100 pt-8">
            <button 
              type="button" 
              onClick={() => { setIsEditing(false); fetchProfile(); }}
              className="bg-white border border-slate-300 text-slate-700 px-8 py-3.5 rounded-2xl font-bold transition-all hover:bg-slate-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-violet-600/20 hover:-translate-y-0.5 hover:shadow-violet-600/30 flex items-center gap-2" 
              disabled={loading}
            >
              {loading ? 'Saving...' : <><Save size={20} /> Save Changes</>}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
