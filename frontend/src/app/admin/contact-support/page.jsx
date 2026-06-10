"use client";

import React, { useState, useEffect } from 'react';
import { Mail, Search, Clock, CheckCircle, Reply, ChevronRight, MessageSquare, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactSupportPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All'); // All, Pending, Resolved

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/contacts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setContacts(data.contacts);
      } else {
        toast.error(data.error || 'Failed to fetch contacts');
      }
    } catch (error) {
      console.error(error);
      toast.error('Server error while fetching contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim()) {
      toast.error('Please enter a reply message');
      return;
    }

    try {
      setSending(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/contacts/${selectedContact._id}/reply`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ replyMessage })
      });
      
      const data = await res.json();
      if (res.ok) {
        toast.success('Reply sent successfully!');
        setReplyMessage('');
        // Update local state
        setContacts(prev => prev.map(c => c._id === data.contact._id ? data.contact : c));
        setSelectedContact(data.contact);
      } else {
        toast.error(data.error || 'Failed to send reply');
      }
    } catch (error) {
      console.error(error);
      toast.error('Server error while sending reply');
    } finally {
      setSending(false);
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contact.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' ? true : contact.status === filter;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-full">
        <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 h-[calc(100vh-80px)] overflow-hidden flex flex-col bg-slate-50/50">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Contact Support</h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">Manage and reply to user inquiries directly.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-full min-h-0">
        {/* Left Pane - List */}
        <div className="w-full lg:w-1/3 flex flex-col bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden shrink-0 lg:shrink h-[400px] lg:h-full">
          <div className="p-4 border-b border-gray-100 space-y-4 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search queries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
              />
            </div>
            <div className="flex p-1 bg-gray-50 rounded-xl">
              {['All', 'Pending', 'Resolved'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${filter === f ? 'bg-white text-violet-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {filteredContacts.length === 0 ? (
              <div className="text-center py-10 px-4 text-gray-500 flex flex-col items-center">
                <MessageSquare className="w-10 h-10 text-gray-300 mb-3" />
                <p className="text-sm font-semibold">No queries found</p>
                <p className="text-xs mt-1">Try adjusting your search or filters.</p>
              </div>
            ) : (
              filteredContacts.map(contact => (
                <div 
                  key={contact._id}
                  onClick={() => setSelectedContact(contact)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all ${selectedContact?._id === contact._id ? 'bg-violet-50 border-violet-200 shadow-sm' : 'hover:bg-gray-50 border-transparent'} border`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 text-sm truncate pr-3">{contact.fullName}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold whitespace-nowrap ${contact.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {contact.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 font-medium truncate mb-1">{contact.subject}</p>
                  <p className="text-xs text-gray-400 mt-2">{new Date(contact.createdAt).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Pane - Details */}
        <div className="w-full lg:w-2/3 bg-white border border-gray-100 rounded-3xl shadow-sm flex flex-col h-[500px] lg:h-full overflow-hidden">
          {selectedContact ? (
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-6 border-b border-gray-100 shrink-0 bg-gray-50/50">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">{selectedContact.subject}</h2>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="font-semibold text-gray-700">{selectedContact.fullName}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                      <span className="flex items-center gap-1.5 hover:text-violet-600 transition-colors cursor-pointer"><Mail size={14} /> {selectedContact.email}</span>
                    </div>
                  </div>
                  <div className={`px-3 py-1.5 rounded-xl flex items-center gap-2 text-sm font-bold ${selectedContact.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {selectedContact.status === 'Resolved' ? <CheckCircle size={16} /> : <Clock size={16} />}
                    {selectedContact.status}
                  </div>
                </div>
              </div>

              {/* Chat/Thread Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
                {/* User Message */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold shrink-0 shadow-md">
                    {selectedContact.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 bg-white border border-gray-100 p-5 rounded-2xl rounded-tl-none shadow-sm">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedContact.message}</p>
                    <p className="text-xs text-gray-400 mt-4 font-medium">{new Date(selectedContact.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                {/* Admin Reply */}
                {selectedContact.status === 'Resolved' && (
                  <div className="flex gap-4 flex-row-reverse">
                    <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold shrink-0 shadow-md">
                      A
                    </div>
                    <div className="flex-1 bg-violet-50 border border-violet-100 p-5 rounded-2xl rounded-tr-none shadow-sm">
                      <div className="flex items-center gap-2 mb-3 text-violet-700">
                        <Reply size={16} className="rotate-180" />
                        <span className="text-xs font-bold uppercase tracking-wider">Replied via Email</span>
                      </div>
                      <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{selectedContact.replyMessage}</p>
                      <p className="text-xs text-violet-400 mt-4 font-medium">{new Date(selectedContact.repliedAt).toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Reply Box */}
              {selectedContact.status === 'Pending' && (
                <div className="p-6 border-t border-gray-100 bg-white shrink-0">
                  <div className="mb-3 flex items-center gap-2 text-sm text-gray-500 font-medium">
                    <Reply size={16} /> Reply to user
                  </div>
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your response here... (This will be sent as an email)"
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all resize-none min-h-[120px]"
                  ></textarea>
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
                      <AlertCircle size={14} /> Ensure SMTP is configured in .env
                    </div>
                    <button 
                      onClick={handleSendReply}
                      disabled={sending || !replyMessage.trim()}
                      className="bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all flex items-center gap-2"
                    >
                      {sending ? 'Sending...' : 'Send Reply'} <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-slate-50/30">
              <Mail className="w-16 h-16 text-gray-200 mb-4" />
              <p className="text-lg font-bold text-gray-600">Select a query</p>
              <p className="text-sm text-gray-400 mt-1">Choose a conversation from the left to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
