import { prisma } from "@/lib/db";
import Link from "next/link";
import {
  GitPullRequest,
  FolderGit2,
  AlertTriangle,
  ShieldCheck,
  ArrowUpRight,
  ArrowRight,
  Zap,
  TrendingUp,
  Clock,
} from "lucide-react";

async function getStats() {
  try {
    const [totalPRs, totalRepos, recentPRs] = await Promise.all([
      prisma.pullRequest.count(),
      prisma.repository.count(),
      prisma.pullRequest.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          repository: { select: { fullName: true } },
          issues: { select: { severity: true } },
        },
      }),
    ]);

    const riskCounts = await prisma.pullRequest.groupBy({
      by: ["riskLevel"],
      _count: true,
    });

    return { totalPRs, totalRepos, recentPRs, riskCounts };
  } catch {
    return { totalPRs: 0, totalRepos: 0, recentPRs: [], riskCounts: [] };
  }
}

const riskBadgeClass: Record<string, string> = {
  low: "badge-risk-low",
  medium: "badge-risk-medium",
  high: "badge-risk-high",
};

const riskDotColor: Record<string, string> = {
  low: "bg-emerald-400",
  medium: "bg-amber-400",
  high: "bg-red-400",
};

const riskBarColor: Record<string, string> = {
  low: "from-emerald-500 to-emerald-400",
  medium: "from-amber-500 to-amber-400",
  high: "from-red-500 to-red-400",
};

