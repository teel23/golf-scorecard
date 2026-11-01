# Golf Scorecard — Notebook

> **Status:** Retired 2026-11-01 · GitHub repo archived, iCloud copy removed  
> **Notebook updated:** 2026-11-01

| | |
|---|---|
| **What** | Augusta-styled golf scorecard PWA: courses with par data, hole-by-hole strokes, round history |
| **Repo** | [teel23/golf-scorecard](https://github.com/teel23/golf-scorecard) (public, archived) |
| **Live** | https://golf.c2tbuilds.com — still up until taken down at the host |
| **Stack** | React + Vite, Tailwind, Dexie (IndexedDB), PWA |
| **Active** | 2026-02-26 → 2026-07-08 |

## Where it ended

Live / beta, offline-first, data stored on the device. Retired in the 2026-11-01 cleanup.

## To revive

```bash
gh repo unarchive teel23/golf-scorecard && gh repo clone teel23/golf-scorecard ~/dev/golf-scorecard
```

## Timeline (git history, newest first)

```text
2026-07-08  3b7e24d  Archive stale March audit doc; sync NOTES
2026-03-16  9caa494  Add handicap tracking — per-player handicap index + net score display
2026-03-06  bf167d3  audit: remove Netlify artifacts, add vercel.json, add audit report — March 2026
2026-02-26  5627c3f  scoring redesign: horizontal wheel, hole header, stats sheet, mulligan tracker, multi-player flow
2026-02-25  9b5f433  Add project docs
2026-02-26  cd4d7fc  Initial commit — Golf Scorecard
```

## Code layout

```text
.gitignore
AI_CONTEXT.md
NOTES.md
README.md
eslint.config.js
index.html
package-lock.json
package.json
postcss.config.js
src/App.css
src/App.jsx
src/db/db.js
src/games/scoring.js
src/index.css
src/main.jsx
src/screens/CourseForm.jsx
src/screens/Courses.jsx
src/screens/Dashboard.jsx
src/screens/History.jsx
src/screens/QuickStart.jsx
src/screens/RoundSummary.jsx
src/screens/Scoring.jsx
src/screens/StartRound.jsx
tailwind.config.js
vercel.json
vite.config.js
```

## Original notes

Every doc that existed for this project, verbatim (duplicates removed, secrets redacted). Click to expand.

<details>
<summary><b>AI_CONTEXT.md</b> · repo · 2.0 KB</summary>

# AI_CONTEXT — Golf Scorecard
> For AI assistant use. Read this at the start of every session to get up to speed instantly.
> **Update this file after every meaningful change.**

---

## Project Identity
- **Name:** Golf Scorecard
- **Type:** Progressive Web App (PWA)
- **Live URL:** https://golf.c2tbuilds.com
- **GitHub:** https://github.com/teel23/golf-scorecard *(create this repo — see MASTER.md)*
- **Netlify:** Connect GitHub repo to auto-deploy on push
- **Status:** Live / Beta

---

## Tech Stack
| Layer | Tech |
|---|---|
| Framework | React (via Vite) |
| Language | JavaScript/TypeScript |
| Styling | Tailwind CSS |
| Build Tool | Vite |
| Database | Dexie.js (IndexedDB wrapper) |
| PWA | Service Worker, Web App Manifest |
| Deployment | Netlify |

---

## Key Features
- Augusta-inspired design
- Course management (full 18-hole par data per course)
- Stroke tracking hole-by-hole with preset buttons (Eagle → Double Bogey)
- Running totals vs par
- Round history with front/back 9 breakdowns
- All data stored locally on device (offline-first)
- Installable as PWA

---

## Key File Map
```
src/              ← Main React source
  components/     ← UI components
  lib/            ← Dexie.js database setup
public/           ← Static assets, manifest
dist/             ← Production build output (gitignored)
index.html        ← Vite entry point
vite.config.js    ← Build config
tailwind.config.js
```

---

## Deployment Flow
1. Make changes in `/AI/Golf/golf-app/`
2. `npm run build` to verify
3. `git add . && git commit -m "message"`
4. `git push` → Netlify auto-deploys
5. Update this file

---

## Recent Changes (update after each session)
| Date | Change |
|---|---|
| Feb 2026 | Initialized git repo, added docs |

---

## Next Steps
- [ ] Connect GitHub repo to Netlify for auto-deploy
- [ ] Cloud sync / backup for round history
- [ ] Multi-player / group scoring
- [ ] Handicap tracking
- [ ] Course library with popular US courses pre-loaded
- [ ] Stats and trend charts (Chart.js or Recharts)

</details>


<details>
<summary><b>NOTES.md</b> · repo · 2.4 KB</summary>

# Golf Scorecard — Project Notes
> Reference for jumping back into this project.
> Last updated: March 9, 2026

---

## What It Is
An offline-first golf scoring PWA with Augusta-inspired design. Manage courses with full 18-hole par data, track strokes hole-by-hole, view running totals vs par, and review complete round history with front/back 9 breakdowns. Everything stored locally — works without internet.

## Live URL
🌐 **https://golf.c2tbuilds.com**

## GitHub
📁 **https://github.com/teel23/golf-scorecard**

## Local Path
`/COMPUTER/AI/Projects/golf-scorecard/golf-app/`

## Platform
🚀 **Vercel** — auto-deploys on push to `main`

---

## Tech Stack
React · Vite · Tailwind CSS · Dexie.js (IndexedDB wrapper) · PWA · Vercel

## Storage
- **IndexedDB**: `GolfAppDB` (version 10)
- Stores: `courses` (keyPath: `id`, index: `name`) and `rounds` (keyPath: `id`, indexes: `courseId`, `date`)
- Round schema: `{ id, courseId, courseName, tee, date, notes, players[], holes[], totalScore, scoreVsPar }`
- Player schema: `{ name, holes: [{ number, par, handicap, strokes }] }`

---

## Status
✅ Live | 🔶 Beta

---

## Portfolio Card
- Buttons: Launch App (blue) + Install App (green)
- Screenshots: `golf-home.png` (dashboard) + `golf-game.png` (2-player scorecard — Carson 75 +3, Mike 84 +12)

---

## Recent Changes
| Date | What Changed |
|---|---|
| Feb 2026 | Initialized git repo, created project docs |
| Mar 9, 2026 | New portfolio screenshots: dashboard + 2-player round (fake data injected via IndexedDB) |
| Mar 9, 2026 | Install App button added to portfolio card |

---

## Open Items
- [ ] Handicap tracking — calculate course handicap from round history (Beta-removal feature)
- [ ] Feature: Import round from 18 Birdies (image upload → parse → log)
- [ ] Feature: Fairway hit direction — arrow keys (Left, Right, Short, Long)
- [ ] Feature: GIR direction — same arrow/checkmark UI
- [ ] Pre-loaded popular US courses
- [ ] Group / multiplayer scoring
- [ ] Stats and trends charts
- [ ] Cloud backup (Supabase)

---

## Requested Features (logged Mar 2026)

### Import Round from 18 Birdies
Upload a screenshot/export from 18 Birdies → app parses and logs the round data. No direct API needed.

### Fairway Hit Direction
After marking fairway hit, show arrow keys + checkmark: Left, Right, Short, Long (match 18 Birdies UX).

### GIR Direction
Same direction UI as fairway after a GIR miss: Short, Long, Left, Right.

</details>


<details>
<summary><b>README.md</b> · repo · 1.1 KB</summary>

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

</details>


<details>
<summary><b>golf-scorecard/NOTES.md</b> · iCloud · 1.4 KB</summary>

# Golf Scorecard — Project Notes
> Reference for jumping back into this project.
> Last updated: July 8, 2026

---

## What It Is
A mobile-first golf scorecard PWA. Supports full 18-hole rounds, multiple courses, per-hole scoring, and par tracking. Installable on any device. Built to replace paper scorecards on the course.

## Live URL
🌐 **https://golf.c2tbuilds.com**

## GitHub
📁 **https://github.com/teel23/golf-scorecard**

## Local Path
`/COMPUTER/AI/Projects/golf-scorecard/golf-app/`

## Platform
🚀 **Vercel** — auto-deploys on push to `main`

---

## Tech Stack
React · JavaScript (JSX) · Vite · Dexie (IndexedDB) · PWA · Vercel

## Storage
- **IndexedDB via Dexie** — `GolfAppDB` (schema version 1 — single version, no migrations needed)
- Stores: `courses`, `rounds`
- No localStorage for game data

## App Structure
- React SPA · entry: `src/App.jsx`
- Screens in `src/screens/`
- DB logic in `src/db/`

---

## Status
✅ Live — handicap tracking shipped (was the Beta-exit feature)

---

## Portfolio Card
- Button: Launch App (blue)
- Screenshot: `golf-real.png`
- No code link on card

---

## Known Bugs

---

## Recent Changes
| Date | What Changed |
|---|---|
| Mar 2026 | Project notes created |

---

## Open Items
- [ ] Test IndexedDB persistence across app restarts on iOS PWA
- [ ] Handicap tracking — primary Beta-removal feature
- [ ] Confirm golf.c2tbuilds.com resolves correctly on all devices

</details>


<details>
<summary><b>_Archive/2026-06-24-audit/golf-scorecard/golf-app/AUDIT_MARCH_2026.md</b> · iCloud _Archive · 2.8 KB</summary>

# Golf Scorecard — Audit Report
*Generated: March 2026*

## Current State
- Live URL: https://golf.c2tbuilds.com
- GitHub Repo: https://github.com/teel23/golf-scorecard
- Hosting Platform: Vercel ✅
- Auto-Deploy: Yes (push to main → Vercel builds)
- Status: Live / Beta

## Tech Stack
- Framework: React 19.2
- Build Tool: Vite 7.3 + @vitejs/plugin-react 5.1
- Key Libraries: Dexie 4.3 (IndexedDB ORM), Tailwind CSS 3.4, vite-plugin-pwa 1.2, Workbox
- Node Version: Not pinned (no .nvmrc, no engines field)
- Deprecated Tech: None — up-to-date stack (React 19 is latest)

## Deployment Health
- Vercel config: ✅ Created this session (`vercel.json` with buildCommand, outputDirectory: dist, framework: vite, SPA rewrites)
- Netlify files removed: ✅ `.netlify/` directory deleted. `_redirects` deleted from both `public/` and `dist/`. SPA routing now handled by `vercel.json` rewrites.
- Portfolio links correct: ✅ golf.c2tbuilds.com confirmed correct in Portfolio

## Dead Code & Waste
- Unused files: `src/assets/react.svg` — default Vite scaffold asset, not used in the app
- Unused components: None — all screens in /screens appear to be wired up in App.jsx
- Unused assets: `public/vite.svg` — default Vite scaffold icon, not referenced in production
- Console.logs in prod: None
- Other waste:
  - `dist/vite.svg` — build artifact of the unused public/vite.svg (delete public/vite.svg and rebuild to remove)

## Completion Assessment
**Percent complete: 70%**

### What's done:
- Course management with full 18-hole par data
- Stroke tracking hole-by-hole (Eagle → Double Bogey presets)
- Running score vs par
- Full round history with front/back 9 breakdowns
- Offline-first PWA with Workbox service worker
- Dexie.js for local IndexedDB storage
- Deployed on Vercel with custom domain

### What's missing to call this finished:
- Handicap tracking (this is the stated Beta-removal feature)
- No multiplayer / group scoring
- Import round from 18 Birdies (image upload + parse)
- Fairway hit direction tracking
- GIR direction tracking
- No pre-loaded course library (cold-start friction for new users)

## Next Phase Plan
### Phase: Handicap + Beta Removal
**Goal:** Implement handicap tracking to remove Beta tag
**Features:**
- Calculate course handicap from round history
- Display handicap differential per round
- Show handicap index on Dashboard
**Estimated effort:** 1 session

### Phase: Course Library + Onboarding
**Goal:** Eliminate cold-start friction
**Features:**
- Pre-load 10 popular local US courses with par data
- Quick Start player selector (1-4 players, same UI as Start Round)
**Estimated effort:** 1 session

## Quick Fixes Done This Session
- Deleted `.netlify/` directory
- Deleted `public/_redirects` and `dist/_redirects` (Netlify-specific)
- Created `vercel.json` (Vite SPA config with rewrites)

</details>
