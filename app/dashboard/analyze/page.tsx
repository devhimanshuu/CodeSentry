"use client";
import { useState } from "react";
import {
  Zap,
  Shield,
  Rocket,
  Gauge,
  Flame,
  Code2,
  AlertTriangle,
  CheckCircle2,
  Brain,
  FileCode,
  Lightbulb,
  Loader2,
  Sparkles,
  GitPullRequest,
} from "lucide-react";

type Persona = "default" | "security" | "cto" | "performance" | "roast";

const PERSONAS: {
  id: Persona;
  label: string;
  icon: React.ElementType;
  desc: string;
  color: string;
  gradient: string;
  iconEmoji: string;
}[] = [
    {
      id: "default",
      icon: Code2,
      label: "Senior Engineer",
      desc: "Balanced, thorough review",
      color: "text-brand-400 border-brand-500/20 bg-brand-500/5",
      gradient: "from-brand-500/20 to-brand-600/5",
      iconEmoji: "👨‍💻",
    },
    {
      id: "security",
      icon: Shield,
      label: "Security Expert",
      desc: "Paranoid risk detection",
      color: "text-red-400 border-red-500/20 bg-red-500/5",
      gradient: "from-red-500/20 to-red-600/5",
      iconEmoji: "🔐",
    },
    {
      id: "cto",
      icon: Rocket,
      label: "Startup CTO",
      desc: "Speed vs stability tradeoffs",
      color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
      gradient: "from-emerald-500/20 to-emerald-600/5",
      iconEmoji: "🚀",
    },
    {
      id: "performance",
      icon: Gauge,
      label: "Perf Architect",
      desc: "Scalability focused analysis",
      color: "text-amber-400 border-amber-500/20 bg-amber-500/5",
      gradient: "from-amber-500/20 to-amber-600/5",
      iconEmoji: "⚡",
    },
    {
      id: "roast",
      icon: Flame,
      label: "Roast Mode",
      desc: "Brutally honest feedback",
      color: "text-pink-400 border-pink-500/20 bg-pink-500/5",
      gradient: "from-pink-500/20 to-pink-600/5",
      iconEmoji: "🔥",
    },
  ];

const severityConfig: Record<
  string,
  { icon: string; color: string; bg: string; label: string }
