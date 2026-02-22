export type Severity = "critical" | "high" | "medium" | "low" | "info";
export type Category =
	| "security"
	| "performance"
	| "logic"
	| "style"
	| "maintainability";

export interface RuleIssue {
	severity: Severity;
	category: Category;
	title: string;
	description: string;
	filePath?: string;
	lineNumber?: number;
	suggestion?: string;
	ruleId: string;
}

export interface DiffFile {
	filename: string;
	patch?: string;
	additions: number;
	deletions: number;
	status: string;
}

// ─── Security Rules ────────────────────────────────────────────────────────

const SECURITY_PATTERNS = [
	{
		ruleId: "SEC-001",
		pattern: /password\s*=\s*['"][^'"]+['"]/gi,
		title: "Hardcoded Password",
		description: "A hardcoded password was detected in the code.",
		suggestion: "Use environment variables or a secrets manager instead.",
		severity: "critical" as Severity,
	},
	{
		ruleId: "SEC-002",
		pattern: /api[_-]?key\s*=\s*['"][^'"]+['"]/gi,
		title: "Hardcoded API Key",
		description: "An API key appears to be hardcoded in the source.",
		suggestion:
			"Store API keys in environment variables (e.g., process.env.API_KEY).",
		severity: "critical" as Severity,
	},
	{
		ruleId: "SEC-003",
		pattern: /eval\s*\(/g,
		title: "Use of eval()",
		description: "eval() can execute arbitrary code and is a security risk.",
		suggestion:
			"Replace eval() with safer alternatives like JSON.parse() or Function constructors.",
		severity: "high" as Severity,
	},
	{
		ruleId: "SEC-004",
		pattern: /innerHTML\s*=/g,
		title: "innerHTML Assignment",
		description: "Direct innerHTML assignment can lead to XSS vulnerabilities.",
		suggestion: "Use textContent, innerText, or a sanitization library.",
		severity: "high" as Severity,
	},
	{
		ruleId: "SEC-005",
		pattern: /dangerouslySetInnerHTML/g,
		title: "dangerouslySetInnerHTML Usage",
		description: "dangerouslySetInnerHTML bypasses React's XSS protection.",
		suggestion:
			"Sanitize user input with DOMPurify before using dangerouslySetInnerHTML.",
		severity: "medium" as Severity,
	},
	{
		ruleId: "SEC-006",
		pattern: /console\.log\s*\(.*?(token|secret|password|key)/gi,
		title: "Sensitive Data Logging",
		description: "Sensitive data may be logged to the console.",
		suggestion:
			"Remove logs containing sensitive information before deploying.",
		severity: "high" as Severity,
	},
	{
		ruleId: "SEC-007",
		pattern: /Math\.random\(\)/g,
		title: "Weak Randomness",
		description: "Math.random() is not cryptographically secure.",
		suggestion:
			"Use crypto.getRandomValues() or Node's crypto.randomBytes() for security tokens.",
		severity: "medium" as Severity,
	},
];

// ─── Performance Rules ─────────────────────────────────────────────────────

const PERFORMANCE_PATTERNS = [
	{
		ruleId: "PERF-001",
		pattern: /SELECT\s+\*/gi,
		title: "SELECT * Usage",
		description:
			"Using SELECT * fetches all columns, which can be inefficient.",
		suggestion: "Select only the columns you need.",
		severity: "medium" as Severity,
	},
	{
		ruleId: "PERF-002",
		pattern: /\.forEach\s*\(.*await/gs,
		title: "Await Inside forEach",
		description:
			"Using await inside forEach doesn't work as expected and can cause performance issues.",
		suggestion: "Use Promise.all() with .map() for parallel async operations.",
		severity: "high" as Severity,
	},
	{
		ruleId: "PERF-003",
		pattern: /new\s+Array\s*\(\d{4,}\)/g,
		title: "Large Static Array Allocation",
		description: "Allocating a large static array may cause memory pressure.",
		suggestion: "Use lazy generation or streams for large data sets.",
		severity: "low" as Severity,
	},
];

// ─── Maintainability Rules ─────────────────────────────────────────────────

const MAINTAINABILITY_PATTERNS = [
	{
		ruleId: "MAINT-001",
		pattern: /TODO|FIXME|HACK|XXX/g,
		title: "TODO / Technical Debt Marker",
		description: "TODO/FIXME comments indicate unresolved technical debt.",
		suggestion: "Resolve the issue or create a tracked ticket before merging.",
		severity: "info" as Severity,
	},
	{
		ruleId: "MAINT-002",
		pattern: /console\.(log|warn|error|debug)\(/g,
		title: "Console Statement Left In Code",
		description: "console statements should be removed before production.",
		suggestion:
			"Use a structured logger (e.g., pino, winston) instead of console.",
		severity: "low" as Severity,
	},
	{
		ruleId: "MAINT-003",
		pattern: /\/\/ @ts-ignore/g,
		title: "TypeScript Error Suppression",
		description: "@ts-ignore silences TypeScript errors without fixing them.",
		suggestion:
			"Fix the underlying type error or use a more specific suppression with a comment.",
		severity: "medium" as Severity,
	},
];

// ─── Logic Rules ───────────────────────────────────────────────────────────

const LOGIC_PATTERNS = [
	{
		ruleId: "LOGIC-001",
		pattern: /catch\s*\([^)]*\)\s*\{\s*\}/g,
		title: "Empty Catch Block",
		description: "An empty catch block silently swallows errors.",
		suggestion: "Log the error or handle it explicitly.",
		severity: "high" as Severity,
	},
	{
		ruleId: "LOGIC-002",
		pattern: /==\s+null|==\s+undefined/g,
		title: "Loose Equality with null/undefined",
		description: "Using == with null/undefined can produce unexpected results.",
		suggestion: "Use === for strict equality checks.",
		severity: "low" as Severity,
	},
];

// ─── File-level checks ─────────────────────────────────────────────────────

function checkFileLevel(file: DiffFile): RuleIssue[] {
	const issues: RuleIssue[] = [];

	// Large file change warning
	if (file.additions + file.deletions > 500) {
		issues.push({
			ruleId: "ARCH-001",
			severity: "medium",
			category: "maintainability",
			title: "Very Large Change Set",
			description: `This file changed by ${file.additions + file.deletions} lines, which makes review difficult.`,
			suggestion: "Consider breaking this PR into smaller, focused changes.",
			filePath: file.filename,
		});
	}

	// Binary / lock file
	if (
		file.filename.endsWith("package-lock.json") ||
		file.filename.endsWith("yarn.lock")
	) {
		issues.push({
			ruleId: "MAINT-004",
			severity: "info",
			category: "maintainability",
			title: "Lock File Modified",
			description:
				"Package lock file was modified — verify dependency changes are intentional.",
			suggestion: "Review added/removed packages for security advisories.",
			filePath: file.filename,
		});
	}

	return issues;
}

// ─── Main Runner ───────────────────────────────────────────────────────────

export function runRuleEngine(files: DiffFile[]): RuleIssue[] {
	const allIssues: RuleIssue[] = [];

	for (const file of files) {
		// File-level checks
		allIssues.push(...checkFileLevel(file));

		if (!file.patch) continue;

		const content = file.patch;
		const lines = content.split("\n");

		const allPatterns = [
			...SECURITY_PATTERNS.map((p) => ({
				...p,
				category: "security" as Category,
			})),
			...PERFORMANCE_PATTERNS.map((p) => ({
				...p,
				category: "performance" as Category,
			})),
			...MAINTAINABILITY_PATTERNS.map((p) => ({
				...p,
				category: "maintainability" as Category,
			})),
			...LOGIC_PATTERNS.map((p) => ({ ...p, category: "logic" as Category })),
		];

		for (const rule of allPatterns) {
			// Only check added lines (lines starting with +)
			const addedLines = lines.filter(
				(l) => l.startsWith("+") && !l.startsWith("+++"),
			);

			let lineNumber = 0;
			for (const line of addedLines) {
				lineNumber++;
				if (rule.pattern.test(line)) {
					// Avoid duplicate issues per file per rule
					const alreadyFound = allIssues.some(
						(i) => i.ruleId === rule.ruleId && i.filePath === file.filename,
					);
					if (!alreadyFound) {
						allIssues.push({
							ruleId: rule.ruleId,
							severity: rule.severity,
							category: rule.category,
							title: rule.title,
							description: rule.description,
							suggestion: rule.suggestion,
							filePath: file.filename,
							lineNumber,
						});
					}
				}
				rule.pattern.lastIndex = 0; // reset regex
			}
		}
	}

	return allIssues;
}
