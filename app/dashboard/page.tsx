// app/dashboard/page.tsx
import { prisma } from "@/lib/db";
import Link from "next/link";

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

const riskColors: Record<string, string> = {
  low: "text-green-400 bg-green-900/30",
  medium: "text-yellow-400 bg-yellow-900/30",
  high: "text-red-400 bg-red-900/30",
};

const riskDot: Record<string, string> = {
  low: "bg-green-400",
  medium: "bg-yellow-400",
  high: "bg-red-400",
};

export default async function DashboardPage() {
  const { totalPRs, totalRepos, recentPRs, riskCounts } = await getStats();

  const high = riskCounts.find((r) => r.riskLevel === "high")?._count ?? 0;
  const medium = riskCounts.find((r) => r.riskLevel === "medium")?._count ?? 0;
  const low = riskCounts.find((r) => r.riskLevel === "low")?._count ?? 0;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Engineering intelligence at a glance</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Repositories" value={totalRepos} icon="📁" />
        <StatCard label="PRs Reviewed" value={totalPRs} icon="🔍" />
        <StatCard label="High Risk PRs" value={high} icon="🔴" accent="text-red-400" />
        <StatCard label="Low Risk PRs" value={low} icon="🟢" accent="text-green-400" />
      </div>

      {/* Risk breakdown */}
      {totalPRs > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6">
          <h2 className="font-semibold mb-4 text-sm text-gray-400 uppercase tracking-wider">Risk Distribution</h2>
          <div className="space-y-3">
            {[
              { level: "high", count: high, color: "bg-red-500" },
              { level: "medium", count: medium, color: "bg-yellow-500" },
              { level: "low", count: low, color: "bg-green-500" },
            ].map(({ level, count, color }) => (
              <div key={level} className="flex items-center gap-3">
                <span className="w-16 text-xs text-gray-400 capitalize">{level}</span>
                <div className="flex-1 bg-gray-800 rounded-full h-2">
                  <div
                    className={`${color} h-2 rounded-full transition-all`}
                    style={{ width: totalPRs > 0 ? `${(count / totalPRs) * 100}%` : "0%" }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent PRs */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h2 className="font-semibold">Recent PR Reviews</h2>
          <Link href="/dashboard/reviews" className="text-blue-400 text-sm hover:text-blue-300">
            View all →
          </Link>
        </div>

        {recentPRs.length === 0 ? (
          <div className="p-10 text-center text-gray-600">
            <div className="text-4xl mb-3">🚀</div>
            <p className="font-medium text-gray-400">No PRs reviewed yet</p>
            <p className="text-sm mt-1">Connect your GitHub repo or use the Analyze tool to get started.</p>
            <Link
              href="/dashboard/analyze"
              className="inline-block mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm transition-colors"
            >
              Analyze a PR →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {recentPRs.map((pr) => (
              <div key={pr.id} className="p-4 flex items-center gap-4">
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    riskDot[pr.riskLevel || "low"] || "bg-gray-400"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{pr.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {pr.repository.fullName} · #{pr.prNumber} · {pr.author}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-gray-500">{pr.issues.length} issues</span>
                  {pr.riskLevel && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        riskColors[pr.riskLevel]
                      }`}
                    >
                      {pr.riskLevel}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label, value, icon, accent = "text-white",
}: {
  label: string; value: number; icon: string; accent?: string;
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div className="text-2xl mb-2">{icon}</div>
      <div className={`text-2xl font-bold ${accent}`}>{value}</div>
      <div className="text-gray-500 text-xs mt-1">{label}</div>
    </div>
  );
}
