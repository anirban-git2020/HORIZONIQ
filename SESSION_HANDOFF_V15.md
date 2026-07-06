# HorizonIQ — Session Handoff V15

**Last updated:** 2026-07-06  
**Version:** MVP V1.1 (Change-First) + Sprint 4A Analytics + Sprint 3.9 Brand/Legal  
**Status:** Active Development — public Beta readiness (brand, legal, SEO) shipped  
**Purpose:** Zero-context handoff for the next chat session or engineer.  
**Supersedes:** `SESSION_HANDOFF_V14.md` and all earlier handoffs

**GitHub repo:** `https://github.com/anirban-git2020/HORIZONIQ`  
**Default branch:** `main`  
**Production URL:** `https://horizoniq-beta.vercel.app/`  
**Local dev:** `start-dev.bat` or `npm run dev:clean` → `http://localhost:3000`

**Read first in a new session:** This file → `PROJECT_MEMORY.md` → `PROJECT_DECISIONS.md` → `CHANGELOG.md` → `.cursorrules`

---

## Sprint 3.9 Summary (2026-07-06)

**Objective:** Brand identity, legal readiness, founder attribution, SEO, and production footer before public Beta.

### Shipped

| Area | Implementation |
|---|---|
| **Global footer** | `components/layout/site-footer.tsx` on landing, dashboard, signal detail, `(site)` pages |
| **Navigation** | `SiteNav` in `TopBar` (`showNav`) — About, Roadmap, Contact, Privacy, Terms, Changelog |
| **Pages** | `/about`, `/contact`, `/privacy`, `/terms`, `/changelog`, `/roadmap` |
| **Founder** | Anirban Chatterjee — About `#founder`, Contact, footer credit |
| **SEO** | `lib/seo.ts`, OG image, icon, manifest, sitemap, robots, JSON-LD |
| **Public paths** | `isPublicSitePath()` — legal pages work during onboarding |
| **Analytics** | `footer_link_clicked` wired via `FooterLink` |

### Locked constraints

- No dashboard redesign, no analytics/provider/pipeline changes
- Welcome screen unchanged
- Terms/Privacy include legal-review placeholders
- GitHub footer link is placeholder

### Key files

```
lib/site.ts                          → branding, founder, public paths
lib/seo.ts                           → metadata + JSON-LD
components/layout/site-footer.tsx
components/layout/site-nav.tsx
components/layout/footer-link.tsx
app/(site)/layout.tsx
app/(site)/{about,contact,privacy,terms,changelog,roadmap}/page.tsx
app/opengraph-image.tsx, icon.tsx, manifest.ts, sitemap.ts, robots.ts
```

---

## Prior State (unchanged from V14)

- Sprint 4A analytics (`track()` abstraction, Vercel Analytics, Speed Insights)
- Living Intelligence Core (Sprint 3C)
- Change-first dashboard + IntelligenceCard (Sprints 2.5–3A)
- Cookie + middleware onboarding with auto-repair
- Live five-source weekly pipeline (W28 production)

See `SESSION_HANDOFF_V14.md` for full architecture, onboarding flow, pipeline CI, and known issues.

---

## Next Priority Tasks

1. Verify analytics in production (V14 task 1)
2. Week 2 return measurement funnels (V14 task 2)
3. Product owner normal-browser verification (V14 task 3)
4. Guided tour step 4 spotlight fix (V14 task 4)
5. Formal legal review of `/terms` and `/privacy` copy
6. Add `NEXT_PUBLIC_SITE_URL` to Vercel Production env if custom domain ships

---

*End of Session Handoff V15*
