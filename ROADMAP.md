# Thoughts — Roadmap

_Audit date: 2026-10-22 · branch `roadmap/phase-1` · last release: 0.1.0 (untagged)_

_File paths in the bug and data tables are as they were at audit time, before source files were renamed to camelCase (e.g. `use-results.ts` → `useResults.ts`)._

Thoughts (internal name **Happy Healthy Human**) is a local-first self-reflection app: screeners, check-ins and saved thoughts, all stored in `localStorage`. The only network call is an optional Groq interpretation. This document covers what exists today, what is broken or wrong, and the order in which to fix and extend it.

Status legend: ✅ done · 🚧 in progress · ⬜ not started

---

## 1. What exists today

| Area | State |
|---|---|
| Routes | `/`, `/tests`, `/tests/[slug]`, `/results/[id]`, `/ai-interpreter`, `/check-in`, `/dashboard`, `/reflection-tools`, `/collections`, `/learn`, `/saved-thoughts`, `/profile`, `/privacy`, `/about`, `POST /api/ai/interpret` |
| Test catalog | 21 runnable definitions (PHQ-9/8/2, GAD-7/2, DASS-21/42, PSS-10, Rosenberg, WHO-5, AUDIT, AUDIT-C, PCL-5, C-SSRS, MDQ, IPIP Big Five 50/100, IPIP-NEO-120, IPIP curated pack) + 15 "original" reflection tests + 21 hidden licensed placeholders |
| Test runner | Full and guided modes, draft autosave, conditional questions (C-SSRS), safety gate for high-risk tests |
| Results | Severity bands, DASS subscale breakdown, crisis detection (C-SSRS, PHQ-9 item 9, PCL-5, MDQ) |
| Storage | Local profile (name, emoji or image avatar, accent), results, check-ins, saved thoughts, drafts; JSON export; typed erase |
| UI | Light/dark theme, desktop navbar, mobile bottom nav, cover art for every test |
| Tooling | Next 16.2.4, React 19.2, Tailwind 4, React Compiler, ESLint. Playwright is installed, but there are no tests |

---

## 2. Bugs

| # | Bug | Where | Severity |
|---|---|---|---|
| ✅ B1 | A results URL that doesn't exist shows a fabricated "Emotional awareness test · 72" result instead of a not-found state | `hooks/use-results.ts`, `data/tests.ts` `sampleResult` | High |
| ✅ B2 | `/ai-interpreter` with no `resultId` defaults to `'r1'`, which is the fake sample result, so the AI interprets made-up data | `app/ai-interpreter/page.tsx` | High |
| ✅ B3 | The "Ask me questions" chat box only echoes your own messages back. It never calls the AI | `components/ai/ai-chat-box.tsx` | High |
| ✅ B4 | An unknown test slug silently opens the first test (IPIP Big Five) instead of returning a 404. Pending licensed slugs open an empty "No renderable questions" card | `components/pages/test-runner-page.tsx` | Medium |
| ✅ B5 | Results for screeners **without** cutoff bands fall through to generic copy that assumes "higher = better". A perceived-stress score of 40/40 reads as **"Strongly grounded"**, and answering "no" to every C-SSRS question reads as **"Needs attention"** | `utils/scoring/index.ts` `toResultSummaryFromBreakdown` | **Critical** |
| ✅ B6 | Normalization ignores the minimum score. A Likert test scored 1–5 can never reach 0%, and the all-lowest answers show as 20% | `utils/scoring/index.ts` | Medium |
| ✅ B7 | The domain max ignores multi-select questions and numeric scales | `utils/scoring/index.ts` | Low |
| ✅ B8 | The AI prompt receives only `pattern`, `score/100` and the generic strengths. It never gets the test name, bands or subscales, so interpretations are generic | `utils/ai/groq.ts` | High |
| ✅ B9 | The API route doesn't validate input (any JSON body is forwarded), has no size limit or timeout, and returns 200 with an error sentence when the key is missing | `app/api/ai/interpret/route.ts` | Medium |
| ✅ B10 | Two of the six AI modes (`explain-simply`, `journal-prompts`) are supported by the API but have no button in the UI | `components/pages/ai-interpreter-page.tsx` | Low |
| ✅ B11 | Draft restore can miss on a hard reload. The restore effect runs once against the hydration snapshot (empty) and then locks itself | `components/pages/test-runner-page.tsx` | Medium |
| ✅ B12 | The radio/likert "selected" dot never fills, so the only selection cue is the border tint. There's no `role="radio"` or `aria-checked` either | `components/test/likert-scale.tsx`, `single-choice-question.tsx` | Medium (a11y) |
| ✅ B13 | The runner footer says "Progress stays on this device unless you create an account later." Accounts were removed | `test-runner-page.tsx` | Low |
| ✅ B14 | Desktop nav has no link to Dashboard, Saved thoughts, Collections or Tools. They're reachable only from the footer | `config/site.ts` | Low |
| ✅ B15 | Saved thoughts can't be deleted, edited, searched or created by hand (the `note` source type is unused) | `saved-thoughts` | Medium |
| ✅ B16 | Individual results can't be viewed as a list or deleted. Only the latest result shows on the dashboard | — | Medium |
| ✅ B17 | The check-in "reflection" is one hardcoded sentence keyed only on stress, and check-in history isn't shown anywhere | `app/check-in/page.tsx` | Medium |
| B18 | The theme ignores `prefers-color-scheme` on first visit | `layout.tsx`, `theme-provider.tsx` | Low |

