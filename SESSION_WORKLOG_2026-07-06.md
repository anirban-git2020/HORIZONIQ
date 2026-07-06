# HorizonIQ — Session Worklog (2026-06-29 to 2026-07-06)

**Purpose:** Handoff document for external analysis (e.g. ChatGPT). Summarizes work done in Cursor across multiple turns in this session.

**Repository:** `https://github.com/anirban-git2020/HORIZONIQ`  
**Production URL:** `https://horizoniq-beta.vercel.app/`  
**Default branch:** `main`

---

## 1. Session Overview

This session focused on:

1. Onboarding the AI agent with project context (vision, memory, decisions, roadmap, handoff docs)
2. Git hygiene (committing an untracked handoff file)
3. Diagnosing and fixing **weekly intelligence briefing auto-refresh** — data was updating in GitHub but **not reaching Vercel production**
4. Hardening the CI/CD pipeline so Monday 06:00 UTC refreshes deploy reliably going forward

---

## 2. Initial Context Load (No Code Changes)

The agent read these files completely at session start:

| File | Purpose |
|---|---|
| `VISION.md` | Product vision — personalized intelligence platform, "Observe. Predict. Lead." |
| `PROJECT_MEMORY.md` | Canonical product spec — change-first MVP, intelligence contracts, sprint status |
| `PROJECT_DECISIONS.md` | Decision log from 2026-06-22 through Sprint 3C |
| `ROADMAP.md` | Phased roadmap — Phase 1 MVP V1.1 in progress |
| `CHANGELOG.md` | Product change history |
| `SESSION_HANDOFF_V12.md` | Zero-context engineer handoff (onboarding auto-repair, architecture) |
| `.cursorrules` | Engineering + design rules |

**Key product principles internalized:**

- HorizonIQ is a **signal change platform**, not a signal platform
- Users return for **changes in signals**, not static feeds
- Weekly briefing cadence: Monday 06:00 UTC via GitHub Actions
- No login for MVP; trust via labeled sources and plain-English confidence

---

## 3. Git: Committed Untracked Handoff

**Problem:** `SESSION_HANDOFF_V12.md` existed locally but was never committed.

**Action:**

- Commit: `574bd0d` — `docs: add SESSION_HANDOFF_V12 for zero-context onboarding handoff`
- Pushed later as part of subsequent work

---

## 4. Fallback Timeline Context

The agent also read `FALLBACK_TIMELINE.md`:

| Field | Value |
|---|---|
| Tag | `fallback/2026-06-28-v1.1-stable` |
| Commit | `aab7e55` |
| Purpose | Known-good restore point if onboarding/navigation breaks |

**Note:** Fallback predates onboarding auto-repair (`668d31e`, `42c0687`). Production was later at `42c0687`+.

---

## 5. Problem 1 — Stale Data on Vercel (June 29)

### User report

Production still showed:

- **Week of June 22, 2026 – June 28, 2026** (W26)
- **Updated 27 Jun 2026**

Expected: new week briefing after Monday June 29.

### Investigation findings

| Layer | Status |
|---|---|
| `data/meta.json` on `main` | Still W26 locally; remote had moved ahead |
| GitHub Actions schedule | `cron: "0 6 * * 1"` — correct for Monday 06:00 UTC |
| Remote git history | Commit `4f0ecd9` on **2026-06-29 10:55 UTC** — `chore(pipeline): weekly briefing [skip ci]` |

**Root cause #1:** Pipeline **did run** on June 29 and committed W27 data to GitHub, but commit message included **`[skip ci]`**, which caused **Vercel to skip deployment**. Data was in git; production never picked it up.

**Root cause #2 (secondary):** Week rollover bug — `loadPreviousBriefing()` only looked for the **current** period's JSON file. On first run of a new ISO week, no file exists yet, so momentum deltas compared against empty state instead of the prior week.

### Fixes applied (commit `d72399c`)

1. **Removed `[skip ci]`** from weekly workflow commit message
2. **Added `GITHUB_TOKEN`** to CI ingest env (GitHub source needs it in Actions)
3. **Fixed week rollover** in `lib/pipeline/generate/briefing.ts` and `lib/pipeline/store/briefing.ts`:
   - `getPreviousBriefingPeriod()` added to `lib/pipeline/utils/periods.ts`
   - `loadPreviousBriefing()` tries same-week file first (re-runs), then previous ISO week
   - `wasPipelineBriefingBefore()` checks previous week too
