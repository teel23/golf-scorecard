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
