"use client";

import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Briefcase, FileCheck, Calendar, ArrowUpRight, ArrowDownRight, Activity, Download, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7days');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [statsData, setStatsData] = useState({
    totalStudents: 0,
    totalJobs: 0,
    totalApplications: 0
  });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (data.stats) {
          setStatsData(data.stats);
        }
        if (data.trendData) {
          setChartData(data.trendData);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
        toast.error("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const avgApps = statsData.totalStudents > 0 
    ? (statsData.totalApplications / statsData.totalStudents).toFixed(1) 
    : 0;

  const stats = [
    { label: "Total Students", value: statsData.totalStudents.toString(), change: "+12.5%", positive: true, icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Active Jobs", value: statsData.totalJobs.toString(), change: "+5.4%", positive: true, icon: Briefcase, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Job Applications", value: statsData.totalApplications.toString(), change: "+24.1%", positive: true, icon: FileCheck, color: "text-violet-500", bg: "bg-violet-50" },
    { label: "Apps per Student", value: avgApps.toString(), change: "+2.4%", positive: true, icon: TrendingUp, color: "text-rose-500", bg: "bg-rose-50" },
  ];

  const handleExport = () => {
    // Generate CSV content
    const headers = ['Metric', 'Value'];
    const rows = [
      ['Total Students', statsData.totalStudents],
      ['Total Jobs', statsData.totalJobs],
      ['Total Applications', statsData.totalApplications],
      ['Average Apps per Student', avgApps],
      ['', ''], // Empty row
      ['Day', 'Applications Trend']
    ];
    
    chartData.forEach(day => {
      rows.push([day.name, day.applications]);
    });

    const csvContent = "data:text/csv;charset=utf-8," 
      + rows.map(e => e.join(",")).join("\n");

    // Download file
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `analytics_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Analytics report exported successfully");
  };

  return (
    <div className="animate-fade-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Analytics & Reports</h1>
          <p className="text-slate-500 mt-1">Detailed insights into platform usage and student engagement.</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="year">This Year</option>
          </select>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl font-bold hover:bg-slate-800 transition-colors"
          >
            <Download size={18} /> Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      {loading ? (
        <div className="flex justify-center items-center h-32 mb-8">
          <Loader2 className="animate-spin text-teal-600" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <span className={`flex items-center gap-1 text-sm font-bold px-2.5 py-1 rounded-full ${stat.positive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {stat.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-slate-500 font-medium text-sm mb-1">{stat.label}</p>
                <h3 className="text-3xl font-extrabold text-slate-900">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900">Application Trends</h3>
            <button 
              onClick={() => router.push('/admin/applications')}
              className="text-teal-600 font-bold text-sm hover:text-teal-700"
            >
              View Details
            </button>
          </div>
          <div className="flex-1 min-h-[300px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: '#0d9488', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="applications" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#colorApps)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Demographics */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Top Job Categories</h3>
          <div className="space-y-5">
            {[
              { name: "Frontend Developer", percent: 45, color: "bg-teal-500" },
              { name: "Backend Developer", percent: 25, color: "bg-blue-500" },
              { name: "UI/UX Designer", percent: 15, color: "bg-violet-500" },
              { name: "Data Scientist", percent: 10, color: "bg-amber-500" },
              { name: "Product Manager", percent: 5, color: "bg-rose-500" },
            ].map((cat, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span className="text-slate-700">{cat.name}</span>
                  <span className="text-slate-500">{cat.percent}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className={`${cat.color} h-2 rounded-full`} style={{ width: `${cat.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