4. **Regenerated W27** locally with correct week-over-week deltas
5. **Pushed to `main`** to trigger Vercel deploy

### Rebase conflict note

Remote already had W27 from CI (`4f0ecd9`). Local fix was rebased on top; W27 data from our pipeline run was kept.

---

## 6. Problem 2 — Still Stale on Vercel (July 6)

### User report (July 6, 2026)

Data still not auto-freshing at 6AM UTC. Still seeing old data on Vercel.

### Investigation findings

| Layer | Status |
|---|---|
| Remote `meta.json` at `9c06d06` | **W28** — `Week of July 6, 2026 – July 12, 2026`, updated `2026-07-06T10:10:56Z` |
| GitHub Actions | **Ran successfully today** — pipeline is NOT broken |
| Vercel latest deploy for `9c06d06` | **ERROR** |
| Vercel last successful production deploy | `d72399c` (W27, July 2) |

**Root cause:** Pipeline commits updated `data/meta.json` to the new week but **`lib/data/briefings-registry.ts` was never included in auto-commits**.

Evidence — pipeline commits only touched 8 files, never the registry:

```
9c06d06 chore(pipeline): weekly briefing     — 8 files, NO briefings-registry.ts
4f0ecd9 chore(pipeline): weekly briefing     — 8 files, NO briefings-registry.ts
```

Meanwhile `d72399c` (manual fix) explicitly added W27 to registry.

**Vercel build failure:**

```
No briefing registered for period "2026-W28" (2026-W28.json). Run npm run pipeline:generate.
```

**Why registry wasn't committed:** `git-auto-commit-action` used a multiline `file_pattern`:

```yaml
file_pattern: |
  data/**
  lib/data/briefings-registry.ts
```

The registry file was regenerated by `syncBriefingsRegistry()` during `pipeline:full` but was **not reliably staged/committed** by the action.

**Architecture note:** Next.js bundles briefing JSON via static imports in `briefings-registry.ts`. `meta.json` points to active period; registry must list every briefing JSON or build fails at compile time.

### Attempted alternative (reverted)

Tried replacing static registry with `import.meta.glob()` in `lib/data/briefings-loader.ts`. **Failed** — TypeScript/Next.js 15 webpack does not support `import.meta.glob` in this setup; also `access.ts` is imported by client components (`"use client"` dashboard).

Reverted to static registry pattern with reliable CI sync.

---

## 7. Final Fix (commit `f344a10`) — Shipped & Live

### Changes

| File / area | Change |
|---|---|
| `lib/data/briefings-registry.ts` | Added W28 import/registration |
| `scripts/sync-briefings-registry.ts` | **New** — standalone registry sync from `data/briefings/*.json` |
| `scripts/verify-briefing.ts` | **New** — verifies meta file exists, period matches, registry includes active period |
| `package.json` | Added `pipeline:sync-registry`, `pipeline:verify` scripts |
| `.github/workflows/weekly-briefing.yml` | Hardened workflow (see below) |
| `lib/pipeline/store/briefing.ts` | Restored `syncBriefingsRegistry()` call in `writeBriefingArtifacts()` |

### New CI workflow sequence

```yaml
1. npm run pipeline:full          # ingest + generate briefing
2. npm run pipeline:sync-registry # ensure registry matches briefings on disk
3. npm run pipeline:verify        # fail if meta/registry/file mismatch
4. npm run build                  # fail if Next.js build would break Vercel
5. git add data/ lib/data/briefings-registry.ts
6. git commit + git push          # explicit add — no git-auto-commit-action
```

**Removed:** `stefanzweifel/git-auto-commit-action` (unreliable for registry file)

### Deploy verification

- Pushed `f344a10` to `main`
- Vercel deployment `dpl_Ectsy9Mz14dwzWRhrmjws4NnKgs6` → **READY**
- Aliases include `horizoniq-beta.vercel.app`
- Production now serves **W28**

---

## 8. Commit Timeline (Relevant)

| Commit | Date | Summary |
|---|---|---|
| `4f0ecd9` | 2026-06-29 | Pipeline W27 — `[skip ci]`, no registry → Vercel skipped/failed |
| `d72399c` | 2026-07-02 | Manual fix: W27 registry, rollover logic, remove skip ci |
| `9c06d06` | 2026-07-06 10:10 UTC | Pipeline W28 — no registry → Vercel build ERROR |
| `f344a10` | 2026-07-06 | Fix CI + W28 registry → Vercel READY |
| `574bd0d` | (earlier) | SESSION_HANDOFF_V12 committed |

