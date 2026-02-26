import React, { useEffect, useState } from 'react';
import { getCourses, deleteCourse } from '../db/db';

export default function Courses({ onBack, onEdit, onNew }) {
  const [courses, setCourses] = useState([]);

  const load = () => getCourses().then(setCourses);
  useEffect(() => { load(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    await deleteCourse(id);
    load();
  };

  return (
    <div className="fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', maxWidth: 480, width: '100%', margin: '0 auto', padding: '0 16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 16, paddingBottom: 16, flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'rgba(245,237,214,0.6)', fontSize: 22, padding: '4px 8px 4px 0' }}>‹</button>
        <span style={{ fontSize: 22, fontWeight: 800, color: '#f5edd6' }}>Courses</span>
      </div>

      {/* Course list — scrollable */}
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 16 }}>
        {courses.length === 0 && (
          <div style={{ textAlign: 'center', color: 'rgba(245,237,214,0.4)', paddingTop: 40, fontSize: 14 }}>
            No courses yet. Add one below.
          </div>
        )}
        {courses.map(c => (
          <div key={c.id} className="fairway-panel" style={{ borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <div>
              <div style={{ fontWeight: 700, color: '#f5edd6', fontSize: 15 }}>{c.name}</div>
              <div style={{ fontSize: 12, color: 'rgba(245,237,214,0.5)', marginTop: 2 }}>
                {c.tee} · {c.holes?.length || 0} holes · Par {c.holes?.reduce((s, h) => s + h.par, 0)}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => onEdit(c)} style={{ background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 8, color: 'var(--gold)', fontSize: 13, padding: '6px 12px', fontWeight: 700 }}>Edit</button>
              <button onClick={() => handleDelete(c.id, c.name)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, color: '#f87171', fontSize: 13, padding: '6px 10px', fontWeight: 700 }}>✕</button>
            </div>
          </div>
        ))}
      </div>

      {/* Fixed bottom button */}
      <div style={{ flexShrink: 0, paddingBottom: 'calc(16px + env(safe-area-inset-bottom))' }}>
        <button onClick={onNew} style={{
          width: '100%', padding: '16px', borderRadius: 16, border: 'none',
          background: 'var(--gold)', color: '#0a2e1a', fontSize: 16, fontWeight: 900,
        }}>
          + Add Course
        </button>
      </div>
    </div>
  );
}
