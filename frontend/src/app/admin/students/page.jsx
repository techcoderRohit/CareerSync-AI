"use client";

import React, { useState, useEffect } from 'react';
import { Users, Loader2, Search, Mail, MapPin, GraduationCap, Download } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminStudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.students) {
        setStudents(data.students);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDeleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student? This will also delete all their applications and resume records permanently.")) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}`}//api/admin/students/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        toast.success("Student deleted successfully");
        setStudents(students.filter(s => s._id !== id));
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete student");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error deleting student");
    }
  };

  const handleExportCSV = () => {
    if (students.length === 0) return toast.error("No data to export");
    
    const headers = ["Name,Email,Phone,College Name,Course,Graduation Year,Skills,Joined Date"];
    const rows = students.map(s => {
      const skillsStr = typeof s.skills === 'string' ? s.skills : (s.skills || []).join('; ');
      return `"${s.fullName}","${s.email}","${s.phone || ''}","${s.collegeName || ''}","${s.course || ''}","${s.graduationYear || ''}","${skillsStr}","${new Date(s.createdAt).toLocaleDateString()}"`;
    });
    
    const csvContent = headers.concat(rows).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `careersync_students_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Export successful!");
  };

  return (
    <div className="animate-fade-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Manage Students</h1>
          <p className="text-slate-500 mt-1">View all registered students and their profiles.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-[0_10px_25px_rgba(0,0,0,0.02)]">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-bold text-slate-900">Student Directory</h2>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl w-full sm:w-auto">
              <Search size={18} className="text-slate-400" />
              <input type="text" placeholder="Search students..." className="bg-transparent border-none outline-none text-sm w-full" />
            </div>
            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-2 bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 px-4 py-2 rounded-xl font-bold text-sm transition-all w-full sm:w-auto justify-center whitespace-nowrap"
            >
              <Download size={16} /> Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-slate-500 flex justify-center"><Loader2 className="animate-spin" size={24} /></div>
          ) : students.length === 0 ? (
            <div className="p-12 text-center text-slate-500 font-medium">No students registered yet.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm">
                  <th className="p-4 font-semibold whitespace-nowrap">Student Name</th>
                  <th className="p-4 font-semibold">Contact Info</th>
                  <th className="p-4 font-semibold">Education</th>
                  <th className="p-4 font-semibold">Skills</th>
                  <th className="p-4 font-semibold">Joined Date</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex items-center justify-center font-bold shadow-sm shrink-0">
                          {student.fullName?.charAt(0).toUpperCase()}
                        </div>
                        <div className="font-bold text-slate-900">{student.fullName}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                        <Mail size={14} className="text-slate-400" /> {student.email}
                      </div>
                      {student.phone && (
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <MapPin size={14} className="text-slate-400" /> {student.phone}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-slate-800 font-medium mb-1">
                        <GraduationCap size={16} className="text-blue-500" /> {student.collegeName}
                      </div>
                      <div className="text-xs text-slate-500">{student.course || 'B.Tech'} - {student.graduationYear || '2025'}</div>
                    </td>
                    <td className="p-4">
                      {student.skills ? (
                        <div className="flex flex-wrap gap-1">
                          {(typeof student.skills === 'string' ? student.skills.split(',').map(s => s.trim()).filter(Boolean) : student.skills)
                            .slice(0, 2)
                            .map((skill, i) => (
                            <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold border border-slate-200">
                              {skill}
                            </span>
                          ))}
                          {(typeof student.skills === 'string' ? student.skills.split(',').filter(Boolean) : student.skills).length > 2 && (
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold border border-slate-200">
                              +{(typeof student.skills === 'string' ? student.skills.split(',').filter(Boolean) : student.skills).length - 2}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">No skills listed</span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-slate-500 font-medium">
                      {new Date(student.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleDeleteStudent(student._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-semibold text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
