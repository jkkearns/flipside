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
| `web/app/page.tsx` | Main two-pane public layout |
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

- [x] Two-pane Drudge-style public layout
- [x] Sample stories.json with realistic placeholder content
- [x] README, MISSION, STATE foundation docs

## What's Next

- [ ] Admin/curation UI at `/admin` (local only)
- [ ] Gemini AI integration — story discovery + headline suggestions
- [ ] Unsplash integration — photo suggestions for top stories
- [ ] Mobile responsive layout

## User Notes

- Owner has no prior web development background — explain concepts when introducing new tools
- Prefers to stay at $0 cost (hard constraint, not soft preference)
- Wants human creative control and final approval on all published content
- Prefers repo-based context files (like this one) over hidden system folders
