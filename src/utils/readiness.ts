export type ReadinessCategory = 'Not Ready' | 'Borderline' | 'Interview Ready';

export interface ProgressSnapshot {
  averageScore: number;
  bestScore: number;
  improvement: number;
  totalSessions: number;
  latestCategory: ReadinessCategory;
}

export const getReadinessCategory = (score: number): ReadinessCategory => {
  if (score >= 80) return 'Interview Ready';
  if (score >= 60) return 'Borderline';
  return 'Not Ready';
};

export const calculateProgressSnapshot = (
  sessions: Array<{ score: number; category: ReadinessCategory }>
): ProgressSnapshot => {
  if (!sessions.length) {
    return {
      averageScore: 0,
      bestScore: 0,
      improvement: 0,
      totalSessions: 0,
      latestCategory: 'Not Ready'
    };
  }

  const orderedSessions = [...sessions];
  const averageScore = Math.round(orderedSessions.reduce((sum, session) => sum + session.score, 0) / orderedSessions.length);
  const bestScore = Math.max(...orderedSessions.map(session => session.score));
  const oldestScore = orderedSessions[0]?.score ?? 0;
  const latestScore = orderedSessions[orderedSessions.length - 1]?.score ?? 0;
  const latestCategory = orderedSessions[orderedSessions.length - 1]?.category ?? 'Not Ready';
  const improvement = Math.max(0, latestScore - oldestScore);

  return {
    averageScore,
    bestScore,
    improvement,
    totalSessions: sessions.length,
    latestCategory
  };
};
