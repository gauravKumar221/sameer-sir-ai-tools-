'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Star, ShieldCheck, CheckCircle, Eye, Lock, Sparkles, Coins, FileText, Clock, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import CanvasPdfReader from '@/components/pdf-viewer/CanvasPdfReader';
export default function GuideDetailPage() {
    const params = useParams();
    const slug = params?.slug;
    const router = useRouter();
    const { user } = useAuth();
    const [guide, setGuide] = useState(null);
    const [access, setAccess] = useState({
        isPurchased: false,
        isAdmin: false,
        lastReadPage: 1,
    });
    const [loading, setLoading] = useState(true);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    useEffect(() => {
        async function fetchGuideDetails() {
            if (!slug)
                return;
            setLoading(true);
            try {
                const res = await fetch(`/api/guides/${slug}`);
                const data = await res.json();
                if (data.success && data.guide) {
                    setGuide(data.guide);
                    if (data.access) {
                        setAccess(data.access);
                    }
                }
            }
            catch (err) {
                console.error('Error fetching guide:', err);
            }
            finally {
                setLoading(false);
            }
        }
        fetchGuideDetails();
    }, [slug]);
    if (loading) {
        return (<div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent"></div>
          <p className="text-xs text-slate-400">Loading course syllabus...</p>
        </div>
      </div>);
    }
    if (!guide) {
        return (<div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-8 text-center max-w-md space-y-4">
          <AlertCircle className="h-10 w-10 text-rose-400 mx-auto"/>
          <h2 className="text-lg font-bold text-white">Course Guide Not Found</h2>
          <p className="text-xs text-slate-400">The requested guide may have been moved or unpublished.</p>
          <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold">
            <ArrowLeft className="h-4 w-4"/> Back to Store
          </Link>
        </div>
      </div>);
    }
    const pointsEarnable = Math.round(guide.price * 0.1);
    return (<div className="relative min-h-screen py-10">
      
      {/* Ambient background glow */}
      <div className="ambient-glow top-20 left-10 h-80 w-80 bg-brand-600/10"/>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-8">
          <Link href="/" className="hover:text-white flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5"/> All Courses
          </Link>
          <span>/</span>
          <span className="text-brand-400 font-medium">{guide.category}</span>
          <span>/</span>
          <span className="text-slate-300 truncate max-w-xs">{guide.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left 2 Columns: Course Syllabus, Highlights, Content Breakdown */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Title & Metadata */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-brand-600/20 border border-brand-500/40 px-2.5 py-1 text-xs font-bold text-brand-300 uppercase">
                  {guide.category}
                </span>
                <span className="rounded-md bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300">
                  {guide.level} Level
                </span>
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-md">
                  <ShieldCheck className="h-3.5 w-3.5"/> 100% DRM Protected
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                {guide.title}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {guide.description}
              </p>

              {/* Rating & Sales Stats */}
              <div className="flex items-center gap-6 text-xs text-slate-400 pt-2 border-y border-slate-800/80 py-3">
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="h-4 w-4 fill-amber-400"/>
                  <span>{guide.rating} Rating</span>
                  <span className="text-slate-500 font-normal">({guide.reviewsCount || 140} verified reviews)</span>
                </div>
                <div>
                  <span className="text-white font-semibold">{guide.salesCount} Students</span> Enrolled
                </div>
                <div className="hidden sm:flex items-center gap-1 text-slate-300">
                  <Clock className="h-3.5 w-3.5 text-slate-400"/>
                  <span>Digital View-Only License</span>
                </div>
              </div>
            </div>

            {/* Course Highlights */}
            {guide.highlights && guide.highlights.length > 0 && (<div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-brand-400"/>
                  What You Will Learn in This Guide
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {guide.highlights.map((h, idx) => (<div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5"/>
                      <span>{h}</span>
                    </div>))}
                </div>
              </div>)}

            {/* Attached PDF Modules / Files */}
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="h-4 w-4 text-brand-400"/>
                Included Course Modules ({guide.pdfFiles?.length || 1} Document)
              </h3>
              <div className="space-y-2.5">
                {guide.pdfFiles?.map((f, idx) => (<div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center font-bold">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{f.fileName}</h4>
                        <span className="text-slate-400">{f.pageCount || 'Multi-chapter'} Pages • DRM Canvas Stream</span>
                      </div>
                    </div>
                    <div>
                      {access.isPurchased ? (<span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle className="h-3.5 w-3.5"/> Unlocked
                        </span>) : (<span className="text-amber-400 font-bold flex items-center gap-1">
                          <Lock className="h-3.5 w-3.5"/> Purchase Required
                        </span>)}
                    </div>
                  </div>))}
              </div>
            </div>

            {/* Anti-Piracy Notice */}
            <div className="rounded-2xl bg-indigo-950/20 border border-indigo-800/30 p-5 flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5"/>
              <div className="text-xs space-y-1">
                <h4 className="font-bold text-indigo-300">Protected Digital Delivery</h4>
                <p className="text-slate-400 leading-relaxed">
                  This course is rendered via our secure in-browser DRM reader. Right-click, saving, and copy functions are disabled, and pages are personalized with your digital ownership stamp.
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Sticky Purchase Box */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-6">
              
              {/* Cover Thumbnail */}
              <div className="relative h-44 w-full rounded-xl overflow-hidden bg-slate-950">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={guide.coverImage} alt={guide.title} className="h-full w-full object-cover"/>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30"/>
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-white bg-black/60 px-2.5 py-1 rounded backdrop-blur-md">
                  <Eye className="h-3.5 w-3.5 text-amber-400"/>
                  <span>{guide.previewPages} Free Preview Pages</span>
                </div>
              </div>

              {/* Price Calculation */}
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-white">₹{guide.price}</span>
                  {guide.originalPrice && (<span className="text-sm text-slate-500 line-through">₹{guide.originalPrice}</span>)}
                  {guide.originalPrice && (<span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
                      {Math.round(((guide.originalPrice - guide.price) / guide.originalPrice) * 100)}% OFF
                    </span>)}
                </div>
                <p className="text-xs text-slate-400 mt-1">One-time payment • Lifetime in-browser reader access</p>
              </div>

              {/* Points Back Incentive */}
              <div className="flex items-center justify-between rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-xs">
                <div className="flex items-center gap-2">
                  <Coins className="h-4 w-4 text-amber-400"/>
                  <span className="text-amber-200 font-medium">Reward Cashback:</span>
                </div>
                <span className="font-bold text-amber-300">+{pointsEarnable} Points</span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                {access.isPurchased ? (<Link href={`/dashboard/reader/${guide._id || guide.id}`} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02]">
                    <BookOpen className="h-4 w-4"/>
                    <span>Read Now (Page {access.lastReadPage})</span>
                  </Link>) : (<>
                    <Link href={`/checkout/${guide._id || guide.id}`} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-brand-500/25 transition-all hover:scale-[1.02]">
                      <Sparkles className="h-4 w-4"/>
                      <span>Buy & Unlock Guide (₹{guide.price})</span>
                    </Link>

                    {guide.previewPages > 0 && (<button onClick={() => setShowPreviewModal(true)} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors">
                        <Eye className="h-4 w-4 text-brand-400"/>
                        <span>Read Free Sample ({guide.previewPages} Pages)</span>
                      </button>)}
                  </>)}
              </div>

              {/* Guarantee items */}
              <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-400"/>
                  <span>Instant access to updated versions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-400"/>
                  <span>Syncs reading progress across devices</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-400"/>
                  <span>Downloadable payment invoice receipt</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Free Sample Preview Modal */}
      {showPreviewModal && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-2 sm:p-6 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative h-[92vh] w-full max-w-5xl rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800 bg-slate-900">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-amber-400"/>
                <span className="text-xs font-bold text-white">Sample Preview: {guide.title}</span>
              </div>
              <button onClick={() => setShowPreviewModal(false)} className="px-3 py-1 rounded bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold">
                Close Preview
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <CanvasPdfReader guideId={guide._id || guide.id} guideTitle={guide.title} userEmail={user?.email || 'guest-preview@learnforge.io'} userName={user?.name || 'Guest Reader'} userId={user?.id || 'GUEST'} isPreview={true} previewPagesLimit={guide.previewPages || 2} guidePrice={guide.price}/>
            </div>
          </div>
        </div>)}

    </div>);
}
