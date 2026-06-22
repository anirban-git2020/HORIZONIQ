# HorizonIQ

**Observe. Predict. Lead.**

HorizonIQ turns emerging global signals into clear, personalized intelligence — helping students, professionals, and entrepreneurs understand **what is changing, why it matters, and what to do next**.

This is the **MVP (Phase 1)**: no authentication, no backend, powered entirely by curated mock data.

## Tech Stack

- [Next.js 15](https://nextjs.org) (App Router)
- TypeScript (strict)
- Tailwind CSS v3
- shadcn/ui-style components (hand-authored)
- lucide-react icons

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## User Flow

```
Landing → Role → Region → Interests → Personalized Dashboard
```

Selections are stored client-side in `localStorage` via a small `PreferencesProvider`. The dashboard composes a **role × interest** knowledge base through a **region** lens, so the same interest reads differently for each role:

| Role + Interest             | Recommended focus                              |
| --------------------------- | ---------------------------------------------- |
| Student + AI                | ML Foundations, Data Science, Applied Robotics |
| Professional + Robotics     | Digital Twins, Predictive Maintenance, Industrial AI |
| Entrepreneur + Biotech      | HealthTech, AI Diagnostics, Medical Automation |

Four personalized sections:

- **Top Signals** — highest-momentum trends with role-specific "what this means for you"
- **Recommended Skills** — the role-specific skill track for each interest
- **Emerging Opportunities** — region-adjusted growth + real regional hubs
- **Recommended Actions** — prioritized next steps, including a region-aware move

## Project Structure

```
app/
  layout.tsx              Root layout, fonts, providers
  page.tsx                Landing page
  onboarding/
    role/page.tsx         Step 1 — role selection
    region/page.tsx       Step 2 — region selection
    interests/page.tsx    Step 3 — interest selection
  dashboard/page.tsx      Personalized dashboard
components/
  ui/                     Button, Card, Badge, MeterBar
  brand/                  Logo
  layout/                 TopBar
  onboarding/             Step progress, option card, shell
  dashboard/              Section + signal/skill/opportunity/action cards
lib/
  types.ts                Shared TypeScript types (seed + view models)
  options.ts              Role/region/interest metadata + role voice
  preferences.tsx         Context + localStorage state
  personalize.ts          Engine: composes role/region/interest-aware content
  data/
    intelligence.ts       Curated role × interest knowledge base + region lens
```

## Design System

Theme tokens are mapped from the UI Constitution into HSL CSS variables in `app/globals.css`:

| Token      | Hex       |
| ---------- | --------- |
| Background | `#0A0F1E` |
| Surface    | `#121826` |
| Primary    | `#00D4FF` |
| Success    | `#00FF88` |
| Warning    | `#FFB800` |
| Text       | `#F8FAFC` |
| Muted      | `#94A3B8` |

Headings use IBM Plex Sans; body uses Inter.

## Phase 2 (future)

Replace mock JSON with live data sources; add Supabase, auth, and saved profiles.
