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
