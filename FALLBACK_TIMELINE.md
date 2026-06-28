# HorizonIQ — Fallback Timeline

**Established:** 2026-06-28  
**Status:** Known-good restore point — use if future work breaks onboarding, navigation, or production severely.

---

## Restore Point

| Field | Value |
|---|---|
| **Git tag** | `fallback/2026-06-28-v1.1-stable` |
| **Commit** | `aab7e55` — fix: use full-page navigation for onboarding phase transitions |
| **Branch** | `main` (at time of marking) |
| **Production URL** | `https://horizoniq-beta.vercel.app/` |
| **Verified** | 2026-06-28 — full onboarding flow works on Vercel in incognito |

---

## What Was Verified Working

End-to-end on **Vercel production** (incognito, fresh session):

1. Welcome → Enter HorizonIQ (or Skip)
2. Name → enter name → **Continue** → personalized landing
3. Landing → **Build my dashboard** → role selection
4. Role → region → interests (or quick-start) → tour choice → dashboard
5. Dashboard intelligence, signal detail, guided tour, Start over

**Critical fix in this timeline:** `lib/onboarding-nav.ts` — `navigateOnboarding()` uses full-page `window.location.assign()` when crossing middleware phase boundaries. Client-side `router.push()` after cookie updates was leaving users stuck on the name screen.

---

## Product Version at This Point

- **MVP V1.1 (Change-First)**
- Sprints 1–3C shipped: premium onboarding, intelligence reasoning, dashboard IA, premium visual system, Living Intelligence Core
- Live 5-source pipeline (HN, arXiv, Wikimedia, GitHub, Product Hunt)
- Onboarding routing: `hziq_ob_v3` cookie + `middleware.ts` phase enforcement
- Unified onboarding storage: `horizoniq.onboarding.v1` + `horizoniq.preferences.v2`

---

## Key Commits (Stable Line)

```
aab7e55 fix: use full-page navigation for onboarding phase transitions
0032bcf chore: add Cursor workspace settings for Vercel plugin
88b478d docs: add SESSION_HANDOFF_V11 for zero-context onboarding handoff
6f040a7 fix: reset onboarding with hziq_ob_v3 cookie and wipe stale prefs
bfd8e49 fix: cookie + middleware onboarding routing replaces localStorage guards
a95e69d fix: unified onboarding state machine to end localStorage drift
7d00fa1 fix: stabilize onboarding flow Welcome to Name to Landing to Profile
e8b1a70 feat: Living Intelligence Core (Sprint 3C) with React 19 and guided tour fix
```

---

## Architecture Snapshot (Do Not Break Without Testing)

| Layer | Implementation |
|---|---|
| **Onboarding authority** | `hziq_ob_v3` cookie — middleware enforces linear phases |
| **Phase transitions** | `navigateOnboarding()` in `lib/onboarding-nav.ts` — not `router.push` across phases |
| **Client init** | Inline `ONBOARDING_COOKIE_INIT_SCRIPT` in `app/layout.tsx` |
| **Navigation stabilization** | No `app/template.tsx` opacity animations; `ScrollToTop` in root layout |
| **Start over** | `window.location.assign("/onboarding/welcome")` + full state wipe |
| **3D field** | Lazy WebGL + CSS fallback; welcome uses CSS-only field |

### Onboarding phases

```
welcome → name → landing (/) → profile (role/region/interests/tour) → complete (dashboard)
```

### Locked non-negotiables

- No login for MVP
- Welcome screen design unchanged without product owner approval
- Do not restore `app/template.tsx` page-in opacity trap
- Cookie is routing authority — never derive phase from localStorage alone

---

## How to Restore This Timeline

### Local checkout

```powershell
cd C:\HorizonIQ
git fetch --tags
git checkout fallback/2026-06-28-v1.1-stable
npm install
npm run dev:clean
```

To return to latest `main`:

```powershell
git checkout main
git pull
```

### Redeploy to Vercel

```powershell
git checkout fallback/2026-06-28-v1.1-stable
git push origin HEAD:main --force-with-lease
```

**Warning:** Force-pushing `main` overwrites remote history. Only do this if production is broken and you intentionally want to roll back. Prefer Vercel dashboard → Deployments → promote the deployment built from `aab7e55` if it still exists.

### Vercel rollback (preferred)

1. Open [Vercel project deployments](https://vercel.com/horizoniq/horizoniq)
2. Find deployment for commit `aab7e55`
3. **Promote to Production**

---

## When to Use This Fallback

Use if any of the following regress severely and cannot be fixed quickly:

- Onboarding stuck on name, welcome, or landing CTAs
- Middleware redirect loops
- Blank pages on client navigation
- Dashboard unreachable after profile completion
- Production works locally but routing is broken on Vercel

**Do not use** for minor UI polish, new features, or non-blocking bugs — fix forward instead.

---

## Related Documents

| Document | Purpose |
|---|---|
| `SESSION_HANDOFF_V11.md` | Session context at time of fallback (may be stale after `aab7e55`) |
| `PROJECT_MEMORY.md` | Canonical product spec |
| `PROJECT_DECISIONS.md` | Decision log |
| `CHANGELOG.md` | Change history |

---

*This file is the canonical fallback reference. Update only when a new known-good production checkpoint is established and verified.*
