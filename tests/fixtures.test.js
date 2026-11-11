import { describe, expect, it } from 'vitest';
import { seedFixtures } from '../src/data/fixtures.js';
import { newFixtures } from '../src/data/newFixtures.js';
import { COUNTRY_ORDER } from '../src/constants.js';
const fixtures = [...seedFixtures, ...newFixtures];

describe('catalogue intégré', () => {
  it('271 matchs aux clés uniques après le contrôle de novembre', () => {
    expect(fixtures).toHaveLength(271);
    expect(new Set(fixtures.map(m => m.fixture_key)).size).toBe(271);
  });
  it.each(['fixture_key', 'country', 'zone', 'league', 'home', 'away', 'date', 'source_url'])('champ %s renseigné', f =>
    expect(fixtures.every(m => typeof m[f] === 'string' && m[f].length > 0)).toBe(true));
  it('dates valides à partir du 11 novembre, y compris les rencontres en semaine', () => {
    for (const m of fixtures) {
      expect(m.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(new Date(m.date + 'T00:00:00Z').toISOString().slice(0, 10)).toBe(m.date);
      expect(m.date >= '2026-11-11' && m.date <= '2027-01-31').toBe(true);
    }
  });
  it('aucune zone italienne non localisée', () => {
    expect(fixtures.filter(m => m.zone === 'Autres villes italiennes')).toHaveLength(0);
    expect(fixtures.every(m => m.cluster)).toBe(true);
  });
  it('heures au format HH:MM ou nulles', () => expect(fixtures.every(m => m.time === null || /^([01]\d|2[0-3]):[0-5]\d$/.test(m.time))).toBe(true));
  it('pays connus', () => expect(fixtures.every(m => COUNTRY_ORDER.includes(m.country))).toBe(true));
  it('conserve la clé des favoris lorsque le coup d’envoi change de date', () => {
    expect(fixtures.find(m => m.fixture_key === '2026-11-29-espanyol-getafe')).toMatchObject({date:'2026-11-30', time:'21:00', date_confirmed:true, time_confirmed:true});
  });
});
