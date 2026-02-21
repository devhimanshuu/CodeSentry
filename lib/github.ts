// lib/github.ts

export interface GitHubPRPayload {
  action: string;
  number: number;
  pull_request: {
    id: number;
    number: number;
    title: string;
    body: string | null;
    state: string;
    user: { login: string };
    head: { sha: string; ref: string };
    base: { sha: string; ref: string };
    additions: number;
    deletions: number;
    changed_files: number;
    html_url: string;
  };
  repository: {
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    default_branch: string;
  };
}

export interface GitHubFile {
  filename: string;
  status: string;
  additions: number;
  deletions: number;
  changes: number;
  patch?: string;
}

export async function fetchPRFiles(
  repoFullName: string,
  prNumber: number
): Promise<GitHubFile[]> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.warn("GITHUB_TOKEN not set — returning mock files");
    return getMockFiles();
  }

  const res = await fetch(
    `https://api.github.com/repos/${repoFullName}/pulls/${prNumber}/files`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function postPRComment(
  repoFullName: string,
  prNumber: number,
  body: string
): Promise<void> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.warn("GITHUB_TOKEN not set — skipping PR comment");
    return;
  }

  const res = await fetch(
    `https://api.github.com/repos/${repoFullName}/issues/${prNumber}/comments`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ body }),
    }
  );

  if (!res.ok) {
    console.error("Failed to post PR comment:", await res.text());
  }
}

export function buildReviewComment(params: {
  summary: string;
  riskLevel: string;
  riskScore: number;
  confidence: number;
  issues: Array<{ severity: string; title: string; description: string; filePath?: string; suggestion?: string }>;
  persona: string;
}): string {
  const { summary, riskLevel, riskScore, confidence, issues, persona } = params;

  const riskEmoji = { low: "🟢", medium: "🟡", high: "🔴" }[riskLevel] || "⚪";
  const personaLabel =
    { default: "Senior Engineer", security: "Security Engineer", cto: "Startup CTO", performance: "Performance Architect", roast: "Roast Mode" }[persona] || "AI Review";

  const issueRows = issues
    .slice(0, 10) // cap at 10
    .map((i) => {
      const emoji = { critical: "🚨", high: "❗", medium: "⚠️", low: "💡", info: "ℹ️" }[i.severity] || "•";
      return `| ${emoji} ${i.severity} | ${i.title} | ${i.filePath || "—"} |`;
    })
    .join("\n");

  return `## 🛡️ CodeSentry Review — ${personaLabel}

> ${riskEmoji} **Risk Level: ${riskLevel.toUpperCase()}** | Score: ${riskScore}/100 | Confidence: ${Math.round(confidence * 100)}%

### Summary
${summary}

${
  issues.length > 0
    ? `### Issues Found (${issues.length})

| Severity | Issue | File |
|----------|-------|------|
${issueRows}

${issues.length > 10 ? `\n_...and ${issues.length - 10} more. See dashboard for full report._` : ""}`
    : "### ✅ No significant issues detected"
}

---
_Reviewed by [CodeSentry](https://github.com/your-repo/codesentry) • ${new Date().toUTCString()}_`;
}

function getMockFiles(): GitHubFile[] {
  return [
    {
      filename: "src/auth.ts",
      status: "modified",
      additions: 20,
      deletions: 5,
      changes: 25,
      patch: `@@ -1,5 +1,25 @@\n+const password = "admin123";\n+eval(userInput);\n+// TODO: fix this hack\n+console.log("token:", token);`,
    },
    {
      filename: "src/api/users.ts",
      status: "added",
      additions: 50,
      deletions: 0,
      changes: 50,
      patch: `@@ -0,0 +1,50 @@\n+async function getUsers() {\n+  const result = await db.query("SELECT * FROM users");\n+  return result;\n+}`,
    },
  ];
}

export function buildDiffSummary(files: GitHubFile[]): string {
  return files
    .map((f) => `${f.filename} (+${f.additions}/-${f.deletions})`)
    .join(", ");
}
