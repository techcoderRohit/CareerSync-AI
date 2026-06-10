"use client";

import React, { useState, useEffect } from 'react';
import { UploadCloud, File, CheckCircle, X, AlertTriangle, FileCheck, ArrowRight, Activity, Zap, Eye, Briefcase, ExternalLink, Check } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ResumePage() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [activeScan, setActiveScan] = useState(null);
  
  // Job Suggestions State
  const [availableJobs, setAvailableJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState([]);

  const fetchJobsData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const jobsRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/jobs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAvailableJobs(jobsRes.data.jobs || []);

      const appliedRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/applications/my-applications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppliedJobIds(appliedRes.data.appliedJobIds || []);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  useEffect(() => {
    fetchJobsData();
  }, []);

  const handleApply = async (jobId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/applications/apply`, { jobId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Successfully applied for the job!');
      setAppliedJobIds(prev => [...prev, jobId]);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to apply.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
    } else {
      toast.error('Please upload a PDF file.');
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      toast.error('Please upload a PDF file.');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setActiveScan(null);

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/resume/analyze`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.success('Resume analyzed successfully!');
      setActiveScan(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to analyze resume');
    } finally {
      setUploading(false);
    }
  };

  const handleViewPdf = () => {
    if (!activeScan || !activeScan._id) return;
    try {
      const token = localStorage.getItem('token');
      // Open the backend HTML wrapper route in a new tab to enforce correct tab title
      window.open(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/resume/view/${activeScan._id}?token=${token}`, '_blank');
    } catch (err) {
      console.error("Error viewing PDF:", err);
      toast.error('Failed to open PDF securely.');
    }
  };

  // Filter Jobs Based on ATS Score
  const getSuggestedJobs = () => {
    if (!activeScan || !activeScan.analysisResult) return [];
    const score = activeScan.analysisResult.score;
    let filtered = availableJobs;
    
    if (score < 60) {
      filtered = availableJobs.filter(j => j.type === 'Internship' || j.title.toLowerCase().includes('junior') || j.title.toLowerCase().includes('entry'));
      if (filtered.length === 0) filtered = availableJobs.slice(0, 3);
    } else {
      filtered = availableJobs.filter(j => j.type === 'Full-time');
      if (filtered.length === 0) filtered = availableJobs.slice(0, 3);
    }
    
    return filtered.slice(0, 4); // return top 4 suggestions
  };

  return (
    <div className="animate-fade-up">
      <div className="mb-10 text-center xl:text-left">
        <h1 className="text-[2.5rem] font-extrabold mb-2 text-slate-900 tracking-tight flex items-center justify-center xl:justify-start gap-3">
          AI Resume Analyzer <Zap className="text-violet-500 fill-violet-500" size={32} />
        </h1>
        <p className="text-slate-500 text-[1.1rem]">Upload your resume to get instant ATS scoring and AI-driven optimization tips.</p>
      </div>

      {/* Dynamic Grid: If no analysis, upload box is centered. If analysis exists, split layout. */}
      <div className={`grid grid-cols-1 ${activeScan ? 'xl:grid-cols-3' : 'max-w-4xl mx-auto'} gap-8 transition-all duration-500`}>
        
        {/* Upload Section */}
        <div className={`flex flex-col gap-6 ${activeScan ? 'xl:col-span-1' : ''}`}>
          <div className="bg-white border border-slate-200 rounded-3xl p-6 lg:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.04)] h-full flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold mb-6 text-slate-900 flex items-center gap-2">
                <FileCheck className="text-violet-600" /> Upload Resume
              </h2>
              
              <div 
                className={`border-2 border-dashed rounded-3xl py-12 px-4 text-center transition-all duration-300 cursor-pointer ${file ? 'border-violet-500 bg-violet-50/50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-violet-400'}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => document.getElementById('resume-upload').click()}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors ${file ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30' : 'bg-violet-600/10 text-violet-600'}`}>
                  <UploadCloud size={32} />
                </div>
                <h3 className="text-lg font-bold mb-2 text-slate-900">
                  {file ? 'Resume Selected' : 'Drag & Drop your PDF'}
                </h3>
                <p className="text-slate-500 font-medium text-sm">
                  {file ? file.name : 'Or click to browse files (Max 5MB)'}
                </p>
                <input 
                  type="file" 
                  id="resume-upload" 
                  accept=".pdf" 
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {file && (
                <div className="mt-4 flex justify-end">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setFile(null); setActiveScan(null); }}
                    className="text-red-500 text-sm font-bold hover:underline"
                  >
                    Remove File
                  </button>
                </div>
              )}

              <div className="mt-8">
                <label className="block text-[0.95rem] text-slate-700 mb-3 font-bold">Target Job Description (Recommended)</label>
                <textarea 
                  className="w-full bg-slate-50 border border-slate-300 px-5 py-4 rounded-2xl text-slate-900 focus:outline-none focus:border-violet-600 focus:ring-4 focus:ring-violet-600/10 transition-all font-medium min-h-[120px]" 
                  placeholder="Paste the job description here to match keywords and get highly tailored AI feedback..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div className="mt-8">
              <button 
                className={`w-full text-white py-4 rounded-2xl font-bold text-lg transition-all flex justify-center items-center gap-3 ${(!file || uploading) ? 'bg-slate-300 cursor-not-allowed' : 'bg-gradient-to-br from-violet-600 to-indigo-600 shadow-xl shadow-violet-600/20 hover:-translate-y-1 hover:shadow-violet-600/40'}`}
                disabled={!file || uploading}
                onClick={handleUpload}
              >
                {uploading ? (
                  <><Activity size={24} className="animate-spin" /> Processing...</>
                ) : (
                  <><Zap size={24} /> Analyze My Resume</>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Loading Overlay State for Right Column (if uploading but no result yet) */}
        {uploading && !activeScan && (
           <div className="xl:col-span-2 flex flex-col items-center justify-center min-h-[500px] bg-white border border-slate-200 rounded-3xl p-6 lg:p-12 shadow-[0_15px_40px_rgba(0,0,0,0.04)] animate-pulse text-center">
             <Activity size={60} className="text-violet-600 animate-spin mb-6" />
             <h2 className="text-2xl font-bold text-slate-900 mb-2">Google Gemini AI is reading your resume...</h2>
             <p className="text-slate-500 font-medium">Extracting text, comparing keywords, and generating expert suggestions.</p>
           </div>
        )}

        {/* Analysis Output Column */}
        {activeScan && activeScan.analysisResult && !uploading && (
          <div className="xl:col-span-2 flex flex-col gap-6 lg:gap-8 animate-fade-up">
            
            {/* Score Header */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 lg:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.04)] flex flex-col md:flex-row items-center gap-6 lg:gap-10 relative">
              
              {/* View Resume Button */}
              {activeScan.filePath && (
                <button 
                  onClick={handleViewPdf}
                  className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center gap-2 bg-slate-50 border border-slate-200 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 text-slate-600 px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs md:text-sm font-bold transition-all"
                >
                  <Eye size={16} className="md:w-4 md:h-4 w-3 h-3" /> View PDF
                </button>
              )}

              <div className="w-[150px] h-[150px] md:w-[200px] md:h-[200px] rounded-full flex items-center justify-center relative shadow-[0_0_40px_rgba(124,58,237,0.15)] shrink-0 mt-8 md:mt-0" style={{ background: `conic-gradient(${activeScan.analysisResult.score >= 80 ? '#10b981' : activeScan.analysisResult.score >= 60 ? '#f59e0b' : '#ef4444'} ${activeScan.analysisResult.score}%, #e2e8f0 0)`}}>
                <div className="absolute w-[125px] h-[125px] md:w-[170px] md:h-[170px] bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                  <div className="text-4xl md:text-5xl font-black text-slate-900 leading-none">{activeScan.analysisResult.score}<span className="text-2xl md:text-3xl">%</span></div>
                  <div className="text-slate-500 font-bold uppercase tracking-widest mt-1 md:mt-2 text-xs md:text-sm">ATS Score</div>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3 md:pr-24">
                  {activeScan.analysisResult.score >= 80 ? 'Excellent Match!' : activeScan.analysisResult.score >= 60 ? 'Good, but needs refinement.' : 'Needs Significant Improvement.'}
                </h3>
                <p className="text-slate-600 font-medium text-[1rem] md:text-lg leading-relaxed mb-6">
                  {activeScan.analysisResult.score >= 80 
                    ? "Your resume is highly optimized for Applicant Tracking Systems and matches the targeted profile well." 
                    : "Your resume might get filtered out by standard ATS software. Focus on the missing keywords and formatting improvements below."}
                </p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <div className="bg-slate-50 text-slate-700 px-4 py-2 rounded-xl font-bold border border-slate-200 shadow-sm">Readability: <span className="text-violet-600">{activeScan.analysisResult.readability}</span></div>
                  <div className="bg-slate-50 text-slate-700 px-4 py-2 rounded-xl font-bold border border-slate-200 shadow-sm">Grade: <span className="text-violet-600">{activeScan.analysisResult.grade}</span></div>
                </div>
              </div>
            </div>

            {/* Keywords Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-[0_15px_40px_rgba(0,0,0,0.04)]">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600"><CheckCircle size={24} /></div>
                  <h3 className="text-xl font-bold text-slate-900">Matched Keywords</h3>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {activeScan.analysisResult.matched?.map((kw, i) => (
                    <span key={i} className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3.5 py-1.5 rounded-xl text-[0.9rem] font-bold shadow-sm">{kw}</span>
                  ))}
                  {(!activeScan.analysisResult.matched || activeScan.analysisResult.matched.length === 0) && <span className="text-slate-400 font-medium">None found. Add keywords from the JD.</span>}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-[0_15px_40px_rgba(0,0,0,0.04)]">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="bg-amber-100 p-2 rounded-lg text-amber-600"><AlertTriangle size={24} /></div>
                  <h3 className="text-xl font-bold text-slate-900">Missing Keywords</h3>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {activeScan.analysisResult.missing?.map((kw, i) => (
                    <span key={i} className="bg-red-50 text-red-600 border border-red-200 px-3.5 py-1.5 rounded-xl text-[0.9rem] font-bold shadow-sm">{kw}</span>
                  ))}
                  {(!activeScan.analysisResult.missing || activeScan.analysisResult.missing.length === 0) && <span className="text-slate-400 font-medium">No critical keywords missing!</span>}
                </div>
              </div>
            </div>

            {/* AI Optimization Suggestions */}
            <div className="bg-white border border-slate-200 rounded-3xl p-10 shadow-[0_15px_40px_rgba(0,0,0,0.04)]">
              <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3 border-b border-slate-100 pb-5">
                <Activity className="text-violet-600" size={28} /> AI Optimization Suggestions
              </h3>
              
              <div className="flex flex-col gap-8">
                {activeScan.analysisResult.improvements?.map((imp, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 relative overflow-hidden transition-all hover:border-violet-300 hover:shadow-md">
                    <div className={`absolute top-0 left-0 w-1.5 h-full ${imp.severity.includes('High') ? 'bg-red-500' : imp.severity.includes('Medium') ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                    
                    <div className="flex items-center justify-between mb-4 pl-2">
                      <h4 className="text-lg font-bold text-slate-900">{imp.title}</h4>
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${imp.severity.includes('High') ? 'bg-red-100 text-red-700' : imp.severity.includes('Medium') ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                        {imp.severity}
                      </span>
                    </div>
                    
                    <p className="text-slate-600 font-medium text-[1rem] mb-5 pl-2">{imp.issue}</p>
                    
                    <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm ml-2">
                      <div className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <div className="bg-violet-100 text-violet-600 p-1 rounded"><ArrowRight size={16}/></div> How to fix:
                      </div>
                      <div className="text-slate-600 mb-5 leading-relaxed font-medium">{imp.howToCorrect}</div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-red-50 p-4 rounded-xl border border-red-100 relative pt-6">
                          <span className="absolute top-0 left-0 bg-red-500 text-white text-[0.65rem] font-bold px-2 py-0.5 rounded-br-lg uppercase">Before</span>
                          <span className="text-slate-500 line-through decoration-red-300 text-sm block mt-1">{imp.beforeText}</span>
                        </div>
                        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 relative pt-6">
                          <span className="absolute top-0 left-0 bg-emerald-500 text-white text-[0.65rem] font-bold px-2 py-0.5 rounded-br-lg uppercase">After</span>
                          <span className="text-slate-800 font-bold text-sm block mt-1">{imp.afterText}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Jobs Section */}
            {getSuggestedJobs().length > 0 && (
              <div className="bg-white border border-slate-200 rounded-3xl p-10 shadow-[0_15px_40px_rgba(0,0,0,0.04)] animate-fade-up">
                <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-5">
                  <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    <Briefcase className="text-violet-600" size={28} /> Jobs You Can Apply For
                  </h3>
                  <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Based on your ATS Score</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {getSuggestedJobs().map(job => {
                    const isApplied = appliedJobIds.includes(job._id);
                    return (
                      <div key={job._id} className="border border-slate-200 p-6 rounded-2xl flex flex-col justify-between hover:shadow-lg transition-all hover:border-violet-300">
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-sm ${job.logoBg || 'bg-violet-600'}`}>
                              {job.company.charAt(0)}
                            </div>
                            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">{job.type}</span>
                          </div>
                          <h4 className="text-lg font-bold text-slate-900 mb-1">{job.title}</h4>
                          <p className="text-slate-500 font-medium text-sm mb-4">{job.company} &bull; {job.location}</p>
                          <div className="flex flex-wrap gap-2 mb-6">
                            {job.skills?.slice(0,3).map((skill, idx) => (
                              <span key={idx} className="bg-violet-50 text-violet-700 border border-violet-100 px-2 py-1 rounded-lg text-xs font-bold">{skill}</span>
                            ))}
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => handleApply(job._id)}
                          disabled={isApplied}
                          className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${isApplied ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-violet-600 hover:shadow-md'}`}
                        >
                          {isApplied ? <><Check size={16} /> Applied</> : <><ExternalLink size={16} /> Apply Now</>}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
