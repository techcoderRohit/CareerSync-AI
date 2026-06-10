"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Bell, Search, ChevronDown, User, LogOut, Settings, UserCircle, CheckCircle, Menu } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSidebar } from '@/context/SidebarContext';

export default function TopBar() {
  const [user, setUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const router = useRouter();
  
  const { isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen } = useSidebar();

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing user data");
      }
    }

    // Click outside handler to close dropdowns
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.notifications) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error("Error fetching notifications", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Optional: Poll every 30 seconds for real-time feel
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const markAllRead = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/notifications/mark-read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Error marking as read", error);
    }
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // in seconds
    if (diff < 60) return `${diff} sec ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  return (
    <div className="flex justify-between items-center px-4 sm:px-10 py-5 bg-white border-b border-slate-200 sticky top-0 z-40">
      {/* Left side: Toggle & Search */}
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger */}
        <button 
          className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors"
          onClick={() => setIsMobileOpen(true)}
        >
          <Menu size={24} />
        </button>
        {/* Desktop Collapse Toggle */}
        <button 
          className="hidden lg:flex p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <Menu size={24} />
        </button>

        <div className="hidden sm:flex items-center gap-3 text-slate-400">
          <Search size={20} />
          <input 
            type="text" 
            placeholder="Search jobs, skills..." 
            className="border-none bg-transparent outline-none text-slate-900 text-[0.95rem] placeholder:text-slate-400 w-32 md:w-64"
          />
        </div>
      </div>

      {/* Right side: Notifications and Profile */}
      <div className="flex items-center gap-6">
        
        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); }}
            className={`p-2 rounded-full transition-colors cursor-pointer relative ${isNotifOpen ? 'bg-slate-100 text-slate-900' : 'bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] overflow-hidden animate-fade-up">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-slate-900">Notifications</h3>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-violet-600 text-[0.8rem] font-bold hover:underline">
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 text-sm">No notifications yet.</div>
                ) : (
                  notifications.map((notif) => (
                    <div key={notif._id || notif.id} className={`p-4 border-b border-slate-50 flex gap-3 hover:bg-slate-50 transition-colors cursor-pointer ${!notif.isRead ? 'bg-violet-50/30' : ''}`}>
                      <div className="mt-1 text-violet-600 shrink-0">
                        {!notif.isRead ? <div className="w-2 h-2 bg-violet-600 rounded-full mt-1.5"></div> : <CheckCircle size={14} className="text-slate-300" />}
                      </div>
                      <div>
                        <div className={`text-[0.9rem] ${!notif.isRead ? 'font-bold text-slate-900' : 'font-medium text-slate-600'}`}>{notif.title}</div>
                        <div className="text-[0.8rem] text-slate-500 mt-0.5">{notif.message}</div>
                        <div className="text-[0.75rem] text-slate-400 mt-1">{notif.createdAt ? getTimeAgo(notif.createdAt) : notif.time}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <Link 
                href="/dashboard/notifications" 
                onClick={() => setIsNotifOpen(false)}
                className="block p-3 text-center text-[0.85rem] font-bold text-slate-600 hover:text-violet-600 hover:bg-slate-50 transition-colors border-t border-slate-100"
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>

        <div className="w-[1px] h-8 bg-slate-200"></div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <div 
            onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); }}
            className={`flex items-center gap-3 cursor-pointer p-1.5 pr-3 rounded-full transition-all ${isProfileOpen ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-[0_4px_10px_rgba(124,58,237,0.2)]">
              {(user?.name || user?.fullName || user?.firstName || user?.email || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block text-left mr-1">
              <div className="text-[0.9rem] font-bold text-slate-900 leading-tight">
                {user?.name || user?.fullName || 'Guest User'}
              </div>
              <div className="text-[0.75rem] font-medium text-slate-500">
                {user?.role === 'admin' ? 'Administrator' : 'Student'}
              </div>
            </div>
            <ChevronDown size={16} className={`text-slate-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
          </div>

          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-200 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] overflow-hidden animate-fade-up">
              <div className="p-5 border-b border-slate-100 bg-slate-50 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg mb-3">
                  {(user?.name || user?.fullName || user?.firstName || user?.email || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="font-bold text-slate-900">{user?.name || user?.fullName || 'Guest User'}</div>
                <div className="text-[0.8rem] text-slate-500 font-medium">{user?.email || 'user@example.com'}</div>
              </div>
              <div className="p-2">
                <Link 
                  href="/dashboard/profile" 
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-700 font-medium transition-colors"
                >
                  <UserCircle size={18} className="text-slate-400" /> My Profile
                </Link>
                <Link 
                  href="/dashboard/settings" 
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-700 font-medium transition-colors text-left"
                >
                  <Settings size={18} className="text-slate-400" /> Account Settings
                </Link>
              </div>
              <div className="p-2 border-t border-slate-100">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-600 font-bold transition-colors text-left"
                >
                  <LogOut size={18} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
