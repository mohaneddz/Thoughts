<h1 style="font-family: Arial, sans-serif; font-size: 36px; color: #6DA8F2; border-bottom: 3px solid #6DA8F2; padding-bottom: 8px;">
  Happy Healthy Human - Reflection and Personal Insight Platform
</h1>


A calm self-reflection web app built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, Framer Motion, TanStack Query, and Groq AI.

## What is included

- Full App Router foundation for:
  - `/`, `/tests`, `/tests/[slug]`, `/results/[id]`, `/ai-interpreter`
  - `/check-in`, `/dashboard`, `/reflection-tools`, `/collections`, `/learn`, `/saved-thoughts`, `/profile`, `/privacy`, `/about`
- Dual light/dark theme toggle with persisted preference
- Local-only identity: name, avatar, and accent stored in the browser — no accounts, no sign-in, no server
- Local-only data: results, check-ins, saved thoughts and in-progress tests live in localStorage, with JSON export and one-step erase
- Typed data for tests, collections, learn articles, tools, check-ins, and results
- Reusable component architecture (cards, filters, question flow, results blocks, AI modes, check-in form, state components)
- Crisis-aware result handling for high-risk screeners (C-SSRS, PHQ-9 item 9, PCL-5, MDQ)
- Groq AI server utilities + API route (`/api/ai/interpret`)

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

Serves on [http://localhost:4321](http://localhost:4321) (not the usual 3000, so it does not collide with other local projects). `pnpm start` uses the same port.

## Quality checks

```bash
pnpm lint
pnpm build
```

## Notes

- Everything except AI interpretation runs entirely on-device; the only outbound call is to Groq, and only when a user asks for an interpretation.
- The app language and disclaimers are explicitly non-clinical and reflection-focused.
- A handful of tests are real, freely available clinical screeners (PHQ, GAD, DASS, AUDIT, WHO-5, Rosenberg, PCL-5, C-SSRS) offered for informational reflection only. Commercial instruments (MMPI, WAIS, MBTI, Rorschach, TAT, …) are metadata-only placeholders with no item content, and stay hidden from the catalog until properly licensed.
