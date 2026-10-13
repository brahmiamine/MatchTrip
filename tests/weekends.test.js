import { describe, expect, it } from 'vitest';
import { buildPairs, buildWeekends, compatible } from '../src/lib/weekends.js';
import { mk } from './helpers.js';

describe('compatibilité', () => {
  it('jours différents : toujours compatible', () => expect(compatible(mk({ date: '2026-10-17', time: null }), mk({ date: '2026-10-18', time: null }))).toBe(true));
  it('même jour, ≥ 4h : compatible', () => expect(compatible(mk({ time: '12:00' }), mk({ time: '16:00' }))).toBe(true));
  it('même jour, < 4h : incompatible', () => expect(compatible(mk({ time: '12:00' }), mk({ time: '15:59' }))).toBe(false));
  it('même jour, heure inconnue : incompatible', () => expect(compatible(mk({ time: '12:00' }), mk({ time: null }))).toBe(false));
  it('buildPairs', () => expect(buildPairs([mk({ time: '12:00' }), mk({ time: '13:00' }), mk({ date: '2026-10-18' })])).toHaveLength(2));
});

describe('week-ends', () => {
  const sat = mk({ home: 'A', date: '2026-10-17', time: '15:00' });
  const sun = mk({ home: 'B', date: '2026-10-18', time: '15:00' });
  const lone = mk({ home: 'C', date: '2026-10-24', time: '15:00' });
  const other = mk({ home: 'D', date: '2026-10-17', time: '15:00', country: 'Italie', cluster: 'Milan' });
  const noCluster = mk({ home: 'E', date: '2026-10-18', cluster: '' });

  it('regroupe samedi + dimanche d’un même cluster', () => {
    const w = buildWeekends([sat, sun]);
    expect(w).toHaveLength(1);
    expect(w[0].weekend).toBe('2026-10-17');
    expect(w[0].items.map(x => x.home)).toEqual(['A', 'B']);
    expect(w[0].pairs).toHaveLength(1);
  });
  it('un match isolé ne forme pas de combinaison', () => expect(buildWeekends([lone])).toEqual([]));
  it('clusters et pays séparés', () => expect(buildWeekends([sat, other])).toEqual([]));
  it('ignore les matchs sans cluster', () => expect(buildWeekends([sat, noCluster])).toEqual([]));
  it('deux matchs simultanés le même jour ne combinent pas', () => expect(buildWeekends([sat, mk({ home: 'F', date: '2026-10-17', time: '16:00' })])).toEqual([]));
  it('tris asc / desc / highlights', () => {
    const w2 = [mk({ home: 'G', date: '2026-10-24', time: '15:00' }), mk({ home: 'H', date: '2026-10-25', time: '15:00', highlight: true })];
    const all = [sat, sun, ...w2];
    expect(buildWeekends(all, 'asc').map(w => w.weekend)).toEqual(['2026-10-17', '2026-10-24']);
    expect(buildWeekends(all, 'desc').map(w => w.weekend)).toEqual(['2026-10-24', '2026-10-17']);
    expect(buildWeekends(all, 'highlights').map(w => w.weekend)).toEqual(['2026-10-24', '2026-10-17']);
  });
  it('score = affiches * 10 + matchs', () => expect(buildWeekends([mk({ highlight: true }), sun])[0].score).toBe(12));
});
