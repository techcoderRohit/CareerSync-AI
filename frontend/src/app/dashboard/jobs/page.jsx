"use client";

import React, { useState, useEffect } from 'react';
import { ExternalLink, Clock, CheckCircle, XCircle, Search, Briefcase } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function JobsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchApplicationHistory();
  }, []);

  const fetchApplicationHistory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/applications/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(res.data.applications || []);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
      toast.error("Failed to load your applied jobs.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Applied': return <Clock size={16} />;
      case 'Reviewing': return <Search size={16} />;
      case 'Interviewing': return <Briefcase size={16} />;
      case 'Accepted': return <CheckCircle size={16} />;
      case 'Rejected': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Applied': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'Reviewing': return 'bg-purple-50 text-purple-600 border-purple-200';
      case 'Interviewing': return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'Accepted': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'Rejected': return 'bg-red-50 text-red-600 border-red-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const formatDate = (dateStr) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  return (
    <>
      <div className="animate-fade-up">
      <h1 className="text-[2.5rem] font-extrabold mb-2 text-slate-900 tracking-tight">Applied Jobs</h1>
      <p className="text-slate-500 text-[1.1rem] mb-6 lg:mb-10">Track the status of your job applications.</p>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 lg:p-8 shadow-[0_10px_25px_rgba(0,0,0,0.02)]">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-violet-600 mb-4"></div>
            <p className="font-medium">Loading your applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Briefcase size={48} className="mb-4 opacity-50" />
            <p className="font-medium text-lg text-slate-600 mb-2">No applications yet</p>
            <p className="text-center">Go to the ATS analyzer to find and apply for jobs!</p>
          </div>
        ) : (
          <div className="overflow-x-auto pb-4">
            <table className="w-full min-w-[700px] border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="p-4 font-bold whitespace-nowrap">Job Title</th>
                  <th className="p-4 font-bold whitespace-nowrap">Company</th>
                  <th className="p-4 font-bold whitespace-nowrap">Date Applied</th>
                  <th className="p-4 font-bold whitespace-nowrap">Status</th>
                  <th className="p-4 font-bold text-right whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id} className="border-b border-slate-100 transition-colors duration-300 hover:bg-slate-50 last:border-b-0">
                    <td className="p-4 font-bold text-slate-900 whitespace-nowrap">{app.jobId?.title || 'Unknown Role'}</td>
                    <td className="p-4 text-slate-600 font-medium whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0 ${app.jobId?.logoBg || 'bg-violet-600'}`}>
                          {app.jobId?.company?.charAt(0) || '?'}
                        </div>
                        {app.jobId?.company || 'Unknown Company'}
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 font-medium whitespace-nowrap">{formatDate(app.appliedAt)}</td>
                    <td className="p-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.85rem] font-bold border ${getStatusColor(app.status)}`}>
                        {getStatusIcon(app.status)} {app.status}
                      </span>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <button 
                        onClick={() => setSelectedJob(app.jobId)}
                        className="bg-slate-50 border border-slate-200 p-2 rounded-xl text-slate-500 hover:text-violet-600 hover:border-violet-200 hover:bg-violet-50 transition-colors cursor-pointer inline-flex" 
                        title="View Job Details"
                      >
                        <ExternalLink size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" style={{ margin: 0 }}>
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setSelectedJob(null)}
          ></div>
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] sm:max-h-[85vh] flex flex-col overflow-hidden animate-fade-up">
            <div className="p-5 sm:p-8 border-b border-slate-100 flex items-start justify-between bg-slate-50 shrink-0">
              <div className="flex gap-4 sm:gap-5 items-center">
                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl sm:text-3xl shadow-lg shrink-0 ${selectedJob.logoBg || 'bg-violet-600'}`}>
                  {selectedJob.company?.charAt(0) || '?'}
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-1 leading-tight">{selectedJob.title}</h2>
                  <p className="text-slate-600 text-sm sm:text-base font-medium flex items-center gap-2">
                    <Briefcase size={16} className="text-slate-400 shrink-0" />
                    {selectedJob.company} • {selectedJob.location}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedJob(null)}
                className="p-1.5 sm:p-2 text-slate-400 hover:bg-white hover:text-slate-900 rounded-full transition-colors shrink-0 ml-2"
              >
                <XCircle size={24} className="sm:w-7 sm:h-7" />
              </button>
            </div>
            
            <div className="p-5 sm:p-8 overflow-y-auto flex-1 min-h-0">
              <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
                <span className="bg-slate-100 text-slate-600 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold border border-slate-200">{selectedJob.type}</span>
                <span className="bg-emerald-50 text-emerald-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold border border-emerald-200">{selectedJob.salary}</span>
              </div>

              <div className="mb-6 sm:mb-8">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 sm:mb-3 border-b border-slate-100 pb-2">About the Role</h3>
                <p className="text-slate-600 leading-relaxed font-medium text-sm sm:text-base">{selectedJob.description}</p>
              </div>

              <div className="mb-6 sm:mb-8">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 sm:mb-3 border-b border-slate-100 pb-2">Requirements</h3>
                <ul className="list-disc pl-5 text-slate-600 font-medium space-y-1.5 sm:space-y-2 text-sm sm:text-base">
                  {selectedJob.requirements?.map((req, i) => <li key={i}>{req}</li>) || <li>Not specified</li>}
                </ul>
              </div>

              <div className="mb-6 sm:mb-8">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 sm:mb-3 border-b border-slate-100 pb-2">Responsibilities</h3>
                <ul className="list-disc pl-5 text-slate-600 font-medium space-y-1.5 sm:space-y-2 text-sm sm:text-base">
                  {selectedJob.responsibilities?.map((res, i) => <li key={i}>{res}</li>) || <li>Not specified</li>}
                </ul>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 sm:mb-3 border-b border-slate-100 pb-2">Benefits</h3>
                <ul className="list-disc pl-5 text-slate-600 font-medium space-y-1.5 sm:space-y-2 text-sm sm:text-base">
                  {selectedJob.benefits?.map((ben, i) => <li key={i}>{ben}</li>) || <li>Not specified</li>}
                </ul>
              </div>
            </div>
            
            <div className="p-5 sm:p-6 border-t border-slate-100 bg-slate-50 shrink-0 flex justify-end">
              <button 
                onClick={() => setSelectedJob(null)}
                className="bg-slate-900 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors text-sm sm:text-base"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
