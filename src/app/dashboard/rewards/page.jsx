'use client';
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Coins, ArrowUpRight, ArrowDownRight, Sparkles, ShoppingBag, ArrowLeft, Info, Gift } from 'lucide-react';
export default function RewardsPage() {
    const { user } = useAuth();
    const points = user?.points || 0;
    const cashValue = (points * 0.5).toFixed(0);
    const history = user?.pointsHistory || [];
    return (<div className="relative min-h-screen py-10">
      
      {/* Ambient glow */}
      <div className="ambient-glow top-20 right-10 h-80 w-80 bg-amber-500/10"/>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Link href="/dashboard" className="text-slate-400 hover:text-white">
                <ArrowLeft className="h-4 w-4"/>
              </Link>
              <h1 className="text-2xl font-extrabold text-white">Rewards & Loyalty Points</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Earn cashback on every purchase and redeem points instantly for checkout discounts
            </p>
          </div>
          <Link href="/" className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-500/20">
            <ShoppingBag className="h-3.5 w-3.5"/>
            <span>Use Points to Buy Courses</span>
          </Link>
        </div>

        {/* Balance KPI Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl bg-gradient-to-br from-amber-500/20 via-slate-900 to-slate-900 border border-amber-500/30 p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">Current Balance</span>
              <Coins className="h-5 w-5 text-amber-400 animate-pulse"/>
            </div>
            <div className="text-3xl font-extrabold text-white">{points} <span className="text-base text-amber-400 font-normal">pts</span></div>
            <p className="text-xs text-slate-300">Equivalent to <strong className="text-white">₹{cashValue}</strong> in checkout credits</p>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Earn Rate</span>
              <Sparkles className="h-5 w-5 text-brand-400"/>
            </div>
            <div className="text-3xl font-extrabold text-white">10% <span className="text-base text-slate-400 font-normal">Back</span></div>
            <p className="text-xs text-slate-400">Earn 10 points for every ₹100 spent</p>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Redeem Rate</span>
              <Gift className="h-5 w-5 text-emerald-400"/>
            </div>
            <div className="text-3xl font-extrabold text-white">1 pt = ₹0.50</div>
            <p className="text-xs text-slate-400">Apply points directly on checkout</p>
          </div>
        </div>

        {/* How It Works */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Info className="h-4 w-4 text-brand-400"/>
            How LearnForge Rewards Work
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
              <span className="font-bold text-white block">1. Sign Up Bonus</span>
              <p className="text-slate-400">Every new student receives 100 welcome points on registration.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
              <span className="font-bold text-white block">2. Earn with Every Guide</span>
              <p className="text-slate-400">Receive 10% cash points automatically when completing any course purchase.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
              <span className="font-bold text-white block">3. Instant Discounts</span>
              <p className="text-slate-400">Toggle the redeem points checkbox at checkout to save up to 100% on your orders.</p>
            </div>
          </div>
        </div>

        {/* Points Ledger History */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-slate-800 bg-slate-950">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Points Ledger Activity</h3>
          </div>

          {history.length === 0 ? (<div className="p-8 text-center text-xs text-slate-400">
              No points transactions recorded yet.
            </div>) : (<div className="divide-y divide-slate-800/60 text-xs">
              {history.slice().reverse().map((item, idx) => {
                const isEarned = item.type === 'earned' || item.amount > 0;
                return (<div key={idx} className="flex items-center justify-between p-4 hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${isEarned
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                        {isEarned ? <ArrowUpRight className="h-4 w-4"/> : <ArrowDownRight className="h-4 w-4"/>}
                      </div>
                      <div>
                        <span className="font-semibold text-white block">{item.reason}</span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(item.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                    })}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`font-bold font-mono text-sm ${isEarned ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isEarned ? `+${item.amount}` : `-${item.amount}`} pts
                      </span>
                    </div>
                  </div>);
            })}
            </div>)}
        </div>

      </div>
    </div>);
}
