import React, { useEffect, useState } from 'react';
import { getCourses } from '../db/db';

export default function StartRound({ onBack, onStart }) {
  const [courses, setCourses]     = useState([]);
  const [selected, setSelected]   = useState(null);
  const [date, setDate]           = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes]         = useState('');
  const [playerCount, setPlayerCount] = useState(2);
  const [playerNames, setPlayerNames] = useState(['Player 1', 'Player 2', 'Player 3', 'Player 4']);
  const [playerHandicaps, setPlayerHandicaps] = useState(['', '', '', '']);

  useEffect(() => {
    getCourses().then(cs => { setCourses(cs); if (cs.length === 1) setSelected(cs[0]); });
  }, []);

  const setName = (i, val) => {
    const next = [...playerNames];
    next[i] = val;
    setPlayerNames(next);
  };

  const setHandicap = (i, val) => {
    const next = [...playerHandicaps];
    next[i] = val;
    setPlayerHandicaps(next);
  };

  const handleStart = () => {
    if (!selected) return;
    const activePlayers = Array.from({ length: playerCount }, (_, i) => ({
      name: playerNames[i].trim() || `Player ${i + 1}`,
      handicapIndex: playerHandicaps[i] !== '' ? Number(playerHandicaps[i]) : null,
      holes: selected.holes.map(h => ({
        number:    h.number,
        par:       h.par,
        handicap:  h.handicap  ?? null,
        yardage:   h.yardage   ?? null,
        strokes:   0,
        putts:     null,
        fairway:   null,
        gir:       null,
        upAndDown: null,
        mulligans: 0,
      })),
    }));
    const round = {
      courseId: selected.id,
      courseName: selected.name,
      tee: selected.tee,
      date,
      notes,
      players: activePlayers,
      // Legacy compat — mirrors first player's holes
      holes: activePlayers[0].holes,
      totalScore: 0,
      scoreVsPar: 0,
    };
    onStart(round);
  };

  const inputStyle = {
    padding: '13px 14px', borderRadius: 12,
    background: '#0f4c2a', border: '1px solid rgba(201,168,76,0.25)',
    color: '#f5edd6', fontSize: 15, width: '100%', boxSizing: 'border-box',
  };

  const labelStyle = {
    fontSize: 11, color: 'rgba(201,168,76,0.8)', textTransform: 'uppercase',
    letterSpacing: 1.5, fontWeight: 700, display: 'block', marginBottom: 8,
  };

  return (
    <div className="fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', maxWidth: 480, width: '100%', margin: '0 auto', padding: '0 16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 16, flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'rgba(245,237,214,0.6)', fontSize: 22, padding: '4px 8px 4px 0' }}>‹</button>
        <span style={{ fontSize: 22, fontWeight: 800, color: '#f5edd6' }}>Start Round</span>
      </div>

      {/* Scrollable form */}
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, display: 'flex', flexDirection: 'column', gap: 18, paddingTop: 20, paddingBottom: 16 }}>

        {/* Course picker */}
        <div>
          <label style={labelStyle}>Course *</label>
          {courses.length === 0 ? (
            <div style={{ color: 'rgba(245,237,214,0.4)', fontSize: 14 }}>No courses saved. Add one first.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {courses.map(c => (
                <button key={c.id} onClick={() => setSelected(c)} style={{
                  padding: '13px 16px', borderRadius: 12, textAlign: 'left',
                  background: selected?.id === c.id ? 'rgba(201,168,76,0.18)' : '#0f4c2a',
                  border: `1.5px solid ${selected?.id === c.id ? 'var(--gold)' : 'rgba(201,168,76,0.2)'}`,
                  color: '#f5edd6', fontSize: 15, fontWeight: selected?.id === c.id ? 700 : 400,
                }}>
                  {c.name} <span style={{ fontSize: 12, opacity: 0.6 }}>· {c.tee} · Par {c.holes?.reduce((s, h) => s + h.par, 0)}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Players */}
        <div>
          <label style={labelStyle}>Players</label>
          {/* Count selector */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            {[1, 2, 3, 4].map(n => (
              <button key={n} onClick={() => setPlayerCount(n)} style={{
                flex: 1, padding: '10px 0', borderRadius: 10, fontWeight: 800, fontSize: 15,
                background: playerCount === n ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.05)',
                border: `1.5px solid ${playerCount === n ? 'var(--gold)' : 'rgba(255,255,255,0.1)'}`,
                color: playerCount === n ? 'var(--gold)' : 'rgba(245,237,214,0.5)',
              }}>
                {n}
              </button>
            ))}
          </div>
          {/* Name inputs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {Array.from({ length: playerCount }, (_, i) => (
              <div key={i} style={{ display: 'flex', gap: 8 }}>
                <input
                  value={playerNames[i]}
                  onChange={e => setName(i, e.target.value)}
                  placeholder={`Player ${i + 1}`}
                  style={{ ...inputStyle, flex: 1 }}
                />
                <input
                  type="number"
                  value={playerHandicaps[i]}
                  onChange={e => setHandicap(i, e.target.value)}
                  placeholder="Hdcp"
                  min={0} max={54}
                  style={{ ...inputStyle, width: 72, flex: 'none', textAlign: 'center', fontSize: 14 }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Date */}
        <div>
          <label style={labelStyle}>Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} />
        </div>

        {/* Notes */}
        <div>
          <label style={labelStyle}>Notes (optional)</label>
          <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Weather, course condition…" style={inputStyle} />
        </div>
      </div>

      {/* Fixed start button */}
      <div style={{ flexShrink: 0, paddingBottom: 'calc(16px + env(safe-area-inset-bottom))' }}>
        <button onClick={handleStart} disabled={!selected} style={{
          width: '100%', padding: '18px', borderRadius: 16, border: 'none',
          background: selected ? 'var(--gold)' : 'rgba(201,168,76,0.25)',
          color: selected ? '#0a2e1a' : 'rgba(201,168,76,0.5)', fontSize: 17, fontWeight: 900,
        }}>
          ⛳ Start Round
        </button>
      </div>
    </div>
  );
}
