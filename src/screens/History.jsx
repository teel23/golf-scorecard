import React, { useEffect, useState } from 'react';
import { getRounds, deleteRound } from '../db/db';
import { formatScoreVsPar, scoreClass } from '../games/scoring';

export default function History({ onBack, onView }) {
  const [rounds, setRounds] = useState([]);

  const load = () => getRounds().then(setRounds);
  useEffect(() => { load(); }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this round?')) return;
    await deleteRound(id);
    load();
  };

  return (
    <div className="fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', maxWidth: 480, width: '100%', margin: '0 auto', padding: '0 16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 16, paddingBottom: 16, flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'rgba(245,237,214,0.6)', fontSize: 22, padding: '4px 8px 4px 0' }}>‹</button>
        <span style={{ fontSize: 22, fontWeight: 800, color: '#f5edd6' }}>Round History</span>
      </div>

      {/* Scrollable list */}
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, paddingBottom: 'calc(16px + env(safe-area-inset-bottom))' }}>
        {rounds.length === 0 && (
          <div style={{ textAlign: 'center', color: 'rgba(245,237,214,0.4)', paddingTop: 60, fontSize: 14 }}>
            No rounds saved yet. Start a round from the home screen.
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {rounds.map(r => {
          const svp = formatScoreVsPar(r.scoreVsPar);
          const cls = scoreClass(r.scoreVsPar);
          return (
            <button key={r.id} onClick={() => onView(r)} style={{ textAlign: 'left', background: 'none', border: 'none', padding: 0 }}>
              <div className="fairway-panel" style={{ borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: '#f5edd6', fontSize: 15 }}>{r.courseName}</div>
                  <div style={{ fontSize: 12, color: 'rgba(245,237,214,0.5)', marginTop: 2 }}>
                    {new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {r.tee}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: '#f5edd6' }}>{r.totalScore}</div>
                    <div className={cls} style={{ fontSize: 12, fontWeight: 700 }}>{svp}</div>
                  </div>
                  <button onClick={e => handleDelete(r.id, e)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, color: '#f87171', fontSize: 12, padding: '6px 9px', fontWeight: 700 }}>✕</button>
                </div>
              </div>
            </button>
          );
        })}
        </div>
      </div>
    </div>
  );
}
