# Flipside — Project State

This file tracks the current state of the project: what's built, what's next, and instructions for the AI curation assistant. It is read by Claude at the start of every curation session.

---

## Project Status

**Phase:** Foundation / Local Development
**Last updated:** 2026-03-14

---

## Core Constraints (Non-Negotiable)

- **$0 operating cost.** Every tool, API, and service used must be free (or free-tier). No credit cards, no subscriptions. If a service requires payment, find a free alternative or build without it.
- **Human approval required.** No story, headline, or photo goes live without the editor's explicit sign-off. AI is a collaborator, not a publisher.
- **Reputable sources only.** See `MISSION.md` for the approved source list.

---

## What the AI Curation Assistant Should Do

When asked to curate, the AI should:

1. **Identify today's top stories** — Find 5–10 news stories currently generating significant coverage from both left and right outlets. Prioritize stories where the framing diverges most sharply between sides.

2. **Pair sources** — For each story, find one left-leaning source and one right-leaning source from the approved list in `MISSION.md`.

3. **Write Drudge-style headlines** — Short, punchy, declarative. No neutral wire copy. Each side's headline should reflect how *that side* is framing the story. Examples:
   - Left: "TRUMP SIGNS ORDER GUTTING CLIMATE PROTECTIONS"
   - Right: "PRESIDENT SIGNS HISTORIC ENERGY FREEDOM ACT"

4. **Suggest a photo for the top story** — Provide an Unsplash search query (3–5 keywords) that would find an evocative, appropriate image. Do not suggest specific URLs — just the search terms.

5. **Tag each story** — Apply one or more category tags from the list in `MISSION.md`.

6. **Present for approval** — Show the full proposed layout to the editor before writing anything to `data/stories.json`.

---

## Current Site Layout

```
[FLIPSIDE HEADER]

LEFT (Liberal)          |  RIGHT (Conservative)
────────────────────────|────────────────────────
[TOP STORY + PHOTO]     |  [TOP STORY + PHOTO]
                        |
[Headline → link]       |  [Headline → link]
[Headline → link]       |  [Headline → link]
[Headline → link]       |  [Headline → link]
...                     |  ...
```

---

## Roadmap

### Now (v0.1 — Local)
- [x] Project scaffolded
- [x] README, MISSION, STATE files written
- [ ] Two-pane public layout (Drudge-style)
- [ ] `data/stories.json` data structure
- [ ] Admin/curation UI (local only)
- [ ] Gemini AI integration for story discovery
- [ ] Unsplash integration for photo suggestions

### Next (v0.2 — Polish)
- [ ] Mobile responsive layout
- [ ] Story category filtering
- [ ] "Last updated" timestamp on public site
- [ ] Archive of past front pages

### Later (v1.0 — Deploy)
- [ ] Deploy to Vercel
- [ ] Custom domain
- [ ] Admin tool secured behind password
- [ ] RSS feed output

---

## API Keys Needed (Free Tier)

| Service | Purpose | Where to get |
|---|---|---|
| Google Gemini | Story discovery + headline writing | aistudio.google.com |
| Unsplash | Photo suggestions | unsplash.com/developers |

Store keys in `.env.local` (never committed to git).
