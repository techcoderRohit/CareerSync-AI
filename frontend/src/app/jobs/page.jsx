'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Sparkles, 
  Filter, 
  ChevronRight, 
  CheckCircle2, 
  X, 
  AlertCircle,
  Building,
  Calendar,
  ChevronLeft
} from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// Helper to convert dynamic class colors to inline style hex values to avoid tree-shaking issues
const getLogoColorHex = (logoBg) => {
  const colorMap = {
    'bg-indigo-600': '#4f46e5',
    'bg-blue-600': '#2563eb',
    'bg-sky-600': '#0284c7',
    'bg-orange-500': '#f97316',
    'bg-pink-600': '#db2777',
    'bg-red-500': '#ef4444'
  };
  return colorMap[logoBg] || '#7d3aed';
};

const JobsPage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [selectedJobForModal, setSelectedJobForModal] = useState(null);
  const [jobsData, setJobsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dynamicMatchScore, setDynamicMatchScore] = useState(null);

  const categories = ['All', 'Frontend', 'Backend', 'Full Stack', 'AI / ML', 'Data Science', 'UI/UX'];
  const jobTypes = ['All', 'Full-time', 'Internship'];

  // Load jobs dynamically from backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:5000/api/jobs', {
          params: {
            category: selectedCategory,
            type: selectedType,
            search: searchQuery
          }
        });
        setJobsData(response.data.jobs || []);
      } catch (error) {
        console.error("Error loading jobs from server:", error.message || error);
        toast.error("Failed to load jobs from server.");
        setJobsData([]);
      } finally {
        setIsLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchJobs();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [selectedCategory, selectedType, searchQuery]);

  // Load user applied job IDs on mount
  useEffect(() => {
    const fetchUserApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get("http://localhost:5000/api/applications/my-applications", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        setAppliedJobs(response.data.appliedJobIds || []);
      } catch (error) {
        console.error("Error loading applied jobs list:", error.message || error);
        // Clear expired/invalid token session
        if (error.response?.status === 403 || error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setAppliedJobs([]);
        }
      }
    };

    fetchUserApplications();
  }, []);

  const handleApply = async (jobId, jobTitle) => {
    if (appliedJobs.includes(jobId)) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to apply for jobs!");
      setTimeout(() => {
        router.push("/auth/login");
      }, 1000);
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/applications/apply", {
        jobId
      }, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      setAppliedJobs([...appliedJobs, jobId]);
      toast.success(`Successfully applied to ${jobTitle}!`);
    } catch (error) {
      const status = error.response?.status;
      if (status === 403 || status === 401) {
        toast.error("Your session has expired. Please log in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setAppliedJobs([]);
        setTimeout(() => {
          router.push("/auth/login");
        }, 1500);
      } else {
        const errMsg = error.response?.data?.error || error.message || "Failed to apply for the job.";
        toast.error(errMsg);
      }
    }
  };


  return (
    <div className="min-h-screen bg-violet-50/30 flex flex-col justify-between font-sans">
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow pt-24 pb-20 sm:pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Dashboard Info */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 sm:mb-16">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 bg-violet-50 text-violet-600 px-4 py-2 rounded-full text-xs font-bold border border-violet-100">
                <Sparkles size={14} className="fill-violet-600 animate-pulse" />
                <span>AI Job Matcher</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">
                Recommended <span className="text-violet-600">Jobs for You</span>
              </h1>
              <p className="text-gray-500 font-medium max-w-xl">
                Explore internship and job openings curated based on your resume ATS score and skills profile.
              </p>
            </div>
            
            {/* Search Input Bar */}
            <div className="relative w-full md:max-w-md group">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-600 transition-colors" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs, companies, or skills..."
                className="w-full pl-12 pr-5 py-4 border border-gray-200 bg-white rounded-2xl text-gray-950 placeholder:text-gray-400 outline-none focus:ring-4 focus:ring-violet-600/5 focus:border-violet-600 transition-all font-medium"
              />
            </div>
          </div>

          {/* Filtering Controls Row */}
          <div className="space-y-6 mb-10">
            {/* Category Pills Slider */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="flex items-center gap-2 text-gray-400 font-bold text-sm mr-2 flex-shrink-0">
                <Filter size={16} /> Filters:
              </div>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold border transition-all cursor-pointer flex-shrink-0 ${
                    selectedCategory === cat
                    ? 'bg-violet-600 border-violet-600 text-white shadow-md shadow-violet-200'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-violet-200 hover:text-violet-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Job Type Toggle Selector */}
            <div className="flex bg-white/80 p-1.5 rounded-2xl w-fit border border-gray-200/50">
              {jobTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-6 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all duration-300 cursor-pointer ${
                    selectedType === type
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Jobs Listing Loading or Grid */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-12 h-12 border-4 border-violet-100 border-t-violet-600 rounded-full animate-spin"></div>
              <p className="text-gray-500 font-bold text-sm">Querying database for jobs...</p>
            </div>
          ) : jobsData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-up">
              {jobsData.map((job) => (
                <div 
                  key={job._id || job.id}
                  className="bg-white border border-gray-100 hover:border-violet-200 p-8 rounded-[32px] shadow-sm hover:shadow-xl hover:shadow-violet-900/5 transition-all duration-300 flex flex-col justify-between relative group"
                >
                  {/* Header info */}
                  <div className="space-y-6">
                    <div className="flex items-start justify-between gap-4">
                      {/* Logo and company name */}
                      <div className="flex items-center gap-3">
                        <div 
                          style={{ backgroundColor: getLogoColorHex(job.logoBg) }}
                          className="w-12 h-12 rounded-xl text-white flex items-center justify-center font-bold text-xl shadow-md"
                        >
                          {job.logo}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 leading-snug">{job.company}</h4>
                          <span className="text-gray-400 text-xs font-semibold">{job.type}</span>
                        </div>
                      </div>

                      {/* AI Matching Score Badge */}
                      <div className={`px-3 py-1.5 rounded-xl border flex flex-col items-center ${
                        job.matchScore >= 90 
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                        : job.matchScore >= 80
                        ? 'bg-violet-50 border-violet-100 text-violet-600'
                        : 'bg-amber-50 border-amber-100 text-amber-600'
                      }`}>
                        <span className="text-[10px] font-extrabold uppercase tracking-wide leading-none">Match</span>
                        <span className="text-sm font-black leading-none mt-1">{job.matchScore}%</span>
                      </div>
                    </div>

                    {/* Job Details Summary */}
                    <div className="space-y-3">
                      <h3 className="text-xl font-extrabold text-gray-950 transition-colors group-hover:text-violet-600">
                        {job.title}
                      </h3>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-500 text-sm font-semibold">
                          <MapPin size={16} /> <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 text-sm font-semibold">
                          <DollarSign size={16} /> <span>{job.salary}</span>
                        </div>
                      </div>
                    </div>

                    {/* Skills Tags list */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {job.skills.map((skill, index) => (
                        <span 
                          key={index}
                          className="bg-violet-50 border border-violet-100/50 text-violet-600 px-3 py-1 rounded-lg text-xs font-bold"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="pt-8 flex items-center justify-between gap-4">
                    {/* View details - Opens details modal */}
                    <button 
                      onClick={() => {
                        setSelectedJobForModal(job);
                        setDynamicMatchScore(null);
                        const token = localStorage.getItem("token");
                        if (token) {
                          axios.get(`http://localhost:5000/api/jobs/${job._id || job.id}/match`, {
                            headers: { Authorization: `Bearer ${token}` }
                          }).then(res => {
                            setDynamicMatchScore(res.data.matchScore);
                          }).catch(err => console.error("Match score error", err));
                        }
                      }}
                      className="text-sm font-bold text-gray-500 hover:text-violet-600 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      View details <ChevronRight size={16} />
                    </button>

                    {/* Quick Apply Button */}
                    <button
                      onClick={() => handleApply(job._id || job.id, job.title)}
                      disabled={appliedJobs.includes(job._id || job.id)}
                      className={`px-6 py-3 rounded-xl text-sm font-bold shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer ${
                        appliedJobs.includes(job._id || job.id)
                        ? 'bg-emerald-50 border border-emerald-100 text-emerald-600 shadow-none'
                        : 'bg-violet-600 text-white hover:bg-violet-700 shadow-violet-200'
                      }`}
                    >
                      {appliedJobs.includes(job._id || job.id) ? (
                        <>
                          <CheckCircle2 size={16} /> Applied
                        </>
                      ) : (
                        'Quick Apply'
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-[32px] p-16 text-center space-y-4 max-w-lg mx-auto shadow-sm">
              <div className="w-16 h-16 bg-violet-50 rounded-full flex items-center justify-center text-violet-600 mx-auto">
                <Briefcase size={28} />
              </div>
              <h3 className="text-2xl font-black text-gray-950">No Jobs Found</h3>
              <p className="text-gray-500 font-medium">
                We couldn't find any job openings matching "{searchQuery}" in this category. Try adjusting your search query or filters.
              </p>
            </div>
          )}

        </div>
      </main>

      {/* JOB DETAILS MODAL OVERLAY */}
      {selectedJobForModal && (
        <div 
          onClick={() => setSelectedJobForModal(null)}
          className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
        >
          {/* Modal Container */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-3xl rounded-[32px] border border-gray-100 shadow-2xl relative overflow-hidden my-8 max-h-[90vh] flex flex-col justify-between animate-pop-up"
          >
            {/* Modal Header */}
            <div className="p-6 sm:p-8 border-b border-gray-100 flex justify-between items-start gap-4">
              <div className="flex items-center gap-4">
                <div 
                  style={{ backgroundColor: getLogoColorHex(selectedJobForModal.logoBg) }}
                  className="w-14 h-14 rounded-2xl text-white flex items-center justify-center font-bold text-2xl shadow-md"
                >
                  {selectedJobForModal.logo}
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-950 leading-snug">{selectedJobForModal.title}</h2>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-semibold text-gray-400 mt-1">
                    <span className="flex items-center gap-1"><Building size={14}/> {selectedJobForModal.company}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><MapPin size={14}/> {selectedJobForModal.location}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Calendar size={14}/> {selectedJobForModal.type}</span>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button 
                onClick={() => setSelectedJobForModal(null)}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-50 rounded-xl transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body - Scrollable Content */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-grow">
              
              {/* Score Match and Salary Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-violet-50/40 border border-violet-100/50 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-black ${
                    (dynamicMatchScore !== null ? dynamicMatchScore : selectedJobForModal.matchScore) >= 90 
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    : 'bg-violet-50 text-violet-600 border border-violet-100'
                  }`}>
                    <span className="text-[9px] uppercase leading-none tracking-wide text-gray-400 font-extrabold">Score</span>
                    <span className="text-base leading-none mt-0.5">{dynamicMatchScore !== null ? dynamicMatchScore : selectedJobForModal.matchScore}%</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-950">AI Resume Match Score</h4>
                    <p className="text-xs font-semibold text-gray-400">Excellent skills match against your resume</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-gray-200/50 pt-3 sm:pt-0 sm:pl-4">
                  <div className="w-12 h-12 rounded-xl bg-violet-100/40 text-violet-600 flex items-center justify-center shadow-inner">
                    <DollarSign size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-950">{selectedJobForModal.salary}</h4>
                    <p className="text-xs font-semibold text-gray-400">Estimated compensation package</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h3 className="text-lg font-extrabold text-gray-950">About the Role</h3>
                <p className="text-gray-600 font-medium text-sm sm:text-base leading-relaxed">
                  {selectedJobForModal.description}
                </p>
              </div>

              {/* Responsibilities */}
              {selectedJobForModal.responsibilities && selectedJobForModal.responsibilities.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-extrabold text-gray-950">Key Responsibilities</h3>
                  <div className="space-y-3">
                    {selectedJobForModal.responsibilities.map((resp, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm font-medium text-gray-600">
                        <CheckCircle2 size={16} className="text-violet-600 mt-0.5 flex-shrink-0" />
                        <span>{resp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Requirements */}
              {selectedJobForModal.requirements && selectedJobForModal.requirements.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-extrabold text-gray-950">Requirements & Qualifications</h3>
                  <div className="space-y-3">
                    {selectedJobForModal.requirements.map((req, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm font-medium text-gray-600">
                        <AlertCircle size={16} className="text-violet-500 mt-0.5 flex-shrink-0" />
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills Tags */}
              {selectedJobForModal.skills && selectedJobForModal.skills.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-extrabold text-gray-950">Target Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedJobForModal.skills.map((skill, index) => (
                      <span 
                        key={index}
                        className="bg-violet-50 border border-violet-100/50 text-violet-600 px-4 py-2 rounded-xl text-xs font-bold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Benefits */}
              {selectedJobForModal.benefits && selectedJobForModal.benefits.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-extrabold text-gray-950">Perks & Compensation</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedJobForModal.benefits.map((ben, i) => (
                      <div key={i} className="p-3.5 bg-gray-50 border border-gray-150 rounded-xl text-xs font-bold text-gray-600 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-violet-600 rounded-full flex-shrink-0"></span>
                        <span>{ben}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Modal Actions Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between gap-4">
              <button 
                onClick={() => setSelectedJobForModal(null)}
                className="text-sm font-bold text-gray-500 hover:text-violet-600 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <ChevronLeft size={16} /> Back to listings
              </button>

              <button
                onClick={() => handleApply(selectedJobForModal._id || selectedJobForModal.id, selectedJobForModal.title)}
                disabled={appliedJobs.includes(selectedJobForModal._id || selectedJobForModal.id)}
                className={`px-8 py-3.5 rounded-xl text-sm font-bold shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer ${
                  appliedJobs.includes(selectedJobForModal._id || selectedJobForModal.id)
                  ? 'bg-emerald-50 border border-emerald-100 text-emerald-600 shadow-none'
                  : 'bg-violet-600 text-white hover:bg-violet-700 shadow-violet-200'
                }`}
              >
                {appliedJobs.includes(selectedJobForModal._id || selectedJobForModal.id) ? (
                  <>
                    <CheckCircle2 size={16} /> Applied
                  </>
                ) : (
                  'Quick Apply'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default JobsPage;
