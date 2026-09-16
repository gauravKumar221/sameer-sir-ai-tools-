'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { BookOpen, Lock, Mail, User, ArrowRight, Sparkles } from 'lucide-react';
export default function SignupPage() {
    const router = useRouter();
    const { signup } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const res = await signup(name, email, password);
        setLoading(false);
        if (res.success) {
            router.push('/dashboard');
        }
        else {
            setError(res.error || 'Signup failed');
        }
    };
    return (<div className="relative min-h-[85vh] flex items-center justify-center px-4 py-12">
      
      {/* Ambient glow */}
      <div className="ambient-glow top-1/4 right-1/3 h-80 w-80 bg-brand-600/15"/>

      <div className="relative w-full max-w-md space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 shadow-xl shadow-brand-500/25 mb-2">
            <BookOpen className="h-6 w-6 text-white"/>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Create Your Account</h1>
          <p className="text-xs text-slate-400">Unlock instant DRM in-browser reader access and exclusive courses</p>
        </div>

        {/* Welcome Bonus Notice */}
        <div className="rounded-xl bg-amber-500/10 border border-amber-500/25 p-3 flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-amber-400 shrink-0"/>
          <p className="text-xs text-amber-200">
            <strong className="text-amber-300">New Learner Bonus:</strong> Get <span className="font-bold text-white">100 Loyalty Points</span> immediately upon signup to redeem discounts!
          </p>
        </div>

        {/* Signup Form */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {error && (<div className="rounded-xl bg-rose-950/60 border border-rose-800/60 p-3 text-xs text-rose-200">
                {error}
              </div>)}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-500"/>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. John Doe" className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"/>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500"/>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"/>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Create Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500"/>
                <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"/>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-brand-500/20 disabled:opacity-50 transition-all hover:scale-[1.02]">
              {loading ? (<span>Creating Account...</span>) : (<>
                  <span>Create Account & Get 100 Points</span>
                  <ArrowRight className="h-4 w-4"/>
                </>)}
            </button>

          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="text-brand-400 hover:underline font-semibold">
              Sign In here
            </Link>
          </div>
        </div>

      </div>
    </div>);
}
