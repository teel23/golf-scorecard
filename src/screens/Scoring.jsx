import React, { useState } from 'react';
import { saveRound } from '../db/db';
import { calculateRoundTotals, formatScoreVsPar, scoreClass, scoreLabel } from '../games/scoring';

export default function Scoring({ round, onFinish, onAbandon }) {
  const [holes, setHoles]   = useState(round.holes.map(h => ({ ...h })));
  const [idx, setIdx]       = useState(0);
  const [saving, setSaving] = useState(false);

  const hole    = holes[idx];
  const totalHoles = holes.length;
  const svpHole = hole.strokes > 0 ? hole.strokes - hole.par : null;
  const { totalStrokes, scoreVsPar } = calculateRoundTotals(holes);
  const allDone = holes.every(h => h.strokes > 0);
  const isQuickStart = !!round.isQuickStart;

  const setStrokes = (val) => {
    const next = [...holes];
    next[idx] = { ...next[idx], strokes: Math.max(1, val) };
    setHoles(next);
  };

  // Quick Start: cycle par 3→4→5→3
  const cyclePar = () => {
    if (!isQuickStart) return;
    const next = [...holes];
    const cur = next[idx].par;
    next[idx] = { ...next[idx], par: cur >= 5 ? 3 : cur + 1 };
    setHoles(next);
  };

  const handleFinish = async () => {
    if (!allDone || saving) return;
    setSaving(true);
    const totals = calculateRoundTotals(holes);
    const completed = { ...round, holes, totalScore: totals.totalStrokes, scoreVsPar: totals.scoreVsPar };
    const id = await saveRound(completed);
    onFinish({ ...completed, id });
  };

  return (
    <div className="fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', maxWidth: 480, width: '100%', margin: '0 auto' }}>

      {/* Top bar */}
      <div className="fairway-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', flexShrink: 0 }}>
        <button onClick={() => window.confirm('Abandon round?') && onAbandon()}
          style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#f87171', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 700 }}>
          ✕ Quit
        </button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: 'rgba(245,237,214,0.5)', textTransform: 'uppercase', letterSpacing: 1.5 }}>{round.courseName}</div>
          <div style={{ fontSize: 11, color: 'rgba(245,237,214,0.5)' }}>{round.date}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 10, color: 'rgba(201,168,76,0.7)', textTransform: 'uppercase', letterSpacing: 1 }}>Total</div>
          <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--gold)' }}>
            {totalStrokes > 0 ? `${totalStrokes} (${formatScoreVsPar(scoreVsPar)})` : '—'}
          </div>
        </div>
      </div>

      {/* Hole header */}
      <div style={{ padding: '12px 16px 4px', textAlign: 'center', flexShrink: 0 }}>
        <div style={{ fontSize: 13, color: 'rgba(201,168,76,0.8)', textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700 }}>
          Hole {hole.number} of {totalHoles}
        </div>
        {/* Par display — tappable if Quick Start */}
        {isQuickStart ? (
          <button onClick={cyclePar} style={{
            marginTop: 4, background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.4)',
            borderRadius: 20, padding: '3px 14px', color: 'var(--gold)', fontSize: 12, fontWeight: 700,
          }}>
            Par {hole.par} ✎ tap to change
          </button>
        ) : (
          <div style={{ fontSize: 13, color: 'rgba(245,237,214,0.5)', marginTop: 2 }}>Par {hole.par}</div>
        )}
      </div>

      {/* Stroke input — centre, flex: 1 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: '4px 16px', minHeight: 0 }}>
        {/* Big +/- */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <button onClick={() => setStrokes((hole.strokes || hole.par) - 1)}
            style={{ width: 64, height: 64, borderRadius: '50%', background: '#0f4c2a', border: '2px solid rgba(201,168,76,0.35)', color: 'var(--gold)', fontSize: 30, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            −
          </button>
          <div style={{ textAlign: 'center', minWidth: 80 }}>
            <div style={{ fontSize: 72, fontWeight: 900, color: '#f5edd6', lineHeight: 1 }}>
              {hole.strokes || '—'}
            </div>
            {svpHole !== null && (
              <div className={scoreClass(svpHole)} style={{ fontSize: 14, fontWeight: 700, marginTop: 2 }}>
                {scoreLabel(svpHole)}
              </div>
            )}
          </div>
          <button onClick={() => setStrokes((hole.strokes || hole.par) + 1)}
            style={{ width: 64, height: 64, borderRadius: '50%', background: '#0f4c2a', border: '2px solid rgba(201,168,76,0.35)', color: 'var(--gold)', fontSize: 30, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            +
          </button>
        </div>

        {/* Quick presets */}
        <div style={{ display: 'flex', gap: 6 }}>
          {[['Eagle', hole.par - 2], ['Birdie', hole.par - 1], ['Par', hole.par], ['Bogey', hole.par + 1], ['Dbl', hole.par + 2]].filter(([, s]) => s >= 1).map(([label, s]) => (
            <button key={label} onClick={() => setStrokes(s)} style={{
              padding: '6px 8px', borderRadius: 10, minWidth: 40,
              background: hole.strokes === s ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.05)',
              border: `1.5px solid ${hole.strokes === s ? 'var(--gold)' : 'rgba(255,255,255,0.1)'}`,
              color: hole.strokes === s ? 'var(--gold)' : 'rgba(245,237,214,0.55)',
              fontSize: 10, fontWeight: 700, lineHeight: 1.3,
            }}>
              {label}<br/>{s}
            </button>
          ))}
        </div>
      </div>

      {/* Hole strip */}
      <div style={{ overflowX: 'auto', padding: '6px 12px', borderTop: '1px solid rgba(201,168,76,0.1)', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 4, minWidth: 'max-content' }}>
          {holes.map((h, i) => {
            const svp = h.strokes > 0 ? h.strokes - h.par : null;
            return (
              <button key={i} onClick={() => setIdx(i)} style={{
                minWidth: 32, padding: '4px 3px', borderRadius: 7, textAlign: 'center',
                background: i === idx ? 'rgba(201,168,76,0.18)' : 'rgba(255,255,255,0.04)',
                border: `1.5px solid ${i === idx ? 'var(--gold)' : 'rgba(255,255,255,0.08)'}`,
              }}>
                <div style={{ fontSize: 8, color: 'rgba(245,237,214,0.45)', marginBottom: 1 }}>{h.number}</div>
                <div className={svp !== null ? scoreClass(svp) : ''} style={{ fontSize: 12, fontWeight: 700, color: svp !== null ? undefined : 'rgba(245,237,214,0.2)' }}>
                  {h.strokes || '·'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Nav + Finish */}
      <div style={{ flexShrink: 0, padding: '8px 16px', paddingBottom: 'calc(12px + env(safe-area-inset-bottom))' }}>
        {allDone && idx < totalHoles - 1 && (
          <button onClick={handleFinish} disabled={saving} style={{
            width: '100%', padding: '14px', borderRadius: 14, border: 'none', marginBottom: 8,
            background: 'var(--gold)', color: '#0a2e1a', fontSize: 15, fontWeight: 900,
          }}>
            {saving ? 'Saving…' : '✓ Finish Round'}
          </button>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0}
            style={{ padding: '13px', borderRadius: 13, background: idx > 0 ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.03)', border: `1.5px solid ${idx > 0 ? 'rgba(201,168,76,0.3)' : 'rgba(255,255,255,0.07)'}`, color: idx > 0 ? '#f5edd6' : 'rgba(245,237,214,0.2)', fontSize: 15, fontWeight: 700 }}>
            ‹ Prev
          </button>

          {idx < totalHoles - 1 ? (
            <button onClick={() => setIdx(i => i + 1)}
              style={{ padding: '13px', borderRadius: 13, background: 'rgba(201,168,76,0.1)', border: '1.5px solid rgba(201,168,76,0.3)', color: '#f5edd6', fontSize: 15, fontWeight: 700 }}>
              Next ›
            </button>
          ) : (
            <button onClick={handleFinish} disabled={!allDone || saving}
              style={{ padding: '13px', borderRadius: 13, border: 'none', background: allDone && !saving ? 'var(--gold)' : 'rgba(201,168,76,0.2)', color: allDone && !saving ? '#0a2e1a' : 'rgba(201,168,76,0.4)', fontSize: 15, fontWeight: 900 }}>
              {saving ? 'Saving…' : allDone ? '✓ Finish' : `${holes.filter(h => h.strokes === 0).length} left`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
