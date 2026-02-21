// app/dashboard/health/page.tsx
import { prisma } from "@/lib/db";
import { deriveHealthMetrics, calculateRepoHealthScore } from "@/lib/rules/scoring";

async function getRepoHealth() {
  try {
    const repos = await prisma.repository.findMany({
      include: {
        pullRequests: {
          include: { issues: true },
          orderBy: { createdAt: "desc" },
          take: 20,
        },
        _count: { select: { pullRequests: true } },
      },
    });

    return repos.map((repo) => {
      const allIssues = repo.pullRequests.flatMap((pr) => pr.issues);
      const metrics = deriveHealthMetrics(allIssues as any);
      const overallScore = calculateRepoHealthScore(metrics);
      return { ...repo, metrics, overallScore };
    });
  } catch {
    return [];
  }
}

function ScoreBar({ label, value, colorClass }: { label: string; value: number; colorClass: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>{label}</span>
        <span>{value.toFixed(0)}</span>
      </div>
      <div className="bg-gray-800 rounded-full h-1.5">
        <div className={`${colorClass} h-1.5 rounded-full`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default async function HealthPage() {
  const repos = await getRepoHealth();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Repository Health</h1>
        <p className="text-gray-500 text-sm mt-1">Weighted quality index across your repositories</p>
      </div>

      {repos.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-10 text-center text-gray-500">
          No repositories tracked yet. Connect a GitHub webhook to get started.
        </div>
      ) : (
        <div className="grid gap-4">
          {repos.map((repo) => {
            const scoreColor =
              repo.overallScore >= 70
                ? "text-green-400"
                : repo.overallScore >= 40
                ? "text-yellow-400"
                : "text-red-400";

            return (
              <div key={repo.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">{repo.fullName}</h3>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {repo._count.pullRequests} PRs reviewed · {repo.defaultBranch}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${scoreColor}`}>{repo.overallScore}</div>
                    <div className="text-xs text-gray-500">Health Score</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <ScoreBar label="Code Quality" value={repo.metrics.codeQuality} colorClass="bg-blue-500" />
                  <ScoreBar label="Maintainability" value={repo.metrics.maintainability} colorClass="bg-violet-500" />
                  <ScoreBar label="Test Coverage" value={repo.metrics.testCoverage} colorClass="bg-emerald-500" />
                  <ScoreBar
                    label="Security Risk"
                    value={100 - repo.metrics.securityRisk}
                    colorClass="bg-orange-500"
                  />
                  <ScoreBar
                    label="Performance Risk"
                    value={100 - repo.metrics.performanceRisk}
                    colorClass="bg-pink-500"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
