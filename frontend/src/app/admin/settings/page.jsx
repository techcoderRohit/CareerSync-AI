"use client";

import React, { useState, useEffect } from 'react';
import { User, Lock, Bell, Globe, Database, Shield, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // States for Settings and Profile
  const [settings, setSettings] = useState({
    platformName: '',
    supportEmail: '',
    status: 'active'
  });
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    role: 'Super Administrator',
    initial: 'A',
    profilePicUrl: null,
    profilePicFile: null,
    removeAvatar: false
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({
        ...profile,
        profilePicFile: file,
        profilePicUrl: URL.createObjectURL(file),
        removeAvatar: false
      });
    }
  };

  const handleRemoveAvatar = () => {
    setProfile({
      ...profile,
      profilePicFile: null,
      profilePicUrl: null,
      removeAvatar: true
    });
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/settings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (data.settings) {
          setSettings({
            platformName: data.settings.platformName || '',
            supportEmail: data.settings.supportEmail || '',
            status: data.settings.status || 'active'
          });
        }
        
        if (data.admin) {
          const nameParts = (data.admin.fullName || '').split(' ');
          setProfile({
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            role: 'Super Administrator',
            initial: (data.admin.fullName || 'A').charAt(0).toUpperCase(),
            profilePicUrl: data.admin.profilePic ? `${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}`}/${data.admin.profilePic}` : null
          });
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
        toast.error("Failed to load settings data");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const token = localStorage.getItem('token');
    
    try {
      if (activeTab === 'general') {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/settings`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify(settings)
        });
        if (res.ok) toast.success("General settings updated successfully!");
        else toast.error("Failed to update settings");
      } 
      else if (activeTab === 'profile') {
        const formData = new FormData();
        formData.append("firstName", profile.firstName);
        formData.append("lastName", profile.lastName);
        if (profile.removeAvatar) {
          formData.append("removeAvatar", "true");
        }
        if (profile.profilePicFile) {
          formData.append("profilePic", profile.profilePicFile);
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/profile`, {
          method: 'PUT',
          headers: { 
            Authorization: `Bearer ${token}` 
          },
          body: formData
        });
        
        if (res.ok) {
          const resData = await res.json();
          if (resData.user) {
            localStorage.setItem('user', JSON.stringify(resData.user));
            window.dispatchEvent(new Event('userUpdated'));
          }
          toast.success("Admin profile updated successfully!");
        } else {
          toast.error("Failed to update profile");
        }
      }
    } catch (error) {
      toast.error("An error occurred while saving");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Platform Settings</h1>
        <p className="text-slate-500 mt-1">Manage admin preferences, security, and global configurations.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Settings Navigation */}
        <div className="lg:w-64 shrink-0">
          <div className="bg-white rounded-3xl border border-slate-100 p-3 shadow-[0_8px_30px_rgba(0,0,0,0.04)] sticky top-28">
            <nav className="flex flex-col gap-1">
              {[
                { id: 'general', label: 'General', icon: Globe },
                { id: 'profile', label: 'Profile', icon: User },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all text-left ${
                    activeTab === tab.id 
                      ? 'bg-teal-50 text-teal-700' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <tab.icon size={18} /> {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1 bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6 sm:p-8">
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin text-teal-600" size={32} />
            </div>
          ) : (
            <>
              {activeTab === 'general' && (
                <div className="animate-fade-up">
                  <h2 className="text-xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">General Configuration</h2>
                  
                  <div className="space-y-6 max-w-2xl">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Platform Name</label>
                      <input 
                        type="text" 
                        value={settings.platformName} 
                        onChange={(e) => setSettings({...settings, platformName: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-teal-500 transition-colors" 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Support Email</label>
                      <input 
                        type="email" 
                        value={settings.supportEmail} 
                        onChange={(e) => setSettings({...settings, supportEmail: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-teal-500 transition-colors" 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Platform Status</label>
                      <select 
                        value={settings.status}
                        onChange={(e) => setSettings({...settings, status: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-teal-500 transition-colors"
                      >
                        <option value="active">Active (Live)</option>
                        <option value="maintenance">Maintenance Mode</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="animate-fade-up">
                  <h2 className="text-xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">Admin Profile</h2>
                  
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg overflow-hidden border-2 border-white">
                      {profile.profilePicUrl ? (
                        <img src={profile.profilePicUrl} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        profile.initial
                      )}
                    </div>
                    <div>
                      <div className="flex gap-2 mb-2">
                        <input 
                          type="file" 
                          id="avatar-upload" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleFileChange} 
                        />
                        <label 
                          htmlFor="avatar-upload" 
                          className="inline-block bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold text-sm transition-colors cursor-pointer"
                        >
                          Upload New Avatar
                        </label>
                        {profile.profilePicUrl && (
                          <button 
                            onClick={handleRemoveAvatar}
                            className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg font-bold text-sm transition-colors cursor-pointer"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">JPG, GIF or PNG. Max size of 800K</p>
                    </div>
                  </div>

                  <div className="space-y-6 max-w-2xl">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">First Name</label>
                        <input 
                          type="text" 
                          value={profile.firstName} 
                          onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-teal-500 transition-colors" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Last Name</label>
                        <input 
                          type="text" 
                          value={profile.lastName} 
                          onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-teal-500 transition-colors" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Role</label>
                      <input 
                        type="text" 
                        disabled 
                        value={profile.role} 
                        className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl outline-none text-slate-500 cursor-not-allowed" 
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button Footer */}
              <div className="mt-10 pt-6 border-t border-slate-100 flex justify-end gap-3">
                <button className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl font-bold bg-teal-600 text-white hover:bg-teal-700 shadow-[0_4px_14px_rgba(13,148,136,0.3)] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} 
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
