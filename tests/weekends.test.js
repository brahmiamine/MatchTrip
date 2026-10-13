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

describe('zones de déplacement admissibles', () => {
  const italy = (home, zone, date, cluster) => mk({ country: 'Italie', home, zone, date, cluster, time: '15:00' });

  it('ne regroupe plus Venise et Udine même avec un ancien cluster en base', () => {
    const matches = [italy('Venezia', 'Venise / Udine', '2026-10-17', 'Venise & Udine'), italy('Udinese', 'Venise / Udine', '2026-10-18', 'Venise & Udine')];
    expect(buildWeekends(matches)).toEqual([]);
  });
  it('ne propose jamais les « Autres villes italiennes », même si la base a un cluster erroné', () => {
    const matches = [italy('Napoli', 'Autres villes italiennes', '2026-10-24', 'Italie'), italy('Genoa', 'Autres villes italiennes', '2026-10-25', 'Italie')];
    expect(buildWeekends(matches)).toEqual([]);
  });
  it('conserve explicitement Paris + Autour de Paris dans un même groupe', () => {
    const matches = [
      mk({ home: 'Lens', zone: 'Autour de Paris', cluster: 'Paris & alentours', date: '2026-10-24' }),
      mk({ home: 'PSG', zone: 'Paris', cluster: 'Paris & alentours', date: '2026-10-25' }),
    ];
    const w = buildWeekends(matches);
    expect(w).toHaveLength(1);
    expect(w[0].cluster).toBe('Paris & alentours');
    expect(w[0].zones).toEqual(['Autour de Paris', 'Paris']);
    expect(w[0].pairs).toHaveLength(1);
  });
  it('conserve Milan/Côme et Bologne/Parme parmi les groupes régionaux', () => {
    const matches = [
      italy('AC Milan', 'Milan / Lombardie', '2026-10-24', 'Lombardie'),
      italy('Como', 'Milan / Lombardie', '2026-10-25', 'Lombardie'),
      italy('Bologna', 'Bologne / Émilie-Romagne', '2026-10-24', 'Émilie-Romagne'),
      italy('Parma', 'Bologne / Émilie-Romagne', '2026-10-25', 'Émilie-Romagne'),
    ];
    expect(buildWeekends(matches)).toHaveLength(2);
  });
  it('ne propose pas deux rencontres du même club comme regroupement de clubs', () => {
    const matches = [
      mk({ home: 'PSG', away: 'Lyon', date: '2026-10-24' }),
      mk({ home: 'PSG', away: 'Monaco', date: '2026-10-25' }),
    ];
    expect(buildWeekends(matches)).toEqual([]);
  });
});
