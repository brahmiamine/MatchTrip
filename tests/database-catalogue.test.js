import { beforeEach, describe, expect, it, vi } from 'vitest';
const { api } = vi.hoisted(() => ({ api: vi.fn() }));
vi.mock('../src/lib/client.js', () => ({ configured: true, api }));
import { loadFixtures } from '../src/lib/api.js';
import { getTicketLabel, getTicketUrl } from '../src/lib/ticketing.js';
import { getDestinationHub, getMatchDistance } from '../src/lib/destinations.js';
import { getWeekendGroup } from '../src/lib/zoneGroups.js';

describe('Database catalogue is authoritative', () => {
  beforeEach(() => api.mockReset());
  const config = { hubs: { France: { Paris: 'Cloud city' } }, coordinates: { 'Cloud city': [48, 2] }, homeCities: { PSG: 'Cloud city' }, zoneGroups: { France: { Paris: 'Cloud group' } } };
  function serve(fixtures, media, settingsError = null) {
    api.mockImplementation(async (method, path) => {
      if (path === '/catalog-config/catalogue') { if (settingsError) throw new Error(settingsError.message); return { value: config }; }
      return path === '/club-media' ? media : fixtures;
    });
  }
  it('keeps database uncertainty even when a code snapshot marked the fixture confirmed', async () => {
    serve([{ fixture_key: '2026-10-18-paris-fc-rennes', country: 'France', zone: 'Paris', home: 'Paris FC', away: 'Rennes', date: '2026-10-18', time: '17:00:00', date_confirmed: false, time_confirmed: false }], [{ club: 'Paris FC', stadium: 'Database stadium', logo_url: 'https://example.org/logo.svg' }]);
    const result = await loadFixtures();
    expect(result.origin).toBe('Serveur');
    expect(result.fixtures[0]).toMatchObject({ date_confirmed: false, time_confirmed: false, time: '17:00', stadium: 'Database stadium' });
  });
  it('loads every fixture (no pagination limit) and uses database ticket and geography updates without a build', async () => {
    const fixtures = Array.from({ length: 501 }, (_, i) => ({ fixture_key: String(i), country: 'France', zone: 'Paris', cluster: 'x', home: 'PSG', away: 'Lyon', date: '2026-10-18', time: null }));
    serve(fixtures, [{ club: 'PSG', ticket_url: 'https://example.org/new-tickets', ticket_kind: 'information' }]);
    const result = await loadFixtures();
    expect(result.fixtures).toHaveLength(501);
    expect(getTicketUrl('PSG')).toBe('https://example.org/new-tickets');
    expect(getTicketLabel('PSG')).toBe('Infos billets');
    expect(getTicketUrl('Lens')).toBeNull();
    expect(getDestinationHub(fixtures[0])).toBe('Cloud city');
    expect(getMatchDistance(fixtures[0]).km).toBe(0);
    expect(getWeekendGroup(fixtures[0])).toBe('Cloud group');
  });
  it('reports unavailable configuration instead of silently presenting code defaults as database data', async () => {
    serve([], [], { message: 'Configuration inaccessible' });
    const result = await loadFixtures();
    expect(result.origin).toBe('catalogue intégré');
    expect(result.error).toContain('Configuration inaccessible');
    expect(result.fixtures.length).toBeGreaterThan(0);
    expect(getTicketUrl('PSG')).toBe('https://billetterie.psg.fr/');
    expect(getDestinationHub({ country: 'France', zone: 'Paris' })).toBe('Paris');
  });
});
