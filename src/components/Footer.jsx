'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Lock, ArrowRight } from 'lucide-react';
export default function Footer() {
    const pathname = usePathname();
    // Hide in dedicated distraction-free reader screen and admin portal
    if (pathname.startsWith('/dashboard/reader') || pathname.startsWith('/admin')) {
        return null;
    }
    return (<footer className="border-t border-emerald-950/70 bg-[#020617] text-slate-400 text-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shadow-sm shadow-emerald-500/20">
                <Sparkles className="h-5 w-5 text-emerald-400"/>
              </div>
              <span className="font-bold text-lg leading-tight tracking-tight text-white">
                AutoGreen <span className="text-emerald-400 font-semibold">AI</span>
              </span>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              A global AI ecosystem helping people and businesses discover, use, automate and build with artificial intelligence.
              Different Businesses. One Green.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-full w-fit">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Global AI Ecosystem Active</span>
            </div>
          </div>

          {/* Ecosystem Navigation */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 mb-3">Ecosystem</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/#discover" className="hover:text-white transition-colors">
                  01 Discover
                </Link>
              </li>
              <li>
                <Link href="/#kits" className="hover:text-white transition-colors">
                  02 AI Kits
                </Link>
              </li>
              <li>
                <Link href="/#automate" className="hover:text-white transition-colors">
                  03 Automate
                </Link>
              </li>
              <li>
                <Link href="/#agents" className="hover:text-white transition-colors">
                  04 AI Agents
                </Link>
              </li>
              <li>
                <Link href="/#voice" className="hover:text-white transition-colors">
                  05 Voice AI
                </Link>
              </li>
              <li>
                <a href="mailto:contact@autogreen.ai" className="hover:text-white transition-colors">
                  06 Studio
                </a>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 mb-3">Company & Trust</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About AutoGreen AI
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/#resources" className="hover:text-white transition-colors">
                  AI Guides Catalog
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  My Library & DRM Reader
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect / Studio */}
          <div className="rounded-2xl bg-[#061412] border border-emerald-950 p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400"/>
              Build with AutoGreen
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Need custom AI strategy, agent implementation, or enterprise workflow deployment?
            </p>
            <a href="mailto:contact@autogreen.ai" className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors pt-1">
              <span>Talk to AutoGreen Studio</span>
              <ArrowRight className="h-3 w-3"/>
            </a>
          </div>

        </div>

        <div className="pt-8 border-t border-emerald-950/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} AutoGreen AI. Built for the modern world, wherever you work.</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-slate-400 transition-colors">About</Link>
            <Link href="/terms" className="hover:text-slate-400 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">Privacy</Link>
            <span className="flex items-center gap-1 text-slate-400">
              <Lock className="h-3 w-3 text-emerald-400"/> Secure DRM Platform
            </span>
          </div>
        </div>
      </div>
    </footer>);
}
