"use client";

import React, { useEffect, useState } from 'react';
import { Users, Briefcase, FileCheck, TrendingUp, Activity, UserCircle } from 'lucide-react';
import Link from 'next/link';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalJobs: 0,
    totalApplications: 0
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [courseDistribution, setCourseDistribution] = useState([]);
  const [statusDistribution, setStatusDistribution] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await fetch('http://localhost:5000/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (data.stats) {
          setStats(data.stats);
          setRecentApplications(data.recentApplications || []);
          setTrendData(data.trendData || []);
          setCourseDistribution(data.courseDistribution || []);
          setStatusDistribution(data.statusDistribution || []);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: <Users size={24} className="text-blue-600" />,
      bg: "bg-blue-50",
      trend: "Overall"
    },
    {
      title: "Active Jobs",
      value: stats.totalJobs,
      icon: <Briefcase size={24} className="text-violet-600" />,
      bg: "bg-violet-50",
      trend: "Total Listed"
    },
    {
      title: "Total Applications",
      value: stats.totalApplications,
      icon: <FileCheck size={24} className="text-emerald-600" />,
      bg: "bg-emerald-50",
      trend: "To Date"
    }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8b5cf6'];

  return (
    <div className="animate-fade-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Overview</h1>
          <p className="text-slate-500 mt-1">Welcome back. Here is what's happening today.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Activity className="animate-spin text-violet-600" size={32} />
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {statCards.map((card, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-[0_10px_25px_rgba(0,0,0,0.02)] transition-transform hover:-translate-y-1">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-14 h-14 rounded-2xl ${card.bg} flex items-center justify-center`}>
                    {card.icon}
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-xs font-bold">
                    <TrendingUp size={14} /> {card.trend}
                  </div>
                </div>
                <div>
                  <h3 className="text-slate-500 font-medium">{card.title}</h3>
                  <div className="text-3xl font-extrabold text-slate-900 mt-1">{card.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            
            {/* Bar Chart - Platform Growth */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-[0_10px_25px_rgba(0,0,0,0.02)] lg:col-span-1">
              <h2 className="text-lg font-bold text-slate-900 mb-6">Platform Growth (Last 7 Days)</h2>
              <div className="h-[250px] w-full">
                {trendData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                      <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                      <Bar dataKey="applications" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Applications" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400">No data available</div>
                )}
              </div>
            </div>

            {/* Pie Chart - Demographics */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-[0_10px_25px_rgba(0,0,0,0.02)] lg:col-span-1">
              <h2 className="text-lg font-bold text-slate-900 mb-6">Student Demographics</h2>
              <div className="h-[250px] w-full">
                {courseDistribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={courseDistribution}
                        cx="50%"
                        cy="45%"
                        innerRadius={60}
                        outerRadius={85}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {courseDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400">No course data available</div>
                )}
              </div>
            </div>

            {/* Donut Chart - Application Status */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-[0_10px_25px_rgba(0,0,0,0.02)] lg:col-span-1">
              <h2 className="text-lg font-bold text-slate-900 mb-6">Application Statuses</h2>
              <div className="h-[250px] w-full">
                {statusDistribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusDistribution}
                        cx="50%"
                        cy="45%"
                        innerRadius={50}
                        outerRadius={85}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {statusDistribution.map((entry, index) => {
                          const statusColors = {
                            'Applied': '#3b82f6',
                            'Reviewing': '#a855f7',
                            'Interviewing': '#f59e0b',
                            'Accepted': '#10b981',
                            'Rejected': '#ef4444'
                          };
                          return <Cell key={`cell-${index}`} fill={statusColors[entry.name] || COLORS[index % COLORS.length]} />;
                        })}
                      </Pie>
                      <RechartsTooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400">No status data available</div>
                )}
              </div>
            </div>

          </div>

          {/* Recent Activity */}
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-[0_10px_25px_rgba(0,0,0,0.02)]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">Recent Applications</h2>
              <Link href="/admin/applications" className="text-violet-600 font-bold text-sm hover:underline">
                View All
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              {recentApplications.length === 0 ? (
                <div className="p-10 text-center text-slate-500">No applications found.</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-sm">
                      <th className="p-4 font-semibold">Student</th>
                      <th className="p-4 font-semibold">Job Position</th>
                      <th className="p-4 font-semibold">Status</th>
                      <th className="p-4 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentApplications.map((app) => (
                      <tr key={app._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                              {app.userId?.fullName?.charAt(0) || <UserCircle size={18} />}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{app.userId?.fullName || 'Unknown Student'}</div>
                              <div className="text-xs text-slate-500">{app.userId?.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-slate-800">{app.jobId?.title || 'Unknown Job'}</div>
                          <div className="text-xs text-slate-500">{app.jobId?.company}</div>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            app.status === 'Applied' ? 'bg-blue-50 text-blue-600' :
                            app.status === 'Interviewing' ? 'bg-amber-50 text-amber-600' :
                            app.status === 'Hired' ? 'bg-emerald-50 text-emerald-600' :
                            app.status === 'Rejected' ? 'bg-red-50 text-red-600' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {app.status || 'Applied'}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-slate-500 font-medium">
                          {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
