'use client';
import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Database, UserCheck, ArrowLeft, Mail, Key, Server } from 'lucide-react';
export default function PrivacyPolicyPage() {
    const policies = [
        {
            icon: Database,
            title: '1. Information We Collect',
            items: [
                'Account Information: When you create an account, we collect your name, email address, and encrypted credentials.',
                'Kit Access & Purchase Records: We store order history, toolkit entitlements, purchase dates, amounts paid, and reward points balances.',
                'Payment Information: Financial credentials are processed directly by PCI-DSS compliant gateways (Stripe, Razorpay) and are never stored on our servers.',
                'Reader Telemetry: We log reading progress (last read page) and security authentication timestamps to synchronize your access across devices.'
            ]
        },
        {
            icon: Lock,
            title: '2. How We Protect & Use Your Data',
            items: [
                'Secure Authentication: Session tokens are stored strictly inside httpOnly, SameSite secure cookies to prevent unauthorized exfiltration.',
                'Watermarking & DRM: Your registered user details are dynamically applied as anti-piracy canvas watermarks during authenticated reading sessions.',
                'We will never sell, rent, or trade your personal information to third-party advertisers or brokers.'
            ]
        },
        {
            icon: Server,
            title: '3. Cookies and Local Storage',
            items: [
                'Essential Cookies: Necessary for maintaining your session, CSRF security, and toolkit access validation.',
                'Preference Cookies: Used to remember reader UI settings, such as zoom level and active themes.'
            ]
        },
        {
            icon: Key,
            title: '4. Third-Party Service Providers',
            items: [
                'Payment Gateways: Stripe & Razorpay handle encrypted transaction processing and settlement.',
                'Database & Infrastructure: Secure MongoDB clusters with end-to-end encryption at rest and in transit.',
                'All infrastructure partners comply with international data security standards.'
            ]
        },
        {
            icon: UserCheck,
            title: '5. Your Rights and Data Controls',
            items: [
                'Access & Update: You can view and edit your profile information anytime in your Account Dashboard.',
                'Data Erasure: You may request a summary of your stored personal information or account deletion by contacting our privacy compliance desk.'
            ]
        }
    ];
    return (<div className="relative min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-[#020617] text-slate-100">
      
      {/* Ambient glow */}
      <div className="ambient-glow top-20 left-1/4 h-80 w-80 bg-emerald-500/10"/>

      <div className="relative mx-auto max-w-4xl space-y-12">
        
        {/* Header */}
        <div className="space-y-4 border-b border-emerald-950/80 pb-8">
          <div className="flex items-center gap-2">
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors">
              <ArrowLeft className="h-4 w-4"/>
              <span>Back to AutoGreen AI</span>
            </Link>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
              <ShieldCheck className="h-6 w-6"/>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white">Privacy Policy</h1>
              <p className="text-xs text-slate-400 mt-0.5">Last updated: September 2026 • AutoGreen AI Platform</p>
            </div>
          </div>
        </div>

        {/* Highlight Notice */}
        <div className="rounded-2xl bg-[#061412] border border-emerald-900/50 p-5 flex items-start gap-4">
          <Lock className="h-6 w-6 text-emerald-400 shrink-0 mt-0.5"/>
          <div className="text-xs text-slate-300 leading-relaxed space-y-1">
            <span className="font-bold text-white block">Our Privacy Commitment</span>
            We respect your privacy and protect your intellectual property and reading data. We do not sell user data or share private prompts.
          </div>
        </div>

        {/* Policy Sections */}
        <div className="space-y-8">
          {policies.map((sec, idx) => {
            const Icon = sec.icon;
            return (<div key={idx} className="rounded-2xl bg-[#061412]/60 border border-emerald-950 p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Icon className="h-4 w-4"/>
                  </div>
                  <h2 className="text-lg font-bold text-white">{sec.title}</h2>
                </div>

                <ul className="space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed list-disc list-inside">
                  {sec.items.map((item, itemIdx) => (<li key={itemIdx} className="leading-relaxed">
                      {item}
                    </li>))}
                </ul>
              </div>);
        })}
        </div>

        {/* Contact info box */}
        <div className="rounded-2xl bg-[#061412] border border-emerald-950 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-emerald-400"/>
            <div>
              <h4 className="text-xs font-bold text-white">Privacy Concerns or Data Requests?</h4>
              <p className="text-xs text-slate-400">Email our privacy desk at privacy@autogreen.ai</p>
            </div>
          </div>
          <Link href="/about" className="px-4 py-2 rounded-xl bg-slate-900 border border-emerald-950 hover:bg-slate-800 text-xs font-bold text-white transition-all">
            About AutoGreen AI
          </Link>
        </div>

      </div>
    </div>);
}
