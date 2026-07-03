import { describe, expect, it } from 'vitest';
import { getReadinessCategory, calculateProgressSnapshot } from './readiness';

describe('readiness utilities', () => {
  it('classifies scores into readiness levels', () => {
    expect(getReadinessCategory(90)).toBe('Interview Ready');
    expect(getReadinessCategory(70)).toBe('Borderline');
    expect(getReadinessCategory(40)).toBe('Not Ready');
  });

  it('builds a progress summary from session history', () => {
    const snapshot = calculateProgressSnapshot([
      { score: 55, category: 'Not Ready' },
      { score: 72, category: 'Borderline' },
      { score: 84, category: 'Interview Ready' }
    ] as Array<{ score: number; category: 'Not Ready' | 'Borderline' | 'Interview Ready' }>);

    expect(snapshot.averageScore).toBe(70);
    expect(snapshot.bestScore).toBe(84);
    expect(snapshot.improvement).toBe(29);
    expect(snapshot.totalSessions).toBe(3);
  });
});
