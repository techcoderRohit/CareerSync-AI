"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  User, 
  FileText, 
  Briefcase, 
  Award, 
  Bell, 
  LogOut,
  LayoutDashboard,
  X,
  MessageSquare,
  FileEdit
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSidebar } from '@/context/SidebarContext';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isCollapsed, isMobileOpen, setIsMobileOpen } = useSidebar();

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Resume Analyzer', path: '/dashboard/resume', icon: <FileText size={20} /> },
    { name: 'Resume Builder', path: '/dashboard/resume-builder', icon: <FileEdit size={20} /> },
    { name: 'Applied Jobs', path: '/dashboard/jobs', icon: <Briefcase size={20} /> },
    { name: 'Skills', path: '/dashboard/skills', icon: <Award size={20} /> },
    { name: 'Interview Prep', path: '/dashboard/interview', icon: <MessageSquare size={20} /> },
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
          <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center shadow-[0_4px_15px_rgba(124,58,237,0.3)] shrink-0">
            <Briefcase color="white" size={20} />
          </div>
          {!isCollapsed && (
            <div className="text-xl font-extrabold tracking-tight whitespace-nowrap">
              CareerSync <span className="text-violet-500">AI</span>
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
            const isActive = pathname === item.path || (item.path !== '/dashboard' && pathname.startsWith(item.path + '/'));
            return (
              <Link 
                key={item.name} 
                href={item.path}
                onClick={() => setIsMobileOpen(false)} 
                className={`flex items-center ${isCollapsed ? 'justify-center p-3' : 'gap-4 px-5 py-3.5'} rounded-2xl font-semibold text-[0.95rem] transition-all duration-300 relative overflow-hidden group hover:text-white hover:bg-white/5 ${!isCollapsed ? 'hover:translate-x-1' : ''} ${isActive ? 'text-white bg-gradient-to-r from-violet-600/20 to-indigo-600/5 border-l-[3px] border-violet-500' : 'text-slate-400'}`}
                title={isCollapsed ? item.name : ""}
              >
                <div className="shrink-0">{item.icon}</div>
                {!isCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className={`p-4 border-t border-white/5 ${isCollapsed ? 'flex justify-center' : ''}`}>
          <button 
            onClick={handleLogout}
            className={`flex items-center ${isCollapsed ? 'justify-center p-3' : 'gap-4 px-5 py-3.5 w-full'} rounded-2xl font-semibold text-[0.95rem] transition-all duration-300 text-red-400 hover:bg-red-500/10 hover:text-red-300`} 
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
