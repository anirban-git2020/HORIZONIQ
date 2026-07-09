# HorizonIQ — Session Handoff V20

**Purpose:** zero-context handoff so a new chat can continue seamlessly.
**Branch:** `feature/intelligence-exchange-ui` (never touch `main` / Vercel).
**Governing document:** `HorizonIQ-Engineering-Constitution.md` (v1.0) — supersedes all
prior operating instructions. Read it first. Key stances: executive owner role;
Business → Product → Architecture → Domain → Design → Engineering → Implementation →
Optimization; one system per change; approval gate before code; protected vocabulary
(Intelligence, Signal/Brief/Pulse, Shift/Momentum, Observed/Signal Detected); reasoning
internal, conclusions surfaced; disclose anything unverified.

---

## 1. Environment reality (READ THIS — it shapes everything)

- **No compiler / no run.** The repo cannot be built or type-checked from the assistant
  sandbox. Verify changes structurally in the editor; the user's `next dev` / `next build`
  is the real check. Always disclose unverified work.
- **The Linux sandbox mount is unreliable.** It serves *stale* copies of files the
  assistant just wrote (bash `git status`, `grep`, `wc`, `tsc` may not see edits), and it
  pads shrinking overwrites with NUL bytes on its side. The **editor / Windows view (Read
  tool) is the source of truth.** Do not trust bash-side verification of just-edited files.
- **Commits must be run by the user in PowerShell** (`C:\Claude_test\HorizonIQ`). The
  sandbox cannot manage `.git` (can create files but not delete locks). If a `.git\*.lock`
  is left over: `Remove-Item -Force .git\*.lock`, then `git reset` to resync if needed.
- **Line endings fixed:** `.gitattributes` (`* text=auto`) was added and committed so
  Windows CRLF no longer shows ~250 phantom file changes. Keep it.
- Stack (fixed): Next.js 15, React 19, TypeScript strict, Tailwind. No Supabase / PostHog /
  backend / auth changes.

---

## 2. What shipped this session (committed)

Branch history (newest first), all authored as Ani:

- `b483456` **feat(pulse): personalize the Intelligence Pulse from the existing engine**
  (Phase 1 — later superseded by the domain wiring below).
- `c28277d` **feat(landing): Landing Experience restoration + Intelligence Exchange polish.**
- `df59728` **feat(exchange): Intelligence Exchange — editorial dashboard + motion language**
  (includes `.gitattributes`).
- `c56c4c8` **feat(focus): world-class story panel — visible close, soft veil, calmer motion.**
- `52a5129` docs: SESSION_HANDOFF_V17 (prior baseline).

Notable delivered work:
- **Focus Overlay** (`components/focus/FocusOverlay.tsx`): visible ✕ close, soft veil, calm
  Apple-style motion, reduced-motion path, focus trap, scroll lock.
- **Landing Experience** (State 1): one cinematic surface — Welcome → Name → Role → Region →
  Interests → 3-scene Guided Tour (Observe/Predict/Lead) → Enter. sessionStorage-only
  persistence via `hooks/use-landing-journey.ts` (keys: displayName, selectedRole,
  selectedRegion, selectedInterests, tourCompleted). Files: `components/landing/*`,
  `app/page.tsx` (mounts it), `middleware.ts` (phase-routing retired to pass-through).
- **Exchange header** (`components/exchange/exchange-header.tsx`): added "Start over"
  (clears journey → "/"); removed the stacked tagline lockup that overflowed the bar.
- **Ticker removed** from `intelligence-exchange-shell.tsx` (component file kept for future
  "Latest Observed" line).
- Fixed onboarding→dashboard **navigation race** (single guarded redirect in
  `landing-experience.tsx`).

---

## 3. Work built but NOT yet committed (PENDING)

Two moves of the **Intelligence Domain Model** sprint are on disk, awaiting commit.

**Move 1 — canonical domain (additive, `lib/domain/`, untracked):**
- `signal.ts` — canonical `Signal` (grouped, deeply readonly): Identity, Classification,
  Geography, Evidence, Momentum, Forecast, Relationships, Personalization, Presentation,
  Reading, Versioning. Reuses RoleId/RegionId/InterestId.
- `source.ts` — `Source`/`SourceRef` + extensible `SourceType`.
- `relationship.ts` — `SignalRelationship` + `RelationshipKind` (graph-ready, id-referenced).
- `repositories.ts` — interfaces only: `SignalRepository`, `EvidenceProvider`,
  `RelationshipProvider`, `ForecastProvider`, `PersonalizationProvider`.
- `mock-intelligence.ts` — the ONE centralized dataset: 12 canonical Signals seeded from the
  editorial tiles/briefs + `mockSignalRepository` (default in-memory SignalRepository).
- `index.ts` — barrel (`@/lib/domain`).

**Move 2 — wire the Exchange to the domain (3 modified files):**
- `lib/exchange/pulse-mock-data.ts` — tiles now derive from `MOCK_SIGNALS` via `toPulseTile`;
  types + `getPulseTilesByTier` kept.
- `lib/exchange/pulse-brief-data.ts` — `getPulseBrief` derives from domain via `toBrief`;
  dead `PULSE_BRIEFS` literal removed; type kept.
