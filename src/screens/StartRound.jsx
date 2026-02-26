import React, { useEffect, useState } from 'react';
import { getCourses } from '../db/db';

export default function StartRound({ onBack, onStart }) {
  const [courses, setCourses]   = useState([]);
  const [selected, setSelected] = useState(null);
  const [date, setDate]         = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes]       = useState('');

  useEffect(() => {
    getCourses().then(cs => { setCourses(cs); if (cs.length === 1) setSelected(cs[0]); });
  }, []);

  const handleStart = () => {
    if (!selected) return;
    const round = {
      courseId: selected.id,
      courseName: selected.name,
      tee: selected.tee,
      date,
      notes,
      holes: selected.holes.map(h => ({ number: h.number, par: h.par, strokes: 0 })),
      totalScore: 0,
      scoreVsPar: 0,
    };
    onStart(round);
  };

  const inputStyle = { padding: '13px 14px', borderRadius: 12, background: '#0f4c2a', border: '1px solid rgba(201,168,76,0.25)', color: '#f5edd6', fontSize: 15, width: '100%' };

  return (
    <div className="fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', maxWidth: 480, width: '100%', margin: '0 auto', padding: '0 16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 16, flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'rgba(245,237,214,0.6)', fontSize: 22, padding: '4px 8px 4px 0' }}>‹</button>
        <span style={{ fontSize: 22, fontWeight: 800, color: '#f5edd6' }}>Start Round</span>
      </div>

      {/* Scrollable form */}
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 20, paddingBottom: 16 }}>
        {/* Course picker */}
        <div>
          <label style={{ fontSize: 11, color: 'rgba(201,168,76,0.8)', textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 700, display: 'block', marginBottom: 8 }}>Course *</label>
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

        {/* Date */}
        <div>
          <label style={{ fontSize: 11, color: 'rgba(201,168,76,0.8)', textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 700, display: 'block', marginBottom: 8 }}>Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} />
        </div>

        {/* Notes */}
        <div>
          <label style={{ fontSize: 11, color: 'rgba(201,168,76,0.8)', textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 700, display: 'block', marginBottom: 8 }}>Notes (optional)</label>
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
