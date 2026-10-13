import { describe, expect, it } from 'vitest';
import { seedFixtures } from '../src/data/fixtures.js';
import { newFixtures } from '../src/data/newFixtures.js';
import { getWeekendGroup } from '../src/lib/zoneGroups.js';
import { buildWeekends } from '../src/lib/weekends.js';

describe('extension Eredivisie et Bundesliga 2026', () => {
  const all = [...seedFixtures, ...newFixtures];
  it('conserve 147 matchs et ajoute 85 rencontres uniques', () => {
    expect(all).toHaveLength(232);
    expect(new Set(all.map(x => x.fixture_key)).size).toBe(232);
    expect(newFixtures.filter(x => x.country === 'Pays-Bas')).toHaveLength(51);
    expect(newFixtures.filter(x => x.country === 'Allemagne')).toHaveLength(34);
  });
  it('dates et stades retrouvables par clubs', () => {
    expect(newFixtures.every(x => x.zone && x.cluster && x.home && x.away && x.source_url && x.date)).toBe(true);
  });
  it('les 13 rencontres allemandes de décembre gardent une fenêtre de dates', () => {
    const unknown = newFixtures.filter(x => x.country === 'Allemagne' && x.date >= '2026-12-01');
    expect(unknown).toHaveLength(13);
    expect(unknown.every(x => x.provisional && x.time === null && x.date_window_start && x.date_window_end)).toBe(true);
    expect(buildWeekends(unknown)).toEqual([]);
  });
  it('Amsterdam se combine avec Alkmaar, Dortmund avec Schalke', () => {
    expect(getWeekendGroup(seedFixtures.find(x => x.home === 'Ajax'))).toBe('Amsterdam / Alkmaar');
    expect(getWeekendGroup(newFixtures.find(x => x.home === 'AZ Alkmaar'))).toBe('Amsterdam / Alkmaar');
    expect(getWeekendGroup(newFixtures.find(x => x.home === 'Schalke 04'))).toBe('Dortmund / Schalke');
  });
});