- `lib/exchange/personalized-pulse.ts` — ranks domain Signals by profile (**order only**);
  `getPersonalizedBrief` delegates to the domain brief. Public API unchanged
  (`journeyToPreferences`, `buildPersonalizedTiles`, `getPersonalizedBrief`).

**Why Move 2 matters:** it fixed a **trust defect** — the previous Phase 1 path fabricated
"You flagged X" on filler cards (it padded the grid via the legacy `lib/personalize` engine
with ALL interests). Now personalization affects ordering only; tile/brief text is editorial
and identical for everyone. It also replaced thin legacy content (momentum ~42, "+0") with
the rich editorial Signals (momentum 97/95…, real velocity, real forecasts).

**Commit commands (user runs in PowerShell after a `next dev` sanity check):**
```
cd C:\Claude_test\HorizonIQ
git add lib/domain
git commit -m "feat(domain): establish canonical Intelligence Domain Model (Move 1)"
git add lib/exchange/pulse-mock-data.ts lib/exchange/pulse-brief-data.ts lib/exchange/personalized-pulse.ts
git commit -m "fix(pulse): source Exchange from domain; remove fabricated 'you flagged' personalization (Move 2)"
```

---

## 4. Architecture now in place

- **Two application states:** State 1 Landing Experience (`/`), State 2 Intelligence
  Experience (`/dashboard` → `IntelligenceExchangeShell` → Hero, World Intelligence Pulse,
  Living Intelligence Field, Focus Overlay, Footer).
- **Single source of truth for Signals:** `lib/domain` (once committed). Every tile/brief in
  the Exchange projects a canonical `Signal` through adapters in `lib/exchange`. Swap the
  repository, not the components.
- **Personalization = ordering.** The user's `selectedInterests` (sessionStorage) rank
  matching Signals first, then momentum. No fabricated claims.
- **Data flow:** `mock-intelligence` (domain) → `pulse-mock-data` / `pulse-brief-data`
  (adapters) → `personalized-pulse` (ranking) → `use-personalized-pulse` (hook) →
  `world-intelligence-pulse` / `FocusOverlay` (UI, unchanged).

---

## 5. Phase 2 backlog / known limits

1. **Content depth.** UPDATED: the domain now holds ~20 Signals covering **all 15
   onboarding-selectable interests** (added Manufacturing, Finance, Healthcare, VC,
   Biochemistry, Life-Sciences, Arts, Commerce). Personalization is now **strict interest
   match** — main grid shows only chosen interests; adjacent Signals appear in a separate
   labeled "Related fields" strip; honest empty state when nothing matches. Further depth
   (more Signals per interest) still helps but is no longer blocking.
   - **Region relevance = live-pipeline responsibility (decision, do NOT hand-tag).** All 8
     regions incl. Latin America are represented, but only the 8 newer Signals carry
     `recommendedRegions`; the core Signals are region-neutral. We deliberately will NOT
     hand-assign regions to global tech Signals — it would be fiction and throwaway. Region
     relevance must come from real geographic evidence when the pipeline populates
     `recommendedRegions` via the `SignalRepository` swap. No UI/model change needed then.
2. **Living motion (#3).** Stock-market-style life (sparklines redrawing on momentum change,
   quiet "Signal Detected" pulse) — gated on real/changing data, delivered with restraint.
   Do NOT build a flashy ticker.
3. **Legacy migration (separate sprint):** `lib/data/*` + `lib/personalize.ts` +
   `app/signals/[id]/page.tsx` are the old engine, still used by the legacy signal-detail
   page. Not part of the live Exchange. Fold into the domain later; do not rewrite now.
4. **Dormant/dead code to retire later:** old multi-page onboarding (`app/onboarding/*`),
   `lib/onboarding-phase.ts` + cookie routing (middleware now pass-through),
   `lib/exchange/focus-mode.ts` (unused), `components/exchange/ticker-placeholder.tsx` (unused).
   Leave until a dedicated cleanup sprint.
5. **Minor visual deltas from Move 2** (intentional, not bugs): timestamp now "Signal
   detected"; three evidence sub-counts derived (Signals total exact); CTA label derived from
   trajectory.
6. Stray untracked files: `SESSION_HANDOFF_V18/V19.md`, `esbuild.err` (safe to delete).

---

## 6. How to work here (from the Constitution)

- **Approval gate:** for anything beyond a trivial edit, present (a) what exists, (b) proposed
  architecture + minimal file list, (c) acceptance criteria + stop condition — then STOP for
  approval before writing code. Foundational work is never built on reflex.
- **One system per sprint.** Reuse before creating. Smallest sufficient change; reversibility
  wins ties. No duplicate models. Names/vocabulary are contracts.
- **Protected & locked (extend, never restyle):** typography, spacing, color, motion tokens,
  Living Intelligence Field, Signal layout, premium aesthetic.
- **Disclose unverified.** Never claim code was run/tested/deployed. Report honestly; never
  mark incomplete work done.
- **Push back** (with a better path) when a request would harm the product; reserved for real
  harm, not taste.

---

*End of Handoff V20.*
