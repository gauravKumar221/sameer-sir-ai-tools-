'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { TrendingUp, ShoppingBag, Users, BookOpen, Loader2 } from 'lucide-react';
export default function AdminOverviewPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch('/api/admin/stats');
                const json = await res.json();
                if (json.success) {
                    setData(json);
                }
            }
            catch (err) {
                console.error('Error fetching admin stats:', err);
            }
            finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);
    if (loading || !data) {
        return (<div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500"/>
      </div>);
    }
    const { stats, categoryStats = [], revenueChartData = [], recentOrders = [] } = data;
    const maxChartRevenue = Math.max(...revenueChartData.map((d) => d.revenue), 1000);
    return (<div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Platform Dashboard & Analytics</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time revenue, order fulfillment, and student engagement metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/guides" className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/20 transition-all">
            + Upload New Guide
          </Link>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Revenue */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Revenue</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="h-4 w-4"/>
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">₹{stats.totalRevenue?.toLocaleString()}</div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>Today: <strong className="text-emerald-400">₹{stats.todayRevenue}</strong></span>
            <span>Month: <strong className="text-white">₹{stats.monthRevenue}</strong></span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Sales</span>
            <div className="h-8 w-8 rounded-lg bg-brand-500/10 text-brand-400 flex items-center justify-center">
              <ShoppingBag className="h-4 w-4"/>
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">{stats.totalOrders}</div>
          <span className="text-[11px] text-slate-400 block">Orders successfully processed</span>
        </div>

        {/* Total Users */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Registered Users</span>
            <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Users className="h-4 w-4"/>
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">{stats.totalUsers}</div>
          <span className="text-[11px] text-slate-400 block">Enrolled students & accounts</span>
        </div>

        {/* Active Guides & Points */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Guides</span>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <BookOpen className="h-4 w-4"/>
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">{stats.activeGuides} <span className="text-xs text-slate-400 font-normal">/ {stats.totalGuides}</span></div>
          <span className="text-[11px] text-amber-300 font-medium block">
            {stats.totalPointsDistributed} pts rewarded
          </span>
        </div>

      </div>

      {/* Revenue History Chart */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">14-Day Revenue Trajectory</h3>
            <p className="text-xs text-slate-400">Daily sales volume in ₹</p>
          </div>
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-md">
            <TrendingUp className="h-3.5 w-3.5"/> Live Stream
          </span>
        </div>

        {/* Interactive Bar Visualization */}
        <div className="h-48 w-full flex items-end justify-between gap-2 pt-8">
          {revenueChartData.map((d, idx) => {
            const heightPct = Math.max(8, Math.round((d.revenue / maxChartRevenue) * 100));
            return (<div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <div className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  ₹{d.revenue}
                </div>
                <div className="w-full rounded-t-lg bg-gradient-to-t from-purple-700 via-indigo-600 to-brand-400 group-hover:brightness-125 transition-all" style={{ height: `${heightPct}%` }}/>
                <span className="text-[10px] font-mono text-slate-500 rotate-45 sm:rotate-0 mt-1">{d.date}</span>
              </div>);
        })}
        </div>
      </div>

      {/* 2-Column: Category Breakdown & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Category Performance */}
        <div className="lg:col-span-1 rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Category Popularity</h3>
          <div className="space-y-3">
            {categoryStats.map((cat, idx) => (<div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs space-y-1.5">
                <div className="flex justify-between font-semibold">
                  <span className="text-white">{cat._id}</span>
                  <span className="text-brand-400">{cat.totalSales} Sales</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>{cat.count} Published Guides</span>
                </div>
              </div>))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Recent Orders</h3>
            <Link href="/admin/orders" className="text-xs text-purple-400 hover:underline">
              View All Orders →
            </Link>
          </div>

          <div className="divide-y divide-slate-800/60 text-xs">
            {recentOrders.map((ord) => (<div key={ord._id} className="py-3 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{ord.guideTitle}</span>
                    <span className="font-mono text-[10px] text-slate-500">#{ord.orderNumber}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {ord.customerDetails?.name} ({ord.customerDetails?.email})
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-white block">₹{ord.amount}</span>
                  <span className="text-[10px] text-emerald-400 uppercase font-semibold">{ord.status}</span>
                </div>
              </div>))}
          </div>
        </div>

      </div>

    </div>);
}