> = {
  critical: { icon: "🚨", color: "text-red-400", bg: "bg-red-500/10 border-red-500/15", label: "Critical" },
  high: { icon: "❗", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/15", label: "High" },
  medium: { icon: "⚠️", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/15", label: "Medium" },
  low: { icon: "💡", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/15", label: "Low" },
  info: { icon: "ℹ️", color: "text-gray-400", bg: "bg-gray-500/10 border-gray-500/15", label: "Info" },
};

const riskColor: Record<string, string> = {
  low: "text-emerald-400",
  medium: "text-amber-400",
  high: "text-red-400",
};

const riskGlow: Record<string, string> = {
  low: "shadow-[0_0_30px_-5px_rgba(52,211,153,0.25)]",
  medium: "shadow-[0_0_30px_-5px_rgba(251,191,36,0.25)]",
  high: "shadow-[0_0_30px_-5px_rgba(248,113,113,0.25)]",
};

const riskGradient: Record<string, string> = {
  low: "from-emerald-500 to-emerald-400",
  medium: "from-amber-500 to-amber-400",
  high: "from-red-500 to-red-400",
};

export default function AnalyzePage() {
  const [repoFullName, setRepoFullName] = useState("");
  const [prNumber, setPrNumber] = useState("");
  const [persona, setPersona] = useState<Persona>("default");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze() {
    if (!repoFullName || !prNumber) {
      setError("Please provide both repository name and PR number.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoFullName,
          prNumber: parseInt(prNumber),
          persona,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setResult(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analyze PR</h1>
        <p className="text-gray-500 text-sm mt-1">
          Run an AI-powered review on any public GitHub pull request
        </p>
      </div>

      {/* ── Input Form ── */}
      <div className="glass-card rounded-2xl p-6 space-y-6">
        {/* Repo + PR inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-400 mb-2 block tracking-wide uppercase">
              Repository
            </label>
            <div className="relative">
              <GitPullRequest className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                className="input-premium !pl-11"
                placeholder="owner/repo (e.g. facebook/react)"
                value={repoFullName}
                onChange={(e) => setRepoFullName(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-400 mb-2 block tracking-wide uppercase">
              PR Number
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 text-sm font-mono">
                #
              </span>
              <input
                className="input-premium !pl-9 font-mono"
                placeholder="42"
                value={prNumber}
                onChange={(e) => setPrNumber(e.target.value)}
                type="number"
              />
            </div>
          </div>
        </div>

        {/* Persona selector */}
        <div>
          <label className="text-xs font-medium text-gray-400 mb-3 block tracking-wide uppercase">
            Review Persona
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {PERSONAS.map((p) => {
              const selected = persona === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setPersona(p.id)}
                  className={`group relative p-4 rounded-xl border text-left transition-all duration-300 overflow-hidden ${selected
                    ? `${p.color} border-current/20`
                    : "border-white/[0.06] hover:border-white/10 bg-white/[0.02]"
                    }`}
                >
                  {/* Active glow */}
                  {selected && (
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${p.gradient} opacity-50`}
                    />
                  )}
                  <div className="relative">
                    <div className="text-2xl mb-2">{p.iconEmoji}</div>
                    <div
                      className={`text-xs font-semibold mb-0.5 ${selected ? "text-white" : "text-gray-300"
                        }`}
                    >
                      {p.label}
                    </div>
                    <div className="text-[11px] text-gray-500">{p.desc}</div>
                  </div>

                  {/* Selection indicator */}
                  {selected && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle2 className="w-4 h-4 text-current opacity-60" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/15 text-red-400">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Submit button */}
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full btn-primary !py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing PR...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" />
              Run AI Analysis
            </span>
          )}
        </button>
      </div>

      {/* ── Loading Animation ── */}
      {loading && (
        <div className="glass-card rounded-2xl p-12 text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-2 border-brand-500/20 animate-spin-slow" />
            {/* Inner ring */}
            <div
              className="absolute inset-2 rounded-full border-2 border-t-brand-400 border-r-transparent border-b-transparent border-l-transparent animate-spin"
              style={{ animationDuration: "1s" }}
            />
            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Brain className="w-8 h-8 text-brand-400 animate-pulse" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">AI is analyzing your PR</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Running 25+ rules, fetching diff data, and generating AI insights with the{" "}
            <span className="text-brand-400">{PERSONAS.find((p) => p.id === persona)?.label}</span> persona...
          </p>
        </div>
      )}

      {/* ── Results ── */}
      {result && (
        <div className="space-y-6 animate-fade-in-up">
          {/* Risk Assessment */}
          <div className={`glass-card rounded-2xl p-6 ${riskGlow[result.risk.level]}`}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${result.risk.level === "high"
                  ? "from-red-500/20 to-red-600/5"
                  : result.risk.level === "medium"
                    ? "from-amber-500/20 to-amber-600/5"
                    : "from-emerald-500/20 to-emerald-600/5"
                  } flex items-center justify-center`}
                >
                  <Shield className={`w-5 h-5 ${riskColor[result.risk.level]}`} />
                </div>
                <div>
                  <h2 className="font-semibold text-white">Risk Assessment</h2>
                  <p className="text-xs text-gray-500">AI confidence & weighted scoring</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-3xl font-bold ${riskColor[result.risk.level]}`}>
                  {result.risk.level.toUpperCase()}
                </div>
                <div className="text-xs text-gray-500 font-mono mt-0.5">
                  {result.risk.score.toFixed(0)} / 100
                </div>
              </div>
            </div>

            {/* Score bar */}
            <div className="h-3 bg-white/[0.04] rounded-full overflow-hidden mb-4">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${riskGradient[result.risk.level]} transition-all duration-1000`}
                style={{ width: `${result.risk.score}%` }}
              />
            </div>

            {/* Severity chips */}
            <div className="flex gap-3 flex-wrap">
              {Object.entries(result.risk.severityBreakdown as Record<string, number>)
                .filter(([, count]) => count > 0)
                .map(([sev, count]) => (
                  <span
                    key={sev}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${severityConfig[sev]?.bg || ""
                      } ${severityConfig[sev]?.color || ""}`}
                  >
                    <span>{severityConfig[sev]?.icon}</span>
                    {count} {severityConfig[sev]?.label || sev}
                  </span>
                ))}
            </div>
          </div>

          {/* AI Review Summary */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-600/5 flex items-center justify-center">
                <Brain className="w-5 h-5 text-brand-400" />
              </div>
              <div>
                <h2 className="font-semibold text-white">AI Review Summary</h2>
                <p className="text-xs text-gray-500">
                  Powered by{" "}
                  {PERSONAS.find((p) => p.id === persona)?.label || "AI"} persona
                </p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              {result.aiReview.summary}
            </p>

            {result.aiReview.additionalInsights?.length > 0 && (
              <div className="mt-5 space-y-2.5 border-t border-white/[0.04] pt-5">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Additional Insights
                </h4>
                {result.aiReview.additionalInsights.map(
                  (insight: string, i: number) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 text-sm text-gray-400"
                    >
                      <Sparkles className="w-4 h-4 text-brand-400/60 flex-shrink-0 mt-0.5" />
                      <span>{insight}</span>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Issues List */}
          {result.issues.length > 0 && (
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-white/[0.04]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/5 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-white">
                        Issues Found{" "}
                        <span className="text-gray-500">({result.issues.length})</span>
                      </h2>
                      <p className="text-xs text-gray-500">Rule-based & AI-detected problems</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-white/[0.04]">
                {result.issues.map((issue: any, i: number) => (
                  <div
                    key={i}
                    className="p-5 hover:bg-white/[0.01] transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm border ${severityConfig[issue.severity]?.bg || ""
                          }`}
                      >
                        {severityConfig[issue.severity]?.icon || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-medium text-sm text-white">
                            {issue.title}
                          </span>
                          <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-gray-400 font-mono">
                            {issue.category}
                          </span>
                        </div>
                        <p className="text-gray-500 text-xs leading-relaxed">
                          {issue.description}
                        </p>
                        {issue.filePath && (
                          <div className="flex items-center gap-1.5 mt-2">
                            <FileCode className="w-3 h-3 text-brand-400/60" />
                            <span className="text-xs text-brand-400 font-mono">
                              {issue.filePath}
                              {issue.lineNumber ? `:${issue.lineNumber}` : ""}
                            </span>
                          </div>
                        )}
                        {issue.suggestion && (
                          <div className="flex items-start gap-1.5 mt-2 p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                            <Lightbulb className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <span className="text-xs text-emerald-400/80 leading-relaxed">
                              {issue.suggestion}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
