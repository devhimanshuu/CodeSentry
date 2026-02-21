// app/api/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { fetchPRFiles, buildDiffSummary, buildReviewComment, postPRComment, GitHubPRPayload } from "@/lib/github";
import { runRuleEngine, DiffFile } from "@/lib/rules/engine";
import { calculateRiskScore } from "@/lib/rules/scoring";
import { runAIReview, Persona } from "@/lib/ai/reviewer";
import crypto from "crypto";

function verifySignature(payload: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(payload);
  const digest = `sha256=${hmac.digest("hex")}`;
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-hub-signature-256") || "";
  const event = req.headers.get("x-github-event");

  // Verify webhook signature (skip if secret not set — dev mode)
  const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;
  if (webhookSecret && signature) {
    if (!verifySignature(rawBody, signature, webhookSecret)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  if (event !== "pull_request") {
    return NextResponse.json({ message: "Event ignored" }, { status: 200 });
  }

  let payload: GitHubPRPayload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Only process opened/synchronize events
  if (!["opened", "synchronize", "reopened"].includes(payload.action)) {
    return NextResponse.json({ message: "PR action ignored" }, { status: 200 });
  }

  const pr = payload.pull_request;
  const repo = payload.repository;

  try {
    // Upsert repository
    const dbRepo = await prisma.repository.upsert({
      where: { githubId: repo.id },
      create: {
        githubId: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description,
        defaultBranch: repo.default_branch,
      },
      update: { name: repo.name, description: repo.description },
    });

    // Upsert PR record
    const dbPR = await prisma.pullRequest.upsert({
      where: {
        repositoryId_prNumber: {
          repositoryId: dbRepo.id,
          prNumber: pr.number,
        },
      },
      create: {
        prNumber: pr.number,
        title: pr.title,
        author: pr.user.login,
        repositoryId: dbRepo.id,
        status: pr.state,
        filesChanged: pr.changed_files,
        additions: pr.additions,
        deletions: pr.deletions,
      },
      update: {
        title: pr.title,
        status: pr.state,
        filesChanged: pr.changed_files,
        additions: pr.additions,
        deletions: pr.deletions,
      },
    });

    // Fetch changed files
    const files = await fetchPRFiles(repo.full_name, pr.number);

    const diffFiles: DiffFile[] = files.map((f) => ({
      filename: f.filename,
      patch: f.patch,
      additions: f.additions,
      deletions: f.deletions,
      status: f.status,
    }));

    // Run rule engine
    const ruleIssues = runRuleEngine(diffFiles);

    // Calculate risk score
    const risk = calculateRiskScore(ruleIssues);

    // Run AI review
    const persona: Persona = (dbPR.persona as Persona) || "default";
    const aiReview = await runAIReview({
      prTitle: pr.title,
      prDescription: pr.body || "",
      diffSummary: buildDiffSummary(files),
      ruleIssues,
      persona,
    });

    // Persist issues
    if (ruleIssues.length > 0) {
      await prisma.pRIssue.createMany({
        data: ruleIssues.map((i) => ({
          pullRequestId: dbPR.id,
          severity: i.severity,
          category: i.category,
          title: i.title,
          description: i.description,
          filePath: i.filePath,
          lineNumber: i.lineNumber,
          suggestion: i.suggestion,
          ruleId: i.ruleId,
        })),
      });
    }

    // Update PR with scores
    await prisma.pullRequest.update({
      where: { id: dbPR.id },
      data: {
        riskLevel: risk.level,
        riskScore: risk.score,
        aiConfidence: aiReview.confidence,
      },
    });

    // Save review
    await prisma.pRReview.create({
      data: {
        pullRequestId: dbPR.id,
        summary: aiReview.summary,
        persona,
      },
    });

    // Post comment to GitHub PR
    const comment = buildReviewComment({
      summary: aiReview.summary,
      riskLevel: risk.level,
      riskScore: risk.score,
      confidence: aiReview.confidence,
      issues: ruleIssues,
      persona,
    });

    await postPRComment(repo.full_name, pr.number, comment);

    return NextResponse.json({
      success: true,
      prId: dbPR.id,
      riskLevel: risk.level,
      riskScore: risk.score,
      issueCount: ruleIssues.length,
    });
  } catch (err) {
    console.error("Webhook processing error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