## 3. Wrong or fake data

| # | Problem | Where |
|---|---|---|
| ✅ D1 | **IPIP-NEO-120 has no reverse keying at all.** Items like "Am not easily annoyed", "Remain calm under pressure", "Avoid contacts with others" and "Cheat to get ahead" are scored as if agreeing raised the trait. About half the 120 items are reverse-keyed in the published key | `data/tests.ts` |
| ✅ D2 | **Big Five / IPIP-NEO are scored as one grand total.** Summing five independent traits into one number means nothing. They need per-domain (and for NEO, per-facet) scoring | `data/tests.ts` |
| ✅ D3 | **The IPIP curated pack declares `domain-sum` but defines no domains**, so five unrelated constructs (cognitive failures, locus of control, order, optimism, private self-consciousness) are summed into one number | `data/tests.ts` |
| D4 | IPIP "Big Five 50" is not Goldberg's published 50-item marker set. It's the positively keyed half of the 100-item set, with 45 of 50 items keyed the same way (heavy acquiescence bias) | `data/tests.ts` |
| ✅ D5 | PSS-10, Rosenberg and C-SSRS have no interpretation bands (see B5) | `data/tests.ts` |
| ✅ D6 | `keyPatterns` on every result ("Overall clarity", "Current strain", "Follow-through" = score + 8, "Recovery room") is invented arithmetic and is shown as a "Key pattern map" | `utils/scoring/index.ts` |
| ✅ D7 | "Top strengths" and "Growth areas" are generic strings chosen only by score and test tone ("Clear self-awareness", "Quick clarity"), with no link to the answers given | `utils/scoring/index.ts` |
| ✅ D8 | The home hero shows a hardcoded "Latest result: Mostly steady" to every visitor | `sections/home/hero.tsx` |
| ✅ D9 | `sampleCheckIns`, `sampleResult`, `useCheckIns` and the stub `scoreTest()`/`toResultSummary()` are dead fixtures still shipped | `data/tests.ts`, `hooks/use-check-ins.ts`, `utils/scoring` |
| ✅ D10 | Collections and Learn reference test names that don't exist ("Overthinking Style Test", "Attachment Reflection Test", "Stress Pattern Test"), and nothing links anywhere | `data/collections.ts`, `data/learn.ts` |
| ✅ D11 | All 15 "original" tests are the same 7-question template with the theme string swapped in ("Rate your current confidence in handling attachment style"). Their scores mix directions (more stress factors adds points, and so does more confidence) | `data/tests.ts` `createOriginalQuestions` |
| ✅ D12 | Pending licensed placeholders all point `sourceUrl` at ipip.ori.org and are all categorised "Personality" (WAIS, BDI, Epworth…) | `data/tests.ts` |
| ✅ D13 | User-facing descriptions contain internal notes: "(licensed + caution handling)", "metadata ready, full item payload pending authoritative import" | `data/tests.ts` |
| ✅ D14 | IPIP-NEO-300 `sourceUrl` points at the Korean translation page | `data/tests.ts` |
| 🚧 D15 | Crisis resources are US-only, plus findahelpline. Nothing is region-aware | `data/crisis-resources.ts` |

---

## 4. Phased plan

### Phase 0 — Hygiene and launch basics
- ✅ Branch, roadmap
- ✅ Rename source files to camelCase/PascalCase (house rule: no hyphens in source file names)
- ✅ Root metadata: per-page titles, Open Graph, `robots.ts`, `sitemap.ts`, `manifest.ts`, icon
- ✅ `not-found.tsx` page
- ✅ Remove dead fixtures and stubs (D9)

### Phase 1 — Correct scoring and honest results _(highest priority)_
- ✅ Scoring direction per test (`higherIs: 'better' | 'worse' | 'neutral'`), so a high stress score never reads as good (B5)
- ✅ Min-aware normalization (B6) and complete domain max (B7)
- ✅ IPIP-NEO-120 reverse keys + 5 domains + 30 facets (D1, D2)
- ✅ IPIP Big Five 50/100: per-domain scoring (D2)
- ✅ IPIP curated pack: one domain per scale (D3)
- ✅ Bands: PSS-10, Rosenberg; C-SSRS result driven by crisis logic only (D5)
- ✅ Replace fake `keyPatterns`/strengths with real data: subscale bars for multi-domain tests, a band position for single-score tests, highest/lowest domains for trait tests (D6, D7)
- ✅ Not-found states for unknown results and tests (B1, B2, B4)
- ✅ Fix stale copy (B13), internal description text (D13), placeholder metadata (D12, D14)
- ✅ Collections and Learn linked by slug, not by invented names (D10)
- ✅ Hero shows the visitor's own latest result, or an invitation when there is none (D8)

