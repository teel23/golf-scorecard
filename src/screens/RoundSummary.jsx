import React, { useState } from 'react';
import { calculateRoundTotals, calculateFrontBackTotals, formatScoreVsPar, scoreClass } from '../games/scoring';

// Renders a full hole-by-hole scorecard for one player's holes array.
function PlayerScorecard({ holes }) {
  const { totalStrokes, totalPar, scoreVsPar } = calculateRoundTotals(holes);
  const svpStr = formatScoreVsPar(scoreVsPar);

  const HoleRow = ({ h }) => {
    const svp = h.strokes > 0 ? h.strokes - h.par : null;
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '28px 30px 36px 42px', gap: 4, padding: '7px 12px', borderBottom: '1px solid rgba(201,168,76,0.07)', alignItems: 'center' }}>
        <div style={{ fontSize: 12, color: 'rgba(245,237,214,0.5)', textAlign: 'center' }}>{h.number}</div>
        <div style={{ fontSize: 12, color: 'rgba(245,237,214,0.6)', textAlign: 'center' }}>{h.par}</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#f5edd6', textAlign: 'center' }}>{h.strokes || '—'}</div>
        <div className={svp !== null ? scoreClass(svp) : ''} style={{ fontSize: 12, fontWeight: 700, textAlign: 'center', color: svp === null ? 'rgba(245,237,214,0.25)' : undefined }}>
          {svp !== null ? formatScoreVsPar(svp) : '—'}
        </div>
      </div>
    );
  };

  return (
    <div className="fairway-panel" style={{ borderRadius: 14, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'grid', gridTemplateColumns: '28px 30px 36px 42px', gap: 4, padding: '8px 12px', borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
        {['#', 'Par', 'Sc', '+/-'].map(h => (
          <div key={h} style={{ fontSize: 10, color: 'rgba(201,168,76,0.7)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center' }}>{h}</div>
        ))}
      </div>
      {/* Front 9 */}
      <div style={{ padding: '4px 12px', fontSize: 10, color: 'rgba(201,168,76,0.5)', fontWeight: 700, background: 'rgba(0,0,0,0.1)', letterSpacing: 1 }}>FRONT 9</div>
      {holes.slice(0, 9).map(h => <HoleRow key={h.number} h={h} />)}
      {/* Back 9 */}
      {holes.length > 9 && (
        <>
          <div style={{ padding: '4px 12px', fontSize: 10, color: 'rgba(201,168,76,0.5)', fontWeight: 700, background: 'rgba(0,0,0,0.1)', letterSpacing: 1 }}>BACK 9</div>
          {holes.slice(9).map(h => <HoleRow key={h.number} h={h} />)}
        </>
      )}
      {/* Totals row */}
      <div style={{ display: 'grid', gridTemplateColumns: '28px 30px 36px 42px', gap: 4, padding: '9px 12px', background: 'rgba(201,168,76,0.08)', alignItems: 'center' }}>
        <div style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 800, textAlign: 'center', gridColumn: '1/3' }}>TOTAL</div>
        <div style={{ fontSize: 15, fontWeight: 900, color: '#f5edd6', textAlign: 'center' }}>{totalStrokes}</div>
        <div className={scoreClass(scoreVsPar)} style={{ fontSize: 13, fontWeight: 900, textAlign: 'center' }}>{svpStr}</div>
      </div>
    </div>
  );
}

