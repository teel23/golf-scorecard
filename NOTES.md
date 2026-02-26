# Golf Scorecard — Project Notes
> Your reference for jumping back into this project anytime.
> **Update the Recent Changes section after every session.**

---

## What It Is
An offline-first golf scoring PWA. Augusta-inspired design. Track strokes hole-by-hole, manage courses, view round history with front/back 9 breakdowns. Everything stores locally on your device — works without internet.

## Live URL
🌐 **https://golf.c2tbuilds.com**

## GitHub
📁 **https://github.com/teel23/golf-scorecard** *(needs to be created — see MASTER.md)*

---

## Current Features
- Course management with full 18-hole par data
- Quick score presets: Eagle, Birdie, Par, Bogey, Double Bogey
- Running score vs par
- Full round history
- Front/back 9 breakdowns
- Works offline (PWA)
- Install to home screen

## Status
✅ Live and working | 🔶 Beta

---

## How to Deploy Changes
1. Open terminal in `/AI/Golf/golf-app/`
2. `npm run build` (verify it builds clean)
3. `git add .`
4. `git commit -m "describe what changed"`
5. `git push`
6. Netlify auto-deploys

---

## Recent Changes (keep updated)
| Date | What Changed |
|---|---|
| Feb 2026 | Initialized git repo, created project docs |

---

## Next Steps
- [ ] Connect GitHub → Netlify auto-deploy
- [ ] Handicap tracking
- [ ] Group / multiplayer scoring
- [ ] Popular US course library built-in
- [ ] Stats and trends charts
- [ ] Cloud backup for round history

---

## Future Feature Plan

### Next Sprint
- **Handicap tracking** — calculate and display handicap based on round history. This is the Beta-removal feature.
- **Pre-loaded courses** — add 10 popular local courses to eliminate cold-start friction for new users
- **Quick Start player selector** — add the same 1-4 player UI that Start Round has

### Connectivity (future)
- Same Supabase + magic link auth plan as Darts
- Group leaderboards, cross-device sync, round sharing

### Scoring Enhancements
- Side games: Skins, Nassau, Match Play — auto-calculated
- Penalties tracker per hole
- Notes field per hole
