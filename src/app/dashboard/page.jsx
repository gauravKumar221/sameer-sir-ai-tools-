'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { BookOpen, ShoppingBag, Sparkles, ArrowRight, ShieldCheck, Search } from 'lucide-react';
export default function DashboardLibraryPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [purchasedGuides, setPurchasedGuides] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [filterSearch, setFilterSearch] = useState('');
    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
            return;
        }
        async function loadUserPurchases() {
            if (!user)
                return;
            try {
                const res = await fetch('/api/guides');
                const data = await res.json();
                if (data.success && data.guides) {
                    const userPurchases = user.purchasedGuides || [];
                    // Match user purchased guides with details
                    const enriched = userPurchases.map((p) => {
                        const guideDetails = data.guides.find((g) => (g._id || g.id) === (p.guideId?._id || p.guideId));
                        return {
                            ...p,
                            details: guideDetails,
                        };
                    }).filter((p) => p.details);
                    setPurchasedGuides(enriched);
                }
            }
            catch (err) {
                console.error('Error loading purchases:', err);
            }
            finally {
                setFetching(false);
            }
        }
        if (user) {
            loadUserPurchases();
        }
    }, [user, loading, router]);
    if (loading || fetching) {
        return (<div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent"></div>
      </div>);
    }
    const filteredPurchases = purchasedGuides.filter((p) => p.details?.title.toLowerCase().includes(filterSearch.toLowerCase()) ||
        p.details?.category.toLowerCase().includes(filterSearch.toLowerCase()));
    return (<div className="relative min-h-screen py-10">
      
      {/* Ambient glow */}
      <div className="ambient-glow top-20 right-10 h-80 w-80 bg-brand-600/10"/>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">My Library</h1>
              <span className="rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 px-2.5 py-0.5 text-xs font-bold">
                {purchasedGuides.length} Guides
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Welcome back, <strong className="text-white">{user?.name}</strong>. Your protected courses are ready for in-browser reading.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all">
              <Sparkles className="h-4 w-4"/>
              <span>Explore More Guides</span>
            </Link>
          </div>
        </div>

        {/* Search within Library */}
        {purchasedGuides.length > 0 && (<div className="my-6 max-w-md">
            <div className="relative flex items-center rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-xs">
              <Search className="h-4 w-4 text-slate-400 mr-2 shrink-0"/>
              <input type="text" placeholder="Search in your purchased courses..." value={filterSearch} onChange={(e) => setFilterSearch(e.target.value)} className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none"/>
            </div>
          </div>)}

        {/* Empty State */}
        {purchasedGuides.length === 0 ? (<div className="my-12 rounded-3xl bg-slate-900/60 border border-slate-800 p-12 text-center max-w-xl mx-auto space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600/20 text-brand-400 border border-brand-500/30">
              <ShoppingBag className="h-7 w-7"/>
            </div>
            <h3 className="text-lg font-bold text-white">Your Library is Empty</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You haven&apos;t enrolled in any digital guides yet. Browse our catalog and start reading with zero downloads.
            </p>
            <div className="pt-2">
              <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white text-xs font-bold shadow-lg shadow-brand-500/25">
                <span>Browse Store Catalog</span>
                <ArrowRight className="h-4 w-4"/>
              </Link>
            </div>
          </div>) : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {filteredPurchases.map((item) => {
                const guide = item.details;
                const lastRead = item.lastReadPage || 1;
                const totalEstPages = guide.pdfFiles?.[0]?.pageCount || 4;
                const progressPct = Math.min(100, Math.round((lastRead / totalEstPages) * 100));
                return (<div key={item._id || item.guideId} className="group relative flex flex-col justify-between rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-brand-500/50 transition-all duration-300 shadow-xl overflow-hidden">
                  {/* Thumbnail */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={guide.coverImage} alt={guide.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/30"/>
                    
                    <div className="absolute top-3 left-3">
                      <span className="rounded-md bg-brand-600/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-white uppercase">
                        {guide.category}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 flex items-center gap-1 text-[10px] font-semibold text-emerald-300 bg-black/60 px-2 py-0.5 rounded backdrop-blur-md">
                      <ShieldCheck className="h-3 w-3 text-emerald-400"/>
                      <span>DRM Active</span>
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors line-clamp-2">
                        {guide.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {guide.shortDescription}
                      </p>

                      {/* Reading Progress Indicator */}
                      <div className="pt-2 space-y-1">
                        <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                          <span>Reading Progress</span>
                          <span className="text-brand-400 font-semibold">Page {lastRead}</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 rounded-full transition-all duration-300" style={{ width: `${Math.max(10, progressPct)}%` }}/>
                        </div>
                      </div>
                    </div>

                    {/* Open Reader Action */}
                    <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">
                        Purchased {new Date(item.purchasedAt || Date.now()).toLocaleDateString()}
                      </span>
                      <Link href={`/dashboard/reader/${guide.id || guide._id}`} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all hover:scale-105">
                        <BookOpen className="h-3.5 w-3.5"/>
                        <span>Continue Reading</span>
                      </Link>
                    </div>

                  </div>
                </div>);
            })}
          </div>)}

      </div>
    </div>);
}
