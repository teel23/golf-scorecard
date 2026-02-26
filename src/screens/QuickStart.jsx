import React, { useState } from 'react';

export default function QuickStart({ onBack, onStart }) {
  const [name, setName]   = useState('');
  const [holes9, setHoles9] = useState(false); // false = 18 holes, true = 9 holes

  const handleStart = () => {
    const holeCount = holes9 ? 9 : 18;
    const holes = Array.from({ length: holeCount }, (_, i) => ({
      number: i + 1,
      par: 4,
      strokes: 0,
    }));

    const round = {
      courseId: null,
      courseName: name.trim() || 'Quick Round',
      tee: '',
      date: new Date().toISOString().slice(0, 10),
      notes: '',
      holes,
      totalScore: 0,
      scoreVsPar: 0,
      isQuickStart: true,
    };
    onStart(round);
  };

  const inputStyle = {
    padding: '14px 16px', borderRadius: 12,
    background: '#0f4c2a', border: '1px solid rgba(201,168,76,0.3)',
    color: '#f5edd6', fontSize: 16, width: '100%',
    boxSizing: 'border-box',
  };

  return (
    <div className="fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', maxWidth: 480, width: '100%', margin: '0 auto', padding: '0 16px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 16, paddingBottom: 8, flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'rgba(245,237,214,0.6)', fontSize: 22, padding: '4px 8px 4px 0' }}>‹</button>
        <span style={{ fontSize: 22, fontWeight: 800, color: '#f5edd6' }}>⚡ Quick Start</span>
      </div>

      {/* Content — centered */}
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 16 }}>

        {/* Description */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 44, marginBottom: 8 }}>⛳</div>
          <div style={{ fontSize: 15, color: 'rgba(245,237,214,0.6)', lineHeight: 1.5 }}>
            Start right away — no course needed.<br/>
            All holes start at Par 4. Tap Par during<br/>
            scoring to adjust on the fly.
          </div>
        </div>

        {/* Course Name */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 11, color: 'rgba(201,168,76,0.8)', textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 700, display: 'block', marginBottom: 8 }}>
            Course Name (optional)
          </label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Pine Valley, Home course…"
            style={inputStyle}
            autoComplete="off"
          />
        </div>

        {/* Holes toggle */}
        <div style={{ marginBottom: 8 }}>
          <label style={{ fontSize: 11, color: 'rgba(201,168,76,0.8)', textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 700, display: 'block', marginBottom: 12 }}>
            Number of Holes
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button onClick={() => setHoles9(false)} style={{
              padding: '16px', borderRadius: 14,
              background: !holes9 ? 'rgba(201,168,76,0.2)' : '#0f4c2a',
              border: `1.5px solid ${!holes9 ? 'var(--gold)' : 'rgba(201,168,76,0.2)'}`,
              color: !holes9 ? 'var(--gold)' : 'rgba(245,237,214,0.6)',
              fontSize: 17, fontWeight: 800,
            }}>
              18 Holes
            </button>
            <button onClick={() => setHoles9(true)} style={{
              padding: '16px', borderRadius: 14,
              background: holes9 ? 'rgba(201,168,76,0.2)' : '#0f4c2a',
              border: `1.5px solid ${holes9 ? 'var(--gold)' : 'rgba(201,168,76,0.2)'}`,
              color: holes9 ? 'var(--gold)' : 'rgba(245,237,214,0.6)',
              fontSize: 17, fontWeight: 800,
            }}>
              9 Holes
            </button>
          </div>
        </div>
      </div>

      {/* Fixed start button */}
      <div style={{ flexShrink: 0, paddingBottom: 'calc(16px + env(safe-area-inset-bottom))' }}>
        <button onClick={handleStart} style={{
          width: '100%', padding: '18px', borderRadius: 16, border: 'none',
          background: 'var(--gold)', color: '#0a2e1a', fontSize: 18, fontWeight: 900,
        }}>
          ⚡ Start Round
        </button>
      </div>
    </div>
  );
}
