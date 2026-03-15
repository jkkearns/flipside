# Flipside — AI Context

This file is read by Claude at the start of new sessions to restore project context.

## What This Is

Flipside is a manually-curated news website split into two panes — left (liberal) and right (conservative) — showing how the same stories are framed differently across the political spectrum. Drudge-style layout, AllSides-style concept.

**GitHub:** https://github.com/jkkearns/flipside
**Run locally:** `cd web && npm run dev` → http://localhost:3000

## Stack

- **Framework:** Next.js 16 (TypeScript + Tailwind CSS) — lives in `web/`
- **Content:** `web/data/stories.json` — edited via admin tool, approved by human
- **AI curation:** Google Gemini API (free tier) — not yet built
- **Photos:** Unsplash API (free tier) — not yet built
- **Deployment:** Vercel (free hobby tier) — not yet deployed
- **Cost:** $0 operating target, hard constraint

## Key Files

| File | Purpose |
|---|---|
| `README.md` | Setup and repo overview |
| `MISSION.md` | Editorial philosophy, approved source list |
| `STATE.md` | Project state, roadmap, AI curation instructions |
| `context/project.md` | This file — AI session context |
| `web/app/page.tsx` | Masthead + footer, passes data to ComparisonSlider |
| `web/app/ComparisonSlider.tsx` | The main UI — all slider logic lives here |
| `web/data/stories.json` | Live story content |
| `web/types/stories.ts` | TypeScript types for story data |

## Content Model

`web/data/stories.json`:
```json
{
  "lastUpdated": "ISO timestamp",
  "left": {
    "topStory": { "headline", "url", "source", "photo", "photoAlt" },
    "stories": [{ "headline", "url", "source" }, ...]
  },
  "right": { ... same structure ... }
}
```

## What's Built

- [x] Comparison slider — two full-width newspaper layouts stacked, clip-path reveals each side
- [x] Hero section — full-width headline + photo, slider bisects both dramatically
- [x] Stories row — 4-column mirrored grid; left pane L→R, right pane reversed R→L (right-aligned)
- [x] At 50/50: `[Story1 | Story2 ‖ Story2' | Story1']` — same event facing each other across divider
- [x] Drag from anywhere on the page (not just the handle); links still work
- [x] Load hint animation — slider nudges left on mount to teach the interaction
- [x] Newsprint background, serif typography, colored accent bars per side
- [x] Sample stories.json with realistic placeholder content (federal workforce story)
- [x] README, MISSION, STATE foundation docs
- [x] context/ folder for AI session continuity (this file)

## What's Next (start here)

### Visual polish (next session)
- [ ] More authentic newspaper typography — varied headline sizes, column rules, classic broadsheet feel
- [ ] The slider concept is locked in; the visual treatment needs to feel like two real newspapers

### Features (after visual is solid)
- [ ] Admin/curation UI at `/admin` (local only, never deployed)
- [ ] Gemini AI integration — story discovery + left/right headline suggestions
- [ ] Unsplash integration — photo suggestions for top stories
- [ ] Human approval flow — review before writing to stories.json
- [ ] Mobile responsive layout
- [ ] Vercel deployment

## User Notes

- Owner has no prior web development background — explain concepts when introducing new tools
- Prefers to stay at $0 cost (hard constraint, not soft preference)
- Wants human creative control and final approval on all published content
- Prefers repo-based context files (like this one) over hidden system folders
