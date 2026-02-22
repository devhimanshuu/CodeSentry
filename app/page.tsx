// app/page.tsx
import Link from "next/link";
import { Shield, Zap, BarChart3, Users, GitPullRequest, Brain, Lock, Activity, ArrowRight, Star, Github, ChevronRight, Sparkles } from "lucide-react";

/* ─── Animated background orbs ─── */
function BackgroundOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Primary brand orb */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full animate-float-slow"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)" }}
      />
      {/* Cyan orb */}
      <div className="absolute top-1/3 -left-32 w-[500px] h-[500px] rounded-full animate-float"
        style={{ background: "radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)" }}
      />
      {/* Purple orb */}
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full animate-float-slower"
        style={{ background: "radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)" }}
      />
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-40" />
    </div>
  );
}

/* ─── Floating status badges (decorative) ─── */
function FloatingBadge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`glass-card rounded-2xl px-4 py-3 animate-float ${className}`}>
      {children}
    </div>
  );
}

/* ─── Feature card ─── */
function FeatureCard({
  icon: Icon,
  title,
  desc,
  gradient,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  gradient: string;
  delay: string;
}) {
  return (
    <div
      className="group glass-card-hover rounded-2xl p-6 relative overflow-hidden"
      style={{ animationDelay: delay }}
    >
      {/* Corner glow */}
      <div
        className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${gradient}`}
      />
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${gradient}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-lg font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

/* ─── Stat pill ─── */
function StatPill({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-gradient mb-1">{value}</div>
      <div className="text-gray-500 text-sm">{label}</div>
    </div>
  );
}

/* ─── Persona card ─── */
function PersonaCard({
  icon,
  name,
  tagline,
  color,
}: {
  icon: string;
  name: string;
  tagline: string;
  color: string;
}) {
  return (
    <div className="glass-card-hover rounded-2xl p-5 text-center group cursor-default">
      <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <div className={`font-semibold text-sm ${color}`}>{name}</div>
      <div className="text-gray-500 text-xs mt-1">{tagline}</div>
    </div>
  );
}

/* ─── Integration logo (decorative) ─── */
function IntegrationBubble({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 group">
      <div className="w-14 h-14 rounded-2xl glass-card flex items-center justify-center group-hover:border-brand-500/30 transition-colors duration-300">
        <Icon className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
      </div>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}

/* ─── MAIN LANDING PAGE ─── */
export default function Home() {
  return (
    <div className="relative min-h-screen">
      <BackgroundOrbs />

      {/* ═══════ NAVBAR ═══════ */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow-sm group-hover:shadow-glow transition-shadow duration-300">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Code<span className="text-gradient">Sentry</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#personas" className="hover:text-white transition-colors">Personas</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="btn-secondary text-sm !px-5 !py-2.5 hidden sm:block">
            Dashboard
          </Link>
          <Link href="/dashboard/analyze" className="btn-primary text-sm !px-5 !py-2.5">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Try Now
            </span>
          </Link>
        </div>
      </nav>

      {/* ═══════ HERO SECTION ═══════ */}
      <section className="relative z-10 px-6 md:px-12 pt-16 md:pt-24 pb-20 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-gray-400">
              v1.0 — AI-Powered Engineering Intelligence
            </span>
            <ChevronRight className="w-3 h-3 text-gray-600" />
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.05] mb-6 animate-fade-in-up">
            Stop Shipping
            <br />
            <span className="text-gradient">Risky Code</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 animate-fade-in-up leading-relaxed" style={{ animationDelay: "0.1s" }}>
            CodeSentry is your AI engineering co-pilot — automated PR reviews, risk scoring, persona-driven insights, and repository health monitoring in one platform.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <Link href="/dashboard/analyze" className="btn-primary text-base !px-8 !py-4 group">
              <span className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Analyze Your First PR
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link href="/dashboard" className="btn-secondary text-base !px-8 !py-4">
              <span className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                View Dashboard
              </span>
            </Link>
          </div>

          {/* Floating elements around hero */}
          <div className="relative mt-20 hidden lg:block">
            <div className="absolute -left-16 top-0">
              <FloatingBadge className="!animate-float">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="text-xs text-gray-300 font-medium">3 Critical Issues</span>
                </div>
              </FloatingBadge>
            </div>
            <div className="absolute -right-8 top-8">
              <FloatingBadge className="!animate-float-slow" >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-xs text-gray-300 font-medium">Health: 94/100</span>
                </div>
              </FloatingBadge>
            </div>
            <div className="absolute left-8 bottom-4">
              <FloatingBadge className="!animate-float-slower">
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-brand-400" />
                  <span className="text-xs text-gray-300 font-medium">AI Confidence: 0.97</span>
                </div>
              </FloatingBadge>
            </div>
          </div>

          {/* Dashboard preview mockup */}
          <div className="relative mt-8 lg:mt-0 max-w-5xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <div className="glass-card rounded-3xl p-1 relative overflow-hidden">
              {/* Gradient top bar */}
              <div className="h-1 w-full bg-gradient-to-r from-brand-500 via-accent-cyan to-accent-purple rounded-t-3xl" />
              <div className="bg-[#0a0a1e] rounded-b-3xl p-6 md:p-8">
                {/* Fake dashboard header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Engineering Overview</div>
                      <div className="text-xs text-gray-500">Real-time intelligence</div>
                    </div>
                  </div>
                  <div className="hidden sm:flex gap-2">
                    <div className="badge-risk-low text-[10px]">2 Low Risk</div>
                    <div className="badge-risk-medium text-[10px]">1 Medium</div>
                    <div className="badge-risk-high text-[10px]">1 High Risk</div>
                  </div>
                </div>

                {/* Fake stat cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {[
                    { label: "PRs Reviewed", value: "247", icon: GitPullRequest, color: "from-brand-500/20 to-brand-600/10" },
                    { label: "Issues Found", value: "1,423", icon: Zap, color: "from-amber-500/20 to-amber-600/10" },
                    { label: "Repos Tracked", value: "12", icon: Github, color: "from-emerald-500/20 to-emerald-600/10" },
                    { label: "Health Score", value: "92", icon: Activity, color: "from-cyan-500/20 to-cyan-600/10" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className={`bg-gradient-to-br ${s.color} rounded-xl p-4 border border-white/5`}
                    >
                      <s.icon className="w-4 h-4 text-gray-400 mb-2" />
                      <div className="text-2xl font-bold stat-number">{s.value}</div>
                      <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Fake progress bars */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { label: "Code Quality", pct: 87, color: "bg-brand-500" },
                    { label: "Security", pct: 94, color: "bg-emerald-500" },
                    { label: "Performance", pct: 72, color: "bg-amber-500" },
                  ].map((m) => (
                    <div key={m.label} className="bg-white/[0.02] rounded-xl p-4 border border-white/5">
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-gray-400">{m.label}</span>
                        <span className="text-white font-medium">{m.pct}%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${m.color}`} style={{ width: `${m.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reflection glow under card */}
            <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-3/4 h-40 bg-brand-500/10 blur-[100px] rounded-full" />
          </div>
        </div>
      </section>

      {/* ═══════ SOCIAL PROOF / STATS ═══════ */}
      <section className="relative z-10 px-6 md:px-12 py-16 max-w-5xl mx-auto">
        <div className="glass-card rounded-3xl p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatPill value="25+" label="Security Rules" />
            <StatPill value="5" label="AI Personas" />
            <StatPill value="<30s" label="Review Time" />
            <StatPill value="99.2%" label="Accuracy" />
          </div>
        </div>
      </section>

      {/* ═══════ FEATURES ═══════ */}
      <section id="features" className="relative z-10 px-6 md:px-12 py-20 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="badge-info mb-4 mx-auto w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            Core Features
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Everything You Need to
            <br />
            <span className="text-gradient">Ship Confidently</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            From automated PR reviews to deep repository health analytics — CodeSentry handles it all.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          <FeatureCard
            icon={GitPullRequest}
            title="AI-Powered PR Review"
            desc="Automated code analysis using Groq LLama 3 with 25+ security, performance, and style rules."
            gradient="bg-gradient-to-br from-brand-500/30 to-brand-700/10"
            delay="0s"
          />
          <FeatureCard
            icon={Shield}
            title="Risk Scoring Engine"
            desc="Every PR gets an instant Low / Medium / High risk assessment with weighted severity scoring."
            gradient="bg-gradient-to-br from-red-500/30 to-red-700/10"
            delay="0.05s"
          />
          <FeatureCard
            icon={Activity}
            title="Repository Health"
            desc="Track code quality, security risk, maintainability, test coverage, and performance over time."
            gradient="bg-gradient-to-br from-emerald-500/30 to-emerald-700/10"
            delay="0.1s"
          />
          <FeatureCard
            icon={Users}
            title="5 Review Personas"
            desc="Get different perspectives — from Security Engineer to Startup CTO to Roast Mode."
            gradient="bg-gradient-to-br from-purple-500/30 to-purple-700/10"
            delay="0.15s"
          />
          <FeatureCard
            icon={Brain}
            title="Intelligent Insights"
            desc="AI doesn't just flag issues — it explains why they matter and suggests actionable fixes."
            gradient="bg-gradient-to-br from-cyan-500/30 to-cyan-700/10"
            delay="0.2s"
          />
          <FeatureCard
            icon={Lock}
            title="GitHub Integration"
            desc="Receives webhooks, auto-reviews PRs, and posts comments directly on your pull requests."
            gradient="bg-gradient-to-br from-amber-500/30 to-amber-700/10"
            delay="0.25s"
          />
        </div>
      </section>

      {/* ═══════ PERSONAS ═══════ */}
      <section id="personas" className="relative z-10 px-6 md:px-12 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="badge-info mb-4 mx-auto w-fit">
            <Users className="w-3.5 h-3.5" />
            Personas
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Review Through
            <br />
            <span className="text-gradient">Different Lenses</span>
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            Each persona brings a unique perspective to your code review, catching what others might miss.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          <PersonaCard icon="👨‍💻" name="Senior Engineer" tagline="Balanced & thorough" color="text-brand-400" />
          <PersonaCard icon="🔐" name="Security Expert" tagline="Paranoid detection" color="text-red-400" />
          <PersonaCard icon="🚀" name="Startup CTO" tagline="Speed vs stability" color="text-emerald-400" />
          <PersonaCard icon="⚡" name="Perf Architect" tagline="Scale focused" color="text-amber-400" />
          <PersonaCard icon="🔥" name="Roast Mode" tagline="Brutally honest" color="text-pink-400" />
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section id="how-it-works" className="relative z-10 px-6 md:px-12 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="badge-info mb-4 mx-auto w-fit">
            <Zap className="w-3.5 h-3.5" />
            How It Works
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Three Steps to
            <br />
            <span className="text-gradient">Safer Code</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              title: "Connect Repository",
              desc: "Set up a GitHub webhook or manually enter any public PR for instant analysis.",
              icon: Github,
            },
            {
              step: "02",
              title: "AI Analyzes Your Code",
              desc: "CodeSentry runs 25+ rules and LLM reasoning to identify security, performance, and logic issues.",
              icon: Brain,
            },
            {
              step: "03",
              title: "Get Actionable Insights",
              desc: "Receive risk scores, detailed reports, and auto-posted PR comments with fix suggestions.",
              icon: BarChart3,
            },
          ].map((s) => (
            <div key={s.step} className="relative glass-card-hover rounded-2xl p-7 group">
              <div className="text-6xl font-black text-white/[0.03] absolute top-4 right-6 select-none">
                {s.step}
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-700/10 flex items-center justify-center mb-5 border border-brand-500/10">
                <s.icon className="w-6 h-6 text-brand-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ CTA SECTION ═══════ */}
      <section className="relative z-10 px-6 md:px-12 py-24 max-w-4xl mx-auto text-center">
        <div className="glass-card rounded-3xl p-10 md:p-16 relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-accent-cyan/5 pointer-events-none" />

          <div className="relative">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Ready to Level Up Your
              <br />
              <span className="text-gradient">Code Reviews?</span>
            </h2>
            <p className="text-gray-400 max-w-md mx-auto mb-8">
              Start analyzing pull requests in under 30 seconds. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard/analyze" className="btn-primary text-base !px-8 !py-4 group">
                <span className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Get Started Free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link href="/dashboard" className="btn-secondary text-base !px-8 !py-4">
                View Demo Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="relative z-10 border-t border-white/5 py-10 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">CodeSentry</span>
            <span className="text-gray-600 text-sm">· AI Engineering Intelligence</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span>Built with Next.js, Prisma & Groq AI</span>
            <span>Phase 1 · v1.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
