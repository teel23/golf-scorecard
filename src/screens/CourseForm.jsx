import React, { useState } from 'react';
import { saveCourse } from '../db/db';

const defaultHoles = () => Array.from({ length: 18 }, (_, i) => ({
  number: i + 1, par: 4, handicap: '', yardage: '',
}));

export default function CourseForm({ course, onBack, onSaved }) {
  const [name, setName]   = useState(course?.name || '');
  const [tee, setTee]     = useState(course?.tee || '');
  const [holes, setHoles] = useState(course?.holes?.map(h => ({ ...h, handicap: h.handicap ?? '', yardage: h.yardage ?? '' })) || defaultHoles());
  const [saving, setSaving] = useState(false);

  const updateHole = (i, field, val) => {
    const next = [...holes];
    next[i] = { ...next[i], [field]: val === '' ? '' : Number(val) };
    setHoles(next);
  };

  const handleSave = async () => {
    if (!name.trim()) return alert('Course name required');
    if (holes.some(h => ![3,4,5].includes(Number(h.par)))) return alert('All pars must be 3, 4, or 5');
    setSaving(true);
    const holesClean = holes.map(h => ({
      number: h.number, par: Number(h.par),
      ...(h.handicap !== '' && { handicap: Number(h.handicap) }),
      ...(h.yardage  !== '' && { yardage:  Number(h.yardage)  }),
    }));
    await saveCourse({ ...(course?.id ? { id: course.id } : {}), name: name.trim(), tee: tee.trim() || 'White', holes: holesClean });
    onSaved();
  };

  return (
    <div className="fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', maxWidth: 480, width: '100%', margin: '0 auto', padding: '0 16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 16, paddingBottom: 12, flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'rgba(245,237,214,0.6)', fontSize: 22, padding: '4px 8px 4px 0' }}>‹</button>
        <span style={{ fontSize: 22, fontWeight: 800, color: '#f5edd6' }}>{course ? 'Edit Course' : 'New Course'}</span>
      </div>

      {/* Name + Tee */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12, flexShrink: 0 }}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Course Name *"
          style={{ padding: '13px 14px', borderRadius: 12, background: '#0f4c2a', border: '1px solid rgba(201,168,76,0.25)', color: '#f5edd6', fontSize: 15 }} />
        <input value={tee} onChange={e => setTee(e.target.value)} placeholder="Tee (e.g. White, Blue)"
          style={{ padding: '13px 14px', borderRadius: 12, background: '#0f4c2a', border: '1px solid rgba(201,168,76,0.25)', color: '#f5edd6', fontSize: 15 }} />
      </div>

      {/* Column headers */}
      <div style={{ display: 'grid', gridTemplateColumns: '28px 52px 52px 64px', gap: 6, paddingBottom: 6, borderBottom: '1px solid rgba(201,168,76,0.15)', marginBottom: 6, flexShrink: 0 }}>
        {['#','Par','Hdcp','Yards'].map(h => (
          <div key={h} style={{ fontSize: 10, color: 'rgba(201,168,76,0.7)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center' }}>{h}</div>
        ))}
      </div>

      {/* Hole rows */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16 }}>
        {holes.map((h, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '28px 52px 52px 64px', gap: 6, alignItems: 'center' }}>
            <div style={{ color: 'rgba(245,237,214,0.5)', fontSize: 12, fontWeight: 700, textAlign: 'center' }}>{h.number}</div>
            <input type="number" value={h.par} onChange={e => updateHole(i, 'par', e.target.value)} min={3} max={5}
              style={{ padding: '8px 4px', borderRadius: 8, background: '#0f4c2a', border: '1px solid rgba(201,168,76,0.25)', color: '#f5edd6', fontSize: 14, textAlign: 'center' }} />
            <input type="number" value={h.handicap} onChange={e => updateHole(i, 'handicap', e.target.value)} placeholder="—" min={1} max={18}
              style={{ padding: '8px 4px', borderRadius: 8, background: '#0f4c2a', border: '1px solid rgba(201,168,76,0.15)', color: 'rgba(245,237,214,0.7)', fontSize: 14, textAlign: 'center' }} />
            <input type="number" value={h.yardage} onChange={e => updateHole(i, 'yardage', e.target.value)} placeholder="—"
              style={{ padding: '8px 4px', borderRadius: 8, background: '#0f4c2a', border: '1px solid rgba(201,168,76,0.15)', color: 'rgba(245,237,214,0.7)', fontSize: 14, textAlign: 'center' }} />
          </div>
        ))}
      </div>

      {/* Fixed save button */}
      <div style={{ flexShrink: 0, paddingBottom: 'calc(16px + env(safe-area-inset-bottom))' }}>
        <button onClick={handleSave} disabled={saving} style={{
          width: '100%', padding: '16px', borderRadius: 16, border: 'none',
          background: saving ? 'rgba(201,168,76,0.4)' : 'var(--gold)', color: '#0a2e1a', fontSize: 16, fontWeight: 900,
        }}>
          {saving ? 'Saving…' : '💾 Save Course'}
        </button>
      </div>
    </div>
  );
}
