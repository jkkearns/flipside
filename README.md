# Flipside

> *Two stories. One truth.*

Flipside is a news curation website that presents the same stories side-by-side through liberal and conservative lenses — exposing how the same events are framed, interpreted, and spun by media on opposite ends of the spectrum.

Inspired by the raw simplicity of **DrudgeReport.com** and the media bias transparency of **AllSides.com**, Flipside puts the contrast front and center: two columns, two narratives, one page.

---

## Concept

The left pane and right pane mirror each other structurally but diverge editorially. Each story pairing links to a real article from a real outlet — no commentary, no editorializing. The curation itself is the editorial act.

---

## Running Locally

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## AI Curation Tools

Flipside includes a private admin interface for AI-assisted curation:

- **Story discovery** — Ask the AI to identify today's most compelling stories with clear left/right coverage
- **Headline pairing** — AI suggests matched headlines for each side
- **Photo suggestions** — AI recommends illustrative photos for top stories via Unsplash
- **Human signoff** — Nothing goes live without your approval

Access the curation tools at [http://localhost:3000/admin](http://localhost:3000/admin) (local only, never deployed).

---

## Tech Stack

| Layer | Tool | Cost |
|---|---|---|
| Framework | Next.js (React) | Free |
| Styling | Tailwind CSS | Free |
| AI | Google Gemini API | Free tier |
| Photos | Unsplash API | Free tier |
| Hosting | Vercel | Free (Hobby) |
| Source control | GitHub | Free |

**Total operating cost: $0**

---

## Deployment

Push to `main` → auto-deploys to Vercel.

```bash
git push origin main
```

---

## Project Files

## Repository Structure

```
flipside/
├── README.md         ← You are here
├── MISSION.md        ← Editorial philosophy and source list
├── STATE.md          ← Project state and AI curation instructions
└── web/              ← Next.js application
    ├── app/          ← Pages and routes
    ├── public/       ← Static assets
    ├── data/         ← stories.json (live site content)
    └── package.json
```
