import { describe, expect, it } from 'vitest';
import { compareChrono, groupMatches, sortMatches } from '../src/lib/sorting.js';
import { mk } from './helpers.js';

const a = mk({ home: 'A', date: '2026-10-18', time: '15:00' });
const b = mk({ home: 'B', date: '2026-10-17', time: '20:45', highlight: true });
const c = mk({ home: 'C', date: '2026-10-17', time: null });
const d = mk({ home: 'D', date: '2026-10-17', time: '12:00' });
const names = l => l.map(x => x.home).join('');

describe('tri', () => {
  it('chronologique : heure inconnue en dernier du jour', () => expect(names(sortMatches([a, b, c, d], 'asc'))).toBe('DBCA'));
  it('antichronologique', () => expect(names(sortMatches([a, b, c, d], 'desc'))).toBe('ACBD'));
  it('affiches d’abord, puis chrono', () => expect(names(sortMatches([a, c, d, b], 'highlights'))).toBe('BDCA'));
  it('ne mute pas l’entrée', () => { const l = [a, b]; sortMatches(l, 'asc'); expect(names(l)).toBe('AB'); });
  it('compareChrono', () => expect(compareChrono(a, b)).toBeGreaterThan(0));
});

describe('regroupement', () => {
  it('par date, ordre conservé', () => {
    const g = groupMatches(sortMatches([a, b, c, d], 'asc'), 'date');
    expect(g.map(([k, v]) => [k, names(v)])).toEqual([['2026-10-17', 'DBC'], ['2026-10-18', 'A']]);
  });
  it('par destination', () => {
    const g = groupMatches([a, mk({ country: 'Italie', zone: 'Milan' })], 'zone');
    expect(g.map(([k]) => k)).toEqual(['France / Paris', 'Italie / Milan']);
  });
  it('liste vide', () => expect(groupMatches([], 'date')).toEqual([]));
});
