"use client";
// app/dashboard/analyze/page.tsx
import { useState } from "react";

type Persona = "default" | "security" | "cto" | "performance" | "roast";

const PERSONAS: { id: Persona; label: string; icon: string; desc: string }[] = [
  { id: "default", icon: "👨‍💻", label: "Senior Engineer", desc: "Balanced, thorough review" },
  { id: "security", icon: "🔐", label: "Security Engineer", desc: "Paranoid risk detection" },
  { id: "cto", icon: "🚀", label: "Startup CTO", desc: "Speed vs stability" },
  { id: "performance", icon: "⚡", label: "Perf Architect", desc: "Scalability focused" },
  { id: "roast", icon: "🔥", label: "Roast Mode", desc: "Brutally honest" },
];

const severityEmoji: Record<string, string> = {
  critical: "🚨", high: "❗", medium: "⚠️", low: "💡", info: "ℹ️",
};

const riskColor: Record<string, string> = {
  low: "text-green-400", medium: "text-yellow-400", high: "text-red-400",
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
        body: JSON.stringify({ repoFullName, prNumber: parseInt(prNumber), persona }),
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
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Analyze PR</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manually trigger a review for any public GitHub PR
        </p>
      </div>

      {/* Input form */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Repository (owner/repo)</label>
            <input
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              placeholder="e.g. facebook/react"
              value={repoFullName}
              onChange={(e) => setRepoFullName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">PR Number</label>
            <input
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              placeholder="e.g. 42"
              value={prNumber}
              onChange={(e) => setPrNumber(e.target.value)}
              type="number"
            />
          </div>
        </div>

        {/* Persona selector */}
        <label className="text-xs text-gray-400 mb-2 block">Review Persona</label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
          {PERSONAS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPersona(p.id)}
              className={`p-3 rounded-lg border text-left transition-all ${
                persona === p.id
                  ? "border-blue-500 bg-blue-900/20"
                  : "border-gray-700 hover:border-gray-600"
              }`}
            >
              <div className="text-lg mb-1">{p.icon}</div>
              <div className="text-xs font-medium">{p.label}</div>
              <div className="text-xs text-gray-500 mt-0.5">{p.desc}</div>
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
        >
          {loading ? "Analyzing..." : "⚡ Run Analysis"}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Risk score */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Risk Assessment</h2>
              <span className={`text-2xl font-bold ${riskColor[result.risk.level]}`}>
                {result.risk.level.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-800 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    result.risk.level === "high"
                      ? "bg-red-500"
                      : result.risk.level === "medium"
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${result.risk.score}%` }}
                />
              </div>
              <span className="text-sm font-medium">{result.risk.score.toFixed(0)}/100</span>
            </div>

            {/* Severity breakdown */}
            <div className="flex gap-4 mt-4 text-xs text-gray-400">
              {Object.entries(result.risk.severityBreakdown as Record<string, number>)
                .filter(([, count]) => count > 0)
                .map(([sev, count]) => (
                  <span key={sev}>
                    {severityEmoji[sev]} {count} {sev}
                  </span>
                ))}
            </div>
          </div>

          {/* AI Summary */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h2 className="font-semibold mb-3">AI Review</h2>
            <p className="text-gray-300 text-sm leading-relaxed">{result.aiReview.summary}</p>
            {result.aiReview.additionalInsights?.length > 0 && (
              <div className="mt-4 space-y-2">
                {result.aiReview.additionalInsights.map((insight: string, i: number) => (
                  <div key={i} className="flex gap-2 text-sm text-gray-400">
                    <span>•</span>
                    <span>{insight}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Issues list */}
          {result.issues.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl">
              <div className="p-4 border-b border-gray-800">
                <h2 className="font-semibold">Issues Found ({result.issues.length})</h2>
              </div>
              <div className="divide-y divide-gray-800">
                {result.issues.map((issue: any, i: number) => (
                  <div key={i} className="p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-lg">{severityEmoji[issue.severity]}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{issue.title}</span>
                          <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
                            {issue.category}
                          </span>
                        </div>
                        <p className="text-gray-400 text-xs mt-1">{issue.description}</p>
                        {issue.filePath && (
                          <p className="text-blue-400 text-xs mt-1 font-mono">{issue.filePath}</p>
                        )}
                        {issue.suggestion && (
                          <p className="text-green-400 text-xs mt-1">
                            💡 {issue.suggestion}
                          </p>
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
