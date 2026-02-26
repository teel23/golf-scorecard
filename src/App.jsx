import React, { useState } from 'react';
import Dashboard    from './screens/Dashboard';
import Courses      from './screens/Courses';
import CourseForm   from './screens/CourseForm';
import StartRound   from './screens/StartRound';
import QuickStart   from './screens/QuickStart';
import Scoring      from './screens/Scoring';
import RoundSummary from './screens/RoundSummary';
import History      from './screens/History';
import { saveCourse } from './db/db';

export default function App() {
  const [screen, setScreen]             = useState('dashboard');
  const [activeRound, setActiveRound]   = useState(null);
  const [viewingRound, setViewingRound] = useState(null);
  const [editingCourse, setEditingCourse] = useState(undefined); // undefined = unset, null = new

  // Save-course prompt state (for Quick Start)
  const [savePrompt, setSavePrompt]     = useState(null); // null or { holes, name }
  const [saveCourseName, setSaveCourseName] = useState('');
  const [savingCourse, setSavingCourse] = useState(false);

  const go = (s) => setScreen(s);

  const startRound = (round) => { setActiveRound(round); go('scoring'); };

  const finishRound = (completed) => {
    setActiveRound(null);
    setViewingRound(completed);
    if (completed.isQuickStart) {
      setSaveCourseName(completed.courseName || '');
      setSavePrompt({ holes: completed.holes, name: completed.courseName || '' });
    }
    go('summary');
  };

  const handleSaveCourse = async () => {
    if (!saveCourseName.trim() || savingCourse) return;
    setSavingCourse(true);
    try {
      await saveCourse({
        name: saveCourseName.trim(),
        tee: 'White',
        holes: savePrompt.holes.map(h => ({ number: h.number, par: h.par })),
      });
    } finally {
      setSavingCourse(false);
      setSavePrompt(null);
    }
  };

  const viewRound = (round) => { setViewingRound(round); go('summary'); };

  const editCourse = (course) => { setEditingCourse(course ?? null); go('courseForm'); };

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#0a2e1a', color: '#f5edd6' }}>

      {/* Save Course Prompt Modal (Quick Start) */}
      {savePrompt && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.75)',
          display: 'flex', alignItems: 'flex-end',
        }}>
          <div style={{
            width: '100%', maxWidth: 480, margin: '0 auto',
            background: '#0f4c2a',
            borderRadius: '20px 20px 0 0',
            padding: '24px 20px',
            paddingBottom: 'calc(24px + env(safe-area-inset-bottom))',
            border: '2px solid rgba(201,168,76,0.4)',
            borderBottom: 'none',
          }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#f5edd6', marginBottom: 8, textAlign: 'center' }}>
              💾 Save This Course?
            </div>
            <div style={{ fontSize: 13, color: 'rgba(245,237,214,0.55)', textAlign: 'center', marginBottom: 20 }}>
              Save the pars you played so you can use this course again.
            </div>
            <input
              value={saveCourseName}
              onChange={e => setSaveCourseName(e.target.value)}
              placeholder="Course Name"
              style={{
                width: '100%', padding: '13px 14px', borderRadius: 12,
                background: '#0a2e1a', border: '1px solid rgba(201,168,76,0.35)',
                color: '#f5edd6', fontSize: 15, marginBottom: 16,
                boxSizing: 'border-box',
              }}
            />
            <button onClick={handleSaveCourse} disabled={!saveCourseName.trim() || savingCourse} style={{
              width: '100%', padding: '16px', borderRadius: 14, border: 'none', marginBottom: 10,
              background: saveCourseName.trim() && !savingCourse ? 'var(--gold)' : 'rgba(201,168,76,0.3)',
              color: saveCourseName.trim() && !savingCourse ? '#0a2e1a' : 'rgba(201,168,76,0.5)',
              fontSize: 16, fontWeight: 900,
            }}>
              {savingCourse ? 'Saving…' : '✓ Save Course'}
            </button>
            <button onClick={() => setSavePrompt(null)} style={{
              width: '100%', padding: '14px', borderRadius: 14,
              background: 'transparent', border: '1.5px solid rgba(245,237,214,0.15)',
              color: 'rgba(245,237,214,0.55)', fontSize: 15, fontWeight: 700,
            }}>
              Skip
            </button>
          </div>
        </div>
      )}

      {screen === 'dashboard'  && <Dashboard onStart={() => go('startRound')} onQuickStart={() => go('quickStart')} onCourses={() => go('courses')} onHistory={() => go('history')} />}
      {screen === 'courses'    && <Courses onBack={() => go('dashboard')} onEdit={editCourse} onNew={() => editCourse(null)} />}
      {screen === 'courseForm' && <CourseForm course={editingCourse} onBack={() => go('courses')} onSaved={() => go('courses')} />}
      {screen === 'startRound' && <StartRound onBack={() => go('dashboard')} onStart={startRound} />}
      {screen === 'quickStart' && <QuickStart onBack={() => go('dashboard')} onStart={startRound} />}
      {screen === 'scoring'    && <Scoring round={activeRound} onFinish={finishRound} onAbandon={() => { setActiveRound(null); go('dashboard'); }} />}
      {screen === 'summary'    && <RoundSummary round={viewingRound} onHome={() => go('dashboard')} onHistory={() => go('history')} />}
      {screen === 'history'    && <History onBack={() => go('dashboard')} onView={viewRound} />}
    </div>
  );
}
