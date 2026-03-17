export const calculateScoreVsPar = (strokes, par) => strokes - par;

export function calculateRoundTotals(holes) {
  const played = holes.filter(h => h.strokes > 0);
  const totalStrokes = played.reduce((s, h) => s + h.strokes, 0);
  const totalPar     = played.reduce((s, h) => s + h.par, 0);
  return { totalStrokes, totalPar, scoreVsPar: totalStrokes - totalPar, holesPlayed: played.length };
}

export function calculateFrontBackTotals(holes) {
  const sum = (arr, key) => arr.reduce((s, h) => s + (h[key] || 0), 0);
  const front = holes.filter(h => h.number <= 9);
  const back  = holes.filter(h => h.number >= 10);
  return {
    front: { strokes: sum(front, 'strokes'), par: sum(front, 'par') },
    back:  { strokes: sum(back,  'strokes'), par: sum(back,  'par') },
  };
}

export function formatScoreVsPar(svp) {
  if (svp === 0) return 'E';
  if (svp > 0)   return `+${svp}`;
  return `${svp}`;
}

export function scoreClass(svp) {
  if (svp <= -2) return 'score-eagle';
  if (svp === -1) return 'score-birdie';
  if (svp === 0)  return 'score-par';
  if (svp === 1)  return 'score-bogey';
  return 'score-double';
}

export function scoreLabel(svp) {
  if (svp <= -2) return 'Eagle!';
  if (svp === -1) return 'Birdie!';
  if (svp === 0)  return 'Par';
  if (svp === 1)  return 'Bogey';
  if (svp === 2)  return 'Double';
  return `+${svp}`;
}

// Calculate net score for a player given their handicap index.
// Holes need a `handicap` field (1-18 difficulty rank, 1=hardest).
// Returns null if handicapIndex is 0/null or no holes have a handicap rank.
export function calculateNetScore(holes, handicapIndex) {
  if (!handicapIndex || handicapIndex <= 0) return null;
  const played = holes.filter(h => h.strokes > 0);
  if (!played.length) return null;
  const holesWithRank = played.filter(h => h.handicap != null && h.handicap > 0);
  if (!holesWithRank.length) return null;
  const base  = Math.floor(handicapIndex / 18);
  const extra = handicapIndex % 18;
  let netStrokes = 0;
  for (const h of played) {
    const strokesGiven = h.handicap != null && h.handicap > 0
      ? base + (h.handicap <= extra ? 1 : 0)
      : 0;
    netStrokes += Math.max(h.strokes - strokesGiven, 0);
  }
  const totalPar = played.reduce((s, h) => s + h.par, 0);
  return { netStrokes, netVsPar: netStrokes - totalPar };
}
