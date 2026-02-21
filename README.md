# 🛡️ CodeSentry — Phase 1

> AI-powered engineering intelligence platform: automated PR review, risk scoring, and repository health monitoring.

## What's in Phase 1

| Feature | Status |
|---|---|
| GitHub Webhook listener | ✅ |
| Rule-based diff analysis (25+ rules) | ✅ |
| AI review via Groq (free tier) | ✅ |
| Risk scoring (Low / Medium / High) | ✅ |
| Engineering Personas (5 modes) | ✅ |
| Auto GitHub PR comment posting | ✅ |
| Repository health score | ✅ |
| Dashboard (Overview, Reviews, Health) | ✅ |
| Manual PR analyze UI | ✅ |
| PostgreSQL via Prisma ORM | ✅ |

---

## Quick Setup

### 1. Prerequisites

- **Node.js** 18+
- **PostgreSQL** (local) or a [Supabase](https://supabase.com) free account
- **GitHub Personal Access Token** (for posting PR comments)
- **Groq API Key** (free at https://console.groq.com) for AI reviews

### 2. Install

```bash
cd codesentry
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
# PostgreSQL connection string
DATABASE_URL="postgresql://postgres:password@localhost:5432/codesentry"

# GitHub token — needs repo scope
GITHUB_TOKEN="ghp_your_token_here"

# Webhook secret (set this in your GitHub repo settings too)
GITHUB_WEBHOOK_SECRET="some-random-secret"

# Groq (free AI)
GROQ_API_KEY="gsk_your_key_here"
GROQ_MODEL="llama-3.3-70b-versatile"
```

### 4. Set up the database

```bash
npm run db:push      # Creates tables from Prisma schema
npm run db:generate  # Generates Prisma Client
```

To view your database visually:
```bash
npm run db:studio
```

### 5. Run the development server

```bash
npm run dev
```

Open http://localhost:3000

---

## Setting Up the GitHub Webhook

1. Go to your GitHub repo → **Settings → Webhooks → Add webhook**
2. Set **Payload URL**: `https://your-domain.com/api/webhook`
   - For local dev, use [ngrok](https://ngrok.com): `ngrok http 3000`
3. **Content type**: `application/json`
4. **Secret**: Same value as `GITHUB_WEBHOOK_SECRET` in your `.env`
5. **Events**: Select **Pull requests**
6. Click **Add webhook**

Now every PR opened/updated in that repo will be automatically reviewed!

---

## Manual PR Analysis (no webhook needed)

In the Dashboard → **Analyze PR** tab:
- Enter a public repo (e.g. `facebook/react`)
- Enter a PR number
- Pick a review persona
- Click **Run Analysis**

Or use the API directly:

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"repoFullName": "your/repo", "prNumber": 42, "persona": "security"}'
```

---

## API Reference

### `POST /api/webhook`
GitHub webhook endpoint. Receives PR events.

### `POST /api/analyze`
Manual PR analysis.

**Body:**
```json
{
  "repoFullName": "owner/repo",
  "prNumber": 42,
  "persona": "default"
}
```

**Personas:** `default` | `security` | `cto` | `performance` | `roast`

### `GET /api/health?repo=owner/repo`
Get repository health score and metrics.

### `GET /api/reviews`
List all reviewed PRs.

---

## Rule Engine Categories

The rule engine checks **added lines only** for:

| Category | Rules |
|---|---|
| 🔐 Security | Hardcoded passwords/keys, eval(), innerHTML, dangerous logging, weak randomness |
| ⚡ Performance | SELECT *, await-in-forEach, large array allocations |
| 🔧 Maintainability | TODOs, console.log, @ts-ignore, lock file changes |
| 🧠 Logic | Empty catch blocks, loose equality |
| 🏛️ Architecture | Large changesets (500+ lines) |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL + Prisma ORM |
| AI | Groq (Llama 3) / OpenRouter fallback |
| UI | Tailwind CSS |
| Hosting | Vercel + Supabase (recommended) |

---

## Project Structure

```
codesentry/
├── app/
│   ├── api/
│   │   ├── webhook/       # GitHub webhook handler
│   │   ├── analyze/       # Manual PR analysis
│   │   ├── health/        # Repo health API
│   │   └── reviews/       # PR reviews list
│   ├── dashboard/
│   │   ├── page.tsx       # Overview
│   │   ├── reviews/       # PR history
│   │   ├── health/        # Repo health
│   │   └── analyze/       # Manual analyzer UI
│   ├── layout.tsx
│   ├── page.tsx           # Landing page
│   └── globals.css
├── lib/
│   ├── db.ts              # Prisma client
│   ├── github.ts          # GitHub API + diff parser
│   ├── rules/
│   │   ├── engine.ts      # Rule-based checker (25+ rules)
│   │   └── scoring.ts     # Risk + health scoring
│   └── ai/
│       └── reviewer.ts    # LLM reasoning layer
├── prisma/
│   └── schema.prisma      # Database schema
├── .env.example
└── README.md
```

---

## Phase 2 Roadmap

- [ ] Authentication (GitHub OAuth)
- [ ] Code heatmap visualization (recharts)
- [ ] Architectural drift detection (circular deps, God classes)
- [ ] Technical debt trend tracking
- [ ] PR diff inline comment posting
- [ ] Slack / email notifications
- [ ] Multi-repo dashboard
- [ ] Custom rule configuration

---

## Deployment

### Vercel + Supabase (recommended)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add all env vars in Vercel dashboard
4. Use Supabase connection string for `DATABASE_URL`
5. Run `prisma db push` once against Supabase

---

## Contributing

Built for extensibility — add new rules in `lib/rules/engine.ts`, new personas in `lib/ai/reviewer.ts`.
