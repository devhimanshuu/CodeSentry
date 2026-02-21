// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 px-4">
      <div className="text-center max-w-2xl">
        <div className="mb-6 flex items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-2xl font-bold">
            🛡️
          </div>
          <h1 className="text-4xl font-bold tracking-tight">CodeSentry</h1>
        </div>

        <p className="text-gray-400 text-lg mb-2">
          AI-powered engineering intelligence platform
        </p>
        <p className="text-gray-500 text-sm mb-10">
          Automated PR review · Risk scoring · Repository health monitoring
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors"
          >
            Open Dashboard →
          </Link>
          <a
            href="/api/analyze"
            className="px-6 py-3 border border-gray-700 hover:border-gray-500 rounded-lg font-medium transition-colors text-gray-300"
            target="_blank"
          >
            API Docs
          </a>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          {[
            { icon: "🔍", title: "PR Review", desc: "Auto reviews with AI + rules" },
            { icon: "⚡", title: "Risk Scoring", desc: "Low / Medium / High per PR" },
            { icon: "📊", title: "Repo Health", desc: "Weighted quality index" },
            { icon: "🎭", title: "Personas", desc: "Security, CTO, Roast mode" },
          ].map((f) => (
            <div key={f.title} className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <div className="text-2xl mb-2">{f.icon}</div>
              <div className="font-medium text-sm">{f.title}</div>
              <div className="text-gray-500 text-xs mt-1">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