### Phase 2 — Interactive reflection tools
Every tool on `/reflection-tools` is currently just a title card. Make each one a real, local, saveable tool:
- ✅ **Emotion wheel**: core → secondary → specific emotion picker, intensity slider, save as a thought
- ✅ **Values sorter**: pick your top 10 from 30 values, then rank them by moving items up and down
- ✅ **Decision helper**: options × weighted criteria matrix with live scores
- ✅ **Overthinking unpacker**: thought → evidence for/against → controllable? → next step
- ✅ **"Why do I feel this?" guide**: trigger → emotion → need → tiny step, stepwise
- ✅ **Conflict reflection**: before and after prompts
- ✅ **Habit loop analyzer**: cue / routine / reward → redesigned loop
- ✅ **Energy drain finder**: tag people, tasks and places as draining or charging, then summarise
- ✅ Each tool saves its output to Saved thoughts with `sourceType: 'tool'`

### Phase 3 — Tracking and insight
- ✅ `/results` history list with delete, grouped by test
- ✅ Score-over-time chart when the same test is taken more than once
- ✅ Check-in history + 7/30-day trend lines (mood, stress, energy, sleep) as inline SVG, no chart library
- ✅ Dashboard rebuild: streak, trends, latest result per screener, recent thoughts
- ✅ Saved thoughts: write a note by hand, search, filter by source, delete
- ✅ Import a previous JSON export (merge, de-duplicated by id)
- ✅ Check-in form shows live values and labels; the reflection uses all seven dimensions

### Phase 4 — AI that knows what it's interpreting
- ✅ Send the full, minimal result context: test title, band, subscales, crisis flag. No answers, no profile
- ✅ Zod-validated request, payload cap, upstream timeout, proper status codes (B8, B9)
- ✅ Expose all six modes (B10)
- ✅ Real follow-up chat grounded in the result (B3) — routes verified for validation and error codes; a live Groq reply has not been verified yet
- ⬜ Streaming responses
- ⬜ Basic per-IP rate limit (needs a store if deployed serverless)

### Still open from Phases 1–3
- D4: swap the Big Five 50 items for Goldberg's published, balanced-keying 50-item marker set

### Phase 5 — Content
- ✅ Rewrite the 15 templated "original" tests into real, distinct item sets with typed outcomes — ~190 original items; style tests name the most pronounced style, attachment and social battery resolve to quadrant profiles, the rest get bands plus the area that most needs attention (D11)
- ✅ Learn article bodies at `/learn/[id]` with related tests and tools (10 articles)
- 🚧 More freely usable instruments. Licence checked 2026-11-03:
  - ✅ SWLS — free for non-commercial use with credit; added with its published bands
  - ⬜ K10, ASRS v1.1 — Harvard NCS pages returned 503 on every attempt; retry
  - ⬜ SCS-SF, UCLA-3 — no licence statement found on the official pages; ask the authors or skip
  - ⬜ Brief Resilience Scale — not checked yet
- 🚧 Region-aware crisis resources (D15) — US, Canada, UK, Ireland and France done from each service's own site; country picker guessed from browser language. **Algeria, Morocco and Tunisia are waiting**: the only sources found were Wikipedia and they conflict (Algeria ambulance 14 vs civil defence 1021), so those countries fall back to "local emergency number + findahelpline" until the numbers are confirmed locally
- 🚧 Arabic and French locales with RTL — locale switcher, `lang`/`dir` before first paint, Noto Sans Arabic, logical spacing so layouts mirror; nav, footer and home page translated. Still English: every other page's UI copy, tools, results copy, and all questionnaires and articles (clinical screeners need validated official translations — a notice says so in FR/AR)

### Phase 6 — Quality
- 🚧 Unit tests for the scoring engine. Every published instrument gets a fixture with a known expected score and band (Vitest set up; PHQ-9, PSS-10, Rosenberg, DASS-21, C-SSRS, MDQ, IPIP-NEO-120, Big Five and check-in helpers covered — GAD, AUDIT, WHO-5, PCL-5 still to add)
- ⬜ Playwright smoke flows: take a test → result → save → dashboard; check-in; export/import
- ✅ Accessible choice controls: radio semantics, keyboard arrows, visible filled state (B12)
- ⬜ `prefers-color-scheme` default (B18)
- ⬜ PWA/offline (the app already works without a server)
- ⬜ Content-Security-Policy headers

---

## 5. Decisions still open
- **Licensed instruments** (MMPI, BDI, WAIS, …): license them or drop them. They're hidden today, and the placeholders add 21 dead entries to the data file.
- **PSS-10 and MDQ** are copyrighted but commonly used for free in non-commercial settings. Confirm they're acceptable for this app's use, or gate them like the others.
- **Deploy target**: the AI route needs a key and rate limiting before any public deploy.
