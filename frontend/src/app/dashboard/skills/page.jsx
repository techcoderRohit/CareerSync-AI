"use client";

import React, { useState, useEffect } from 'react';
import { Plus, X, Loader2, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const COMMON_SKILLS = [
  "React.js", "Next.js", "Node.js", "JavaScript", "TypeScript",
  "Python", "Java", "C++", "C#", "Go", "Rust", "Ruby",
  "HTML", "CSS", "Tailwind CSS", "Bootstrap",
  "MongoDB", "PostgreSQL", "MySQL", "Redis",
  "AWS", "Docker", "Kubernetes", "Git",
  "Machine Learning", "Data Science", "Artificial Intelligence",
  "UI/UX Design", "Figma", "Adobe XD", "SQL", "Express.js"
];

export default function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [verifiedSkills, setVerifiedSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.user) {
          if (data.user.skills) {
            const skillsArray = data.user.skills.split(',').map(s => s.trim()).filter(Boolean);
            setSkills(skillsArray);
          }
          if (data.user.verifiedSkills) {
            setVerifiedSkills(data.user.verifiedSkills.map(s => s.trim()));
          }
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load skills");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const saveSkillsToBackend = async (updatedSkillsArray) => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const skillsString = updatedSkillsArray.join(', ');
      const res = await fetch('http://localhost:5000/api/auth/skills', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ skills: skillsString })
      });
      if (!res.ok) {
        throw new Error("Failed to save");
      }
      toast.success("Skills updated successfully!");
    } catch (error) {
      toast.error("Error saving skills");
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = async (skillName) => {
    const trimmedSkill = skillName.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      const newSkillsArray = [...skills, trimmedSkill];
      setSkills(newSkillsArray);
      setSearchQuery('');
      setIsModalOpen(false);
      await saveSkillsToBackend(newSkillsArray);
    }
  };

  const handleRemoveSkill = async (skillToRemove) => {
    const updatedSkills = skills.filter(skill => skill !== skillToRemove);
    setSkills(updatedSkills);
    await saveSkillsToBackend(updatedSkills);
  };

  const filteredSkills = COMMON_SKILLS.filter(s => 
    s.toLowerCase().includes(searchQuery.toLowerCase()) && !skills.includes(s)
  );

  return (
    <>
      <div className="animate-fade-up">
        <h1 className="text-[2.5rem] font-extrabold mb-2 text-slate-900 tracking-tight">Skills Management</h1>
      <p className="text-slate-500 text-[1.1rem] mb-10">Add and manage the skills that will be highlighted on your profile and resume.</p>

      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-[0_10px_25px_rgba(0,0,0,0.02)] max-w-3xl">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-bold text-slate-900">Your Skills</h3>
          <div className="flex gap-4">
            <button 
              onClick={() => window.location.href='/dashboard/skills/assessment'}
              className="bg-white border-2 border-emerald-500 text-emerald-600 px-6 py-3 rounded-2xl font-bold transition-all hover:-translate-y-0.5 hover:shadow-emerald-500/20 flex items-center gap-2"
            >
              Take Assessment
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-violet-600/20 hover:-translate-y-0.5 hover:shadow-violet-600/30 flex items-center gap-2"
            >
              <Plus size={18} /> Add Skill
            </button>
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center p-10 text-slate-500">
            <Loader2 className="animate-spin" size={24} />
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {skills.map((skill, index) => {
              // Capitalize display logic like in backend
              const displaySkill = skill.toLowerCase() === 'ui/ux' ? 'UI/UX' : skill.toLowerCase() === 'node.js' ? 'Node.js' : skill.charAt(0).toUpperCase() + skill.slice(1).toLowerCase();
              const isVerified = verifiedSkills.includes(displaySkill);
              return (
                <div key={index} className={`px-4 py-2.5 rounded-full text-[0.95rem] font-bold border inline-flex items-center gap-2.5 transition-all duration-200 hover:scale-105 ${isVerified ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-200 text-indigo-600 hover:bg-slate-100 hover:border-indigo-200'}`}>
                  {skill}
                  {isVerified && (
                    <span className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded-md uppercase tracking-wider">Verified</span>
                  )}
                  <button 
                    onClick={() => handleRemoveSkill(skill)}
                    disabled={saving}
                    className="bg-transparent border-none text-slate-400 cursor-pointer flex items-center hover:text-red-500 transition-colors disabled:opacity-50 ml-1"
                  >
                    <X size={16} />
                  </button>
                </div>
              );
            })}
            {skills.length === 0 && <p className="text-slate-500 font-medium">No skills added yet.</p>}
          </div>
        )}
      </div>
      </div>

      {/* Add Skill Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="bg-white rounded-3xl w-full max-w-md relative z-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] animate-fade-up overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-extrabold text-slate-900">Add New Skill</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 border-b border-slate-100 shrink-0">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Search size={18} />
                </div>
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Search for a skill..." 
                  className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-3.5 rounded-xl text-slate-900 text-sm transition-all focus:outline-none focus:border-violet-600 focus:bg-white focus:ring-4 focus:ring-violet-600/10 font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      handleAddSkill(searchQuery);
                    }
                  }}
                />
              </div>
            </div>

            <div className="p-4 overflow-y-auto flex-1 custom-scrollbar">
              {filteredSkills.length > 0 ? (
                <div className="flex flex-col gap-1">
                  {filteredSkills.map(skill => (
                    <button
                      key={skill}
                      onClick={() => handleAddSkill(skill)}
                      className="text-left px-4 py-3 rounded-xl hover:bg-violet-50 hover:text-violet-700 text-slate-700 font-semibold text-sm transition-colors flex justify-between items-center group"
                    >
                      {skill}
                      <Plus size={16} className="opacity-0 group-hover:opacity-100" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center p-6">
                  <p className="text-slate-500 mb-4 text-sm">No exact matches found.</p>
                  {searchQuery.trim() && (
                    <button
                      onClick={() => handleAddSkill(searchQuery)}
                      className="bg-violet-50 text-violet-700 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-violet-100 transition-colors inline-flex items-center gap-2"
                    >
                      <Plus size={16} /> Add "{searchQuery}"
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
