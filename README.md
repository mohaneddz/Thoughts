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
- **Crisis-aware result handling** — high-risk screeners (C-SSRS, PHQ-9 item 9, PCL-5, MDQ) surface dedicated safety messaging in results rather than a plain score.
- **Local-first privacy model** — identity (name, avatar, accent) and all data (test results, check-ins, saved thoughts, in-progress tests) live only in `localStorage`. No accounts, no sign-in, no backend database. Full JSON export and one-step erase are built in.
- **Optional AI interpretation** — `/ai-interpreter` and the `/api/ai/interpret` route call Groq to turn a completed result into a plain-language reflection. This is the only feature that leaves the device, and only fires when the user asks for it.
- **Check-ins, dashboard, and saved thoughts** — lightweight day-to-day tracking pages (`/check-in`, `/dashboard`, `/saved-thoughts`) alongside the test catalog.
- **Reflection tools & learn library** — supplementary static content at `/reflection-tools` and `/learn`.
- **Light/dark theme** with persisted preference.

### Not (yet) available

Commercial, copyrighted clinical instruments (MMPI, WAIS, MBTI, Rorschach, TAT, and similar) exist in the data model only as metadata placeholders with no item content, and are hidden from the catalog until they can be properly licensed.

## Routes

- `/` — landing
- `/tests`, `/tests/[slug]` — screener/quiz catalog and individual test flow
- `/results/[id]` — a completed result
- `/ai-interpreter` — Groq-powered plain-language interpretation of a result
- `/check-in` — day-to-day mood/state check-ins
- `/dashboard` — overview of check-ins and recent activity
- `/reflection-tools` — supplementary self-reflection tools
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
- Playwright (dev/test)

## Status

Actively developed. Recently migrated off Supabase auth to a fully local, account-free profile — the app now has effectively zero backend beyond the optional Groq call. The commercial personality/clinical instruments remain gated pending licensing.

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
pnpm build
```

## Notes

- Everything except AI interpretation runs entirely on-device; the only outbound call is to Groq, and only when a user asks for an interpretation.
- App language and disclaimers are explicitly non-clinical and reflection-focused — this is not a diagnostic tool.
- A handful of tests are real, freely available clinical screeners offered for informational reflection only, not clinical use. Commercial instruments are metadata-only placeholders with no item content and stay hidden from the catalog until properly licensed.
