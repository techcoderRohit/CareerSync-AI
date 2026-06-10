"use client";

import React, { useState, useEffect } from 'react';
import { Bell, Briefcase, BarChart2, Star, CheckCircle } from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch('http://localhost:5000/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.notifications) {
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error("Error fetching notifications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllRead = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      await fetch('http://localhost:5000/api/notifications/mark-read', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Error marking as read", error);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'JOB_APPLY': return <Briefcase size={20} />;
      case 'RESUME_SCAN': return <BarChart2 size={20} />;
      case 'JOB_MATCH': return <Star size={20} />;
      default: return <Bell size={20} />;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'JOB_APPLY': return 'text-emerald-500 bg-emerald-50';
      case 'RESUME_SCAN': return 'text-amber-500 bg-amber-50';
      case 'JOB_MATCH': return 'text-blue-500 bg-blue-50';
      default: return 'text-violet-500 bg-violet-50';
    }
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return `${diff} sec ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  return (
    <div className="animate-fade-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-4">
        <h1 className="text-[2.5rem] font-extrabold text-slate-900 tracking-tight">Notifications</h1>
        <button onClick={markAllRead} className="bg-white border border-slate-300 text-slate-600 px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer transition-colors duration-300 hover:bg-slate-50 hover:text-slate-900 font-bold text-[0.95rem]">
          <CheckCircle size={18} /> Mark all as read
        </button>
      </div>
      <p className="text-slate-500 text-[1.1rem] mb-10">Stay updated with your applications and profile alerts.</p>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-[0_10px_25px_rgba(0,0,0,0.02)]">
        {loading ? (
          <div className="p-12 text-center text-slate-400 font-medium">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center text-slate-400 font-medium">No notifications to show.</div>
        ) : (
          <div className="flex flex-col">
            {notifications.map((notif, index) => (
              <div 
                key={notif._id} 
                className={`p-6 flex gap-5 transition-colors duration-300 hover:bg-slate-50 ${index !== notifications.length - 1 ? 'border-b border-slate-100' : ''} ${notif.isRead ? 'bg-transparent' : 'bg-slate-50/50'}`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${getColor(notif.type)}`}>
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <h3 className={`text-[1.1rem] font-bold ${notif.isRead ? 'text-slate-600' : 'text-slate-900'}`}>{notif.title}</h3>
                    <span className="text-slate-500 text-[0.85rem] font-medium">{getTimeAgo(notif.createdAt)}</span>
                  </div>
                  <p className="text-slate-500 leading-relaxed font-medium">{notif.message}</p>
                </div>
                {!notif.isRead && (
                  <div className="w-2.5 h-2.5 rounded-full bg-violet-600 self-center"></div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
