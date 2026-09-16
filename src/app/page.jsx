'use client';
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Search, CheckCircle, Bot, Zap, Mic, Code, BookOpen, ChevronDown, Check, Compass, Briefcase, Terminal, Activity, Send } from 'lucide-react';
export default function HomePage() {
    const [guides, setGuides] = useState([]);
    const [categories, setCategories] = useState(['All']);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    // Interactive Agent Tab State
    const [activeAgentTab, setActiveAgentTab] = useState(0);
    // FAQ Accordion State
    const [openFaq, setOpenFaq] = useState(0);
    // Newsletter State
    const [emailSubscribed, setEmailSubscribed] = useState(false);
    const [newsletterEmail, setNewsletterEmail] = useState('');
    // Interactive Canvas Ref for constellation background
    const canvasRef = useRef(null);
    useEffect(() => {
        // Particle constellation animation
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        let animationFrameId;
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);
        const handleResize = () => {
            if (!canvas)
                return;
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);
        const particles = [];
        for (let i = 0; i < 45; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                radius: Math.random() * 1.8 + 1,
                alpha: Math.random() * 0.5 + 0.2,
            });
        }
        const render = () => {
            ctx.clearRect(0, 0, width, height);
            // Draw connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 130) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(16, 185, 129, ${0.15 * (1 - dist / 130)})`;
                        ctx.lineWidth = 0.8;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            // Draw and move particles
            for (const p of particles) {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0)
                    p.x = width;
                if (p.x > width)
                    p.x = 0;
                if (p.y < 0)
                    p.y = height;
                if (p.y > height)
                    p.y = 0;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(52, 211, 153, ${p.alpha})`;
                ctx.fill();
            }
            animationFrameId = requestAnimationFrame(render);
        };
        render();
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);
    useEffect(() => {
        async function fetchGuides() {
            setLoading(true);
            try {
                const queryParams = new URLSearchParams();
                if (selectedCategory !== 'All')
                    queryParams.set('category', selectedCategory);
                if (searchQuery)
                    queryParams.set('search', searchQuery);
                const res = await fetch(`/api/guides?${queryParams.toString()}`);
                const data = await res.json();
                if (data.success) {
                    setGuides(data.guides || []);
                    if (data.categories) {
                        setCategories(data.categories);
                    }
                }
            }
            catch (err) {
                console.error('Error fetching guides:', err);
            }
            finally {
                setLoading(false);
            }
        }
        const timer = setTimeout(() => {
            fetchGuides();
        }, 200);
        return () => clearTimeout(timer);
    }, [selectedCategory, searchQuery]);
    // Ecosystem Pillars Data
    const pillars = [
        {
            step: '01',
            tag: 'Discover',
            title: 'Find the right AI tools.',
            desc: 'Curated AI tools for every profession and industry — filtered by use case, difficulty, and stack.',
            icon: Compass,
            gradient: 'from-emerald-500/20 to-teal-500/10',
            actionText: 'Explore Directory',
            link: '#resources'
        },
        {
            step: '02',
            tag: 'Kits',
            title: 'Get ready-to-use AI systems.',
            desc: 'Role-specific AI toolkits — tools, prompts, workflows and automations in one place.',
            icon: Briefcase,
            gradient: 'from-emerald-500/25 to-green-600/10',
            actionText: 'View AI Kits',
            link: '#kits'
        },
        {
            step: '03',
            tag: 'Automate',
            title: 'Automate repetitive work.',
            desc: 'Connect apps, data and AI so decisions and actions happen without you.',
            icon: Zap,
            gradient: 'from-emerald-500/20 to-cyan-600/10',
            actionText: 'See Automations',
            link: '#automate'
        },
        {
            step: '04',
            tag: 'Agents',
            title: 'Build AI employees.',
            desc: 'Specialised AI agents that research, sell, support and report alongside your team.',
            icon: Bot,
            gradient: 'from-emerald-500/20 to-lime-600/10',
            actionText: 'Meet The Agents',
            link: '#agents'
        },
        {
            step: '05',
            tag: 'Voice',
            title: 'Deploy AI voice experiences.',
            desc: 'Natural, conversational voice agents for sales, support, qualification, and booking.',
            icon: Mic,
            gradient: 'from-emerald-500/20 to-teal-600/10',
            actionText: 'Explore Voice',
            link: '#voice'
        },
        {
            step: '06',
            tag: 'Studio',
            title: 'Build custom AI solutions.',
            desc: 'Strategy, implementation and transformation — bespoke AI systems for your brand.',
            icon: Code,
            gradient: 'from-emerald-500/20 to-emerald-700/10',
            actionText: 'Contact Studio',
            link: 'mailto:contact@autogreen.ai'
        }
    ];
    // AI Marketer Kit Tiers Data
    const kitTiers = [
        {
            name: 'AI Marketer Starter',
            badge: 'FOUNDATION',
            price: '$49',
            originalPrice: '$99',
            description: 'Discover what AI can do for your daily marketing work.',
            features: [
                '50+ Curated AI marketing tools directory',
                '100+ High-conversion tested prompts',
                'Daily content drafting workflows',
                'DRM secured technical guides & PDF',
                'Instant digital access & cloud progress'
            ],
            cta: 'Get Starter Kit',
            popular: false
        },
        {
            name: 'AI Marketer Community',
            badge: 'MOST POPULAR',
            price: '$149',
            originalPrice: '$299',
            description: 'Turn AI tools into repeatable marketing workflows.',
            features: [
                'Everything in AI Marketer Starter',
                'n8n & Zapier automated lead pipelines',
                'AI reporting & performance analytics system',
                'Access to private AutoGreen operator community',
                'Monthly live teardown & prompt labs',
                'Earn 10% Cash Back Reward points'
            ],
            cta: 'Join Community & Kit',
            popular: true
        },
        {
            name: 'AI Marketer Expert',
            badge: 'SCALE & ENTERPRISE',
            price: '$299',
            originalPrice: '$599',
            description: 'Build your own AI marketing department.',
            features: [
                'Everything in Community Kit',
                'AI employee builder & multi-agent templates',
                'AI freelancer & marketing agency operating system',
                'Bespoke internal AI workflows & SOPs',
                '1-on-1 strategy onboarding session',
                'Lifetime roadmap updates included'
            ],
            cta: 'Get Full Expert Stack',
            popular: false
        }
    ];
    // AI Agents Directory Data
    const agents = [
        {
            name: 'AI Research Agent',
            role: 'Market & Competitive Intelligence',
            status: 'Autonomous Worker',
            capabilities: [
                'Scrapes competitor pricing, offerings and ads',
                'Synthesizes industry whitepapers into 2-page briefs',
                'Monitors social sentiment and emergent trends'
            ],
            sampleOutput: 'Identified 3 market gaps in B2B AI automation. Generated executive summary + 14 reference citations.'
        },
        {
            name: 'AI Marketing Agent',
            role: 'Multi-Channel Campaign Architect',
            status: 'Autonomous Worker',
            capabilities: [
                'Drafts high-converting landing page copy and headlines',
                'Schedules omnichannel social variations with hooks',
                'Conducts A/B test analysis on CTR and conversion'
            ],
            sampleOutput: 'Generated 5 high-converting ad hooks with 9.2% estimated CTR increase over baseline.'
        },
        {
            name: 'AI Support Agent',
            role: '24/7 Context-Aware Customer Care',
            status: 'Real-time Autonomous',
            capabilities: [
                'Instant answers grounded in company documentation',
                'Processes ticket escalation with sentiment scoring',
                'Integrates with Slack, Zendesk, and Intercom'
            ],
            sampleOutput: 'Resolved 84% of tier-1 customer inquiries instantly with a 98.7% satisfaction rating.'
        },
        {
            name: 'AI Reporting Agent',
            role: 'KPI & Revenue Data Synthesizer',
            status: 'Scheduled Worker',
            capabilities: [
                'Extracts data from Stripe, GA4, and CRM systems',
                'Translates tabular metrics into actionable narrative',
                'Dispatches Monday morning executive briefs'
            ],
            sampleOutput: 'Weekly brief sent: CAC dropped 18%, MRR increased 12.4% driven by Kit Tier 2.'
        },
        {
            name: 'AI Lead Qualification Agent',
            role: 'High-Intent Prospect Scoring',
            status: 'Autonomous Inbound',
            capabilities: [
                'Enriches company size, tech stack, and LinkedIn data',
                'Interviews inbound visitors via conversational chat',
                'Auto-books qualified meetings on sales calendars'
            ],
            sampleOutput: 'Qualified 42 enterprise leads this week and routed 18 direct calls to account executives.'
        }
    ];
    // FAQ Data
    const faqs = [
        {
            q: 'What is AutoGreen AI?',
            a: 'AutoGreen AI is a global AI ecosystem. We help people and businesses discover the right AI tools, learn to use them, automate their work and build custom AI systems — from individual workflows to full AI employees.'
        },
        {
            q: 'Who is AutoGreen AI for?',
            a: 'AutoGreen is built for professionals, creators, agency owners, SMEs, and enterprise operators. If you work in modern business, AutoGreen helps you work faster, automate routine operations, and lead with AI.'
        },
        {
            q: 'What is the AI Marketer Kit?',
            a: 'A role-specific digital toolkit that turns marketers into AI operators. It combines Claude Skills, tested workflows, n8n automations, and AI employee templates across three progressive levels: Starter, Community, and Expert.'
        },
        {
            q: 'Which AI tools and models are included?',
            a: 'Our ecosystem encompasses top foundational models (Claude 3.5, OpenAI, Gemini) and specialised tools across copywriting, design, video, research, automation (n8n, Make), and voice AI.'
        },
        {
            q: 'What are AI agents and AI employees?',
            a: 'AI agents are autonomous software systems built to perform specialised work — researching, qualifying leads, drafting reports, and answering customer queries without constant manual intervention.'
        },
        {
            q: 'Can businesses partner with AutoGreen Studio for custom systems?',
            a: 'Yes. Through AutoGreen Automate, Agents, Voice, and Studio, we design and implement bespoke AI strategy, proprietary knowledge bases, and custom agents for organizations of any scale.'
        },
        {
            q: 'How does digital access and DRM protection work?',
            a: 'All guides and toolkits purchased on AutoGreen are delivered through our high-performance in-browser DRM reader. Content is encrypted, personalized with dynamic watermarks, and synchronized across your devices.'
        }
    ];
    return (<div className="relative min-h-screen bg-[#020617] text-slate-100 selection:bg-emerald-500 selection:text-slate-950 overflow-hidden">
      
      {/* Interactive Constellation Background Canvas */}
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-40"/>

      {/* Ambient Emerald Glow Elements */}
      <div className="ambient-glow -top-32 left-1/2 -translate-x-1/2 h-[550px] w-[550px] bg-emerald-500/15"/>
      <div className="ambient-glow top-[900px] -left-40 h-[450px] w-[450px] bg-teal-500/10"/>
      <div className="ambient-glow top-[2200px] -right-40 h-[550px] w-[550px] bg-emerald-600/10"/>

      {/* ========================================================================= */}
      {/* 1. HERO SECTION                                                           */}
      {/* ========================================================================= */}
      <section className="relative z-10 pt-20 pb-24 sm:pt-28 sm:pb-32 lg:pt-36 lg:pb-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Eyebrow Pill */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-4 py-1.5 text-xs font-mono tracking-widest text-emerald-300 backdrop-blur-md shadow-sm shadow-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>AUTOGREEN AI — A GLOBAL AI ECOSYSTEM</span>
            </div>
          </div>

          {/* Main Headline */}
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-white leading-[1.05]">
              AI is the <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">
                new green.
              </span>
            </h1>

            <p className="mt-8 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              Thousands of businesses. Thousands of professions. Thousands of ways to work.{' '}
              <strong className="text-white font-semibold">One intelligence connects them all.</strong>
            </p>

            <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
              AutoGreen AI helps people and businesses discover, use, automate and build with artificial intelligence.
            </p>

            {/* Action Buttons */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="#kits" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-sm hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/25 hover:scale-105 active:scale-95">
                <span>Explore AI Kits</span>
                <ArrowRight className="h-4 w-4"/>
              </Link>

              <Link href="#discover" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-slate-900/80 border border-slate-700/80 text-white font-semibold text-sm hover:border-emerald-500/50 hover:bg-slate-800/80 transition-all backdrop-blur-md">
                <span>Explore AutoGreen AI</span>
              </Link>
            </div>
          </div>

          {/* Hero Ecosystem Stats Row */}
          <div className="mt-20 border-y border-emerald-950/60 bg-emerald-950/20 py-6 backdrop-blur-md">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto px-4 text-center">
              <div>
                <p className="text-3xl font-extrabold text-white tracking-tight">450+</p>
                <p className="text-xs uppercase tracking-wider font-mono text-emerald-400/90 mt-1">Curated AI Tools</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-white tracking-tight">12,000+</p>
                <p className="text-xs uppercase tracking-wider font-mono text-emerald-400/90 mt-1">Active AI Operators</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-white tracking-tight">85,000+</p>
                <p className="text-xs uppercase tracking-wider font-mono text-emerald-400/90 mt-1">Automations Deployed</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-white tracking-tight">99.4%</p>
                <p className="text-xs uppercase tracking-wider font-mono text-emerald-400/90 mt-1">Workflow Reliability</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. CORE ECOSYSTEM PILLARS (Bento Grid) (#discover)                        */}
      {/* ========================================================================= */}
      <section id="discover" className="relative z-10 py-24 border-t border-emerald-950/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-2">The Architecture</p>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Discover the tools. Build the systems. <br />
              <span className="text-emerald-400">Grow with AI.</span>
            </h2>
            <p className="mt-4 text-slate-400 text-base">
              Different Businesses. One Green. A complete end-to-end framework to master modern artificial intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((pillar) => {
            const IconComponent = pillar.icon;
            return (<div key={pillar.step} className="group relative rounded-2xl border border-emerald-900/40 bg-[#071311]/70 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/10 flex flex-col justify-between">
                  <div className="absolute top-0 right-0 p-6 text-xs font-mono font-bold text-emerald-500/30 group-hover:text-emerald-400/60 transition-colors">
                    {pillar.step}
                  </div>

                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                      <IconComponent className="h-6 w-6"/>
                    </div>

                    <span className="inline-block text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">
                      {pillar.tag}
                    </span>

                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-300 transition-colors">
                      {pillar.title}
                    </h3>

                    <p className="text-sm text-slate-300 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-emerald-950/80">
                    <Link href={pillar.link} className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
                      <span>{pillar.actionText}</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform"/>
                    </Link>
                  </div>
                </div>);
        })}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. FEATURED AI KITS & TIERS (#kits)                                       */}
      {/* ========================================================================= */}
      <section id="kits" className="relative z-10 py-24 bg-[#030c0a]/80 border-t border-emerald-950/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-3">
              <Briefcase className="h-3.5 w-3.5"/>
              <span>DIGITAL TOOLKITS & WORKFLOWS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Start with the <span className="text-emerald-400">AI Marketer Kit</span>
            </h2>
            <p className="mt-4 text-slate-300 text-base">
              A role-specific digital toolkit that turns marketers into AI operators. It combines Claude Skills,
              workflows, n8n automations, and AI employees across three progressive levels.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {kitTiers.map((tier) => (<div key={tier.name} className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${tier.popular
                ? 'border-2 border-emerald-500 bg-[#081b16] shadow-2xl shadow-emerald-500/15 lg:-translate-y-2'
                : 'border border-emerald-900/50 bg-[#051311]/70'}`}>
                {tier.popular && (<div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-500 text-slate-950 text-xs font-extrabold tracking-wider uppercase shadow-md shadow-emerald-500/30">
                    {tier.badge}
                  </div>)}

                <div>
                  {!tier.popular && (<span className="text-[11px] font-mono font-semibold text-emerald-400/80 uppercase tracking-wider block mb-1">
                      {tier.badge}
                    </span>)}

                  <h3 className="text-2xl font-bold text-white mt-1">{tier.name}</h3>
                  <p className="text-xs text-slate-300 mt-2 min-h-[34px]">{tier.description}</p>

                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-white">{tier.price}</span>
                    <span className="text-sm text-slate-500 line-through">{tier.originalPrice}</span>
                    <span className="text-xs text-emerald-400 font-medium">one-time</span>
                  </div>

                  <div className="mt-8 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">What is included:</p>
                    {tier.features.map((feat, idx) => (<div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5"/>
                        <span>{feat}</span>
                      </div>))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-emerald-900/60">
                  <Link href={`/checkout?tier=${encodeURIComponent(tier.name)}&price=${encodeURIComponent(tier.price)}`} className={`w-full py-3 px-4 rounded-xl text-center text-sm font-bold flex items-center justify-center gap-2 transition-all ${tier.popular
                ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900 border border-emerald-800/60 text-white hover:bg-slate-800'}`}>
                    <span>{tier.cta}</span>
                    <ArrowRight className="h-4 w-4"/>
                  </Link>
                </div>
              </div>))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. AI AGENTS DIRECTORY & INTERACTIVE SHOWCASE (#agents)                  */}
      {/* ========================================================================= */}
      <section id="agents" className="relative z-10 py-24 border-t border-emerald-950/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-3">
              <Bot className="h-3.5 w-3.5"/>
              <span>AUTONOMOUS AI WORKFORCE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Build <span className="text-emerald-400">AI employees.</span>
            </h2>
            <p className="mt-4 text-slate-300 text-base">
              Specialised AI agents that research, sell, support and report alongside your team.
              Explore our production-ready agent blueprints.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Agent Selector List */}
            <div className="lg:col-span-5 space-y-3">
              {agents.map((agent, index) => (<button key={agent.name} onClick={() => setActiveAgentTab(index)} className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between ${activeAgentTab === index
                ? 'border-emerald-500 bg-emerald-950/40 text-white shadow-lg shadow-emerald-500/10'
                : 'border-emerald-900/30 bg-[#061412]/50 text-slate-400 hover:border-emerald-800/50 hover:text-slate-200'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${activeAgentTab === index
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-emerald-950/60 text-emerald-400'}`}>
                      <Bot className="h-5 w-5"/>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{agent.name}</p>
                      <p className="text-xs text-slate-400">{agent.role}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Live
                  </span>
                </button>))}
            </div>

            {/* Agent Live Terminal / Execution Card */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-emerald-800/50 bg-[#051412] p-8 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between pb-6 border-b border-emerald-900/50 mb-6">
                  <div className="flex items-center gap-2.5">
                    <div className="h-3 w-3 rounded-full bg-rose-500/80"/>
                    <div className="h-3 w-3 rounded-full bg-amber-500/80"/>
                    <div className="h-3 w-3 rounded-full bg-emerald-500/80"/>
                    <span className="text-xs font-mono text-slate-400 ml-2">autogreen-agent-sandbox v2.4</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                    <Activity className="h-3.5 w-3.5 animate-pulse"/>
                    <span>STATUS: {agents[activeAgentTab].status.toUpperCase()}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-white mb-1">
                    {agents[activeAgentTab].name}
                  </h4>
                  <p className="text-xs text-emerald-400 font-mono mb-6">
                    ROLE: {agents[activeAgentTab].role}
                  </p>

                  <div className="space-y-4 mb-6">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Core Autonomous Capabilities:
                    </p>
                    {agents[activeAgentTab].capabilities.map((cap, i) => (<div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5"/>
                        <span>{cap}</span>
                      </div>))}
                  </div>

                  <div className="p-4 rounded-xl bg-black/50 border border-emerald-900/40 mb-6">
                    <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400 mb-1">
                      <Terminal className="h-3.5 w-3.5"/>
                      <span>Latest Autonomous Dispatch:</span>
                    </div>
                    <p className="text-xs text-slate-300 font-mono italic">
                      "{agents[activeAgentTab].sampleOutput}"
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Link href="/#kits" className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all flex items-center gap-2">
                      <span>Deploy This Agent Template</span>
                      <ArrowRight className="h-3.5 w-3.5"/>
                    </Link>
                    <a href="mailto:contact@autogreen.ai" className="px-5 py-2.5 rounded-xl bg-slate-900 border border-emerald-900/60 text-slate-200 font-medium text-xs hover:bg-slate-800 transition-all">
                      Request Custom Training
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. AUTOMATION & VOICE AI CAPABILITIES (#automate & #voice)                */}
      {/* ========================================================================= */}
      <section id="automate" className="relative z-10 py-24 bg-[#030d0a]/70 border-t border-emerald-950/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-4">
                <Zap className="h-3.5 w-3.5"/>
                <span>INTELLIGENT WORKFLOW ENGINE</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Automate repetitive work. <br />
                <span className="text-emerald-400">Connect apps, data and AI.</span>
              </h2>

              <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
                Connect your business tools, databases, and AI models so decisions and actions occur without friction.
                From automated client onboarding to multi-step research reports, AutoGreen gives you battle-tested n8n
                and webhook pipelines.
              </p>

              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-200">
                  <div className="h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">1</div>
                  <span>Trigger from any webhook, form, CRM or database event</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-200">
                  <div className="h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">2</div>
                  <span>Process context through Claude 3.5 Sonnet / OpenAI with strict guardrails</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-200">
                  <div className="h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">3</div>
                  <span>Dispatch formatted outputs to Slack, Gmail, Google Sheets or your custom API</span>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-4">
                <Link href="#kits" className="px-6 py-3 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all flex items-center gap-2">
                  <span>Get Ready Automations</span>
                  <ArrowRight className="h-3.5 w-3.5"/>
                </Link>
              </div>
            </div>

            {/* Voice AI Card (#voice) */}
            <div id="voice" className="rounded-3xl border border-emerald-800/50 bg-[#061512] p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                  <Mic className="h-6 w-6"/>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Deploy AI Voice Experiences</h3>
                  <p className="text-xs text-emerald-400 font-mono">Ultra-low latency conversational agents</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                Deliver human-like, real-time voice interactions across inbound calls, outbound qualification, and customer support.
                AutoGreen Voice connects telephony with LLMs in under 450ms.
              </p>

              <div className="space-y-2.5 p-4 rounded-2xl bg-black/40 border border-emerald-950 mb-6">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>Voice Latency</span>
                  <span className="font-mono text-emerald-400 font-bold">&lt; 450ms</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>Supported Accents & Languages</span>
                  <span className="font-mono text-emerald-400 font-bold">38+</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>Calendar & CRM Integration</span>
                  <span className="font-mono text-emerald-400 font-bold">Google, Cal.com, HubSpot</span>
                </div>
              </div>

              <Link href="mailto:contact@autogreen.ai" className="w-full py-3 rounded-xl border border-emerald-500/50 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 font-semibold text-xs flex items-center justify-center gap-2 transition-all">
                <span>Consult On Voice Implementation</span>
                <ArrowRight className="h-3.5 w-3.5"/>
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. CURATED AI GUIDES & E-BOOKS CATALOG (#resources)                       */}
      {/* ========================================================================= */}
      <section id="resources" className="relative z-10 py-24 border-t border-emerald-950/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-3">
                <BookOpen className="h-3.5 w-3.5"/>
                <span>DRM SECURED DIGITAL GUIDES</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Curated AI Technical Guides
              </h2>
              <p className="mt-2 text-slate-300 text-sm max-w-xl">
                Read in-depth manuals, developer architecture blueprints, and business playbooks
                directly in our cloud DRM reader.
              </p>
            </div>

            {/* Real-time Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"/>
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search guides, tools, agents..." className="w-full pl-10 pr-4 py-2.5 rounded-full bg-slate-900/80 border border-emerald-900/50 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"/>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
            {categories.map((cat) => (<button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${selectedCategory === cat
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-emerald-950'}`}>
                {cat}
              </button>))}
          </div>

          {/* Guides Grid */}
          {loading ? (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (<div key={n} className="h-80 rounded-2xl bg-slate-900/40 border border-slate-800 animate-pulse"/>))}
            </div>) : guides.length > 0 ? (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {guides.map((guide) => (<div key={guide._id || guide.slug} className="group rounded-2xl border border-emerald-950 bg-[#061412]/80 overflow-hidden flex flex-col justify-between hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300">
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                    <img src={guide.coverImage || '/placeholder-cover.jpg'} alt={guide.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => {
                    e.target.style.display = 'none';
                }}/>
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md border border-emerald-500/30 text-[10px] font-mono text-emerald-400">
                        {guide.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-white text-base group-hover:text-emerald-300 transition-colors line-clamp-2">
                        {guide.title}
                      </h3>
                      <p className="mt-2 text-xs text-slate-400 line-clamp-2">
                        {guide.shortDescription}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-emerald-950 flex items-center justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-extrabold text-white">₹{guide.price}</span>
                        {guide.originalPrice && (<span className="text-xs text-slate-500 line-through">₹{guide.originalPrice}</span>)}
                      </div>

                      <Link href={`/guides/${guide.slug}`} className="px-4 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold hover:bg-emerald-500 hover:text-slate-950 transition-all">
                        Read Guide
                      </Link>
                    </div>
                  </div>
                </div>))}
            </div>) : (<div className="text-center py-16 rounded-2xl border border-dashed border-emerald-950 bg-slate-950/40">
              <BookOpen className="h-10 w-10 text-emerald-500/40 mx-auto mb-3"/>
              <p className="text-sm font-semibold text-white">No guides matching your criteria</p>
              <p className="text-xs text-slate-500 mt-1">Try resetting the category filter or search query</p>
              <button onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
            }} className="mt-4 px-4 py-1.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs">
                Reset Filters
              </button>
            </div>)}

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. PHILOSOPHY & WHY US                                                   */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-24 bg-[#030d0b] border-t border-emerald-950/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              We separate useful AI <br />
              <span className="text-emerald-400">from AI noise.</span>
            </h2>
            <p className="mt-4 text-slate-300 text-base">
              AI changes constantly. AutoGreen evolves with it. We engineer pragmatic systems that drive
              verifiable productivity rather than superficial hype.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl border border-emerald-950 bg-[#061412] text-left">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-mono font-bold text-sm mb-4">
                01
              </div>
              <h4 className="text-base font-bold text-white mb-2">Find the right AI tools</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Filter through thousands of AI products to uncover the select few that generate immediate ROI for your role.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-emerald-950 bg-[#061412] text-left">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-mono font-bold text-sm mb-4">
                02
              </div>
              <h4 className="text-base font-bold text-white mb-2">Create AI employees</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Package tasks into autonomous agents that conduct research, resolve support, and publish content without supervision.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-emerald-950 bg-[#061412] text-left">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-mono font-bold text-sm mb-4">
                03
              </div>
              <h4 className="text-base font-bold text-white mb-2">Automate workflows</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Wire up APIs, webhooks, and n8n scripts so multi-step operational chains execute seamlessly around the clock.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-emerald-950 bg-[#061412] text-left">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-mono font-bold text-sm mb-4">
                04
              </div>
              <h4 className="text-base font-bold text-white mb-2">Become future-ready</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Transition from manual operator to strategic orchestrator of intelligent systems across modern business.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. FREQUENTLY ASKED QUESTIONS (Accordion)                                */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-24 border-t border-emerald-950/60">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <p className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-2">Answers</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-slate-400 text-sm">
              Everything you need to know about AutoGreen AI, the kits, automations, and DRM ecosystem.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (<div key={index} className="rounded-2xl border border-emerald-950 bg-[#061412]/70 overflow-hidden transition-colors">
                  <button onClick={() => setOpenFaq(isOpen ? null : index)} className="w-full p-6 text-left flex items-center justify-between gap-4 text-white font-semibold text-sm sm:text-base hover:text-emerald-300 transition-colors">
                    <span>{faq.q}</span>
                    <ChevronDown className={`h-4 w-4 text-emerald-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}/>
                  </button>

                  {isOpen && (<div className="px-6 pb-6 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-emerald-950/60 pt-4">
                      {faq.a}
                    </div>)}
                </div>);
        })}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. NEWSLETTER & ECOSYSTEM BANNER                                          */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-20 bg-gradient-to-b from-[#061914] to-[#020617] border-t border-emerald-900/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-4 py-1.5 text-xs font-mono text-emerald-300 mb-6">
            <span>WEEKLY BRIEFING</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Practical AI, straight to your inbox.
          </h2>

          <p className="mt-4 text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Different Businesses. One Green. Join 12,000+ engineers, marketers and founders building with AI.
          </p>

          <div className="mt-8 max-w-md mx-auto">
            {emailSubscribed ? (<div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400"/>
                <span>You are on the list! Welcome to AutoGreen AI.</span>
              </div>) : (<form onSubmit={(e) => {
                e.preventDefault();
                if (newsletterEmail)
                    setEmailSubscribed(true);
            }} className="flex items-center gap-2 p-1.5 rounded-full bg-slate-900/90 border border-emerald-800/60 focus-within:border-emerald-500 transition-all">
                <input type="email" required value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)} placeholder="Enter your work email address..." className="w-full bg-transparent px-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none"/>
                <button type="submit" className="px-5 py-2.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all shrink-0 flex items-center gap-1.5">
                  <span>Subscribe</span>
                  <Send className="h-3.5 w-3.5"/>
                </button>
              </form>)}
            <p className="text-[11px] text-slate-500 mt-3">No spam. Only high-signal workflows, agent blueprints, and tool teardowns.</p>
          </div>

        </div>
      </section>

    </div>);
}
