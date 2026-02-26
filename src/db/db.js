import Dexie from 'dexie';

const db = new Dexie('GolfAppDB');
db.version(1).stores({
  courses: '++id, name',
  rounds:  '++id, courseId, date',
});
export default db;

export const getCourses   = () => db.courses.orderBy('name').toArray();
export const getCourse    = (id) => db.courses.get(id);
export const deleteCourse = (id) => db.courses.delete(id);

export async function saveCourse(course) {
  if (course.id) { await db.courses.put(course); return course.id; }
  return db.courses.add(course);
}

export const getRounds   = () => db.rounds.orderBy('date').reverse().toArray();
export const getRound    = (id) => db.rounds.get(id);
export const deleteRound = (id) => db.rounds.delete(id);

export async function saveRound(round) {
  if (round.id) { await db.rounds.put(round); return round.id; }
  return db.rounds.add(round);
}

export async function getDashboardStats() {
  const rounds = await db.rounds.toArray();
  if (!rounds.length) return { avgScore: null, bestRound: null, mostRecent: null, totalRounds: 0 };
  const sorted = [...rounds].sort((a, b) => new Date(b.date) - new Date(a.date));
  const scores = rounds.map(r => r.totalScore).filter(Boolean);
  const avg  = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
  const best = rounds.reduce((b, r) => (!b || r.totalScore < b.totalScore) ? r : b, null);
  return { avgScore: avg, bestRound: best, mostRecent: sorted[0], totalRounds: rounds.length };
}
