import React, { useState, useEffect, useRef } from 'react';
import { saveRound } from '../db/db';
import { formatScoreVsPar } from '../games/scoring';

// Player accent colors: gold, blue, green, red
const PLAYER_COLORS = ['#c9a84c', '#60a5fa', '#22c55e', '#f87171'];

// ─── Golf notation badge ──────────────────────────────────────────────────────
// Eagle≤-2: double circle gold | Birdie -1: circle gold | Par: plain cream
// Bogey +1: square cream | Double +2: double square | Triple+: filled red
function ScoreBadge({ strokes, par, onClick }) {
  const svp   = strokes - par;
  const GOLD  = '#c9a84c';
  const CREAM = '#f5edd6';
  const S     = 96;
  const IS    = 66;
  const FS    = 40;
  const base  = { cursor: onClick ? 'pointer' : 'default', flexShrink: 0 };

  if (svp <= -2) {
    return (
      <div className="badge-pop" onClick={onClick} style={{ ...base, position: 'relative', width: S, height: S, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `3px solid ${GOLD}` }} />
        <div style={{ width: IS, height: IS, borderRadius: '50%', border: `3px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: FS, fontWeight: 900, color: GOLD, lineHeight: 1 }}>{strokes}</span>
        </div>
      </div>
    );
  }
  if (svp === -1) {
    return (
      <div className="badge-pop" onClick={onClick} style={{ ...base, width: S, height: S, borderRadius: '50%', border: `3px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: FS, fontWeight: 900, color: GOLD, lineHeight: 1 }}>{strokes}</span>
      </div>
    );
  }
  if (svp === 0) {
    return (
      <span className="badge-pop" onClick={onClick} style={{ ...base, fontSize: Math.round(S * 0.65), fontWeight: 900, color: CREAM, lineHeight: 1 }}>{strokes}</span>
    );
  }
  if (svp === 1) {
    return (
      <div className="badge-pop" onClick={onClick} style={{ ...base, width: S, height: S, border: `3px solid ${CREAM}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: FS, fontWeight: 900, color: CREAM, lineHeight: 1 }}>{strokes}</span>
      </div>
    );
  }
  if (svp === 2) {
    return (
      <div className="badge-pop" onClick={onClick} style={{ ...base, position: 'relative', width: S, height: S, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, border: `3px solid ${CREAM}` }} />
        <div style={{ width: IS, height: IS, border: `3px solid ${CREAM}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: FS - 4, fontWeight: 900, color: CREAM, lineHeight: 1 }}>{strokes}</span>
        </div>
      </div>
    );
  }
  // Triple+ — filled dark square, muted red
  return (
    <div className="badge-pop" onClick={onClick} style={{ ...base, width: S, height: S, background: 'rgba(239,68,68,0.15)', border: '2px solid rgba(239,68,68,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: FS - 2, fontWeight: 900, color: '#f87171', lineHeight: 1 }}>{strokes}</span>
    </div>
  );
}

// ─── Horizontal score wheel ───────────────────────────────────────────────────
// Shows 7 numbers centred on `center`. Swipe left/right to change score;
// tap an adjacent number to jump to it; tap the centre number to confirm.
// The centre number pulses gold on confirm via the `confirming` prop.
function HorizontalScoreWheel({ center, par, onChange, onConfirm, confirming, disabled }) {
  const touchRef  = useRef(null);
  const swipedRef = useRef(false);
  const STEP_PX   = 52;

  // Visual weights per offset index [−3, −2, −1, 0, +1, +2, +3]
  const fontSizes = [14, 21, 35, 74, 35, 21, 14];
  const opacities = [0.06, 0.15, 0.42, 1, 0.42, 0.15, 0.06];
  const widths    = [26, 40, 58, 96, 58, 40, 26];

  const handleTouchStart = (e) => {
    if (disabled) return;
    touchRef.current  = e.touches[0].clientX;
    swipedRef.current = false;
  };

  const handleTouchEnd = (e) => {
    if (disabled || touchRef.current === null) return;
    const dx    = e.changedTouches[0].clientX - touchRef.current;
    const steps = Math.round(-dx / STEP_PX); // left swipe → increase
    if (Math.abs(steps) > 0) {
      onChange(Math.max(1, center + steps));
      swipedRef.current = true;
    }
    touchRef.current = null;
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ position: 'relative', width: '100%', height: 110, userSelect: 'none', overflow: 'hidden' }}
    >
      {/* Centre highlight band */}
      <div style={{
        position: 'absolute', top: 8, bottom: 8,
        left: '50%', transform: 'translateX(-50%)',
        width: 96,
        background: 'rgba(201,168,76,0.1)',
        border: '1.5px solid rgba(201,168,76,0.35)',
        borderRadius: 18,
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Left edge gradient fade (above − button so button is still tappable) */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 56,
        background: 'linear-gradient(to right, #0a2e1a 18%, transparent)',
        zIndex: 3, pointerEvents: 'none',
      }} />
      {/* Right edge gradient fade */}
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: 56,
        background: 'linear-gradient(to left, #0a2e1a 18%, transparent)',
        zIndex: 3, pointerEvents: 'none',
      }} />

      {/* − nudge button (left edge) */}
      <button
        onClick={() => { if (!disabled) onChange(Math.max(1, center - 1)); }}
        style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 56,
          background: 'transparent', border: 'none',
          color: 'rgba(201,168,76,0.8)', fontSize: 34, fontWeight: 900,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 4, cursor: 'pointer',
        }}
      >−</button>

      {/* + nudge button (right edge) */}
      <button
        onClick={() => { if (!disabled) onChange(center + 1); }}
        style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: 56,
          background: 'transparent', border: 'none',
          color: 'rgba(201,168,76,0.8)', fontSize: 34, fontWeight: 900,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 4, cursor: 'pointer',
        }}
      >+</button>

      {/* Number items */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 2,
      }}>
        {[-3, -2, -1, 0, 1, 2, 3].map((off, i) => {
          const val      = center + off;
          const isCenter = off === 0;
          const hidden   = val < 1;
          const opacity  = hidden ? 0 : opacities[i];
          const svp      = val - par;
          const color    = isCenter ? (svp < 0 ? '#c9a84c' : '#f5edd6') : '#f5edd6';

          return (
            <div
              key={off}
              onClick={() => {
                if (disabled || swipedRef.current || hidden) return;
                if (isCenter) onConfirm(val);
                else onChange(val);
              }}
              style={{
                width: widths[i],
                flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity,
                cursor: !disabled && !hidden ? 'pointer' : 'default',
              }}
            >
              {!hidden && (
                <span
                  className={isCenter && confirming ? 'pulse-gold' : ''}
                  style={{ fontSize: fontSizes[i], fontWeight: 900, color, lineHeight: 1 }}
                >
                  {val}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Scoring({ round, onFinish, onAbandon }) {
  const isQuickStart = !!round.isQuickStart;

  // Normalise: always work with a players array.
  const initPlayers = () => {
    if (round.players && round.players.length > 0) {
      return round.players.map(p => ({
        ...p,
        holes: p.holes.map(h => ({
          number:    h.number,
          par:       h.par,
          handicap:  h.handicap  ?? null,
          yardage:   h.yardage   ?? null,
          strokes:   h.strokes   || 0,
          putts:     h.putts     ?? null,
          fairway:   h.fairway   ?? null,
          gir:       h.gir       ?? null,
          upAndDown: h.upAndDown ?? null,
          mulligans: h.mulligans ?? 0,
        })),
      }));
    }
    return [{
      name: 'Player 1',
      holes: round.holes.map(h => ({
        number:    h.number,
        par:       h.par,
        handicap:  h.handicap  ?? null,
        yardage:   h.yardage   ?? null,
        strokes:   h.strokes   || 0,
        putts:     h.putts     ?? null,
        fairway:   h.fairway   ?? null,
        gir:       h.gir       ?? null,
        upAndDown: h.upAndDown ?? null,
        mulligans: h.mulligans ?? 0,
      })),
    }];
  };

  const [players,        setPlayers]        = useState(initPlayers);
  const [holeIdx,        setHoleIdx]        = useState(0);
  const [playerIdx,      setPlayerIdx]      = useState(0);
  const [saving,         setSaving]         = useState(false);
  const [wheelVal,       setWheelVal]       = useState(null); // null → show par
  const [scoreConfirmed, setScoreConfirmed] = useState(false);
  const [showStats,      setShowStats]      = useState(false);
  const [confirming,     setConfirming]     = useState(false); // brief pulse animation

  const isMulti    = players.length > 1;
  const totalHoles = players[0].holes.length;

  // Use a ref so the useEffect always reads freshest state
  const playersRef = useRef(players);
  playersRef.current = players;

  // Reset per-turn UI whenever hole or player changes
  useEffect(() => {
    const h        = playersRef.current[playerIdx]?.holes[holeIdx];
    const hasScore = (h?.strokes ?? 0) > 0;
    setWheelVal(hasScore ? h.strokes : null);
    setScoreConfirmed(hasScore);
    setShowStats(false);
    setConfirming(false);
  }, [holeIdx, playerIdx]);

  const curPlayer   = players[playerIdx];
  const curHole     = curPlayer.holes[holeIdx];
  const isPar3      = curHole.par === 3;
  const wheelCenter = wheelVal ?? curHole.par;
  const playerColor = PLAYER_COLORS[playerIdx % PLAYER_COLORS.length];

  // Live running total: all confirmed holes + current hole's pending wheel value
  const liveStrokes = curPlayer.holes.reduce((s, h, i) => {
    if (i === holeIdx) return s + (scoreConfirmed ? h.strokes : wheelCenter);
    return s + (h.strokes > 0 ? h.strokes : 0);
  }, 0);
  const livePar = curPlayer.holes.reduce((s, h, i) => {
    if (i === holeIdx) return s + h.par;
    return s + (h.strokes > 0 ? h.par : 0);
  }, 0);
  const liveScoreVsPar = liveStrokes - livePar;

  // Color for the live score display
  const liveTotalColor = liveScoreVsPar < 0
    ? '#c9a84c'
    : liveScoreVsPar === 0
      ? 'rgba(245,237,214,0.9)'
      : 'rgba(245,237,214,0.6)';

  const allDone = players.every(p => p.holes.every(h => h.strokes > 0));
  const atEnd   = holeIdx === totalHoles - 1 && playerIdx === players.length - 1;

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const updateHole = (updates) =>
    setPlayers(prev => prev.map((p, pi) =>
      pi !== playerIdx ? p : {
        ...p,
        holes: p.holes.map((h, hi) => hi !== holeIdx ? h : { ...h, ...updates }),
      }
    ));

  const cyclePar = () => {
    if (!isQuickStart) return;
    const next = curHole.par >= 5 ? 3 : curHole.par + 1;
    setPlayers(prev => prev.map(p => ({
      ...p,
      holes: p.holes.map((h, hi) => hi !== holeIdx ? h : { ...h, par: next }),
    })));
  };

  const confirmScore = (val) => {
    if (confirming) return;
    updateHole({ strokes: val });
    setWheelVal(val); // keep wheel centred on confirmed value during animation
    setConfirming(true);
    setTimeout(() => {
      setConfirming(false);
      setScoreConfirmed(true);
      setShowStats(true);
    }, 300);
  };

  const editScore = () => {
    setScoreConfirmed(false);
    setShowStats(false);
    setWheelVal(curHole.strokes || null);
  };

  // After stats Done: auto-advance to next player on hole, then next hole
  const handleStatsDone = () => {
    setShowStats(false);
    if (isMulti && playerIdx < players.length - 1) {
      setPlayerIdx(p => p + 1);
    } else if (holeIdx < totalHoles - 1) {
      setHoleIdx(h => h + 1);
      setPlayerIdx(0);
    }
    // else: last player on last hole — stay; Finish button is visible
  };

  const handleFinish = async () => {
    if (!allDone || saving) return;
    setSaving(true);
    const playersWithTotals = players.map(p => {
      const played     = p.holes.filter(h => h.strokes > 0);
      const totalScore = played.reduce((s, h) => s + h.strokes, 0);
      const totalPar   = played.reduce((s, h) => s + h.par, 0);
      return { ...p, totalScore, scoreVsPar: totalScore - totalPar };
    });
    const completed = {
      ...round,
      players: playersWithTotals,
      holes:      playersWithTotals[0].holes,
      totalScore: playersWithTotals[0].totalScore,
      scoreVsPar: playersWithTotals[0].scoreVsPar,
    };
    const id = await saveRound(completed);
    onFinish({ ...completed, id });
  };

  const goHole = (dir) => {
    const next = holeIdx + dir;
    if (next < 0 || next >= totalHoles) return;
    setHoleIdx(next);
    setPlayerIdx(0);
  };

  // ── Style helpers ────────────────────────────────────────────────────────────
  const toggleBtn = (on, color) => ({
    flex: 1, minHeight: 64, padding: '0', borderRadius: 12, fontSize: 18, fontWeight: 800,
    background: on ? `${color}26` : 'rgba(255,255,255,0.05)',
    border:     `2px solid ${on ? color : 'rgba(255,255,255,0.1)'}`,
    color:      on ? color : 'rgba(245,237,214,0.4)',
  });

  const puttBtn = (n) => ({
    flex: 1, minHeight: 64, borderRadius: 10,
    background: curHole.putts === n ? 'rgba(201,168,76,0.25)' : 'rgba(255,255,255,0.05)',
    border:     `2px solid ${curHole.putts === n ? 'var(--gold)' : 'rgba(255,255,255,0.1)'}`,
    color:      curHole.putts === n ? 'var(--gold)' : 'rgba(245,237,214,0.4)',
    fontSize: 22, fontWeight: 800,
  });

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div
      className="fade-in"
      style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', maxWidth: 480, width: '100%', margin: '0 auto', position: 'relative' }}
    >

      {/* ── Top bar: Quit + course info ─────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px 6px', flexShrink: 0 }}>
        <button
          onClick={() => window.confirm('Abandon round?') && onAbandon()}
          style={{
            background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)',
            color: '#f87171', borderRadius: 8, padding: '8px 14px', fontSize: 13, fontWeight: 700,
            minHeight: 40,
          }}
        >
          ✕ Quit
        </button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: 'rgba(245,237,214,0.6)', fontWeight: 600 }}>{round.courseName}</div>
          {round.tee && (
            <div style={{ fontSize: 10, color: 'rgba(245,237,214,0.35)', marginTop: 1 }}>{round.tee} tees · {round.date}</div>
          )}
        </div>
        <div style={{ width: 72 }} />
      </div>

      {/* ── Hole info: HOLE # (largest), PAR # (second largest), HDCP/YDS ─── */}
      <div style={{ textAlign: 'center', flexShrink: 0, padding: '0 16px 4px' }}>
        {/* HOLE label + number */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(245,237,214,0.38)', textTransform: 'uppercase', letterSpacing: 2.5, marginBottom: 0 }}>
            Hole
          </div>
          <div style={{ fontSize: 72, fontWeight: 900, color: '#f5edd6', lineHeight: 1 }}>
            {curHole.number}
          </div>
        </div>

        {/* PAR — second largest, tappable on QuickStart */}
        {isQuickStart ? (
          <button
            onClick={cyclePar}
            style={{
              background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.4)',
              borderRadius: 24, padding: '4px 22px', marginTop: 2,
              color: 'var(--gold)', fontSize: 30, fontWeight: 800,
            }}
          >
            Par {curHole.par} ✎
          </button>
        ) : (
          <div style={{ fontSize: 30, fontWeight: 800, color: 'rgba(245,237,214,0.72)', marginTop: 2 }}>
            Par {curHole.par}
          </div>
        )}

        {/* HDCP + YDS — only when course data has these values */}
        {(curHole.handicap != null || curHole.yardage != null) && (
          <div style={{ fontSize: 13, color: 'rgba(245,237,214,0.42)', fontWeight: 600, marginTop: 4, letterSpacing: 0.5 }}>
            {curHole.handicap != null && `HDCP ${curHole.handicap}`}
            {curHole.handicap != null && curHole.yardage != null && '\u2002·\u2002'}
            {curHole.yardage  != null && `${curHole.yardage} YDS`}
          </div>
        )}
      </div>

      {/* ── Player strip: name (colored) + mulligan M+ + live running total ── */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: isMulti ? 'space-between' : 'flex-end',
        padding: '8px 20px 6px',
        flexShrink: 0,
      }}>
        {/* Player name + dot + mulligan (multi-player) */}
        {isMulti && (
          <div
            key={`${holeIdx}-${playerIdx}`}
            className="player-in"
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            {/* Accent dot */}
            <div style={{ width: 9, height: 9, borderRadius: '50%', background: playerColor, flexShrink: 0 }} />
            {/* Name */}
            <span style={{ fontSize: 22, fontWeight: 900, color: playerColor, letterSpacing: 0.2 }}>
              {curPlayer.name}
            </span>
            {/* Mulligan M+ button */}
            <button
              onClick={() => updateHole({ mulligans: curHole.mulligans + 1 })}
              style={{
                padding: '5px 10px', borderRadius: 8, minHeight: 32,
                background: curHole.mulligans > 0 ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.06)',
                border: `1px solid ${curHole.mulligans > 0 ? 'rgba(201,168,76,0.55)' : 'rgba(255,255,255,0.12)'}`,
                color: curHole.mulligans > 0 ? '#c9a84c' : 'rgba(245,237,214,0.45)',
                fontSize: 12, fontWeight: 700,
              }}
            >
              M{curHole.mulligans > 0 ? ` ×${curHole.mulligans}` : '+'}
            </button>
          </div>
        )}

        {/* Mulligan for single-player (left side) */}
        {!isMulti && (
          <button
            onClick={() => updateHole({ mulligans: curHole.mulligans + 1 })}
            style={{
              padding: '5px 10px', borderRadius: 8, minHeight: 32,
              background: curHole.mulligans > 0 ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.06)',
              border: `1px solid ${curHole.mulligans > 0 ? 'rgba(201,168,76,0.55)' : 'rgba(255,255,255,0.12)'}`,
              color: curHole.mulligans > 0 ? '#c9a84c' : 'rgba(245,237,214,0.45)',
              fontSize: 12, fontWeight: 700,
            }}
          >
            M{curHole.mulligans > 0 ? ` ×${curHole.mulligans}` : '+'}
          </button>
        )}

        {/* Live running +/- total (right side, always) */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 10, color: 'rgba(245,237,214,0.38)', textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 700 }}>
            Running
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, color: liveTotalColor, lineHeight: 1 }}>
            {formatScoreVsPar(liveScoreVsPar)}
          </div>
        </div>
      </div>

      {/* ── Score area: wheel (pending) or badge (confirmed) ─────────────────── */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        minHeight: 0, padding: '4px 0',
      }}>
        {scoreConfirmed ? (
          /* Confirmed — golf notation badge, tap to edit */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <ScoreBadge strokes={curHole.strokes} par={curHole.par} onClick={editScore} />
            <div style={{ fontSize: 11, color: 'rgba(245,237,214,0.22)', textTransform: 'uppercase', letterSpacing: 2 }}>
              tap to edit
            </div>
          </div>
        ) : (
          /* Pending — horizontal scroll wheel */
          <HorizontalScoreWheel
            center={wheelCenter}
            par={curHole.par}
            onChange={setWheelVal}
            onConfirm={confirmScore}
            confirming={confirming}
            disabled={confirming}
          />
        )}
      </div>

      {/* ── Early-finish banner (all done but browsing back through holes) ─── */}
      {allDone && !atEnd && !showStats && (
        <div style={{ flexShrink: 0, padding: '0 16px 8px' }}>
          <button
            onClick={handleFinish}
            disabled={saving}
            style={{ width: '100%', padding: '14px', borderRadius: 14, border: 'none', background: 'var(--gold)', color: '#0a2e1a', fontSize: 15, fontWeight: 900 }}
          >
            {saving ? 'Saving…' : '✓ Finish Round'}
          </button>
        </div>
      )}

      {/* ── Hole navigation: ← | HOLE N | → / Finish ────────────────────────── */}
      <div style={{
        flexShrink: 0,
        display: 'grid', gridTemplateColumns: '1fr auto 1fr',
        gap: 10, alignItems: 'center',
        padding: '8px 16px',
        paddingBottom: 'calc(14px + env(safe-area-inset-bottom))',
      }}>
        {/* ← Prev hole */}
        <button
          onClick={() => goHole(-1)}
          disabled={holeIdx === 0}
          style={{
            height: 72, borderRadius: 16,
            background: holeIdx > 0 ? 'rgba(201,168,76,0.1)'  : 'rgba(255,255,255,0.03)',
            border: `2px solid ${holeIdx > 0 ? 'rgba(201,168,76,0.35)' : 'rgba(255,255,255,0.06)'}`,
            color:  holeIdx > 0 ? '#f5edd6' : 'rgba(245,237,214,0.16)',
            fontSize: 34, fontWeight: 700,
          }}
        >‹</button>

        {/* Current hole number (navigation context) */}
        <div style={{ textAlign: 'center', padding: '0 10px' }}>
          <div style={{ fontSize: 34, fontWeight: 900, color: '#f5edd6', lineHeight: 1 }}>
            {curHole.number}
          </div>
          <div style={{ fontSize: 10, color: 'rgba(245,237,214,0.32)', textTransform: 'uppercase', letterSpacing: 1.5 }}>
            of {totalHoles}
          </div>
        </div>

        {/* → Next hole or Finish Round */}
        {holeIdx < totalHoles - 1 ? (
          <button
            onClick={() => goHole(1)}
            style={{
              height: 72, borderRadius: 16,
              background: 'rgba(201,168,76,0.1)',
              border: '2px solid rgba(201,168,76,0.35)',
              color: '#f5edd6', fontSize: 34, fontWeight: 700,
            }}
          >›</button>
        ) : (
          <button
            onClick={handleFinish}
            disabled={!allDone || saving}
            style={{
              height: 72, borderRadius: 16, border: 'none',
              fontSize: 14, fontWeight: 900,
              background: allDone && !saving ? 'var(--gold)' : 'rgba(201,168,76,0.18)',
              color:      allDone && !saving ? '#0a2e1a'    : 'rgba(201,168,76,0.4)',
            }}
          >
            {saving ? 'Saving…' : allDone ? '✓ Finish Round' : `${players.reduce((s, p) => s + p.holes.filter(h => !h.strokes).length, 0)} left`}
          </button>
        )}
      </div>

      {/* ── Stats bottom sheet ────────────────────────────────────────────────── */}
      {showStats && (
        <>
          {/* Backdrop scrim with blur */}
          <div
            onClick={() => setShowStats(false)}
            style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              zIndex: 20,
            }}
          />

          {/* Sheet */}
          <div className="slide-up" style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 21,
            background: '#0f4c2a',
            borderRadius: '22px 22px 0 0',
            border: '1.5px solid rgba(201,168,76,0.3)',
            borderBottom: 'none',
            padding: '16px 20px',
            paddingBottom: 'calc(22px + env(safe-area-inset-bottom))',
          }}>
            {/* Drag handle */}
            <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.18)', margin: '0 auto 16px' }} />

            {/* Player name label inside sheet (multi-player) */}
            {isMulti && (
              <div style={{
                fontSize: 12, fontWeight: 800, color: playerColor,
                textAlign: 'center', marginBottom: 16,
                textTransform: 'uppercase', letterSpacing: 2,
              }}>
                {curPlayer.name}
              </div>
            )}

            {/* Putts */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: 'rgba(201,168,76,0.7)', textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 700, marginBottom: 8 }}>Putts</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} onClick={() => updateHole({ putts: curHole.putts === n ? null : n })} style={puttBtn(n)}>
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Par 3: Up & Down only. Non-par-3: GIR + Fairway */}
            {isPar3 ? (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10, color: 'rgba(201,168,76,0.7)', textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 700, marginBottom: 8 }}>Up &amp; Down</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => updateHole({ upAndDown: curHole.upAndDown === true  ? null : true  })} style={toggleBtn(curHole.upAndDown === true,  '#22c55e')}>Yes</button>
                  <button onClick={() => updateHole({ upAndDown: curHole.upAndDown === false ? null : false })} style={toggleBtn(curHole.upAndDown === false, '#ef4444')}>No</button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 10, color: 'rgba(201,168,76,0.7)', textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 700, marginBottom: 8 }}>Green in Regulation</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => updateHole({ gir: curHole.gir === true  ? null : true  })} style={toggleBtn(curHole.gir === true,  '#22c55e')}>Yes</button>
                    <button onClick={() => updateHole({ gir: curHole.gir === false ? null : false })} style={toggleBtn(curHole.gir === false, '#ef4444')}>No</button>
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 10, color: 'rgba(201,168,76,0.7)', textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 700, marginBottom: 8 }}>Fairway Hit</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => updateHole({ fairway: curHole.fairway === true  ? null : true  })} style={toggleBtn(curHole.fairway === true,  '#22c55e')}>Yes</button>
                    <button onClick={() => updateHole({ fairway: curHole.fairway === false ? null : false })} style={toggleBtn(curHole.fairway === false, '#ef4444')}>No</button>
                  </div>
                </div>
              </>
            )}

            {/* Done — saves stats, auto-advances */}
            <button
              onClick={handleStatsDone}
              style={{ width: '100%', padding: '18px', borderRadius: 14, border: 'none', background: 'var(--gold)', color: '#0a2e1a', fontSize: 17, fontWeight: 900 }}
            >
              Done
            </button>
          </div>
        </>
      )}
    </div>
  );
}