export default async function DashboardPage() {
  const { totalPRs, totalRepos, recentPRs, riskCounts } = await getStats();

  const high = riskCounts.find((r) => r.riskLevel === "high")?._count ?? 0;
  const medium = riskCounts.find((r) => r.riskLevel === "medium")?._count ?? 0;
  const low = riskCounts.find((r) => r.riskLevel === "low")?._count ?? 0;

  const totalIssues = recentPRs.reduce((acc, pr) => acc + pr.issues.length, 0);

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
          <p className="text-gray-500 text-sm mt-1">
            Engineering intelligence at a glance
          </p>
        </div>
        <Link href="/dashboard/analyze" className="btn-primary text-sm !px-5 !py-2.5">
          <span className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Analyze PR
          </span>
        </Link>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Repositories"
          value={totalRepos}
          icon={FolderGit2}
          gradient="from-brand-500/20 to-brand-600/5"
          iconColor="text-brand-400"
          trend="+2 this week"
        />
        <StatCard
          label="PRs Reviewed"
          value={totalPRs}
          icon={GitPullRequest}
          gradient="from-cyan-500/20 to-cyan-600/5"
          iconColor="text-cyan-400"
          trend={`${recentPRs.length} recent`}
        />
        <StatCard
          label="High Risk PRs"
          value={high}
          icon={AlertTriangle}
          gradient="from-red-500/20 to-red-600/5"
          iconColor="text-red-400"
          trend="Needs attention"
          trendColor="text-red-400/60"
        />
        <StatCard
          label="Issues Found"
          value={totalIssues}
          icon={ShieldCheck}
          gradient="from-emerald-500/20 to-emerald-600/5"
          iconColor="text-emerald-400"
          trend="Across recent PRs"
        />
      </div>

      {/* ── Risk Distribution + Quick Actions ── */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Risk Distribution */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold text-white">Risk Distribution</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Across {totalPRs} reviewed pull requests
              </p>
            </div>
            <div className="badge-info">
              <TrendingUp className="w-3 h-3" />
              <span>{totalPRs} total</span>
            </div>
          </div>

          {totalPRs > 0 ? (
            <div className="space-y-5">
              {[
                { level: "high", count: high, label: "High Risk" },
                { level: "medium", count: medium, label: "Medium Risk" },
                { level: "low", count: low, label: "Low Risk" },
              ].map(({ level, count, label }) => (
                <div key={level}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${riskDotColor[level]}`} />
                      <span className="text-sm text-gray-300">{label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">{count}</span>
                      <span className="text-xs text-gray-600">
                        ({totalPRs > 0 ? ((count / totalPRs) * 100).toFixed(0) : 0}%)
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${riskBarColor[level]} transition-all duration-700`}
                      style={{
                        width: totalPRs > 0 ? `${(count / totalPRs) * 100}%` : "0%",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-600">
              <div className="text-3xl mb-3">📊</div>
              <p className="text-sm">No PR data yet. Analyze your first PR to see risk distribution.</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="font-semibold text-white mb-5">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              href="/dashboard/analyze"
              className="group flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-brand-500/20 hover:bg-brand-500/5 transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-600/10 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-brand-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white">Analyze a PR</div>
                <div className="text-xs text-gray-500">Manual review with AI</div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-brand-400 transition-colors" />
            </Link>

            <Link
              href="/dashboard/health"
              className="group flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-emerald-500/20 hover:bg-emerald-500/5 transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white">Repo Health</div>
                <div className="text-xs text-gray-500">Check quality scores</div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-emerald-400 transition-colors" />
            </Link>

            <Link
              href="/dashboard/reviews"
              className="group flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-cyan-500/20 hover:bg-cyan-500/5 transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 flex items-center justify-center flex-shrink-0">
                <GitPullRequest className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white">View Reviews</div>
                <div className="text-xs text-gray-500">Browse PR history</div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-cyan-400 transition-colors" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Recent PR Reviews ── */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-white/[0.04]">
          <div>
            <h2 className="font-semibold text-white">Recent PR Reviews</h2>
            <p className="text-xs text-gray-500 mt-0.5">Latest analyzed pull requests</p>
          </div>
          <Link
            href="/dashboard/reviews"
            className="text-brand-400 text-sm hover:text-brand-300 transition-colors flex items-center gap-1 group"
          >
            View all
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {recentPRs.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-brand-500/10 to-brand-600/5 flex items-center justify-center">
              <Zap className="w-8 h-8 text-brand-400/60" />
            </div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No PRs reviewed yet</h3>
            <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
              Connect your GitHub repo via webhook or use the manual analyzer to get started with your first code review.
            </p>
            <Link href="/dashboard/analyze" className="btn-primary text-sm !px-6 !py-3">
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Analyze Your First PR
              </span>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {recentPRs.map((pr) => (
              <div
                key={pr.id}
                className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors"
              >
                {/* Risk dot */}
                <div className="relative flex-shrink-0">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${riskDotColor[pr.riskLevel || "low"] || "bg-gray-500"
                      }`}
                  />
                  <div
                    className={`absolute inset-0 w-2.5 h-2.5 rounded-full animate-ping opacity-40 ${riskDotColor[pr.riskLevel || "low"] || "bg-gray-500"
                      }`}
                  />
                </div>

                {/* PR info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-white truncate">{pr.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500 font-mono">
                      {pr.repository.fullName}
                    </span>
                    <span className="text-gray-700">·</span>
                    <span className="text-xs text-gray-500">#{pr.prNumber}</span>
                    <span className="text-gray-700">·</span>
                    <span className="text-xs text-gray-500">{pr.author}</span>
                  </div>
                </div>

                {/* Right info */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {pr.issues.length}
                  </div>
                  {pr.riskLevel && (
                    <span className={riskBadgeClass[pr.riskLevel]}>
                      {pr.riskLevel}
                    </span>
                  )}
                  <div className="text-xs text-gray-600 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(pr.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Stat Card Component ── */
function StatCard({
  label,
  value,
  icon: Icon,
  gradient,
  iconColor,
  trend,
  trendColor = "text-gray-600",
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  gradient: string;
  iconColor: string;
  trend: string;
  trendColor?: string;
}) {
  return (
    <div className="glass-card-hover rounded-2xl p-5 group relative overflow-hidden">
      {/* Background gradient on hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}
          >
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
          <ArrowUpRight className="w-4 h-4 text-gray-700 group-hover:text-gray-400 transition-colors" />
        </div>
        <div className="text-3xl font-bold stat-number mb-1">{value}</div>
        <div className="text-sm text-gray-500">{label}</div>
        <div className={`text-xs mt-2 ${trendColor}`}>{trend}</div>
      </div>
    </div>
  );
}
