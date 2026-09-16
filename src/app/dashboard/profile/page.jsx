'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { User, Lock, Mail, CheckCircle2, ArrowLeft, Loader2 } from 'lucide-react';
export default function ProfilePage() {
    const { user, refreshUser } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMsg(null);
        setErrorMsg(null);
        if (newPassword && newPassword !== confirmPassword) {
            setErrorMsg('New passwords do not match');
            setLoading(false);
            return;
        }
        try {
            const res = await fetch('/api/auth/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name.trim(),
                    currentPassword: currentPassword || undefined,
                    newPassword: newPassword || undefined,
                }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Failed to update profile');
            }
            setSuccessMsg('Profile updated successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            await refreshUser();
        }
        catch (err) {
            setErrorMsg(err.message || 'Error updating profile');
        }
        finally {
            setLoading(false);
        }
    };
    return (<div className="relative min-h-screen py-10">
      
      {/* Ambient glow */}
      <div className="ambient-glow top-20 left-10 h-80 w-80 bg-brand-600/10"/>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-3 pb-6 border-b border-slate-800">
          <Link href="/dashboard" className="text-slate-400 hover:text-white">
            <ArrowLeft className="h-4 w-4"/>
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Account Settings</h1>
            <p className="text-xs text-slate-400 mt-0.5">Manage your personal details, credentials, and reader security</p>
          </div>
        </div>

        {/* Profile Form Card */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
          
          {successMsg && (<div className="flex items-center gap-2 rounded-xl bg-emerald-950/60 border border-emerald-800/60 p-3 text-xs text-emerald-200">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0"/>
              <span>{successMsg}</span>
            </div>)}

          {errorMsg && (<div className="rounded-xl bg-rose-950/60 border border-rose-800/60 p-3 text-xs text-rose-200">
              {errorMsg}
            </div>)}

          <form onSubmit={handleUpdate} className="space-y-6">
            
            {/* Read-only email badge */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Registered Email</label>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
                <Mail className="h-4 w-4 text-slate-500"/>
                <span className="font-mono text-slate-200">{user?.email}</span>
                <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 uppercase">
                  {user?.role}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Email is embedded into your protected DRM watermarks</p>
            </div>

            {/* Name input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-500"/>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-brand-500"/>
              </div>
            </div>

            {/* Change Password Sub-section */}
            <div className="pt-4 border-t border-slate-800 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Change Password (Optional)</h3>
              
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500"/>
                  <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Enter current password to change" className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-brand-500"/>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400">New Password</label>
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="At least 6 characters" className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2.5 px-3.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-brand-500"/>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400">Confirm New Password</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-type new password" className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2.5 px-3.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-brand-500"/>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-500/20 disabled:opacity-50 transition-all hover:scale-[1.02]">
                {loading ? <Loader2 className="h-4 w-4 animate-spin"/> : <span>Save Changes</span>}
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>);
}
