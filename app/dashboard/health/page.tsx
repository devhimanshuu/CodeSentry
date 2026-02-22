// app/dashboard/health/page.tsx
import { prisma } from "@/lib/db";
import { deriveHealthMetrics, calculateRepoHealthScore } from "@/lib/rules/scoring";
import {
  HeartPulse,
  ShieldCheck,
  Code2,
  Wrench,
  TestTube,
  Gauge,
  Lock,
  GitBranch,
  ArrowUpRight,
} from "lucide-react";

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

const metricConfig: Record<
  string,
  { label: string; icon: React.ElementType; color: string; gradient: string }
> = {
  codeQuality: {
    label: "Code Quality",
    icon: Code2,
    color: "text-brand-400",
    gradient: "from-brand-500 to-brand-400",
  },
  maintainability: {
    label: "Maintainability",
    icon: Wrench,
    color: "text-violet-400",
    gradient: "from-violet-500 to-violet-400",
  },
  testCoverage: {
    label: "Test Coverage",
    icon: TestTube,
    color: "text-emerald-400",
    gradient: "from-emerald-500 to-emerald-400",
  },
  securityRisk: {
    label: "Security Score",
    icon: Lock,
    color: "text-orange-400",
    gradient: "from-orange-500 to-orange-400",
  },
  performanceRisk: {
    label: "Performance Score",
    icon: Gauge,
    color: "text-pink-400",
    gradient: "from-pink-500 to-pink-400",
  },
};

function ScoreRing({
  score,
  size = 120,
}: {
  score: number;
  size?: number;
}) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const dashOffset = circumference - progress;

  const color =
    score >= 70
      ? "stroke-emerald-400"
      : score >= 40
        ? "stroke-amber-400"
        : "stroke-red-400";

  const glowColor =
    score >= 70
      ? "rgba(52,211,153,0.3)"
      : score >= 40
        ? "rgba(251,191,36,0.3)"
        : "rgba(248,113,113,0.3)";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="6"
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{
            filter: `drop-shadow(0 0 8px ${glowColor})`,
            transition: "stroke-dashoffset 1s ease-out",
          }}
        />
      </svg>
      {/* Center score */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold stat-number">{score}</span>
        <span className="text-[10px] text-gray-500 uppercase tracking-wider">Health</span>
      </div>
    </div>
  );
}

function MetricBar({
  label,
  value,
  icon: Icon,
  gradient,
  color,
  inverted = false,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  gradient: string;
  color: string;
  inverted?: boolean;
}) {
  const displayValue = inverted ? 100 - value : value;

  return (
    <div className="group">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className={`w-3.5 h-3.5 ${color}`} />
          <span className="text-xs text-gray-400 font-medium">{label}</span>
        </div>
        <span className="text-xs text-white font-semibold">{displayValue.toFixed(0)}</span>
      </div>
      <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-700 group-hover:opacity-90`}
          style={{ width: `${displayValue}%` }}
        />
      </div>
    </div>
  );
}

export default async function HealthPage() {
  const repos = await getRepoHealth();

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Repository Health</h1>
        <p className="text-gray-500 text-sm mt-1">
          Weighted quality index across your repositories
        </p>
      </div>

      {/* ── Repos ── */}
      {repos.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 flex items-center justify-center">
            <HeartPulse className="w-8 h-8 text-emerald-400/60" />
          </div>
          <h3 className="text-lg font-semibold text-gray-300 mb-2">No repositories tracked</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Connect a GitHub webhook to start monitoring repository health metrics automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {repos.map((repo) => (
            <div key={repo.id} className="glass-card-hover rounded-2xl overflow-hidden">
              <div className="p-6 md:p-8">
                {/* Header */}
                <div className="flex items-start justify-between gap-6 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-600/10 flex items-center justify-center flex-shrink-0 border border-brand-500/10">
                      <GitBranch className="w-6 h-6 text-brand-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{repo.fullName}</h3>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span>{repo._count.pullRequests} PRs reviewed</span>
                        <span className="text-gray-700">·</span>
                        <span className="font-mono">{repo.defaultBranch}</span>
                      </div>
                    </div>
                  </div>

                  <ScoreRing score={repo.overallScore} />
                </div>

                {/* Metric bars */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
                  <MetricBar
                    label="Code Quality"
                    value={repo.metrics.codeQuality}
                    icon={Code2}
                    color="text-brand-400"
                    gradient="from-brand-500 to-brand-400"
                  />
                  <MetricBar
                    label="Maintainability"
                    value={repo.metrics.maintainability}
                    icon={Wrench}
                    color="text-violet-400"
                    gradient="from-violet-500 to-violet-400"
                  />
                  <MetricBar
                    label="Test Coverage"
                    value={repo.metrics.testCoverage}
                    icon={TestTube}
                    color="text-emerald-400"
                    gradient="from-emerald-500 to-emerald-400"
                  />
                  <MetricBar
                    label="Security Score"
                    value={repo.metrics.securityRisk}
                    icon={Lock}
                    color="text-orange-400"
                    gradient="from-orange-500 to-orange-400"
                    inverted
                  />
                  <MetricBar
                    label="Performance Score"
                    value={repo.metrics.performanceRisk}
                    icon={Gauge}
                    color="text-pink-400"
                    gradient="from-pink-500 to-pink-400"
                    inverted
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
