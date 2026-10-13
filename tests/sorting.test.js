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

describe('tri par pays', () => {
  const it1 = mk({ home: 'I', date: '2026-10-17', time: '10:00', country: 'Italie' });
  const es = mk({ home: 'E', date: '2026-10-25', country: 'Espagne' });
  const pt = mk({ home: 'P', date: '2026-10-17', country: 'Portugal' });
  const be = mk({ home: 'B2', date: '2026-10-17', country: 'Belgique' });
  it('ordre des pays puis chronologique ; pays inconnus à la fin', () => expect(names(sortMatches([pt, it1, es, a, be, d], 'country'))).toBe('DAB2EIP'));
  it('ne mute pas l’entrée', () => { const l = [it1, a]; sortMatches(l, 'country'); expect(names(l)).toBe('IA'); });
});

describe('regroupement', () => {
  it('par date, ordre conservé', () => {
    const g = groupMatches(sortMatches([a, b, c, d], 'asc'), 'date');
    expect(g.map(([k, v]) => [k, names(v)])).toEqual([['2026-10-17', 'DBC'], ['2026-10-18', 'A']]);
  });
  it('par destination', () => {
    const g = groupMatches([a, mk({ country: 'Italie', zone: 'Milan' })], 'zone');
    expect(g.map(([k]) => k)).toEqual(['France / Paris & alentours', 'Italie / Milan']);
  });
  it('destination répétée pour chaque date, dans l’ordre chronologique', () => {
    const x = mk({ home: 'X', date: '2026-10-18', country: 'Italie', zone: 'Milan' });
    const g = groupMatches(sortMatches([a, x, b, d], 'asc'), 'zone-date');
    expect(g.map(([k, v]) => [k, names(v)])).toEqual([
      ['2026-10-17|France / Paris & alentours', 'DB'],
      ['2026-10-18|France / Paris & alentours', 'A'],
      ['2026-10-18|Italie / Milan', 'X'],
    ]);
  });
  it('destination et week-end : samedi et dimanche réunis', () => {
    const x = mk({ home: 'X', date: '2026-10-24', time: '15:00' });
    const g = groupMatches(sortMatches([x, a, b, d], 'asc'), 'zone-weekend');
    expect(g.map(([k, v]) => [k, names(v)])).toEqual([
      ['2026-10-17|France / Paris & alentours', 'DBA'],
      ['2026-10-24|France / Paris & alentours', 'X'],
    ]);
  });
  it('fusionne Paris et Autour de Paris dans toutes les vues destination', () => {
    const paris = mk({ home: 'PSG', zone: 'Paris', date: '2026-11-28' });
    const lens = mk({ home: 'Lens', zone: 'Autour de Paris', date: '2026-11-28' });
    const auxerre = mk({ home: 'Auxerre', zone: 'Autour de Paris', date: '2026-11-29' });
    for (const group of ['zone', 'zone-weekend']) {
      const result = groupMatches([paris, lens, auxerre], group);
      expect(result).toHaveLength(1);
      expect(result[0][0]).toContain('France / Paris & alentours');
      expect(result[0][1]).toHaveLength(3);
    }
    const byDay = groupMatches([paris, lens, auxerre], 'zone-date');
    expect(byDay).toHaveLength(2);
    expect(byDay[0][0]).toBe('2026-11-28|France / Paris & alentours');
    expect(byDay[0][1]).toHaveLength(2);
    expect(byDay[1][0]).toBe('2026-11-29|France / Paris & alentours');
    expect(groupMatches([paris, lens, auxerre], 'date')).toHaveLength(2);
  });
  it('liste vide', () => expect(groupMatches([], 'date')).toEqual([]));
});
