# Weekly Data Refresh

HorizonIQ MVP uses curated mock JSON. Refresh weekly so the "What Changed" layer stays credible.

## Checklist (every Monday or before user testing)

1. **Update `meta.json`**
   - Set `briefingPeriod` to the current ISO week (e.g. `2026-W26`)
   - Set `briefingLabel` (e.g. `Week of June 23, 2026`)
   - Set `updatedAt` to the refresh date (ISO 8601)

2. **Update signal change fields** in `signals.json` (changed signals only)
   - Move current `momentum` / `confidence` into `previousMomentum` / `previousConfidence`
   - Adjust current values by a few points (±3–8)
   - Refresh `change.type` and `change.summary` where the story moved

3. **Optional:** refresh `demandChange` in `skills.json`, `growthChange` in `jobs.json`, and `changeReason` in `recommendations.json`

4. **Verify in the app**
   - First visit shows "What Changed This Week" with the new `briefingLabel` and "Updated [date]" in the hero
   - Return visits within the same `briefingPeriod` show "What Changed Since Your Last Visit"
   - After a new `briefingPeriod`, users see the weekly briefing again (snapshot period resets)

## Files

| File | Refresh |
|---|---|
| `meta.json` | Every week (required) |
| `signals.json` | Change metadata on active signals |
| `skills.json` | Demand deltas for rising skills |
| `jobs.json` | Growth deltas for opportunities |
| `recommendations.json` | Action change reasons |
