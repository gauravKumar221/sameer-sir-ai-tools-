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
    return (<div className="relative min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-[#020617] text-slate-100">
      
      {/* Ambient background glows */}
      <div className="ambient-glow top-20 left-1/4 h-96 w-96 bg-emerald-500/10"/>
      <div className="ambient-glow bottom-20 right-1/4 h-96 w-96 bg-teal-500/10"/>

      <div className="relative mx-auto max-w-5xl space-y-16">
        
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-4 py-1.5 text-xs font-mono tracking-wider text-emerald-300">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400"/>
            <span>ABOUT AUTOGREEN AI</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            AI is the <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">
              new green.
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-base text-slate-300 leading-relaxed">
            Thousands of businesses. Thousands of professions. Thousands of ways to work.{' '}
            <strong className="text-white">One intelligence connects them all.</strong> AutoGreen AI is a global AI ecosystem helping people and businesses discover, use, automate and build with artificial intelligence.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, idx) => (<div key={idx} className="rounded-2xl bg-[#061412]/80 border border-emerald-950 p-6 text-center shadow-lg backdrop-blur-sm">
              <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-xs font-semibold text-slate-400 mt-2">{stat.label}</div>
            </div>))}
        </div>

        {/* Core Pillars */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">The AutoGreen Standard</h2>
            <p className="text-xs text-slate-400 mt-1">Engineered from the ground up for practical AI implementation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (<div key={idx} className="rounded-2xl bg-[#061412]/60 border border-emerald-950 p-6 space-y-4 hover:border-emerald-500/40 transition-all shadow-md">
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${pillar.color} border flex items-center justify-center`}>
                    <Icon className="h-6 w-6"/>
                  </div>
                  <h3 className="text-lg font-bold text-white">{pillar.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{pillar.description}</p>
                </div>);
        })}
          </div>
        </div>

        {/* Our Philosophy */}
        <div className="rounded-3xl bg-gradient-to-br from-[#061714] via-[#04120f] to-[#020617] border border-emerald-900/50 p-8 sm:p-12 space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
              <Sparkles className="h-5 w-5"/>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">The AutoGreen AI Mission</h3>
              <p className="text-xs text-emerald-400 font-mono">Different Businesses. One Green.</p>
            </div>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed">
            Artificial intelligence is not just a collection of separate tools; it is the fundamental utility connecting modern enterprise, independent creators, and agile teams. AutoGreen makes that intelligence straightforward to discover, test, automate, and scale.
          </p>

          <div className="space-y-3 pt-2">
            {values.map((val, idx) => (<div key={idx} className="flex items-start gap-3 text-xs text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5"/>
                <span>{val}</span>
              </div>))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-8 border-t border-emerald-950">
          <h3 className="text-2xl font-bold text-white mb-3">Ready to transform your work with AI?</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
            Join thousands of professionals already leveraging AutoGreen AI toolkits and automations.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/#kits" className="px-6 py-3 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all flex items-center gap-2">
              <span>Explore AI Kits</span>
              <ArrowRight className="h-3.5 w-3.5"/>
            </Link>
            <a href="mailto:contact@autogreen.ai" className="px-6 py-3 rounded-full bg-slate-900 border border-emerald-900/60 text-white font-semibold text-xs hover:bg-slate-800 transition-all">
              Contact Studio
            </a>
          </div>
        </div>

      </div>
    </div>);
}
