// app/dashboard/reviews/page.tsx
import { prisma } from "@/lib/db";
import {
  GitPullRequest,
  AlertTriangle,
  Clock,
  FileCode,
  Plus,
  Minus,
  Brain,
  Filter,
} from "lucide-react";

const severityConfig: Record<string, { color: string; bg: string }> = {
  critical: { color: "text-red-400", bg: "bg-red-500/10" },
  high: { color: "text-orange-400", bg: "bg-orange-500/10" },
  medium: { color: "text-amber-400", bg: "bg-amber-500/10" },
  low: { color: "text-blue-400", bg: "bg-blue-500/10" },
  info: { color: "text-gray-400", bg: "bg-gray-500/10" },
};

const riskBadgeClass: Record<string, string> = {
  low: "badge-risk-low",
  medium: "badge-risk-medium",
  high: "badge-risk-high",
};

async function getReviews() {
  try {
    return await prisma.pullRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        repository: { select: { fullName: true } },
        issues: { select: { severity: true, category: true, title: true } },
        reviews: {
          select: { summary: true, persona: true },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });
  } catch {
    return [];
  }
}

export default async function ReviewsPage() {
  const prs = await getReviews();

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">PR Reviews</h1>
          <p className="text-gray-500 text-sm mt-1">
            {prs.length} pull request{prs.length !== 1 ? "s" : ""} analyzed
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary text-sm !px-4 !py-2.5 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {/* ── Reviews List ── */}
      {prs.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-brand-500/10 to-brand-600/5 flex items-center justify-center">
            <GitPullRequest className="w-8 h-8 text-brand-400/60" />
          </div>
          <h3 className="text-lg font-semibold text-gray-300 mb-2">No reviews yet</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Set up your GitHub webhook or use the manual analyzer to start reviewing PRs.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {prs.map((pr) => {
            const bySeverity = pr.issues.reduce((acc, i) => {
              acc[i.severity] = (acc[i.severity] || 0) + 1;
              return acc;
            }, {} as Record<string, number>);

            return (
              <div
                key={pr.id}
                className="glass-card-hover rounded-2xl p-6 group"
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="text-xs font-mono text-gray-500 bg-white/[0.03] px-2 py-1 rounded-lg">
                        #{pr.prNumber}
                      </span>
                      {pr.riskLevel && (
                        <span className={riskBadgeClass[pr.riskLevel]}>
                          {pr.riskLevel} risk
                        </span>
                      )}
                      {pr.riskScore != null && (
                        <span className="text-[11px] text-gray-600 font-mono">
                          Score: {pr.riskScore.toFixed(0)}/100
                        </span>
                      )}
                      {pr.persona !== "default" && (
                        <span className="badge-info text-[11px]">
                          {pr.persona}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-white text-lg truncate group-hover:text-brand-300 transition-colors">
                      {pr.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span className="font-mono">{pr.repository.fullName}</span>
                      <span className="text-gray-700">·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(pr.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span className="text-gray-700">·</span>
                      <span>by {pr.author}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{pr.issues.length}</div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-wider">Issues</div>
                    </div>
                    <div className="w-px h-8 bg-white/[0.06]" />
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="text-emerald-400 flex items-center gap-0.5">
                        <Plus className="w-3 h-3" />
                        {pr.additions}
                      </span>
                      <span className="text-red-400 flex items-center gap-0.5">
                        <Minus className="w-3 h-3" />
                        {pr.deletions}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Severity badges */}
                {Object.keys(bySeverity).length > 0 && (
                  <div className="flex gap-2 flex-wrap mb-4">
                    {Object.entries(bySeverity).map(([sev, count]) => (
                      <span
                        key={sev}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${severityConfig[sev]?.color || "text-gray-400"
                          } ${severityConfig[sev]?.bg || "bg-gray-500/10"}`}
                      >
                        <AlertTriangle className="w-3 h-3" />
                        {count} {sev}
                      </span>
                    ))}
                  </div>
                )}

                {/* AI Summary */}
                {pr.reviews[0]?.summary && (
                  <div className="border-t border-white/[0.04] pt-4 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500/15 to-brand-600/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Brain className="w-3.5 h-3.5 text-brand-400" />
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">
                      {pr.reviews[0].summary}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
