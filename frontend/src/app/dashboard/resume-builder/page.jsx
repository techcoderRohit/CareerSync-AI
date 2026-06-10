"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Save, Download, Plus, Trash2, User, BookOpen, Briefcase, Code, LayoutTemplate, Palette, Mail, Phone, MapPin, Link } from 'lucide-react';
import toast from 'react-hot-toast';
import { useReactToPrint } from 'react-to-print';

export default function ResumeBuilderPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const componentRef = useRef(null);

  const [resumeData, setResumeData] = useState({
    personalInfo: { fullName: '', email: '', phone: '', address: '', linkedin: '', github: '', portfolio: '' },
    summary: '',
    education: [],
    experience: [],
    projects: [],
    skills: [],
    theme: { template: 'modern', color: '#0f172a', fontFamily: "'Inter', sans-serif" }
  });

  const [skillsInput, setSkillsInput] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/resume/builder`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.data) {
        setResumeData({
          ...data.data,
          theme: data.data.theme || { template: 'modern', color: '#0f172a', fontFamily: "'Inter', sans-serif" }
        });
        setSkillsInput((data.data.skills || []).join(', '));
      }
    } catch (err) {
      toast.error('Failed to load resume data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const skillsArray = skillsInput.split(',').map(s => s.trim()).filter(s => s);
      const dataToSave = { ...resumeData, skills: skillsArray };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/resume/builder`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(dataToSave)
      });
      
      if (res.ok) {
        toast.success('Resume saved successfully!');
      } else {
        toast.error('Failed to save resume');
      }
    } catch (err) {
      toast.error('Server error while saving');
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${resumeData.personalInfo.fullName || 'Resume'}_CareerSync`,
  });

  const handlePersonalInfo = (e) => {
    setResumeData({
      ...resumeData,
      personalInfo: { ...resumeData.personalInfo, [e.target.name]: e.target.value }
    });
  };

  const handleArrayChange = (field, index, key, value) => {
    const newArray = [...resumeData[field]];
    newArray[index][key] = value;
    setResumeData({ ...resumeData, [field]: newArray });
  };

  const addArrayItem = (field, template) => {
    setResumeData({ ...resumeData, [field]: [...resumeData[field], template] });
  };

  const removeArrayItem = (field, index) => {
    const newArray = [...resumeData[field]];
    newArray.splice(index, 1);
    setResumeData({ ...resumeData, [field]: newArray });
  };

  const handleThemeChange = (key, value) => {
    setResumeData({
      ...resumeData,
      theme: { ...resumeData.theme, [key]: value }
    });
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-full">
        <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Helper variables for rendering preview
  const tpl = resumeData.theme.template;
  const col = resumeData.theme.color;
  const p = resumeData.personalInfo;
  
  return (
    <div className="p-4 sm:p-8 min-h-screen bg-slate-50 flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Resume Builder</h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">Create a stunning, ATS-friendly resume instantly.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 flex items-center gap-2 transition-all disabled:opacity-50">
            <Save size={16} /> {saving ? 'Saving...' : 'Save Data'}
          </button>
          <button onClick={handlePrint} className="px-4 py-2 bg-violet-600 text-white rounded-xl text-sm font-bold shadow-md shadow-violet-500/20 hover:bg-violet-700 flex items-center gap-2 transition-all">
            <Download size={16} /> Download PDF
          </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
        
        {/* Left Pane - Editor */}
        <div className="w-full xl:w-[45%] bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[800px]">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2 font-bold text-gray-700">
            <LayoutTemplate size={18} className="text-violet-500" /> Editor
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
            
            {/* Theme Settings */}
            <section className="bg-violet-50/50 p-5 rounded-2xl border border-violet-100/50">
              <h2 className="text-sm font-bold text-violet-900 uppercase tracking-wider mb-4 flex items-center gap-2"><Palette size={16}/> Design & Formatting</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">Template Style</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['modern', 'professional', 'executive'].map(t => (
                      <button key={t} onClick={() => handleThemeChange('template', t)} className={`py-2 px-1 rounded-xl text-xs font-bold capitalize border transition-all ${tpl === t ? 'bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-500/20' : 'bg-white text-gray-600 border-gray-200 hover:border-violet-300'}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">Primary Color</label>
                  <div className="flex flex-wrap gap-3">
                    {['#0f172a', '#2563eb', '#059669', '#e11d48', '#7c3aed', '#0891b2', '#ea580c', '#475569'].map(color => (
                      <button key={color} onClick={() => handleThemeChange('color', color)} className={`w-8 h-8 rounded-full border-[3px] transition-transform hover:scale-110 ${col === color ? 'border-white ring-2 ring-violet-500 scale-110 shadow-md' : 'border-transparent shadow-sm'}`} style={{ backgroundColor: color }} title={color} />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">Typography</label>
                  <select value={resumeData.theme.fontFamily} onChange={(e) => handleThemeChange('fontFamily', e.target.value)} className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10">
                    <option value="'Inter', sans-serif">Inter (Clean & Modern)</option>
                    <option value="'Roboto', sans-serif">Roboto (Standard Sans)</option>
                    <option value="'Playfair Display', serif">Playfair Display (Elegant Serif)</option>
                    <option value="'Merriweather', serif">Merriweather (Classic Serif)</option>
                    <option value="'Courier New', monospace">Courier New (Monospace / Tech)</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Personal Info */}
            <section>
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2"><User size={16}/> Personal Info</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input name="fullName" value={p.fullName} onChange={handlePersonalInfo} placeholder="Full Name" className="p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm w-full" />
                <input name="email" value={p.email} onChange={handlePersonalInfo} placeholder="Email" className="p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm w-full" />
                <input name="phone" value={p.phone} onChange={handlePersonalInfo} placeholder="Phone" className="p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm w-full" />
                <input name="address" value={p.address} onChange={handlePersonalInfo} placeholder="City, Country" className="p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm w-full" />
                <input name="linkedin" value={p.linkedin} onChange={handlePersonalInfo} placeholder="LinkedIn URL" className="p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm w-full" />
                <input name="github" value={p.github} onChange={handlePersonalInfo} placeholder="GitHub URL" className="p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm w-full" />
              </div>
            </section>

            {/* Summary */}
            <section>
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Professional Summary</h2>
              <textarea value={resumeData.summary} onChange={(e) => setResumeData({...resumeData, summary: e.target.value})} placeholder="A brief summary of your professional background and goals..." className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm w-full h-24 resize-none"></textarea>
            </section>

            {/* Experience */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2"><Briefcase size={16}/> Experience</h2>
                <button onClick={() => addArrayItem('experience', { company: '', role: '', startDate: '', endDate: '', description: '' })} className="text-xs font-bold text-violet-600 bg-violet-50 px-2 py-1 rounded hover:bg-violet-100 flex items-center gap-1"><Plus size={14}/> Add</button>
              </div>
              <div className="space-y-4">
                {resumeData.experience.map((exp, idx) => (
                  <div key={idx} className="p-4 border border-gray-100 rounded-xl bg-gray-50/50 relative group">
                    <button onClick={() => removeArrayItem('experience', idx)} className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <input value={exp.company} onChange={(e) => handleArrayChange('experience', idx, 'company', e.target.value)} placeholder="Company" className="p-2 border border-gray-200 rounded text-sm w-full" />
                      <input value={exp.role} onChange={(e) => handleArrayChange('experience', idx, 'role', e.target.value)} placeholder="Job Title" className="p-2 border border-gray-200 rounded text-sm w-full" />
                      <input value={exp.startDate} onChange={(e) => handleArrayChange('experience', idx, 'startDate', e.target.value)} placeholder="Start Date" className="p-2 border border-gray-200 rounded text-sm w-full" />
                      <input value={exp.endDate} onChange={(e) => handleArrayChange('experience', idx, 'endDate', e.target.value)} placeholder="End Date" className="p-2 border border-gray-200 rounded text-sm w-full" />
                    </div>
                    <textarea value={exp.description} onChange={(e) => handleArrayChange('experience', idx, 'description', e.target.value)} placeholder="Responsibilities..." className="p-2 border border-gray-200 rounded text-sm w-full h-20 resize-none"></textarea>
                  </div>
                ))}
              </div>
            </section>

            {/* Education */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2"><BookOpen size={16}/> Education</h2>
                <button onClick={() => addArrayItem('education', { school: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', grade: '' })} className="text-xs font-bold text-violet-600 bg-violet-50 px-2 py-1 rounded hover:bg-violet-100 flex items-center gap-1"><Plus size={14}/> Add</button>
              </div>
              <div className="space-y-4">
                {resumeData.education.map((edu, idx) => (
                  <div key={idx} className="p-4 border border-gray-100 rounded-xl bg-gray-50/50 relative group">
                    <button onClick={() => removeArrayItem('education', idx)} className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input value={edu.school} onChange={(e) => handleArrayChange('education', idx, 'school', e.target.value)} placeholder="School/University" className="p-2 border border-gray-200 rounded text-sm w-full" />
                      <input value={edu.degree} onChange={(e) => handleArrayChange('education', idx, 'degree', e.target.value)} placeholder="Degree" className="p-2 border border-gray-200 rounded text-sm w-full" />
                      <input value={edu.fieldOfStudy} onChange={(e) => handleArrayChange('education', idx, 'fieldOfStudy', e.target.value)} placeholder="Field of Study" className="p-2 border border-gray-200 rounded text-sm w-full" />
                      <input value={edu.grade} onChange={(e) => handleArrayChange('education', idx, 'grade', e.target.value)} placeholder="Grade" className="p-2 border border-gray-200 rounded text-sm w-full" />
                      <input value={edu.startDate} onChange={(e) => handleArrayChange('education', idx, 'startDate', e.target.value)} placeholder="Start Year" className="p-2 border border-gray-200 rounded text-sm w-full" />
                      <input value={edu.endDate} onChange={(e) => handleArrayChange('education', idx, 'endDate', e.target.value)} placeholder="End Year" className="p-2 border border-gray-200 rounded text-sm w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Projects */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2"><Code size={16}/> Projects</h2>
                <button onClick={() => addArrayItem('projects', { title: '', link: '', description: '' })} className="text-xs font-bold text-violet-600 bg-violet-50 px-2 py-1 rounded hover:bg-violet-100 flex items-center gap-1"><Plus size={14}/> Add</button>
              </div>
              <div className="space-y-4">
                {resumeData.projects.map((proj, idx) => (
                  <div key={idx} className="p-4 border border-gray-100 rounded-xl bg-gray-50/50 relative group">
                    <button onClick={() => removeArrayItem('projects', idx)} className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <input value={proj.title} onChange={(e) => handleArrayChange('projects', idx, 'title', e.target.value)} placeholder="Title" className="p-2 border border-gray-200 rounded text-sm w-full" />
                      <input value={proj.link} onChange={(e) => handleArrayChange('projects', idx, 'link', e.target.value)} placeholder="Link" className="p-2 border border-gray-200 rounded text-sm w-full" />
                    </div>
                    <textarea value={proj.description} onChange={(e) => handleArrayChange('projects', idx, 'description', e.target.value)} placeholder="Description..." className="p-2 border border-gray-200 rounded text-sm w-full h-16 resize-none"></textarea>
                  </div>
                ))}
              </div>
            </section>

            {/* Skills */}
            <section>
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Skills</h2>
              <textarea value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} placeholder="React, Node.js, Python... (Comma separated)" className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm w-full h-20 resize-none"></textarea>
            </section>

          </div>
        </div>

        {/* Right Pane - Live Preview */}
        <div className="w-full xl:w-[55%] bg-gray-200/50 p-4 sm:p-6 rounded-3xl border border-gray-200 overflow-auto h-[800px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <style>{`
            .resume-preview-wrapper { zoom: 0.45; }
            @media (min-width: 640px) { .resume-preview-wrapper { zoom: 0.65; } }
            @media (min-width: 768px) { .resume-preview-wrapper { zoom: 0.9; } }
            @media (min-width: 1024px) { .resume-preview-wrapper { zoom: 1; } }
            @media (min-width: 1280px) { .resume-preview-wrapper { zoom: 0.8; } }
            @media (min-width: 1536px) { .resume-preview-wrapper { zoom: 1; } }
          `}</style>
          <div className="resume-preview-wrapper mx-auto w-[210mm]">
            <div className="bg-white shadow-2xl shrink-0 w-[210mm] min-h-[297mm]">
            {/* PRINTABLE AREA */}
            <div ref={componentRef} className="text-gray-800 bg-white min-h-[297mm] box-border" style={{ fontFamily: resumeData.theme.fontFamily, lineHeight: 1.5 }}>
              
              {/* === TEMPLATE: MODERN === */}
              {tpl === 'modern' && (
                <div className="p-[10mm]">
                  <header className="border-b-[3px] pb-5 mb-6 text-center" style={{ borderColor: col }}>
                    <h1 className="text-3xl font-black uppercase tracking-widest mb-3" style={{ color: col }}>{p.fullName || "YOUR NAME"}</h1>
                    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] text-gray-600 font-medium">
                      {p.email && <span className="flex items-center gap-1"><Mail size={12}/>{p.email}</span>}
                      {p.phone && <span className="flex items-center gap-1"><Phone size={12}/>{p.phone}</span>}
                      {p.address && <span className="flex items-center gap-1"><MapPin size={12}/>{p.address}</span>}
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 text-[11px] mt-1 text-gray-600 font-medium">
                      {p.linkedin && <span className="flex items-center gap-1"><Link size={12}/>{p.linkedin.replace(/^https?:\/\//,'')}</span>}
                      {p.github && <span className="flex items-center gap-1"><Code size={12}/>{p.github.replace(/^https?:\/\//,'')}</span>}
                      {p.portfolio && <span className="flex items-center gap-1"><Code size={12}/>{p.portfolio.replace(/^https?:\/\//,'')}</span>}
                    </div>
                  </header>

                  <div className="space-y-6">
                    {resumeData.summary && (
                      <section>
                        <p className="text-[12px] text-gray-700 whitespace-pre-wrap leading-relaxed">{resumeData.summary}</p>
                      </section>
                    )}

                    {skillsInput.length > 0 && (
                      <section>
                        <h2 className="text-sm font-bold uppercase border-b pb-1 mb-2" style={{ color: col, borderColor: col }}>Skills</h2>
                        <p className="text-[12px] text-gray-700 font-medium">{skillsInput}</p>
                      </section>
                    )}

                    {resumeData.experience.length > 0 && (
                      <section>
                        <h2 className="text-sm font-bold uppercase border-b pb-1 mb-3" style={{ color: col, borderColor: col }}>Experience</h2>
                        <div className="space-y-4">
                          {resumeData.experience.map((exp, idx) => (
                            <div key={idx}>
                              <div className="flex justify-between items-baseline mb-0.5">
                                <h3 className="text-[13px] font-bold text-gray-900">{exp.role}</h3>
                                <span className="text-[11px] text-gray-500 font-bold bg-gray-100 px-2 py-0.5 rounded">{exp.startDate} {exp.endDate ? `- ${exp.endDate}` : ''}</span>
                              </div>
                              <div className="text-[12px] font-bold italic mb-1.5" style={{ color: col }}>{exp.company}</div>
                              <p className="text-[12px] text-gray-700 whitespace-pre-wrap pl-3 border-l-2 border-gray-200">{exp.description}</p>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                    {resumeData.projects.length > 0 && (
                      <section>
                        <h2 className="text-sm font-bold uppercase border-b pb-1 mb-3" style={{ color: col, borderColor: col }}>Projects</h2>
                        <div className="space-y-3">
                          {resumeData.projects.map((proj, idx) => (
                            <div key={idx}>
                              <div className="flex justify-between items-baseline mb-0.5">
                                <h3 className="text-[13px] font-bold text-gray-900">{proj.title}</h3>
                                {proj.link && <span className="text-[11px] text-gray-500 font-medium">{proj.link.replace(/^https?:\/\//,'')}</span>}
                              </div>
                              <p className="text-[12px] text-gray-700 whitespace-pre-wrap">{proj.description}</p>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                    {resumeData.education.length > 0 && (
                      <section>
                        <h2 className="text-sm font-bold uppercase border-b pb-1 mb-3" style={{ color: col, borderColor: col }}>Education</h2>
                        <div className="space-y-3">
                          {resumeData.education.map((edu, idx) => (
                            <div key={idx}>
                              <div className="flex justify-between items-baseline mb-0.5">
                                <h3 className="text-[13px] font-bold text-gray-900">{edu.school}</h3>
                                <span className="text-[11px] text-gray-500 font-bold bg-gray-100 px-2 py-0.5 rounded">{edu.startDate} {edu.endDate ? `- ${edu.endDate}` : ''}</span>
                              </div>
                              <div className="flex justify-between items-baseline text-[12px] text-gray-700 font-medium">
                                <span>{edu.degree} in {edu.fieldOfStudy}</span>
                                {edu.grade && <span style={{ color: col }}>Grade: {edu.grade}</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}
                  </div>
                </div>
              )}

              {/* === TEMPLATE: PROFESSIONAL (TWO COLUMN) === */}
              {tpl === 'professional' && (
                <div className="flex h-full min-h-[297mm]">
                  {/* Left Column */}
                  <div className="w-[35%] p-[8mm] text-white" style={{ backgroundColor: col }}>
                    <div className="mb-8">
                      <h1 className="text-2xl font-black uppercase tracking-wider mb-1 leading-tight">{p.fullName || "YOUR NAME"}</h1>
                      {resumeData.experience.length > 0 && (
                        <div className="text-[12px] opacity-80 uppercase tracking-widest font-medium">{resumeData.experience[0].role}</div>
                      )}
                    </div>

                    <div className="space-y-6">
                      <section>
                        <h2 className="text-[11px] uppercase tracking-widest border-b border-white/20 pb-1 mb-3 font-bold opacity-90">Contact</h2>
                        <div className="space-y-2 text-[11px] opacity-90">
                          {p.email && <div className="flex items-center gap-2"><Mail size={12} className="shrink-0"/> <span className="break-all">{p.email}</span></div>}
                          {p.phone && <div className="flex items-center gap-2"><Phone size={12} className="shrink-0"/> <span>{p.phone}</span></div>}
                          {p.address && <div className="flex items-center gap-2"><MapPin size={12} className="shrink-0"/> <span>{p.address}</span></div>}
                          {p.linkedin && <div className="flex items-center gap-2"><Link size={12} className="shrink-0"/> <span className="break-all">{p.linkedin.replace(/^https?:\/\//,'')}</span></div>}
                          {p.github && <div className="flex items-center gap-2"><Code size={12} className="shrink-0"/> <span className="break-all">{p.github.replace(/^https?:\/\//,'')}</span></div>}
                        </div>
                      </section>

                      {skillsInput.length > 0 && (
                        <section>
                          <h2 className="text-[11px] uppercase tracking-widest border-b border-white/20 pb-1 mb-3 font-bold opacity-90">Skills</h2>
                          <div className="flex flex-wrap gap-1">
                            {skillsInput.split(',').map((s, i) => s.trim() && (
                              <span key={i} className="text-[10px] px-2 py-1 bg-white/10 rounded font-medium">{s.trim()}</span>
                            ))}
                          </div>
                        </section>
                      )}

                      {resumeData.education.length > 0 && (
                        <section>
                          <h2 className="text-[11px] uppercase tracking-widest border-b border-white/20 pb-1 mb-3 font-bold opacity-90">Education</h2>
                          <div className="space-y-3">
                            {resumeData.education.map((edu, idx) => (
                              <div key={idx}>
                                <div className="text-[11px] font-bold">{edu.degree}</div>
                                <div className="text-[10px] opacity-80">{edu.fieldOfStudy}</div>
                                <div className="text-[10px] italic mt-1">{edu.school}</div>
                                <div className="text-[10px] opacity-80">{edu.startDate} {edu.endDate ? `- ${edu.endDate}` : ''}</div>
                              </div>
                            ))}
                          </div>
                        </section>
                      )}
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="w-[65%] p-[8mm] bg-white">
                    {resumeData.summary && (
                      <section className="mb-6">
                        <h2 className="text-[12px] font-black uppercase tracking-widest border-b-2 pb-1 mb-3" style={{ borderColor: col, color: col }}>Profile</h2>
                        <p className="text-[12px] text-gray-700 whitespace-pre-wrap leading-relaxed">{resumeData.summary}</p>
                      </section>
                    )}

                    {resumeData.experience.length > 0 && (
                      <section className="mb-6">
                        <h2 className="text-[12px] font-black uppercase tracking-widest border-b-2 pb-1 mb-3" style={{ borderColor: col, color: col }}>Experience</h2>
                        <div className="space-y-5">
                          {resumeData.experience.map((exp, idx) => (
                            <div key={idx}>
                              <div className="flex justify-between items-baseline mb-0.5">
                                <h3 className="text-[13px] font-bold text-gray-900">{exp.role}</h3>
                                <span className="text-[11px] text-gray-500 font-bold" style={{ color: col }}>{exp.startDate} {exp.endDate ? `- ${exp.endDate}` : ''}</span>
                              </div>
                              <div className="text-[12px] font-bold text-gray-600 uppercase tracking-wider mb-2">{exp.company}</div>
                              <p className="text-[12px] text-gray-700 whitespace-pre-wrap">{exp.description}</p>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                    {resumeData.projects.length > 0 && (
                      <section>
                        <h2 className="text-[12px] font-black uppercase tracking-widest border-b-2 pb-1 mb-3" style={{ borderColor: col, color: col }}>Projects</h2>
                        <div className="space-y-4">
                          {resumeData.projects.map((proj, idx) => (
                            <div key={idx}>
                              <div className="flex justify-between items-baseline mb-0.5">
                                <h3 className="text-[13px] font-bold text-gray-900">{proj.title}</h3>
                                {proj.link && <span className="text-[10px] text-gray-500 font-medium">{proj.link.replace(/^https?:\/\//,'')}</span>}
                              </div>
                              <p className="text-[12px] text-gray-700 whitespace-pre-wrap">{proj.description}</p>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}
                  </div>
                </div>
              )}

              {/* === TEMPLATE: EXECUTIVE === */}
              {tpl === 'executive' && (
                <div className="p-[10mm]">
                  <header className="text-center mb-6">
                    <h1 className="text-4xl font-bold uppercase tracking-widest mb-2" style={{ color: col }}>{p.fullName || "YOUR NAME"}</h1>
                    <div className="w-16 h-1 bg-gray-900 mx-auto mb-3" style={{ backgroundColor: col }}></div>
                    <div className="flex justify-center flex-wrap gap-2 text-[11px] text-gray-700 uppercase tracking-wider">
                      {p.address && <span>{p.address} | </span>}
                      {p.phone && <span>{p.phone} | </span>}
                      {p.email && <span>{p.email}</span>}
                    </div>
                    {(p.linkedin || p.github) && (
                      <div className="flex justify-center flex-wrap gap-2 text-[11px] text-gray-700 uppercase tracking-wider mt-1">
                        {p.linkedin && <span>{p.linkedin.replace(/^https?:\/\//,'')} | </span>}
                        {p.github && <span>{p.github.replace(/^https?:\/\//,'')}</span>}
                      </div>
                    )}
                  </header>

                  <div className="space-y-5">
                    {resumeData.summary && (
                      <section>
                        <p className="text-[12px] text-gray-800 text-center italic px-10 leading-relaxed">"{resumeData.summary}"</p>
                      </section>
                    )}

                    {resumeData.experience.length > 0 && (
                      <section>
                        <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-3 text-center" style={{ color: col }}>Professional Experience</h2>
                        <div className="space-y-4">
                          {resumeData.experience.map((exp, idx) => (
                            <div key={idx}>
                              <div className="flex justify-between items-baseline mb-1">
                                <div>
                                  <span className="text-[13px] font-bold text-gray-900">{exp.company}</span>
                                  <span className="text-[12px] italic text-gray-600"> — {exp.role}</span>
                                </div>
                                <span className="text-[11px] text-gray-600 font-bold">{exp.startDate} - {exp.endDate || 'Present'}</span>
                              </div>
                              <p className="text-[12px] text-gray-700 whitespace-pre-wrap">{exp.description}</p>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                    {resumeData.education.length > 0 && (
                      <section>
                        <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-3 text-center" style={{ color: col }}>Education</h2>
                        <div className="space-y-3">
                          {resumeData.education.map((edu, idx) => (
                            <div key={idx} className="flex justify-between items-baseline">
                              <div>
                                <div className="text-[13px] font-bold text-gray-900">{edu.school}</div>
                                <div className="text-[12px] italic text-gray-700">{edu.degree} in {edu.fieldOfStudy}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-[11px] text-gray-600 font-bold">{edu.startDate} - {edu.endDate}</div>
                                {edu.grade && <div className="text-[11px] text-gray-500">Grade: {edu.grade}</div>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                    {skillsInput.length > 0 && (
                      <section>
                        <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-3 text-center" style={{ color: col }}>Core Competencies</h2>
                        <p className="text-[12px] text-gray-800 text-center leading-relaxed font-medium">{skillsInput.split(',').map(s=>s.trim()).filter(s=>s).join(' • ')}</p>
                      </section>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
        </div>

      </div>
    </div>
  );
}
