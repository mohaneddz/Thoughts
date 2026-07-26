<h1 style="font-family: Arial, sans-serif; font-size: 36px; color: #6DA8F2; border-bottom: 3px solid #6DA8F2; padding-bottom: 8px;">
  Happy Healthy Human - Reflection and Personal Insight Platform
</h1>


A calm self-reflection web app built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, Framer Motion, TanStack Query, Supabase scaffolding, and Groq AI stubs.

## What is included

- Full App Router foundation for:
  - `/`, `/tests`, `/tests/[slug]`, `/results/[id]`, `/ai-interpreter`
  - `/check-in`, `/dashboard`, `/reflection-tools`, `/collections`, `/learn`, `/saved-thoughts`, `/privacy`, `/about`
- Dual light/dark theme toggle with persisted preference
- Typed mock-first data for tests, collections, learn articles, tools, check-ins, and sample results
- Reusable component architecture (cards, filters, question flow, results blocks, AI modes, check-in form, state components)
- Supabase utilities + SQL schema and RLS policies scaffold
- Groq AI server utilities + API route stub (`/api/ai/interpret`)

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

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GROQ_API_KEY`
- `GROQ_MODEL`
- `NEXT_PUBLIC_APP_URL`

4. (Optional now, required for real persistence) apply schema in Supabase SQL editor:

- `supabase/schema.sql`

## Run

```bash
pnpm dev
```

## Quality checks

```bash
pnpm lint
pnpm build
```

## Notes

- This version is intentionally mock-first for UI and local flows.
- Supabase/Groq integrations are scaffolded and typed, ready for full auth/data wiring.
- The app language and disclaimers are explicitly non-clinical and reflection-focused.
