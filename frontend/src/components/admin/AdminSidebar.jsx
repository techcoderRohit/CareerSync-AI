"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Users, 
  Briefcase, 
  FileCheck,
  BarChart,
  Settings,
  LogOut,
  LayoutDashboard,
  X,
  ShieldAlert,
  MessageSquare,
  Mail
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSidebar } from '@/context/SidebarContext';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isCollapsed, isMobileOpen, setIsMobileOpen } = useSidebar();
  const [stats, setStats] = React.useState({ totalJobs: 0, totalStudents: 0, totalApplications: 0 });

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.stats) {
          setStats(data.stats);
        }
      } catch (err) {
        console.error("Error fetching stats for sidebar:", err);
      }
    };
    fetchStats();
  }, [pathname]); // refresh stats on navigation change

  const navItems = [
    { name: 'Overview', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Manage Jobs', path: '/admin/jobs', icon: <Briefcase size={20} />, badge: stats.totalJobs },
    { name: 'Manage Students', path: '/admin/students', icon: <Users size={20} />, badge: stats.totalStudents },
    { name: 'Applications', path: '/admin/applications', icon: <FileCheck size={20} />, badge: stats.totalApplications },
    { name: 'Analytics', path: '/admin/analytics', icon: <BarChart size={20} /> },
    { name: 'Contact Support', path: '/admin/contact-support', icon: <MessageSquare size={20} /> },
    { name: 'Newsletter', path: '/admin/newsletter', icon: <Mail size={20} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  return (
    <>
      {/* Mobile Overlay Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 bg-[#0a0b1e] border-r border-white/5 flex flex-col transition-all duration-300 ease-in-out text-white shrink-0
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'lg:w-[80px]' : 'w-[280px]'}
      `}>
        <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center lg:px-0' : 'gap-3'} border-b border-white/5 h-[80px]`}>
          <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center shadow-[0_4px_15px_rgba(13,148,136,0.3)] shrink-0">
            <ShieldAlert color="white" size={20} />
          </div>
          {!isCollapsed && (
            <div className="text-xl font-extrabold tracking-tight whitespace-nowrap">
              Admin <span className="text-teal-500">Panel</span>
            </div>
          )}
          {/* Close button for mobile */}
          <button 
            className="lg:hidden ml-auto text-slate-400 hover:text-white"
            onClick={() => setIsMobileOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className={`px-4 py-6 flex-1 flex flex-col gap-2 overflow-y-auto ${isCollapsed ? 'items-center px-2' : ''}`}>
          {navItems.map((item) => {
            const isActive = pathname === item.path || (item.path !== '/admin/dashboard' && pathname.startsWith(item.path));
            return (
              <Link 
                key={item.name} 
                href={item.path}
                onClick={() => setIsMobileOpen(false)} 
                className={`flex items-center ${isCollapsed ? 'justify-center p-3' : 'gap-4 px-5 py-3.5'} rounded-2xl font-semibold text-[0.95rem] transition-all duration-300 relative overflow-hidden group hover:text-white hover:bg-white/5 ${!isCollapsed ? 'hover:translate-x-1' : ''} ${isActive ? 'text-white bg-gradient-to-r from-teal-600/20 to-emerald-600/5 border-l-[3px] border-teal-500' : 'text-slate-400'}`}
                title={isCollapsed ? item.name : ""}
              >
                <div className="shrink-0">{item.icon}</div>
                {!isCollapsed && <span className="whitespace-nowrap flex-1">{item.name}</span>}
                {!isCollapsed && item.badge > 0 && (
                  <span className={`text-[0.7rem] font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-teal-500 text-white shadow-md shadow-teal-900' : 'bg-slate-800 text-slate-300 group-hover:bg-teal-500/20 group-hover:text-teal-400'}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className={`p-4 border-t border-white/5 ${isCollapsed ? 'flex justify-center' : ''}`}>
          <button 
            onClick={handleLogout}
            className={`flex items-center ${isCollapsed ? 'justify-center p-3' : 'gap-4 px-5 py-3.5 w-full'} rounded-2xl font-semibold text-[0.95rem] transition-all duration-300 text-slate-400 hover:bg-slate-800 hover:text-white`} 
            title={isCollapsed ? "Logout" : ""}
          >
            <div className="shrink-0"><LogOut size={20} /></div>
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
}
