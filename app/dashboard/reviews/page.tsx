// app/dashboard/reviews/page.tsx
import { prisma } from "@/lib/db";

const severityColors: Record<string, string> = {
  critical: "text-red-400",
  high: "text-orange-400",
  medium: "text-yellow-400",
  low: "text-blue-400",
  info: "text-gray-400",
};

const riskBadge: Record<string, string> = {
  low: "bg-green-900/40 text-green-400 border border-green-800",
  medium: "bg-yellow-900/40 text-yellow-400 border border-yellow-800",
  high: "bg-red-900/40 text-red-400 border border-red-800",
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
          select: { summary: true },
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
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">PR Reviews</h1>
        <p className="text-gray-500 text-sm mt-1">{prs.length} pull requests reviewed</p>
      </div>

      {prs.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-10 text-center text-gray-500">
          No reviews yet. Set up your webhook or use the Analyze tool.
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
                className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-gray-500 text-sm">#{pr.prNumber}</span>
                      {pr.riskLevel && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${riskBadge[pr.riskLevel]}`}>
                          {pr.riskLevel} risk
                        </span>
                      )}
                      <span className="text-gray-600 text-xs">
                        Score: {pr.riskScore?.toFixed(0) ?? "—"}/100
                      </span>
                    </div>
                    <h3 className="font-semibold truncate">{pr.title}</h3>
                    <p className="text-gray-500 text-xs mt-1">
                      {pr.repository.fullName} · by {pr.author} ·{" "}
                      {new Date(pr.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-medium">{pr.issues.length} issues</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      +{pr.additions} / -{pr.deletions}
                    </div>
                  </div>
                </div>

                {/* Severity breakdown */}
                {Object.keys(bySeverity).length > 0 && (
                  <div className="flex gap-3 mt-3 flex-wrap">
                    {Object.entries(bySeverity).map(([sev, count]) => (
                      <span key={sev} className={`text-xs ${severityColors[sev]}`}>
                        {count} {sev}
                      </span>
                    ))}
                  </div>
                )}

                {/* AI Summary */}
                {pr.reviews[0]?.summary && (
                  <p className="mt-3 text-sm text-gray-400 line-clamp-2 border-t border-gray-800 pt-3">
                    {pr.reviews[0].summary}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
