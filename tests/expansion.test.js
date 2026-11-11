import { describe, expect, it } from 'vitest';
import { seedFixtures } from '../src/data/fixtures.js';
import { newFixtures } from '../src/data/newFixtures.js';
import { getWeekendGroup } from '../src/lib/zoneGroups.js';
import { buildWeekends } from '../src/lib/weekends.js';

describe('calendrier Eredivisie et Bundesliga jusqu’à janvier 2027', () => {
  const all = [...seedFixtures, ...newFixtures];
  it('couvre les clubs sélectionnés dans les deux championnats', () => {
    expect(new Set(all.map(x => x.fixture_key)).size).toBe(all.length);
    expect(newFixtures.filter(x => x.country === 'Pays-Bas')).toHaveLength(62);
    expect(newFixtures.filter(x => x.country === 'Allemagne')).toHaveLength(45);
  });
  it('dates et stades retrouvables par clubs', () => {
    expect(newFixtures.every(x => x.zone && x.cluster && x.home && x.away && x.source_url && x.date)).toBe(true);
  });
  it('les cinq rencontres allemandes de la J19 gardent leur fenêtre officielle', () => {
    const unknown = newFixtures.filter(x => x.country === 'Allemagne' && x.provisional);
    expect(unknown).toHaveLength(5);
    expect(unknown.every(x => x.provisional && x.time === null && x.date_window_start && x.date_window_end)).toBe(true);
    expect(unknown.every(x => x.date_window_start === '2027-01-29' && x.date_window_end === '2027-01-31')).toBe(true);
    expect(buildWeekends(unknown)).toEqual([]);
    expect(newFixtures.filter(x => x.country === 'Allemagne' && x.date.startsWith('2026-12')).every(x => x.time_confirmed)).toBe(true);
  });
  it('Amsterdam se combine avec Alkmaar, Dortmund avec Schalke', () => {
    expect(getWeekendGroup(newFixtures.find(x => x.home === 'Ajax'))).toBe('Amsterdam / Alkmaar');
    expect(getWeekendGroup(newFixtures.find(x => x.home === 'AZ Alkmaar'))).toBe('Amsterdam / Alkmaar');
    expect(getWeekendGroup(newFixtures.find(x => x.home === 'Schalke 04'))).toBe('Dortmund / Schalke');
  });
});
