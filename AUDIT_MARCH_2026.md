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
