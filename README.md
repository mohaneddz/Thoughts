![Thoughts](screenshots/cover.avif)

<h1 style="font-family: Arial, sans-serif; font-size: 36px; color: #6DA8F2; border-bottom: 3px solid #6DA8F2; padding-bottom: 8px;">
  Thoughts - Local-First Self-Reflection Platform
</h1>


**Thoughts** (package name `happy-healthy-human`) is a calm, local-first self-reflection app. It offers a catalog of clinical-style self-assessment screeners, informal reflection quizzes, and personality inventories, alongside check-ins and saved-thought journaling — all stored entirely in the browser. There are no accounts and no server-side data store; the only network call the app ever makes is an optional one to Groq for an AI-generated interpretation of a result.

This is an informational, non-clinical reflection tool. It does not diagnose, treat, or replace a conversation with a qualified professional.

## Key features

- **Screener catalog** — real, freely available clinical-style instruments:
  - Depression: PHQ-9, PHQ-8, PHQ-2
  - Anxiety: GAD-7, GAD-2
  - Stress & mood: DASS-21, DASS-42, PSS-10, WHO-5 Well-Being Index
  - Self-esteem: Rosenberg Self-Esteem Scale
  - Substance use: AUDIT, AUDIT-C
  - Trauma & risk: PCL-5 (PTSD Checklist), C-SSRS (Columbia Suicide Severity Rating Scale), MDQ (Mood Disorder Questionnaire)
  - Personality: IPIP Big Five (50 and 100 item), IPIP-NEO (120 and 300 item), IPIP Personality Scales curated pack
  - A set of lighter, non-clinical reflection quizzes (attachment style, overthinking, burnout, values clarity, emotional awareness, social battery, motivation style, habit loops, self-esteem, career direction, thinking style, decision-making style, conflict style, love language, inner critic)
- **Honest scoring** — every test declares whether a higher score is better, worse or neutral, so a high stress score never reads as good news. Screeners show your score on an interactive band scale; the Big Five, IPIP-NEO-120 (5 domains, 30 facets, published reverse keys) and the IPIP scale pack show a per-trait profile instead of a meaningless grand total. Scoring is covered by Vitest unit tests.
- **Crisis-aware result handling** — high-risk screeners (C-SSRS, PHQ-9 item 9, PCL-5, MDQ) surface dedicated safety messaging in results rather than a plain score.
- **Results history** — every finished test is kept at `/results`, retakes are charted over time, and any result can be deleted.
- **Interactive reflection tools** — an SVG emotion wheel, a values sorter with drag-to-rank, a weighted decision matrix, an energy drain map, and guided flows for overthinking, "why do I feel this?", conflict prep/debrief and habit loops. Anything you make can be saved to your thoughts.
- **Local-first privacy model** — identity (name, avatar, accent) and all data (test results, check-ins, saved thoughts, in-progress tests) live only in `localStorage`. No accounts, no sign-in, no backend database. JSON export, merge-import of a previous export, and one-step erase are built in.
- **Optional AI interpretation** — six interpretation modes plus a follow-up chat (`/api/ai/interpret`, `/api/ai/chat`). Only a zod-validated result summary is sent to Groq (test, score, range, subscales, crisis flag) — never individual answers, names or notes — and only when the user asks.
- **Check-ins and dashboard** — seven-slider daily check-in with a rule-based read, streaks, 7/30/365-day trend charts (dependency-free SVG) and editable history; the dashboard brings together weekly averages, trends, the latest result per test and recent thoughts.
- **Saved thoughts** — hand-written notes plus saved takeaways from results, tools and AI, with search, source filters and delete.
- **Collections & learn library** — guided paths and short articles that link straight to the relevant tests and tools.
- **Light/dark theme** with persisted preference.

### Not (yet) available

Commercial, copyrighted clinical instruments (MMPI, WAIS, MBTI, Rorschach, TAT, and similar) exist in the data model only as metadata placeholders with no item content, and are hidden from the catalog until they can be properly licensed.

## Routes

- `/` — landing
- `/tests`, `/tests/[slug]` — screener/quiz catalog and individual test flow (unknown or unlicensed slugs return 404)
- `/results`, `/results/[id]` — result history and a single result
- `/ai-interpreter` — Groq-powered interpretation and follow-up chat for a result
- `/check-in` — daily check-ins, trends and history
- `/dashboard` — streaks, averages, trends and latest results
- `/reflection-tools`, `/reflection-tools/[id]` — the eight interactive tools
- `/collections` — grouped/curated sets of tests
- `/learn` — informational articles
- `/saved-thoughts` — free-form saved notes
- `/profile` — local-only profile (name, avatar, accent)
- `/privacy` — privacy/data model explanation
- `/about` — about the project

## Tech stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Framer Motion
- TanStack Query
- Groq AI (optional interpretation calls)
- Zod (AI request validation)
- Vitest (unit tests)

## Status

Actively developed — see [ROADMAP.md](ROADMAP.md) for the full audit, bug list and phased plan. Scoring correctness, interactive tools, tracking and the AI rework are done; next up is content (rewriting the 15 templated reflection tests, article bodies, more open instruments, region-aware crisis lines) and broader test coverage. The commercial personality/clinical instruments remain gated pending licensing.

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Create environment file:

```bash
cp .env.example .env
```

3. Fill required variables in `.env`:

- `GROQ_API_KEY` — required only for AI interpretation
- `GROQ_MODEL`
- `NEXT_PUBLIC_APP_URL`

## Run

```bash
pnpm dev
```

Serves on [http://localhost:27384](http://localhost:27384). `pnpm start` uses the same port.

## Quality checks

```bash
pnpm lint
pnpm test
pnpm build
```

## Notes

- Everything except AI interpretation runs entirely on-device; the only outbound call is to Groq, and only when a user asks for an interpretation.
- App language and disclaimers are explicitly non-clinical and reflection-focused — this is not a diagnostic tool.
- A handful of tests are real, freely available clinical screeners offered for informational reflection only, not clinical use. Commercial instruments are metadata-only placeholders with no item content and stay hidden from the catalog until properly licensed.
