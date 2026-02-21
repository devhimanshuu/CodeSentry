// lib/ai/reviewer.ts
import { RuleIssue } from "@/lib/rules/engine";

export type Persona = "default" | "security" | "cto" | "performance" | "roast";

const PERSONA_PROMPTS: Record<Persona, string> = {
  default: `You are a senior software engineer reviewing a pull request. Be thorough, professional, and constructive.`,
  security: `You are a paranoid security engineer. Your job is to find every possible vulnerability, attack vector, or data leak. Be extremely thorough about security issues. Think like an attacker.`,
  cto: `You are a pragmatic startup CTO. Balance speed vs stability. Acknowledge when something works and call out genuine blockers. Don't nitpick style — focus on what matters for shipping.`,
  performance: `You are a performance architect obsessed with scalability. Identify every possible bottleneck, N+1 query, memory leak, or inefficient algorithm. Think about what happens at 100x scale.`,
  roast: `You are a brutally honest code reviewer. Roast the code mercilessly but still give actionable feedback. Be funny but don't be cruel. Think Silicon Valley's Gilfoyle reviewing code.`,
};

export interface AIReviewResult {
  summary: string;
  confidence: number; // 0–1
  additionalInsights: string[];
}

export async function runAIReview(params: {
  prTitle: string;
  prDescription: string;
  diffSummary: string;
  ruleIssues: RuleIssue[];
  persona: Persona;
}): Promise<AIReviewResult> {
  const { prTitle, prDescription, diffSummary, ruleIssues, persona } = params;

  const issuesSummary = ruleIssues
    .map((i) => `[${i.severity.toUpperCase()}][${i.category}] ${i.title}: ${i.description}`)
    .join("\n");

  const systemPrompt = PERSONA_PROMPTS[persona];

  const userPrompt = `
PR Title: ${prTitle}
PR Description: ${prDescription || "No description provided."}

Diff Summary:
${diffSummary}

Rule Engine found these issues:
${issuesSummary || "No rule-based issues found."}

Please provide:
1. A concise PR review summary (2–4 paragraphs)
2. Any additional insights the rule engine may have missed
3. Overall assessment

Format your response as JSON:
{
  "summary": "...",
  "additionalInsights": ["insight 1", "insight 2"],
  "confidence": 0.85
}
`.trim();

  try {
    const apiKey = process.env.GROQ_API_KEY;
    const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

    if (!apiKey) {
      return generateFallbackReview(ruleIssues, persona);
    }

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.4,
        max_tokens: 1024,
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      console.error("Groq API error:", await res.text());
      return generateFallbackReview(ruleIssues, persona);
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) return generateFallbackReview(ruleIssues, persona);

    const parsed = JSON.parse(content);
    return {
      summary: parsed.summary || "Review complete.",
      confidence: parsed.confidence ?? 0.75,
      additionalInsights: parsed.additionalInsights || [],
    };
  } catch (err) {
    console.error("AI review error:", err);
    return generateFallbackReview(ruleIssues, persona);
  }
}

function generateFallbackReview(issues: RuleIssue[], persona: Persona): AIReviewResult {
  const criticalCount = issues.filter((i) => i.severity === "critical").length;
  const highCount = issues.filter((i) => i.severity === "high").length;

  let summary = `Rule-based analysis complete. Found ${issues.length} issue(s): ${criticalCount} critical, ${highCount} high severity.`;

  if (criticalCount > 0) {
    summary += " Critical issues must be resolved before merging.";
  } else if (issues.length === 0) {
    summary += " No significant issues detected — this PR looks clean!";
  }

  if (persona === "roast" && issues.length > 3) {
    summary += " Whoever wrote this needs to re-read the OWASP top 10... and possibly a career counselor.";
  }

  return {
    summary,
    confidence: 0.6,
    additionalInsights: ["AI review skipped — no API key configured. Add GROQ_API_KEY to .env."],
  };
}
