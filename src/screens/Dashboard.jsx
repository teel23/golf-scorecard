import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../db/db';
import { formatScoreVsPar } from '../games/scoring';

export default function Dashboard({ onStart, onQuickStart, onCourses, onHistory }) {
  const [stats, setStats] = useState(null);

  useEffect(() => { getDashboardStats().then(setStats); }, []);

  const StatCard = ({ label, value, sub }) => (
    <div className="fairway-panel rounded-2xl p-4 text-center">
      <div style={{ color: 'var(--gold)', fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700, marginBottom: 4 }}>{label}</div>
      <div style={{ color: '#f5edd6', fontSize: 26, fontWeight: 900, lineHeight: 1 }}>{value ?? '—'}</div>
      {sub && <div style={{ color: 'rgba(245,237,214,0.5)', fontSize: 11, marginTop: 3 }}>{sub}</div>}
    </div>
  );

  const recentSvp = stats?.mostRecent ? formatScoreVsPar(stats.mostRecent.scoreVsPar) : null;
  const bestSvp   = stats?.bestRound  ? formatScoreVsPar(stats.bestRound.scoreVsPar)  : null;

  return (
    <div className="fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', maxWidth: 480, width: '100%', margin: '0 auto', padding: '0 16px' }}>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: 20, paddingBottom: 12 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 44 }}>⛳</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#f5edd6', letterSpacing: '-0.5px' }}>Golf Scorecard</div>
          <div style={{ fontSize: 13, color: 'rgba(245,237,214,0.5)', marginTop: 2 }}>Local · Offline · Private</div>
        </div>

        {/* Stats grid */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 8 }}>
            <StatCard label="Rounds" value={stats.totalRounds} />
            <StatCard label="Avg Score" value={stats.avgScore} />
            <StatCard label="Best Round" value={stats.bestRound?.totalScore} sub={stats.bestRound ? `${bestSvp} · ${stats.bestRound.courseName}` : null} />
            <StatCard label="Last Round" value={stats.mostRecent?.totalScore} sub={stats.mostRecent ? `${recentSvp} · ${new Date(stats.mostRecent.date).toLocaleDateString()}` : null} />
          </div>
        )}
      </div>

      {/* Fixed bottom nav buttons */}
      <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 'calc(16px + env(safe-area-inset-bottom))', paddingTop: 8 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button onClick={onStart} style={{
            padding: '16px 8px', borderRadius: 14, border: 'none',
            background: 'var(--gold)', color: '#0a2e1a', fontSize: 15, fontWeight: 900,
          }}>
            ⛳ Start Round
          </button>
          <button onClick={onQuickStart} style={{
            padding: '16px 8px', borderRadius: 14, border: '1.5px solid rgba(201,168,76,0.5)',
            background: 'rgba(201,168,76,0.08)', color: '#f5edd6', fontSize: 15, fontWeight: 800,
          }}>
            ⚡ Quick Start
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button onClick={onCourses} style={{
            padding: '14px', borderRadius: 14,
            background: 'transparent', border: '1.5px solid rgba(201,168,76,0.25)',
            color: '#f5edd6', fontSize: 14, fontWeight: 700,
          }}>
            🗺 Courses
          </button>
          <button onClick={onHistory} style={{
            padding: '14px', borderRadius: 14,
            background: 'transparent', border: '1.5px solid rgba(201,168,76,0.25)',
            color: '#f5edd6', fontSize: 14, fontWeight: 700,
          }}>
            📋 History
          </button>
        </div>
      </div>
    </div>
  );
}
