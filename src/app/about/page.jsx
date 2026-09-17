'use client';
import React from 'react';
import Link from 'next/link';
import { Sparkles, Bot, Zap, Lock, ArrowRight, CheckCircle2, Compass } from 'lucide-react';
export default function AboutUsPage() {
    const stats = [
        { label: 'Curated AI Tools', value: '450+' },
        { label: 'Active Operators', value: '12,000+' },
        { label: 'Automations Deployed', value: '85,000+' },
        { label: 'Workflow Reliability', value: '99.4%' },
    ];
    const pillars = [
        {
            icon: Compass,
            title: 'High-Signal Curation',
            description: 'We separate useful AI from AI noise. Only proven models, architectures, and tools that drive quantifiable business ROI make it into our ecosystem.',
            color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30'
        },
        {
            icon: Zap,
            title: 'Pragmatic Automation',
            description: 'Moving beyond theoretical prompts into production n8n workflows, webhook orchestration, and multi-agent coordination that work without supervision.',
            color: 'from-emerald-500/20 to-teal-600/20 text-emerald-400 border-emerald-500/30'
        },
        {
            icon: Bot,
            title: 'Autonomous AI Employees',
            description: 'Building specialised agents that research, qualify leads, draft marketing collateral, and synthesize revenue reports alongside your human team.',
            color: 'from-emerald-500/20 to-green-600/20 text-emerald-400 border-emerald-500/30'
        },
        {
            icon: Lock,
            title: 'Secure DRM Knowledge Base',
            description: 'Every handbook and toolkit is delivered through an encrypted in-browser DRM reader with canvas streaming and anti-scraping protection.',
            color: 'from-emerald-500/20 to-cyan-500/20 text-emerald-400 border-emerald-500/30'
        }
    ];
    const values = [
        'Different Businesses. One Green. An inclusive global ecosystem for companies and operators at any scale.',
        'Practical execution over speculative AI hype — prioritizing measurable workflow efficiency.',
        'Role-specific toolkits combining Claude Skills, tested automations, and agent blueprints.',
        'Continuous updates ensuring our members stay ahead of the rapidly evolving AI frontier.'
    ];
    return (<div className="relative min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-white text-slate-900">
      
      {/* Ambient background glows */}
      <div className="ambient-glow top-20 left-1/4 h-96 w-96 bg-emerald-100/30"/>
      <div className="ambient-glow bottom-20 right-1/4 h-96 w-96 bg-teal-100/20"/>

      <div className="relative mx-auto max-w-5xl space-y-16">
        
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-mono tracking-wider text-emerald-800">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600"/>
            <span>ABOUT AUTOGREEN AI</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#111827] leading-tight">
            AI is the <br />
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              new green.
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-base text-slate-600 leading-relaxed">
            Thousands of businesses. Thousands of professions. Thousands of ways to work.{' '}
            <strong className="text-slate-900">One intelligence connects them all.</strong> AutoGreen AI is a global AI ecosystem helping people and businesses discover, use, automate and build with artificial intelligence.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, idx) => (<div key={idx} className="rounded-2xl bg-slate-50 border border-slate-200 p-6 text-center shadow-xs">
              <div className="text-3xl sm:text-4xl font-black text-emerald-700">
                {stat.value}
              </div>
              <div className="text-xs font-semibold text-slate-600 mt-2">{stat.label}</div>
            </div>))}
        </div>

        {/* Core Pillars */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111827]">The AutoGreen Standard</h2>
            <p className="text-xs text-slate-500 mt-1">Engineered from the ground up for practical AI implementation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (<div key={idx} className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4 hover:border-emerald-300 hover:shadow-md transition-all shadow-xs">
                  <div className="h-12 w-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                    <Icon className="h-6 w-6"/>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{pillar.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{pillar.description}</p>
                </div>);
        })}
          </div>
        </div>

        {/* Our Philosophy */}
        <div className="rounded-3xl bg-slate-50 border border-slate-200 p-8 sm:p-12 space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-700">
              <Sparkles className="h-5 w-5"/>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">The AutoGreen AI Mission</h3>
              <p className="text-xs text-emerald-700 font-mono font-semibold">Different Businesses. One Green.</p>
            </div>
          </div>

          <p className="text-slate-600 text-sm leading-relaxed">
            Artificial intelligence is not just a collection of separate tools; it is the fundamental utility connecting modern enterprise, independent creators, and agile teams. AutoGreen makes that intelligence straightforward to discover, test, automate, and scale.
          </p>

          <div className="space-y-3 pt-2">
            {values.map((val, idx) => (<div key={idx} className="flex items-start gap-3 text-xs text-slate-700">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5"/>
                <span>{val}</span>
              </div>))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-8 border-t border-slate-200">
          <h3 className="text-2xl font-bold text-slate-900 mb-3">Ready to transform your work with AI?</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
            Join thousands of professionals already leveraging AutoGreen AI toolkits and automations.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/#kits" className="px-6 py-3 rounded-full bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-all flex items-center gap-2 shadow-xs">
              <span>Explore AI Kits</span>
              <ArrowRight className="h-3.5 w-3.5"/>
            </Link>
            <a href="mailto:contact@autogreen.ai" className="px-6 py-3 rounded-full bg-slate-100 border border-slate-300 text-slate-800 font-semibold text-xs hover:bg-slate-200 transition-all">
              Contact Studio
            </a>
          </div>
        </div>

      </div>
    </div>);
}
