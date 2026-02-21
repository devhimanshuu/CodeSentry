// app/api/analyze/route.ts
// Manual PR analysis endpoint — useful for testing without webhook setup

import { NextRequest, NextResponse } from "next/server";
import { fetchPRFiles, buildDiffSummary, buildReviewComment } from "@/lib/github";
import { runRuleEngine, DiffFile } from "@/lib/rules/engine";
import { calculateRiskScore } from "@/lib/rules/scoring";
import { runAIReview, Persona } from "@/lib/ai/reviewer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { repoFullName, prNumber, persona = "default" } = body;

    if (!repoFullName || !prNumber) {
      return NextResponse.json(
        { error: "repoFullName and prNumber are required" },
        { status: 400 }
      );
    }

    const files = await fetchPRFiles(repoFullName, prNumber);

    const diffFiles: DiffFile[] = files.map((f) => ({
      filename: f.filename,
      patch: f.patch,
      additions: f.additions,
      deletions: f.deletions,
      status: f.status,
    }));

    const ruleIssues = runRuleEngine(diffFiles);
    const risk = calculateRiskScore(ruleIssues);
    const aiReview = await runAIReview({
      prTitle: `PR #${prNumber}`,
      prDescription: "",
      diffSummary: buildDiffSummary(files),
      ruleIssues,
      persona: persona as Persona,
    });

    const comment = buildReviewComment({
      summary: aiReview.summary,
      riskLevel: risk.level,
      riskScore: risk.score,
      confidence: aiReview.confidence,
      issues: ruleIssues,
      persona,
    });

    return NextResponse.json({
      risk,
      issues: ruleIssues,
      aiReview,
      markdownComment: comment,
    });
  } catch (err) {
    console.error("Analyze error:", err);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
