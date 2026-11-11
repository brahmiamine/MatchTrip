import { describe, expect, it } from 'vitest';
import { seedFixtures } from '../src/data/fixtures.js';
import { newFixtures } from '../src/data/newFixtures.js';
import audit from '../docs/data/fixtures-audit-2026-11-11.json';
import { buildWeekends } from '../src/lib/weekends.js';

const fixtures = [...seedFixtures, ...newFixtures];
const sources = new Map(audit.fixtures.map(row => [row.fixture_key, row]));

describe('rapprochement du catalogue et des sources du 11 novembre', () => {
  it('conserve les 56 clubs receveurs sélectionnés et ajoute janvier dans les six pays', () => {
    for (const [country, clubs] of Object.entries(audit.reviewed_clubs)) {
      expect([...new Set(fixtures.filter(m => m.country === country).map(m => m.home))].sort()).toEqual(clubs);
      expect(fixtures.some(m => m.country === country && m.date.startsWith('2027-01'))).toBe(true);
    }
    expect(fixtures.filter(m => m.date.startsWith('2027-01'))).toHaveLength(audit.counts.january);
    expect(audit.counts.january).toBe(134);
  });

  it('dispose d’une preuve de contrôle pour chaque rencontre, sans doublon d’affiche', () => {
    expect(sources.size).toBe(fixtures.length);
    expect(new Set(fixtures.map(m => `${m.country}|${m.home}|${m.away}`)).size).toBe(fixtures.length);
    for (const match of fixtures) {
      const evidence = sources.get(match.fixture_key);
      expect(evidence?.feed_url).toMatch(/^https:\/\/site\.api\.espn\.com\//);
      expect(match.verified_source_url).toBe(evidence.official_source_url || evidence.event_url);
      expect(match.verified_at).toBe(audit.checked_at);
    }
  });

  it('convertit les coups d’envoi UTC vers Paris sans décalage d’une heure', () => {
    const format = new Intl.DateTimeFormat('en-CA', {
      timeZone: audit.timezone, year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', hourCycle:'h23',
    });
    const confirmed = fixtures.filter(m => m.time_confirmed);
    expect(confirmed).toHaveLength(205);
    for (const match of confirmed) {
      const evidence = sources.get(match.fixture_key);
      expect(evidence.time_valid).toBe(true);
      const parts = Object.fromEntries(format.formatToParts(new Date(evidence.kickoff_utc)).map(p => [p.type,p.value]));
      expect(match.date).toBe(`${parts.year}-${parts.month}-${parts.day}`);
      expect(match.time).toBe(`${parts.hour}:${parts.minute}`);
    }
  });

  it('ne transforme pas les horaires provisoires en voyages combinables', () => {
    const provisional = fixtures.filter(m => !m.time_confirmed);
    expect(provisional).toHaveLength(66);
    for (const match of provisional) {
      expect(sources.get(match.fixture_key).time_valid).toBe(false);
      expect(match).toMatchObject({time:null, date_confirmed:false, time_confirmed:false, provisional:true});
      expect(match.date_window_start <= match.date && match.date <= match.date_window_end).toBe(true);
    }
    expect(buildWeekends(provisional)).toEqual([]);
  });
});
