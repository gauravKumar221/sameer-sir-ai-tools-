'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, ShieldCheck, ShoppingBag, Award, User as UserIcon, LogOut, Menu, X, LayoutDashboard, Coins, ChevronDown } from 'lucide-react';
export default function Navbar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const isActive = (path) => pathname === path;
    // Don't show public nav inside the dedicated reader or admin portal
    if (pathname.startsWith('/dashboard/reader') || pathname.startsWith('/admin')) {
        return null;
    }
    return (<header className="sticky top-0 z-50 w-full border-b border-emerald-950/60 bg-[#020617]/85 backdrop-blur-xl transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        
        {/* AutoGreen Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="h-5 w-5 text-emerald-400"/>
          </div>
          <span className="font-bold text-lg leading-tight tracking-tight text-white flex items-center gap-1.5">
            AutoGreen <span className="text-emerald-400 font-semibold">AI</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link href="/#discover" className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">
            Discover
          </Link>
          <Link href="/#kits" className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">
            Kits
          </Link>
          <Link href="/#automate" className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">
            Automate
          </Link>
          <Link href="/#agents" className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">
            Agents
          </Link>
          <Link href="/#voice" className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">
            Voice
          </Link>
          <Link href="/#studio" className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">
            Studio
          </Link>
          <Link href="/about" className={`text-sm font-medium transition-colors hover:text-emerald-400 ${isActive('/about') ? 'text-emerald-400 font-semibold' : 'text-slate-300'}`}>
            About
          </Link>
          <Link href="/#resources" className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">
            Resources
          </Link>
        </nav>

        {/* Right Action Bar */}
        <div className="hidden md:flex items-center gap-4">
          <a href="mailto:contact@autogreen.ai" className="text-xs font-medium text-slate-300 hover:text-white transition-colors">
            Talk to AutoGreen
          </a>

          <Link href="/#kits" className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-500 text-slate-950 font-semibold text-xs hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20">
            <span>Explore AI Kits</span>
            <span className="text-xs">↗</span>
          </Link>
          {user ? (<div className="flex items-center gap-3">
              {/* Rewards Points Badge */}
              <Link href="/dashboard/rewards" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold hover:bg-amber-500/20 transition-all shadow-sm shadow-amber-500/10" title="Your Loyalty Reward Points">
                <Coins className="h-3.5 w-3.5 text-amber-400 animate-pulse"/>
                <span>{user.points || 0} pts</span>
              </Link>

              {/* My Purchases Shortcut */}
              <Link href="/dashboard" className={`flex items-center gap-1.5 text-sm font-medium px-3.5 py-1.5 rounded-lg border transition-all ${isActive('/dashboard')
                ? 'bg-brand-600/20 border-brand-500/50 text-brand-300'
                : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'}`}>
                <ShoppingBag className="h-4 w-4 text-brand-400"/>
                <span>My Library</span>
              </Link>

              {/* Admin Panel Link */}
              {user.role === 'admin' && (<Link href="/admin" className="flex items-center gap-1.5 text-sm font-medium px-3.5 py-1.5 rounded-lg bg-purple-600/20 border border-purple-500/40 text-purple-300 hover:bg-purple-600/30 transition-all">
                  <ShieldCheck className="h-4 w-4 text-purple-400"/>
                  <span>Admin Panel</span>
                </Link>)}

              {/* User Dropdown */}
              <div className="relative">
                <button onClick={() => setUserDropdownOpen(!userDropdownOpen)} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 hover:border-slate-700 transition-all text-sm font-medium">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-400 text-white flex items-center justify-center text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400"/>
                </button>

                {userDropdownOpen && (<div onMouseLeave={() => setUserDropdownOpen(false)} className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-semibold text-white truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                        {user.role}
                      </span>
                    </div>

                    <Link href="/dashboard" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800/80 hover:text-white transition-colors">
                      <LayoutDashboard className="h-4 w-4 text-brand-400"/>
                      My Purchased Guides
                    </Link>

                    <Link href="/dashboard/orders" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800/80 hover:text-white transition-colors">
                      <ShoppingBag className="h-4 w-4 text-emerald-400"/>
                      Order History & Invoices
                    </Link>

                    <Link href="/dashboard/rewards" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800/80 hover:text-white transition-colors">
                      <Award className="h-4 w-4 text-amber-400"/>
                      Rewards & Points Ledger
                    </Link>

                    <Link href="/dashboard/profile" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800/80 hover:text-white transition-colors">
                      <UserIcon className="h-4 w-4 text-sky-400"/>
                      Account Settings
                    </Link>

                    <div className="border-t border-slate-800 my-1"></div>

                    <button onClick={() => {
                    setUserDropdownOpen(false);
                    logout();
                }} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors text-left">
                      <LogOut className="h-4 w-4"/>
                      Sign Out
                    </button>
                  </div>)}
              </div>
            </div>) : (<div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-semibold text-slate-300 hover:text-white px-3 py-2 transition-colors">
                Log In
              </Link>
              <Link href="/signup" className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white text-sm font-semibold shadow-md shadow-brand-500/20 hover:from-brand-500 hover:to-indigo-500 transition-all hover:scale-[1.02]">
                <Sparkles className="h-4 w-4"/>
                <span>Get Started</span>
              </Link>
            </div>)}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          {user && (<Link href="/dashboard/rewards" className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
              <Coins className="h-3 w-3 text-amber-400"/>
              <span>{user.points || 0}</span>
            </Link>)}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white">
            {mobileMenuOpen ? <X className="h-5 w-5"/> : <Menu className="h-5 w-5"/>}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (<div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-6 space-y-3">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-slate-200">
            Explore Guides
          </Link>
          <Link href="/#categories" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-slate-200">
            Categories
          </Link>
          {user ? (<>
              <div className="pt-2 border-t border-slate-800"></div>
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 py-2 text-base font-medium text-brand-400">
                <ShoppingBag className="h-4 w-4"/>
                My Purchased Guides
              </Link>
              <Link href="/dashboard/rewards" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 py-2 text-base font-medium text-amber-400">
                <Award className="h-4 w-4"/>
                Rewards Wallet ({user.points} pts)
              </Link>
              <Link href="/dashboard/orders" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 py-2 text-base font-medium text-emerald-400">
                <LayoutDashboard className="h-4 w-4"/>
                Order History & Invoices
              </Link>
              {user.role === 'admin' && (<Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 py-2 text-base font-medium text-purple-400">
                  <ShieldCheck className="h-4 w-4"/>
                  Admin Portal
                </Link>)}
              <button onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                }} className="w-full text-left py-2 text-base font-medium text-rose-400 flex items-center gap-2">
                <LogOut className="h-4 w-4"/>
                Sign Out
              </button>
            </>) : (<div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="w-full py-2.5 text-center text-sm font-semibold rounded-xl bg-slate-900 border border-slate-800 text-white">
                Log In
              </Link>
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="w-full py-2.5 text-center text-sm font-semibold rounded-xl bg-brand-600 text-white">
                Sign Up
              </Link>
            </div>)}
        </div>)}
    </header>);
}
