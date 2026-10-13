import { describe, expect, it } from 'vitest';
import { seedFixtures } from '../src/data/fixtures.js';
import { newFixtures } from '../src/data/newFixtures.js';
import { getDestinationHub, getDestinationLabel, getMatchDistance } from '../src/lib/destinations.js';
import { mk } from './helpers.js';

describe('villes touristiques de référence', () => {
  it('choisit Paris pour Paris et Autour de Paris', () => {
    const paris = mk({ zone: 'Paris', home: 'PSG' });
    const around = mk({ zone: 'Autour de Paris', home: 'Lens', city: 'France proche' });
    expect(getDestinationHub(paris)).toBe('Paris');
    expect(getDestinationHub(around)).toBe('Paris');
    expect(getDestinationLabel(paris)).toBe('France / Paris & alentours');
    expect(getDestinationLabel(around)).toBe('France / Paris & alentours');
    expect(getMatchDistance(paris)?.km).toBe(0);
    expect(getMatchDistance(around)?.city).toBe('Lens');
    expect(getMatchDistance(around)?.km).toBeGreaterThan(170);
  });

  it('choisit Madrid en Espagne / Madrid, Valence pour Villarreal', () => {
    expect(getMatchDistance(mk({ country: 'Espagne', zone: 'Madrid', home: 'Real Madrid' })))
      .toEqual({ hub: 'Madrid', city: 'Madrid', km: 0 });
    const away = getMatchDistance(mk({ country: 'Espagne', zone: 'Valence / Villarreal', home: 'Villarreal' }));
    expect(away.hub).toBe('Valence');
    expect(away.city).toBe('Villarreal');
    expect(away.km).toBeGreaterThan(50);
    expect(away.km).toBeLessThan(65);
  });

  it('calcule sur la ville réelle du club et non sur la région déclarée', () => {
    const match = mk({ country: 'Italie', zone: 'Milan / Lombardie', city: 'Milan', home: 'Como' });
    const result = getMatchDistance(match);
    expect(result).toEqual({ hub: 'Milan', city: 'Côme', km: expect.any(Number) });
    expect(result.km).toBeGreaterThan(30);
    expect(result.km).toBeLessThan(45);
  });

  it('n’invente rien pour une ville ou destination non reconnue', () => {
    expect(getMatchDistance(mk({ home: 'Club inconnu', city: 'France proche' }))).toBeNull();
    expect(getMatchDistance(mk({ zone: 'Destination inconnue', home: 'PSG' }))).toBeNull();
  });

  it('couvre tous les clubs receveurs des deux catalogues intégrés', () => {
    for (const m of [...seedFixtures, ...newFixtures]) {
      expect(getDestinationHub(m), `Destination inconnue : ${m.country} / ${m.zone}`).toBeTruthy();
      expect(getMatchDistance(m), `Ville du club inconnue : ${m.home}`).not.toBeNull();
    }
  });
});
