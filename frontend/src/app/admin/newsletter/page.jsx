"use client";

import React, { useState } from 'react';
import { Mail, Send, Users, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminNewsletterPage() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isHtml, setIsHtml] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!subject || !message) {
      toast.error('Subject and message are required.');
      return;
    }

    if (!confirm('Are you sure you want to send this email to ALL students?')) {
      return;
    }

    setSending(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/admin/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ subject, message, isHtml })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || 'Newsletter sent successfully!');
        setSubject('');
        setMessage('');
      } else {
        toast.error(data.error || 'Failed to send newsletter');
      }
    } catch (error) {
      toast.error('Server error while sending newsletter');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="animate-fade-up max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <Mail className="text-violet-600" size={32} />
          Bulk Email & Newsletter
        </h1>
        <p className="text-slate-500 mt-2">Send important updates, job alerts, or newsletters to all registered students simultaneously.</p>
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-[0_10px_25px_rgba(0,0,0,0.02)] relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-violet-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        <form onSubmit={handleSend} className="relative z-10 space-y-6">
          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex items-start gap-4">
            <div className="bg-blue-100 p-2 rounded-xl text-blue-600 shrink-0">
              <Users size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Broadcast Message</h3>
              <p className="text-sm text-slate-500 mt-1">This email will be delivered to every active student account on the platform. Please verify your content before sending.</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Subject Line</label>
            <input 
              type="text" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Top Job Picks of the Week 🚀" 
              className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-slate-900 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all font-medium"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-bold text-slate-700">Email Content</label>
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-600">
                <input 
                  type="checkbox" 
                  checked={isHtml} 
                  onChange={(e) => setIsHtml(e.target.checked)}
                  className="w-4 h-4 text-violet-600 rounded focus:ring-violet-500 accent-violet-600"
                />
                Send as HTML (Supports basic tags like &lt;b&gt;, &lt;br&gt;)
              </label>
            </div>
            <textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..." 
              className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-slate-900 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all font-medium h-64 resize-y custom-scrollbar"
              required
            ></textarea>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button 
              type="submit" 
              disabled={sending}
              className="bg-violet-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-violet-700 transition-all shadow-lg shadow-violet-600/20 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {sending ? (
                <><Activity size={18} className="animate-spin" /> Sending to All...</>
              ) : (
                <><Send size={18} /> Send Broadcast</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
