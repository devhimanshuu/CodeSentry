// lib/rules/scoring.ts
import { RuleIssue } from "./engine";

export interface RiskScore {
  score: number;        // 0–100, higher = more risky
  level: "low" | "medium" | "high";
  severityBreakdown: Record<string, number>;
  categoryBreakdown: Record<string, number>;
}

const SEVERITY_WEIGHTS: Record<string, number> = {
  critical: 25,
  high: 15,
  medium: 7,
  low: 3,
  info: 1,
};

export function calculateRiskScore(issues: RuleIssue[]): RiskScore {
  const severityBreakdown: Record<string, number> = {
    critical: 0, high: 0, medium: 0, low: 0, info: 0,
  };
  const categoryBreakdown: Record<string, number> = {};

  let rawScore = 0;
  for (const issue of issues) {
    severityBreakdown[issue.severity] = (severityBreakdown[issue.severity] || 0) + 1;
    categoryBreakdown[issue.category] = (categoryBreakdown[issue.category] || 0) + 1;
    rawScore += SEVERITY_WEIGHTS[issue.severity] || 0;
  }

  // Normalize to 0–100
  const score = Math.min(100, rawScore);

  const level: RiskScore["level"] =
    score >= 60 ? "high" : score >= 25 ? "medium" : "low";

  return { score, level, severityBreakdown, categoryBreakdown };
}

export function calculateRepoHealthScore(params: {
  codeQuality: number;
  securityRisk: number;
  maintainability: number;
  testCoverage: number;
  performanceRisk: number;
}): number {
  const { codeQuality, securityRisk, maintainability, testCoverage, performanceRisk } = params;

  // Weighted average — security and quality matter most
  const weighted =
    codeQuality * 0.25 +
    (100 - securityRisk) * 0.3 +
    maintainability * 0.2 +
    testCoverage * 0.15 +
    (100 - performanceRisk) * 0.1;

  return Math.round(Math.max(0, Math.min(100, weighted)));
}

export function deriveHealthMetrics(recentIssues: RuleIssue[]): {
  codeQuality: number;
  securityRisk: number;
  maintainability: number;
  testCoverage: number;
  performanceRisk: number;
} {
  const secIssues = recentIssues.filter((i) => i.category === "security");
  const perfIssues = recentIssues.filter((i) => i.category === "performance");
  const maintIssues = recentIssues.filter((i) => i.category === "maintainability");

  return {
    codeQuality: Math.max(0, 100 - recentIssues.length * 3),
    securityRisk: Math.min(100, secIssues.length * 20),
    maintainability: Math.max(0, 100 - maintIssues.length * 5),
    testCoverage: 50, // placeholder until test detection is implemented
    performanceRisk: Math.min(100, perfIssues.length * 15),
  };
}
