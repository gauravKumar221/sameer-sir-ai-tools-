'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { BookOpen, Lock, Mail, ArrowRight, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';
export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const res = await login(email, password);
        setLoading(false);
        if (res.success) {
            router.push('/dashboard');
        }
        else {
            setError(res.error || 'Invalid credentials');
        }
    };
    const handleQuickFill = (userEmail, userPass) => {
        setEmail(userEmail);
        setPassword(userPass);
    };
    return (<div className="relative min-h-[85vh] flex items-center justify-center px-4 py-12">
      
      {/* Ambient glow */}
      <div className="ambient-glow top-1/4 left-1/3 h-80 w-80 bg-brand-600/15"/>

      <div className="relative w-full max-w-md space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 shadow-xl shadow-brand-500/25 mb-2">
            <BookOpen className="h-6 w-6 text-white"/>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h1>
          <p className="text-xs text-slate-400">Sign in to your LearnForge account to read your courses</p>
        </div>

        {/* Quick Fill Demo Shortcuts */}
        <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-3.5 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-amber-300 font-semibold">
            <span className="flex items-center gap-1"><Sparkles className="h-3.5 w-3.5 text-amber-400"/> One-Click Demo Logins:</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => handleQuickFill('student@example.com', 'student123')} className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-brand-500 text-[11px] font-medium text-brand-300 hover:text-white transition-all text-left">
              <UserCheck className="h-3.5 w-3.5"/>
              <span>Student Account</span>
            </button>
            <button type="button" onClick={() => handleQuickFill('admin@example.com', 'admin123')} className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-purple-500 text-[11px] font-medium text-purple-300 hover:text-white transition-all text-left">
              <ShieldCheck className="h-3.5 w-3.5"/>
              <span>Admin Account</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {error && (<div className="rounded-xl bg-rose-950/60 border border-rose-800/60 p-3 text-xs text-rose-200">
                {error}
              </div>)}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500"/>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"/>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Password</label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500"/>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"/>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-500/20 disabled:opacity-50 transition-all hover:scale-[1.02]">
              {loading ? (<span>Signing In...</span>) : (<>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4"/>
                </>)}
            </button>

          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-brand-400 hover:underline font-semibold">
              Create an account (+100 Free Points)
            </Link>
          </div>
        </div>

      </div>
    </div>);
}
