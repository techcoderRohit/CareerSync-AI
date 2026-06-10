"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Bell, Search, ChevronDown, LogOut, Settings, UserCircle, Menu, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSidebar } from '@/context/SidebarContext';

export default function AdminTopBar() {
  const [user, setUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const router = useRouter();
  
  const { isCollapsed, setIsCollapsed, setIsMobileOpen } = useSidebar();

  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Error parsing user data");
        }
      }
    };

    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/notifications`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setNotifications(data.notifications || []);
        }
      } catch (err) {
        console.error("Error fetching notifications", err);
      }
    };

    loadUser(); // Initial load
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 30000); // 30s poll

    window.addEventListener('userUpdated', loadUser);

    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      clearInterval(interval);
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener('userUpdated', loadUser);
    };
  }, []);

  const handleMarkAsRead = async (id, link) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}`}//api/admin/notifications/${id}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setIsNotificationOpen(false);
      if (link) {
        router.push(link);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/notifications/read-all`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  return (
    <div className="flex justify-between items-center px-4 sm:px-10 py-5 bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button 
          className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors"
          onClick={() => setIsMobileOpen(true)}
        >
          <Menu size={24} />
        </button>
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
            placeholder="Search admin tools..." 
            className="border-none bg-transparent outline-none text-slate-900 text-[0.95rem] placeholder:text-slate-400 w-32 md:w-64"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Notification Dropdown */}
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="relative p-2 rounded-full bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
          >
            <Bell size={20} />
            {notifications.filter(n => !n.isRead).length > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </button>

          {isNotificationOpen && (
            <div className="absolute right-[-60px] sm:right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] overflow-hidden animate-fade-up z-50">
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-slate-900">Notifications</h3>
                {notifications.filter(n => !n.isRead).length > 0 && (
                  <button onClick={handleMarkAllAsRead} className="text-xs text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 size={14} /> Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">
                    <Bell size={32} className="mx-auto mb-3 text-slate-300 opacity-50" />
                    <p className="text-sm font-medium">No notifications yet</p>
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div 
                      key={notif._id} 
                      onClick={() => handleMarkAsRead(notif._id, notif.link)}
                      className={`p-4 border-b border-slate-50 cursor-pointer transition-colors hover:bg-slate-50 ${!notif.isRead ? 'bg-teal-50/30' : ''}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className={`text-sm font-bold ${!notif.isRead ? 'text-slate-900' : 'text-slate-700'}`}>{notif.title}</h4>
                        {!notif.isRead && <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0 mt-1.5"></span>}
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-2">{notif.message}</p>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {new Date(notif.createdAt).toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="w-[1px] h-8 bg-slate-200"></div>

        <div className="relative" ref={profileRef}>
          <div 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`flex items-center gap-3 cursor-pointer p-1.5 pr-3 rounded-full transition-all ${isProfileOpen ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-600 to-emerald-600 flex items-center justify-center text-white font-bold shadow-[0_4px_10px_rgba(13,148,136,0.2)] overflow-hidden border-2 border-white">
              {user?.profilePic ? (
                <img src={`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}`}/${user.profilePic}`} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                (user?.name || user?.fullName || 'A').charAt(0).toUpperCase()
              )}
            </div>
            <div className="hidden sm:block text-left mr-1">
              <div className="text-[0.9rem] font-bold text-slate-900 leading-tight">
                {user?.name || user?.fullName || 'Admin User'}
              </div>
              <div className="text-[0.75rem] font-medium text-slate-500">
                Administrator
              </div>
            </div>
            <ChevronDown size={16} className={`text-slate-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
          </div>

          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-200 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] overflow-hidden animate-fade-up">
              <div className="p-5 border-b border-slate-100 bg-slate-50 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-600 to-emerald-600 flex items-center justify-center text-white font-bold text-xl shadow-lg mb-3 overflow-hidden border-2 border-white">
                  {user?.profilePic ? (
                    <img src={`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}`}/${user.profilePic}`} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    (user?.name || user?.fullName || 'A').charAt(0).toUpperCase()
                  )}
                </div>
                <div className="font-bold text-slate-900">{user?.name || user?.fullName || 'Admin User'}</div>
                <div className="text-[0.8rem] text-slate-500 font-medium">{user?.email || 'admin@example.com'}</div>
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
