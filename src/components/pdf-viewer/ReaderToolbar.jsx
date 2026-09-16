'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, Minimize2, ShieldAlert, Moon, Sun, BookOpen, Layers, FileText } from 'lucide-react';
export default function ReaderToolbar({ title, currentPage, totalPages, zoom, theme, viewMode, isFullscreen, isPreview, onPageChange, onZoomChange, onThemeChange, onViewModeChange, onToggleFullscreen, onToggleThumbnails, showThumbnails, }) {
    return (<header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-slate-800 bg-slate-950/95 px-4 backdrop-blur-md text-slate-200">
      
      {/* Left: Back Link + Document Title */}
      <div className="flex items-center gap-3 min-w-0 max-w-[35%]">
        <Link href="/dashboard" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors" title="Back to Dashboard">
          <ArrowLeft className="h-4 w-4"/>
        </Link>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold text-white">{title}</span>
            {isPreview ? (<span className="shrink-0 rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                PREVIEW MODE
              </span>) : (<span className="shrink-0 rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <ShieldAlert className="h-2.5 w-2.5"/> DRM SECURED
              </span>)}
          </div>
        </div>
      </div>

      {/* Center: Page Navigation */}
      <div className="flex items-center gap-1.5 rounded-xl bg-slate-900/90 border border-slate-800 px-2 py-1">
        <button disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)} className="p-1 rounded hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:hover:bg-transparent transition-colors" title="Previous Page">
          <ChevronLeft className="h-4 w-4"/>
        </button>

        <div className="flex items-center gap-1 text-xs font-medium px-2">
          <input type="number" min={1} max={totalPages || 1} value={currentPage} onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            if (val >= 1 && val <= totalPages) {
                onPageChange(val);
            }
        }} className="w-10 rounded bg-slate-950 border border-slate-700 py-0.5 text-center text-xs text-white focus:outline-none focus:border-brand-500"/>
          <span className="text-slate-400">/ {totalPages || 1}</span>
        </div>

        <button disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)} className="p-1 rounded hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:hover:bg-transparent transition-colors" title="Next Page">
          <ChevronRight className="h-4 w-4"/>
        </button>
      </div>

      {/* Right Controls: Zoom, Theme, View Mode, Fullscreen */}
      <div className="flex items-center gap-2">
        {/* Toggle Thumbnails */}
        <button onClick={onToggleThumbnails} className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs transition-colors ${showThumbnails
            ? 'bg-brand-600/20 border-brand-500 text-brand-300'
            : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'}`} title="Toggle Page Thumbnails">
          <Layers className="h-4 w-4"/>
        </button>

        {/* Zoom Controls */}
        <div className="hidden sm:flex items-center gap-1 rounded-lg bg-slate-900 border border-slate-800 px-1.5 py-0.5">
          <button onClick={() => onZoomChange(Math.max(50, zoom - 15))} className="p-1 text-slate-400 hover:text-white" title="Zoom Out">
            <ZoomOut className="h-3.5 w-3.5"/>
          </button>
          <span className="text-[11px] font-mono font-medium px-1 text-slate-300">{zoom}%</span>
          <button onClick={() => onZoomChange(Math.min(200, zoom + 15))} className="p-1 text-slate-400 hover:text-white" title="Zoom In">
            <ZoomIn className="h-3.5 w-3.5"/>
          </button>
        </div>

        {/* Reader Theme (Night / Light / Sepia) */}
        <div className="hidden md:flex items-center gap-1 rounded-lg bg-slate-900 border border-slate-800 p-0.5">
          <button onClick={() => onThemeChange('dark')} className={`px-2 py-1 rounded text-xs transition-colors ${theme === 'dark' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-white'}`} title="Dark Theme">
            <Moon className="h-3.5 w-3.5"/>
          </button>
          <button onClick={() => onThemeChange('sepia')} className={`px-2 py-1 rounded text-xs transition-colors ${theme === 'sepia' ? 'bg-[#3b3228] text-[#e8dccb] font-medium' : 'text-slate-400 hover:text-white'}`} title="Sepia Warm Theme">
            <span className="text-[11px] font-serif font-bold">Aa</span>
          </button>
          <button onClick={() => onThemeChange('light')} className={`px-2 py-1 rounded text-xs transition-colors ${theme === 'light' ? 'bg-slate-200 text-slate-900 font-medium' : 'text-slate-400 hover:text-white'}`} title="Clean Light Theme">
            <Sun className="h-3.5 w-3.5"/>
          </button>
        </div>

        {/* View Mode Toggle */}
        <button onClick={() => onViewModeChange(viewMode === 'continuous' ? 'single' : 'continuous')} className="hidden lg:flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white" title={`Switch to ${viewMode === 'continuous' ? 'Single Page' : 'Continuous Scroll'}`}>
          {viewMode === 'continuous' ? <FileText className="h-3.5 w-3.5"/> : <BookOpen className="h-3.5 w-3.5"/>}
          <span>{viewMode === 'continuous' ? 'Scroll' : 'Single'}</span>
        </button>

        {/* Fullscreen Toggle */}
        <button onClick={onToggleFullscreen} className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors" title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}>
          {isFullscreen ? <Minimize2 className="h-4 w-4"/> : <Maximize2 className="h-4 w-4"/>}
        </button>
      </div>

    </header>);
}
