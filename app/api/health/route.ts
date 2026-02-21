// app/api/health/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { deriveHealthMetrics, calculateRepoHealthScore } from "@/lib/rules/scoring";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const repoFullName = searchParams.get("repo");

  try {
    if (repoFullName) {
      // Single repo health
      const repo = await prisma.repository.findUnique({
        where: { fullName: repoFullName },
        include: {
          pullRequests: {
            include: { issues: true },
            orderBy: { createdAt: "desc" },
            take: 10,
          },
          healthChecks: {
            orderBy: { createdAt: "desc" },
            take: 5,
          },
        },
      });

      if (!repo) {
        return NextResponse.json({ error: "Repository not found" }, { status: 404 });
      }

      const allRecentIssues = repo.pullRequests.flatMap((pr) => pr.issues);
      const metrics = deriveHealthMetrics(allRecentIssues as any);
      const overallScore = calculateRepoHealthScore(metrics);

      return NextResponse.json({ repo, metrics, overallScore });
    }

    // All repos summary
    const repos = await prisma.repository.findMany({
      include: {
        _count: { select: { pullRequests: true } },
        pullRequests: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { riskLevel: true, riskScore: true, createdAt: true },
        },
      },
    });

    return NextResponse.json({ repos });
  } catch (err) {
    console.error("Health API error:", err);
    return NextResponse.json({ error: "Failed to fetch health data" }, { status: 500 });
  }
}
