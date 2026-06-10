"use client";

import React, { useState, useEffect } from 'react';
import { FileCheck, Loader2, Search, UserCircle, Briefcase, ChevronDown, Check, X, Download } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/admin/applications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.applications) {
        setApplications(data.applications);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusUpdate = async (appId, newStatus) => {
    setUpdatingId(appId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/admin/applications/${appId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        toast.success(`Status updated to ${newStatus}. Email sent to student.`);
        // Update local state without fetching again
        setApplications(apps => apps.map(app => 
          app._id === appId ? { ...app, status: newStatus } : app
        ));
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleExportCSV = () => {
    if (applications.length === 0) return toast.error("No data to export");
    
    const headers = ["Candidate Name,Candidate Email,Job Title,Company,Status,Applied Date"];
    const rows = applications.map(app => {
      const studentName = app.userId?.fullName || 'Unknown';
      const studentEmail = app.userId?.email || 'Unknown';
      const jobTitle = app.jobId?.title || 'Unknown';
      const company = app.jobId?.company || 'Unknown';
      const status = app.status || 'Applied';
      const appliedDate = new Date(app.createdAt).toLocaleDateString();
      
      return `"${studentName}","${studentEmail}","${jobTitle}","${company}","${status}","${appliedDate}"`;
    });
    
    const csvContent = headers.concat(rows).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `careersync_applications_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Export successful!");
  };

  return (
    <div className="animate-fade-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Student Applications</h1>
          <p className="text-slate-500 mt-1">Review job applications and update candidate statuses.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-[0_10px_25px_rgba(0,0,0,0.02)]">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-bold text-slate-900">All Applications</h2>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl w-full sm:w-auto">
              <Search size={18} className="text-slate-400" />
              <input type="text" placeholder="Search applications..." className="bg-transparent border-none outline-none text-sm w-full" />
            </div>
            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-2 bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 px-4 py-2 rounded-xl font-bold text-sm transition-all w-full sm:w-auto justify-center whitespace-nowrap"
            >
              <Download size={16} /> Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="p-12 text-center text-slate-500 flex justify-center"><Loader2 className="animate-spin" size={24} /></div>
          ) : applications.length === 0 ? (
            <div className="p-12 text-center text-slate-500 font-medium">No applications found.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm">
                  <th className="p-4 font-semibold whitespace-nowrap">Candidate</th>
                  <th className="p-4 font-semibold">Job Details</th>
                  <th className="p-4 font-semibold">Applied Date</th>
                  <th className="p-4 font-semibold">Status Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold shrink-0">
                          {app.userId?.fullName?.charAt(0) || <UserCircle size={20} />}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{app.userId?.fullName || 'Unknown Student'}</div>
                          <div className="text-xs text-slate-500">{app.userId?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 font-bold text-slate-800 mb-1">
                        <Briefcase size={16} className="text-violet-600" /> {app.jobId?.title || 'Unknown Job'}
                      </div>
                      <div className="text-xs text-slate-500">{app.jobId?.company} - {app.jobId?.location}</div>
                    </td>
                    <td className="p-4 text-sm text-slate-500 font-medium">
                      {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {updatingId === app._id ? (
                          <Loader2 className="animate-spin text-violet-600" size={20} />
                        ) : (
                          <div className="relative group">
                            <select 
                              value={app.status || 'Applied'}
                              onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                              className={`appearance-none font-bold text-xs px-4 py-2 pr-8 rounded-full border border-transparent cursor-pointer outline-none transition-colors ${
                                app.status === 'Applied' ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' :
                                app.status === 'Reviewing' ? 'bg-purple-50 text-purple-700 hover:bg-purple-100' :
                                app.status === 'Interviewing' ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' :
                                app.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' :
                                app.status === 'Rejected' ? 'bg-red-50 text-red-700 hover:bg-red-100' :
                                'bg-slate-100 text-slate-700'
                              }`}
                            >
                              <option value="Applied">Applied</option>
                              <option value="Reviewing">Reviewing</option>
                              <option value="Interviewing">Interviewing</option>
                              <option value="Accepted">Accepted</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                          </div>
                        )}
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
  );
}
