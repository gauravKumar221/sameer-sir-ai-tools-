'use client';
import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Scale, ArrowLeft, Mail } from 'lucide-react';
export default function TermsAndConditionsPage() {
    const sections = [
        {
            title: '1. Acceptance of Terms',
            content: [
                'By accessing or using AutoGreen AI (the "Platform", "we", "our", or "us"), you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.',
                'If you do not agree with any part of these Terms, you must immediately discontinue use of the platform and all associated services.'
            ]
        },
        {
            title: '2. Digital Content & View-Only License',
            content: [
                'Upon successful purchase of an AI Kit, guide, or workflow toolkit, AutoGreen AI grants you a personal, non-exclusive, non-transferable, revocable license to access and read the digital content online through our secure in-browser DRM viewer.',
                'No Ownership Transfer: Purchasing an AI Kit gives you a viewing and deployment license, not ownership of the underlying intellectual property or copyrights.',
                'Strict Anti-Piracy Policy: Digital assets are delivered via secure streaming technology. You may not attempt to extract, scrape, reverse-engineer, redistribute, resell, or share access credentials with third parties.'
            ]
        },
        {
            title: '3. User Accounts and Authentication',
            content: [
                'You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.',
                'Single User Access: Account sharing is strictly prohibited. Our security systems monitor concurrent sessions and automated scraping patterns. AutoGreen AI reserves the right to suspend accounts violating this policy.'
            ]
        },
        {
            title: '4. Pricing, Payments, and Taxes',
            content: [
                'All prices listed across the ecosystem are subject to change without prior notice.',
                'Payments are securely processed via third-party gateways (Stripe, Razorpay). By purchasing, you authorize the charge to your selected payment method.',
                'Taxes: Applicable goods and services taxes or digital service taxes are calculated at checkout where legally required.'
            ]
        },
        {
            title: '5. Refund & Cancellation Policy',
            content: [
                'Due to the instant digital delivery and view access granted upon payment confirmation, digital kit purchases are generally non-refundable once unlocked.',
                'If you experience technical issues preventing you from accessing a purchased toolkit, please contact our support desk at contact@autogreen.ai within 7 days of purchase for assistance.'
            ]
        },
        {
            title: '6. Limitation of Liability',
            content: [
                'The educational prompts, AI blueprints, and technical code samples provided in our toolkits are for instructional and operational guidance. AutoGreen AI and its contributors shall not be liable for any consequential outcomes resulting from third-party AI model behaviors or external API changes.'
            ]
        },
        {
            title: '7. Governing Law and Amendments',
            content: [
                'These Terms shall be governed by and construed in accordance with applicable laws. We reserve the right to revise these Terms at any time by updating this page.'
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
              <Scale className="h-6 w-6"/>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white">Terms & Conditions</h1>
              <p className="text-xs text-slate-400 mt-0.5">Last updated: September 2026 • AutoGreen AI Platform</p>
            </div>
          </div>
        </div>

        {/* Highlight Notice */}
        <div className="rounded-2xl bg-[#061412] border border-emerald-900/50 p-5 flex items-start gap-4">
          <ShieldCheck className="h-6 w-6 text-emerald-400 shrink-0 mt-0.5"/>
          <div className="text-xs text-slate-300 leading-relaxed space-y-1">
            <span className="font-bold text-white block">Key Summary: Digital DRM License</span>
            Kits and guides purchased on AutoGreen AI are licensed for individual in-browser viewing and deployment. Downloading raw source PDFs or attempting to circumvent DRM watermarks is strictly prohibited.
          </div>
        </div>

        {/* Terms Sections */}
        <div className="space-y-8">
          {sections.map((sec, idx) => (<div key={idx} className="rounded-2xl bg-[#061412]/60 border border-emerald-950 p-6 sm:p-8 space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="text-emerald-400">{sec.title}</span>
              </h2>
              <div className="space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                {sec.content.map((p, pIdx) => (<p key={pIdx}>{p}</p>))}
              </div>
            </div>))}
        </div>

        {/* Contact info box */}
        <div className="rounded-2xl bg-[#061412] border border-emerald-950 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-emerald-400"/>
            <div>
              <h4 className="text-xs font-bold text-white">Questions regarding our Terms?</h4>
              <p className="text-xs text-slate-400">Contact our team at contact@autogreen.ai</p>
            </div>
          </div>
          <Link href="/about" className="px-4 py-2 rounded-xl bg-slate-900 border border-emerald-950 hover:bg-slate-800 text-xs font-bold text-white transition-all">
            About AutoGreen AI
          </Link>
        </div>

      </div>
    </div>);
}