---

## 9. Current Production State (as of session end)

| Field | Value |
|---|---|
| Briefing period | `2026-W28` |
| Label | Week of July 6, 2026 – July 12, 2026 |
| `updatedAt` | `2026-07-06T10:10:56.566Z` (from pipeline ingest; registry fix deployed after) |
| Active briefing file | `2026-W28.json` |
| Vercel status | Production **READY** on `horizoniq-beta.vercel.app` |

---

## 10. Architecture: Weekly Refresh Flow

```
Monday 06:00 UTC — GitHub Actions (weekly-briefing.yml)
        ↓
npm run pipeline:full
        ↓
lib/pipeline/ingest/*     → HN, arXiv, Wikimedia, GitHub, Product Hunt
        ↓
lib/pipeline/score/*
        ↓
lib/pipeline/generate/briefing → data/briefings/{period}.json + meta.json
        ↓
syncBriefingsRegistry()   → lib/data/briefings-registry.ts
        ↓
pipeline:verify + npm run build  (must pass)
        ↓
git commit data/ + briefings-registry.ts → push main
        ↓
Vercel auto-deploy from main → production
```

### Critical invariant

**`meta.json` active period must exist in `briefings-registry.ts`** or Next.js production build fails.

---

## 11. Known Remaining Risks / Open Items

| Risk | Severity | Notes |
|---|---|---|
| Registry file must stay in sync with new briefing JSON | Medium | Now guarded by sync + verify + build in CI |
| Old briefing JSON files accumulate in registry/bundle | Low | W26, W27, W28 all imported — bundle grows slowly |
| Product Hunt HTTP 429 in CI | Medium | Source may mark `stale`; pipeline still completes |
| `import.meta.glob` not viable for auto-discovery | Info | Tried and reverted; static registry remains |
| GitHub Actions scheduled workflow delays | Low | July 6 run was ~4h after 06:00 UTC (normal GH scheduler variance) |

---

## 12. Files Created or Modified This Session

### Created

- `scripts/sync-briefings-registry.ts`
- `scripts/verify-briefing.ts`
- `SESSION_WORKLOG_2026-07-06.md` (this file)

### Modified

- `.github/workflows/weekly-briefing.yml`
- `lib/data/briefings-registry.ts`
- `lib/data/access.ts` (error message tweak)
- `lib/pipeline/generate/briefing.ts` (week rollover)
- `lib/pipeline/store/briefing.ts` (rollover + registry sync)
- `lib/pipeline/utils/periods.ts` (`getPreviousBriefingPeriod`, `parseBriefingPeriod`)
- `package.json` (new scripts)

### Deleted (temporarily, then restored)

- `lib/data/briefings-loader.ts` — attempted glob approach, removed

---

## 13. Lessons Learned (for analysis)

1. **"Pipeline ran" ≠ "users see new data"** — three layers must succeed: ingest → git commit (all required files) → Vercel build + deploy.

2. **`[skip ci]` in commit messages** can prevent Vercel deployments even when git is updated.

3. **Split state is fatal** — updating `meta.json` without `briefings-registry.ts` breaks the Next.js build because briefings are statically imported.

4. **`git-auto-commit-action` file_pattern** was unreliable for committing the registry; explicit `git add` is safer.

5. **CI should run `npm run build`** before pushing pipeline data — would have caught W28 failure before it hit Vercel.

6. **The Monday cron was working** — the user's perception of "not auto refreshing" was a **deploy pipeline failure**, not a data ingestion failure.

---

## 14. Suggested Questions for ChatGPT Analysis

- Is static `briefings-registry.ts` the right long-term pattern, or should briefing loading move server-only to avoid client bundle + sync issues?
- Should old briefing weeks be pruned from the registry to reduce bundle size?
- Is GitHub Actions + Vercel git deploy the right architecture, or should pipeline push directly to Vercel Blob / Edge Config?
- Are there additional guardrails (e.g. deployment status check, Slack alert on CI failure) worth adding?
- How should visit-snapshot / "What Changed Since Your Last Visit" behave across weekly briefing period rollovers?

---

*End of session worklog — 2026-07-06*
