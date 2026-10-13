import { describe, expect, it } from 'vitest';
import coords from '../src/data/stadiumCoords.json';
import clubMedia from '../src/data/clubMedia.json';
import { coordsOf, formatKm, haversineKm, legsBetweenMatches, maxSpreadKm } from '../src/lib/distance.js';
import { mk } from './helpers.js';

describe('distances', () => {
  it('haversine : points identiques → 0', () => expect(haversineKm([48, 2], [48, 2])).toBe(0));
  it('haversine : Paris ↔ Lyon ≈ 392 km', () => expect(haversineKm([48.8566, 2.3522], [45.764, 4.8357])).toBeCloseTo(392, -1));
  it('Venise (Penzo) ↔ Udine (Friuli) ≈ 100 km', () => {
    const km = haversineKm(coordsOf('Stadio Pier Luigi Penzo'), coordsOf('Stadio Friuli'));
    expect(km).toBeGreaterThan(90); expect(km).toBeLessThan(120);
  });
  it('Parc des Princes ↔ Jean-Bouin < 2 km', () => expect(haversineKm(coordsOf('Parc des Princes'), coordsOf('Stade Jean-Bouin'))).toBeLessThan(2));
  it('formatKm', () => { expect(formatKm(104.6)).toBe('105 km'); expect(formatKm(0.4)).toBe('< 1 km'); });
});

describe('coordonnées des stades', () => {
  const stadiums = [...new Set(Object.values(clubMedia).map(c => c.stadium).filter(Boolean))];
  it('tous les stades du catalogue ont des coordonnées', () => expect(stadiums.filter(s => !coords[s])).toEqual([]));
  it('coordonnées plausibles (Europe de l’Ouest)', () => Object.values(coords).forEach(([lat, lon]) => {
    expect(lat).toBeGreaterThan(36); expect(lat).toBeLessThan(54); expect(lon).toBeGreaterThan(-5); expect(lon).toBeLessThan(19);
  }));
});

describe('trajets entre matchs', () => {
  const v = mk({ home: 'Venezia', stadium: 'Stadio Pier Luigi Penzo', date: '2026-10-17', time: '15:00' });
  const u = mk({ home: 'Udinese', stadium: 'Stadio Friuli', date: '2026-10-17', time: '20:45' });
  const u2 = mk({ home: 'Udinese', stadium: 'Stadio Friuli', date: '2026-10-18', time: '15:00' });
  it('deux stades → un trajet, quel que soit l’ordre d’entrée', () => {
    const legs = legsBetweenMatches([u, v]);
    expect(legs).toHaveLength(1);
    expect(legs[0].from).toBe('Stadio Pier Luigi Penzo'); expect(legs[0].to).toBe('Stadio Friuli');
  });
  it('même stade → aucun trajet', () => { expect(legsBetweenMatches([u, u2])).toEqual([]); expect(maxSpreadKm([u, u2])).toBeNull(); });
  it('trois matchs → trajets successifs sans doublon consécutif', () => expect(legsBetweenMatches([v, u, u2])).toHaveLength(1));
  it('stade inconnu ou absent ignoré', () => { expect(legsBetweenMatches([v, mk({ stadium: 'Inconnu' }), mk({ stadium: undefined })])).toEqual([]); });
  it('écart maximal', () => expect(maxSpreadKm([v, u])).toBeCloseTo(legsBetweenMatches([v, u])[0].km, 5));
  it('liste vide', () => { expect(legsBetweenMatches([])).toEqual([]); expect(maxSpreadKm([])).toBeNull(); });
});
