"use client";

import React, { useState } from 'react';
import { Shield, Bell, Lock, Key, CreditCard, Trash2, Save } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
  const router = useRouter();

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error('Both fields are required');
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/auth/change-password', passwordData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Password updated successfully!');
      setPasswordData({ currentPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete('http://localhost:5000/api/auth/delete-account', {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Account deleted successfully');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/auth/login');
      } catch (err) {
        toast.error(err.response?.data?.error || 'Failed to delete account');
      }
    }
  };

  return (
    <div className="animate-fade-up">
      <h1 className="text-[2.5rem] font-extrabold mb-2 text-slate-900 tracking-tight">Account Settings</h1>
      <p className="text-slate-500 text-[1.1rem] mb-10">Manage your security preferences, notifications, and billing.</p>

      <div className="flex flex-col gap-6 max-w-4xl">
        
        {/* Security Section */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-[0_10px_25px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <Shield className="text-violet-600" size={24} />
            <h2 className="text-xl font-bold text-slate-900">Security & Password</h2>
          </div>
          
          <form onSubmit={handlePasswordChange}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-[0.9rem] text-slate-600 mb-2 font-bold">Current Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-4 text-slate-400" />
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-300 pl-11 pr-5 py-3.5 rounded-2xl text-slate-900 focus:outline-none focus:border-violet-600 focus:bg-white focus:ring-4 focus:ring-violet-600/10 transition-all font-medium" 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-[0.9rem] text-slate-600 mb-2 font-bold">New Password</label>
                <div className="relative">
                  <Key size={18} className="absolute left-4 top-4 text-slate-400" />
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-300 pl-11 pr-5 py-3.5 rounded-2xl text-slate-900 focus:outline-none focus:border-violet-600 focus:bg-white focus:ring-4 focus:ring-violet-600/10 transition-all font-medium" 
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button type="submit" disabled={loading} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:-translate-y-0.5 hover:shadow-slate-900/20 flex items-center gap-2">
                {loading ? 'Saving...' : <><Save size={18} /> Update Password</>}
              </button>
            </div>
          </form>
        </div>

        {/* Notifications Preferences */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-[0_10px_25px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <Bell className="text-blue-500" size={24} />
            <h2 className="text-xl font-bold text-slate-900">Notification Preferences</h2>
          </div>
          
          <div className="flex flex-col gap-4">
            <label className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
              <div>
                <div className="font-bold text-slate-900">Email Notifications</div>
                <div className="text-sm text-slate-500 font-medium">Receive updates about job applications via email.</div>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-violet-600 cursor-pointer" />
            </label>

            <label className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
              <div>
                <div className="font-bold text-slate-900">Push Notifications</div>
                <div className="text-sm text-slate-500 font-medium">Receive real-time alerts in your browser.</div>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-violet-600 cursor-pointer" />
            </label>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white border border-red-200 rounded-3xl p-8 shadow-[0_10px_25px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-3 mb-4">
            <Trash2 className="text-red-500" size={24} />
            <h2 className="text-xl font-bold text-red-600">Danger Zone</h2>
          </div>
          <p className="text-slate-600 font-medium mb-6">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button onClick={handleDeleteAccount} className="bg-red-50 text-red-600 border border-red-200 px-6 py-3 rounded-xl font-bold transition-all hover:bg-red-500 hover:text-white flex items-center gap-2 cursor-pointer">
            Delete Account
          </button>
        </div>

      </div>
    </div>
  );
}
