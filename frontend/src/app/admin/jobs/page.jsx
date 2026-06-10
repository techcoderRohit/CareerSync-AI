"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Briefcase, X, Loader2, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);

  // Form State
  const initialFormState = {
    title: '',
    company: '',
    location: '',
    salary: '',
    type: 'Full-time',
    category: 'Frontend',
    description: '',
    skills: '' // comma separated
  };
  const [formData, setFormData] = useState(initialFormState);

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/jobs`);
      const data = await res.json();
      if (data.jobs) {
        setJobs(data.jobs);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditClick = (job) => {
    setFormData({
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary,
      type: job.type,
      category: job.category,
      description: job.description,
      skills: job.skills ? job.skills.join(', ') : ''
    });
    setEditingJobId(job._id);
    setIsModalOpen(true);
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job and all its applications?")) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}`}//api/jobs/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        toast.success("Job deleted successfully");
        fetchJobs();
      } else {
        toast.error("Failed to delete job");
      }
    } catch (error) {
      toast.error("Error deleting job");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s);
      
      const payload = {
        ...formData,
        skills: skillsArray,
        logo: formData.company.charAt(0).toUpperCase(),
        logoBg: 'bg-indigo-600',
      };

      if (!editingJobId) {
        payload.matchScore = Math.floor(Math.random() * 20) + 80;
        payload.responsibilities = ["Develop features", "Collaborate with team"];
        payload.requirements = ["Relevant degree", "Experience in role"];
        payload.benefits = ["Health insurance", "PTO"];
      }

      const url = editingJobId ? `${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}`}//api/jobs/${editingJobId}` : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/jobs`;
      const method = editingJobId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success(editingJobId ? "Job updated successfully!" : "Job posted successfully!");
        setIsModalOpen(false);
        setFormData(initialFormState);
        setEditingJobId(null);
        fetchJobs();
      } else {
        const errData = await res.json();
        toast.error(errData.error || "Failed to save job");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error saving job");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="animate-fade-up">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Manage Jobs</h1>
          <p className="text-slate-500 mt-1">Add, view, and manage all active job postings.</p>
        </div>
        <button 
          onClick={() => {
            setFormData(initialFormState);
            setEditingJobId(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-violet-500/30 transition-all hover:-translate-y-0.5"
        >
          <Plus size={20} /> Post New Job
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-[0_10px_25px_rgba(0,0,0,0.02)]">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-bold text-slate-900">Active Job Postings</h2>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl w-full sm:w-auto">
            <Search size={18} className="text-slate-400" />
            <input type="text" placeholder="Search jobs..." className="bg-transparent border-none outline-none text-sm w-full" />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-slate-500 flex justify-center"><Loader2 className="animate-spin" size={24} /></div>
          ) : jobs.length === 0 ? (
            <div className="p-12 text-center text-slate-500 font-medium">No jobs posted yet.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm">
                  <th className="p-4 font-semibold whitespace-nowrap">Job Title & Company</th>
                  <th className="p-4 font-semibold">Location</th>
                  <th className="p-4 font-semibold">Type & Category</th>
                  <th className="p-4 font-semibold">Posted Date</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${job.logoBg || 'bg-slate-800'} text-white flex items-center justify-center font-bold shadow-sm shrink-0`}>
                          {job.logo || <Briefcase size={18} />}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{job.title}</div>
                          <div className="text-xs text-slate-500">{job.company}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-medium text-slate-700">{job.location}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 bg-violet-50 text-violet-600 rounded-lg text-xs font-bold whitespace-nowrap">{job.type}</span>
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold whitespace-nowrap">{job.category}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-500 font-medium">
                      {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEditClick(job)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-semibold text-sm">Edit</button>
                        <button onClick={() => handleDeleteJob(job._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-semibold text-sm">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      </div>

      {/* POST NEW JOB MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] p-4 sm:p-6 flex justify-center items-start overflow-y-auto" style={{ margin: 0 }}>
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !submitting && setIsModalOpen(false)}></div>
          
          <div className="bg-white rounded-3xl w-full max-w-2xl my-auto flex flex-col relative z-10 shadow-2xl animate-fade-up overflow-hidden max-h-[95vh] sm:max-h-[85vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">{editingJobId ? 'Edit Job' : 'Post New Job'}</h2>
                <p className="text-sm text-slate-500 mt-1">{editingJobId ? 'Update the details for this job.' : 'This will automatically notify students with matching skills.'}</p>
              </div>
              <button onClick={() => !submitting && setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            {/* Custom scrollbar styling added here */}
            <div className="p-6 overflow-y-auto flex-1 min-h-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-300">
              <form id="jobForm" onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Job Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600" placeholder="e.g. Frontend Engineer" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Company Name</label>
                    <input type="text" name="company" value={formData.company} onChange={handleChange} required className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600" placeholder="e.g. Google" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Location</label>
                    <input type="text" name="location" value={formData.location} onChange={handleChange} required className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600" placeholder="e.g. Remote (Global)" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Salary</label>
                    <input type="text" name="salary" value={formData.salary} onChange={handleChange} required className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600" placeholder="e.g. $100k - $120k / Yr" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Job Type</label>
                    <select name="type" value={formData.type} onChange={handleChange} className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 cursor-pointer">
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Category</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 cursor-pointer">
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="Full Stack">Full Stack</option>
                      <option value="UI/UX">UI/UX</option>
                      <option value="Data Science">Data Science</option>
                      <option value="AI / ML">AI / ML</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Required Skills (Comma separated)</label>
                  <input type="text" name="skills" value={formData.skills} onChange={handleChange} required className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600" placeholder="e.g. React, Node.js, Python" />
                  <p className="text-xs text-slate-500">We will notify students whose profile matches these skills.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 resize-none" placeholder="Short description of the role..." />
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-3xl shrink-0">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors">
                Cancel
              </button>
              <button type="submit" form="jobForm" disabled={submitting} className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-violet-500/30 transition-all">
                {submitting ? <Loader2 className="animate-spin" size={18} /> : (editingJobId ? null : <Plus size={18} />)}
                {editingJobId ? 'Save Changes' : 'Publish Job'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