export default function RoundSummary({ round, onHome, onHistory }) {
  if (!round) return null;

  const [selectedPlayerIdx, setSelectedPlayerIdx] = useState(0);

  const isMultiPlayer = round.players && round.players.length > 1;

  // ── Multi-player view ──────────────────────────────────────────────────────
  if (isMultiPlayer) {
    // Rank players by total strokes (ascending)
    const rankedPlayers = round.players
      .map(p => {
        const { totalStrokes, totalPar, scoreVsPar } = calculateRoundTotals(p.holes);
        const totalMulligans = p.holes.reduce((s, h) => s + (h.mulligans || 0), 0);
        return { ...p, totalStrokes, totalPar, scoreVsPar, totalMulligans };
      })
      .sort((a, b) => a.totalStrokes - b.totalStrokes);

    const medals = ['🥇', '🥈', '🥉', '4️⃣'];

    const selectedPlayer = round.players[selectedPlayerIdx];
    const { front, back } = calculateFrontBackTotals(selectedPlayer.holes);

    return (
      <div className="fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', maxWidth: 480, width: '100%', margin: '0 auto', padding: '0 16px' }}>

        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, paddingTop: 20, paddingBottom: 8 }}>

          {/* Title */}
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: 'rgba(201,168,76,0.7)', textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700 }}>{round.courseName} · {round.tee}</div>
            <div style={{ fontSize: 13, color: 'rgba(245,237,214,0.4)', marginTop: 2 }}>
              {new Date(round.date).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
            {round.notes && <div style={{ fontSize: 12, color: 'rgba(245,237,214,0.4)', marginTop: 4, fontStyle: 'italic' }}>{round.notes}</div>}
          </div>

          {/* Leaderboard */}
          <div style={{ fontSize: 11, color: 'rgba(201,168,76,0.8)', textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 700, marginBottom: 8 }}>Leaderboard</div>
          <div className="fairway-panel" style={{ borderRadius: 14, overflow: 'hidden', marginBottom: 20 }}>
            {rankedPlayers.map((p, i) => {
              const svpStr = formatScoreVsPar(p.scoreVsPar);
              const svpCls = scoreClass(p.scoreVsPar);
              const isFirst = i === 0;
              return (
                <div key={p.name} style={{
                  display: 'flex', alignItems: 'center',
                  padding: '13px 16px',
                  background: isFirst ? 'rgba(201,168,76,0.06)' : 'transparent',
                  borderBottom: i < rankedPlayers.length - 1 ? '1px solid rgba(201,168,76,0.1)' : 'none',
                }}>
                  <div style={{ width: 28, fontSize: 20, textAlign: 'center', flexShrink: 0 }}>{medals[i] || `${i + 1}.`}</div>
                  <div style={{ flex: 1, marginLeft: 8 }}>
                    <div style={{ fontSize: 15, fontWeight: isFirst ? 800 : 600, color: '#f5edd6' }}>{p.name}</div>
                    {p.totalMulligans > 0 && (
                      <div style={{ fontSize: 10, color: 'rgba(245,237,214,0.4)', marginTop: 1 }}>{p.totalMulligans} mulligan{p.totalMulligans !== 1 ? 's' : ''}</div>
                    )}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: '#f5edd6' }}>{p.totalStrokes}</div>
                    <div className={svpCls} style={{ fontSize: 12, fontWeight: 700 }}>{svpStr}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Scorecard section */}
          <div style={{ fontSize: 11, color: 'rgba(201,168,76,0.8)', textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 700, marginBottom: 8 }}>Scorecard</div>

          {/* Player tab strip */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
            {round.players.map((p, i) => (
              <button key={i} onClick={() => setSelectedPlayerIdx(i)} style={{
                flex: 1, padding: '8px 4px', borderRadius: 10, fontSize: 11, fontWeight: 700,
                background: i === selectedPlayerIdx ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.05)',
                border: `1.5px solid ${i === selectedPlayerIdx ? 'var(--gold)' : 'rgba(255,255,255,0.1)'}`,
                color: i === selectedPlayerIdx ? 'var(--gold)' : 'rgba(245,237,214,0.5)',
              }}>
                {p.name}
              </button>
            ))}
          </div>

          {/* Front/Back for selected player */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
            <div className="fairway-panel" style={{ borderRadius: 14, padding: 14, textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: 'rgba(201,168,76,0.8)', textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 700, marginBottom: 6 }}>Front 9</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#f5edd6' }}>{front.strokes || '—'}</div>
              {front.strokes > 0 && <div style={{ fontSize: 11, color: 'rgba(245,237,214,0.5)', marginTop: 3 }}>{formatScoreVsPar(front.strokes - front.par)}</div>}
            </div>
            <div className="fairway-panel" style={{ borderRadius: 14, padding: 14, textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: 'rgba(201,168,76,0.8)', textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 700, marginBottom: 6 }}>Back 9</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#f5edd6' }}>{back.strokes || '—'}</div>
              {back.strokes > 0 && <div style={{ fontSize: 11, color: 'rgba(245,237,214,0.5)', marginTop: 3 }}>{formatScoreVsPar(back.strokes - back.par)}</div>}
            </div>
          </div>

          {/* Hole-by-hole scorecard */}
          <PlayerScorecard holes={selectedPlayer.holes} />
        </div>

        {/* Action buttons */}
        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 8, paddingBottom: 'calc(16px + env(safe-area-inset-bottom))' }}>
          <button onClick={onHome} style={{ width: '100%', padding: '16px', borderRadius: 14, border: 'none', background: 'var(--gold)', color: '#0a2e1a', fontSize: 16, fontWeight: 900 }}>
            ⛳ Home
          </button>
          <button onClick={onHistory} style={{ width: '100%', padding: '14px', borderRadius: 14, background: 'transparent', border: '1.5px solid rgba(201,168,76,0.3)', color: '#f5edd6', fontSize: 15, fontWeight: 700 }}>
            📋 Round History
          </button>
        </div>
      </div>
    );
  }

  // ── Single-player view (original UI, unchanged) ────────────────────────────
  const holes = round.holes;
  const { totalStrokes, totalPar, scoreVsPar, holesPlayed } = calculateRoundTotals(holes);
  const { front, back } = calculateFrontBackTotals(holes);
  const svpStr        = formatScoreVsPar(scoreVsPar);
  const svpCls        = scoreClass(scoreVsPar);
  const totalMulligans = holes.reduce((s, h) => s + (h.mulligans || 0), 0);

  const StatCard = ({ label, main, sub, cls }) => (
    <div className="fairway-panel" style={{ borderRadius: 14, padding: '14px', textAlign: 'center' }}>
      <div style={{ fontSize: 10, color: 'rgba(201,168,76,0.8)', textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 700, marginBottom: 6 }}>{label}</div>
      <div className={cls || ''} style={{ fontSize: 26, fontWeight: 900, color: cls ? undefined : '#f5edd6' }}>{main}</div>
      {sub && <div style={{ fontSize: 11, color: 'rgba(245,237,214,0.5)', marginTop: 3 }}>{sub}</div>}
    </div>
  );

  return (
    <div className="fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', maxWidth: 480, width: '100%', margin: '0 auto', padding: '0 16px' }}>

      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, paddingTop: 20, paddingBottom: 8 }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: 'rgba(201,168,76,0.7)', textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700 }}>{round.courseName} · {round.tee}</div>
          <div style={{ fontSize: 13, color: 'rgba(245,237,214,0.4)', marginTop: 2 }}>{new Date(round.date).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}</div>
          {round.notes && <div style={{ fontSize: 12, color: 'rgba(245,237,214,0.4)', marginTop: 4, fontStyle: 'italic' }}>{round.notes}</div>}
        </div>

        {/* Hero score */}
        <div style={{ textAlign: 'center', marginBottom: 14 }}>
          <div style={{ fontSize: 72, fontWeight: 900, color: '#f5edd6', lineHeight: 1 }}>{totalStrokes}</div>
          <div className={svpCls} style={{ fontSize: 22, fontWeight: 800, marginTop: 4 }}>{svpStr}</div>
          <div style={{ fontSize: 12, color: 'rgba(245,237,214,0.4)', marginTop: 4 }}>
            Par {totalPar} · {holesPlayed} holes{totalMulligans > 0 ? ` · ${totalMulligans} mulligan${totalMulligans !== 1 ? 's' : ''}` : ''}
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
          <StatCard label="Front 9" main={front.strokes || '—'} sub={front.strokes ? formatScoreVsPar(front.strokes - front.par) : null} />
          <StatCard label="Back 9"  main={back.strokes  || '—'} sub={back.strokes  ? formatScoreVsPar(back.strokes  - back.par)  : null} />
        </div>

        {/* Hole-by-hole scorecard */}
        <div className="fairway-panel" style={{ borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr 36px 42px', gap: 4, padding: '8px 12px', borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
            {['#', 'Par', 'Sc', '+/-'].map(h => (
              <div key={h} style={{ fontSize: 10, color: 'rgba(201,168,76,0.7)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center' }}>{h}</div>
            ))}
          </div>
          <div style={{ padding: '4px 12px', fontSize: 10, color: 'rgba(201,168,76,0.5)', fontWeight: 700, background: 'rgba(0,0,0,0.1)', letterSpacing: 1 }}>FRONT 9</div>
          {holes.slice(0, 9).map(h => {
            const svp = h.strokes > 0 ? h.strokes - h.par : null;
            return (
              <div key={h.number} style={{ display: 'grid', gridTemplateColumns: '28px 1fr 36px 42px', gap: 4, padding: '7px 12px', borderBottom: '1px solid rgba(201,168,76,0.07)', alignItems: 'center' }}>
                <div style={{ fontSize: 12, color: 'rgba(245,237,214,0.5)', textAlign: 'center' }}>{h.number}</div>
                <div style={{ fontSize: 12, color: 'rgba(245,237,214,0.6)', textAlign: 'center' }}>{h.par}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#f5edd6', textAlign: 'center' }}>{h.strokes || '—'}</div>
                <div className={svp !== null ? scoreClass(svp) : ''} style={{ fontSize: 12, fontWeight: 700, textAlign: 'center', color: svp === null ? 'rgba(245,237,214,0.25)' : undefined }}>
                  {svp !== null ? formatScoreVsPar(svp) : '—'}
                </div>
              </div>
            );
          })}
          {holes.length > 9 && (
            <>
              <div style={{ padding: '4px 12px', fontSize: 10, color: 'rgba(201,168,76,0.5)', fontWeight: 700, background: 'rgba(0,0,0,0.1)', letterSpacing: 1 }}>BACK 9</div>
              {holes.slice(9).map(h => {
                const svp = h.strokes > 0 ? h.strokes - h.par : null;
                return (
                  <div key={h.number} style={{ display: 'grid', gridTemplateColumns: '28px 1fr 36px 42px', gap: 4, padding: '7px 12px', borderBottom: '1px solid rgba(201,168,76,0.07)', alignItems: 'center' }}>
                    <div style={{ fontSize: 12, color: 'rgba(245,237,214,0.5)', textAlign: 'center' }}>{h.number}</div>
                    <div style={{ fontSize: 12, color: 'rgba(245,237,214,0.6)', textAlign: 'center' }}>{h.par}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#f5edd6', textAlign: 'center' }}>{h.strokes || '—'}</div>
                    <div className={svp !== null ? scoreClass(svp) : ''} style={{ fontSize: 12, fontWeight: 700, textAlign: 'center', color: svp === null ? 'rgba(245,237,214,0.25)' : undefined }}>
                      {svp !== null ? formatScoreVsPar(svp) : '—'}
                    </div>
                  </div>
                );
              })}
            </>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr 36px 42px', gap: 4, padding: '9px 12px', background: 'rgba(201,168,76,0.08)', alignItems: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 800, textAlign: 'center', gridColumn: '1/3' }}>TOTAL</div>
            <div style={{ fontSize: 15, fontWeight: 900, color: '#f5edd6', textAlign: 'center' }}>{totalStrokes}</div>
            <div className={svpCls} style={{ fontSize: 13, fontWeight: 900, textAlign: 'center' }}>{svpStr}</div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 8, paddingBottom: 'calc(16px + env(safe-area-inset-bottom))' }}>
        <button onClick={onHome} style={{ width: '100%', padding: '16px', borderRadius: 14, border: 'none', background: 'var(--gold)', color: '#0a2e1a', fontSize: 16, fontWeight: 900 }}>
          ⛳ Home
        </button>
        <button onClick={onHistory} style={{ width: '100%', padding: '14px', borderRadius: 14, background: 'transparent', border: '1.5px solid rgba(201,168,76,0.3)', color: '#f5edd6', fontSize: 15, fontWeight: 700 }}>
          📋 Round History
        </button>
      </div>
    </div>
  );
}
