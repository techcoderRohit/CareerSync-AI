"use client";

import React from 'react';
import { Briefcase, BarChart2, Bell, FileCheck, PhoneCall, PieChart, ArrowUpRight, ArrowDownRight, Minus, Loader2 } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

export default function DashboardOverview() {
  const [userName, setUserName] = React.useState('User');
  const [overviewData, setOverviewData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            setUserName(parsed.name || parsed.fullName || 'User');
          } catch (e) {}
        }

        const token = localStorage.getItem('token');
        if (token) {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/dashboard/overview`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setOverviewData(res.data.overview);
        }
      } catch (error) {
        console.error("Failed to load dashboard overview data", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-500 gap-4">
        <Loader2 className="animate-spin w-8 h-8 text-violet-600" />
        <p className="font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  // Safe fallbacks if data is missing
  const {
    atsScore = 0,
    appliedJobsCount = 0,
    interviewCallsCount = 0,
    profileCompletion = 0,
    recentActivity = []
  } = overviewData || {};

  return (
    <div className="animate-fade-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
        <div>
          <h1 className="text-[2.5rem] font-extrabold mb-2 text-slate-900 tracking-tight">Welcome back, {userName}!</h1>
          <p className="text-slate-500 text-[1.1rem] m-0">Track your career progress and application statuses.</p>
        </div>
        <div className="text-slate-500 text-[0.9rem] font-medium">
          Last updated: Today at 10:00 AM
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        
        {/* ATS Resume Score Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-[0_10px_25px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(0,0,0,0.06)] hover:border-violet-600/20">
          <div className="flex justify-between items-start mb-5">
            <div className="w-10 h-10 rounded-xl bg-violet-600/10 flex items-center justify-center text-violet-600">
              <FileCheck size={20} />
            </div>
            <span className="flex items-center gap-1 text-[0.85rem] font-bold text-emerald-600 bg-emerald-600/10 px-2.5 py-1 rounded-lg">
              <ArrowUpRight size={14} /> +5%
            </span>
          </div>
          <h3 className="text-[0.95rem] font-bold text-slate-500 mb-1">ATS Resume Score</h3>
          <div className="text-3xl font-extrabold text-slate-900 mb-2">{atsScore}%</div>
          <p className="text-slate-400 text-[0.85rem] m-0 font-medium">Based on top matches</p>
        </div>

        {/* Applied Jobs Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-[0_10px_25px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(0,0,0,0.06)] hover:border-violet-600/20">
          <div className="flex justify-between items-start mb-5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Briefcase size={20} />
            </div>
            <span className="flex items-center gap-1 text-[0.85rem] font-bold text-emerald-600 bg-emerald-600/10 px-2.5 py-1 rounded-lg">
              <ArrowUpRight size={14} /> +2
            </span>
          </div>
          <h3 className="text-[0.95rem] font-bold text-slate-500 mb-1">Applied Jobs</h3>
          <div className="text-3xl font-extrabold text-slate-900 mb-2">{appliedJobsCount}</div>
          <p className="text-slate-400 text-[0.85rem] m-0 font-medium">4 awaiting response</p>
        </div>

        {/* Interview Calls Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-[0_10px_25px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(0,0,0,0.06)] hover:border-violet-600/20">
          <div className="flex justify-between items-start mb-5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <PhoneCall size={20} />
            </div>
            <span className="flex items-center gap-1 text-[0.85rem] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
              <Minus size={14} /> 0
            </span>
          </div>
          <h3 className="text-[0.95rem] font-bold text-slate-500 mb-1">Interview Calls</h3>
          <div className="text-3xl font-extrabold text-slate-900 mb-2">{interviewCallsCount}</div>
          <p className="text-slate-400 text-[0.85rem] m-0 font-medium">2 scheduled this week</p>
        </div>

        {/* Profile Completion Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-[0_10px_25px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(0,0,0,0.06)] hover:border-violet-600/20">
          <div className="flex justify-between items-start mb-5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <PieChart size={20} />
            </div>
            <span className="flex items-center gap-1 text-[0.85rem] font-bold text-red-500 bg-red-500/10 px-2.5 py-1 rounded-lg">
              <ArrowDownRight size={14} /> -10%
            </span>
          </div>
          <h3 className="text-[0.95rem] font-bold text-slate-500 mb-1">Profile Completion</h3>
          <div className="text-3xl font-extrabold text-slate-900 mb-2">{profileCompletion}%</div>
          <p className="text-slate-400 text-[0.85rem] m-0 font-medium">{profileCompletion < 100 ? "Complete your profile" : "Profile is complete!"}</p>
        </div>

      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-[0_10px_25px_rgba(0,0,0,0.02)] mb-6">
        <h2 className="text-xl font-extrabold text-slate-900 mb-6">Recent Activity</h2>
        <div className="flex flex-col gap-4">
          {recentActivity.length > 0 ? recentActivity.map((notif, i) => {
            let Icon = Bell;
            if (notif.type === 'JOB_MATCH') Icon = Briefcase;
            if (notif.type === 'RESUME_SCAN') Icon = FileCheck;
            
            return (
              <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 transition-colors duration-300 hover:bg-slate-100">
                <div className="text-violet-600 bg-violet-600/10 p-2.5 rounded-xl"><Icon size={18} /></div>
                <div className="flex-1">
                  <div className="font-bold text-slate-900">{notif.title || notif.message}</div>
                  <div className="text-slate-500 text-[0.85rem] mt-0.5 font-medium">
                    {notif.createdAt ? formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true }) : 'Recently'}
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="text-center p-6 text-slate-400 font-medium">No recent activity found.</div>
          )}
        </div>
        <div className="mt-6 text-center">
          <Link href="/dashboard/notifications" className="text-violet-600 font-bold hover:underline">
            View All Activity
          </Link>
        </div>
      </div>
    </div>
  );
}
