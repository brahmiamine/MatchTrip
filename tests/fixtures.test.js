import { describe, expect, it } from 'vitest';
import { seedFixtures } from '../src/data/fixtures.js';
import { COUNTRY_ORDER, END, START } from '../src/constants.js';
import { weekdayOf } from '../src/lib/dates.js';

describe('catalogue intégré', () => {
  it('147 matchs aux clés uniques', () => {
    expect(seedFixtures).toHaveLength(147);
    expect(new Set(seedFixtures.map(m => m.fixture_key)).size).toBe(147);
  });
  it.each(['fixture_key', 'country', 'zone', 'league', 'home', 'away', 'date', 'source_url'])('champ %s renseigné', f =>
    expect(seedFixtures.every(m => typeof m[f] === 'string' && m[f].length > 0)).toBe(true));
  it('dates valides, dans la période, samedi ou dimanche', () => {
    for (const m of seedFixtures) {
      expect(m.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(m.date >= START && m.date <= END).toBe(true);
      expect([0, 6]).toContain(weekdayOf(m.date));
    }
  });
  it('cluster vide uniquement pour les villes dispersées (non combinables)', () => {
    const empty = seedFixtures.filter(m => !m.cluster);
    expect(empty.length).toBeGreaterThan(0);
    expect(empty.every(m => m.zone === 'Autres villes italiennes')).toBe(true);
  });
  it('heures au format HH:MM ou nulles', () => expect(seedFixtures.every(m => m.time === null || /^\d{2}:\d{2}$/.test(m.time))).toBe(true));
  it('pays connus', () => expect(seedFixtures.every(m => COUNTRY_ORDER.includes(m.country))).toBe(true));
  it('clé cohérente avec la date', () => expect(seedFixtures.every(m => m.fixture_key.startsWith(m.date))).toBe(true));
});
