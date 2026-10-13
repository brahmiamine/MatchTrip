import { describe, expect, it } from 'vitest';
import { getMatchDirectionsUrl } from '../src/lib/maps.js';
import { getTicketUrl } from '../src/lib/ticketing.js';
import { getDestinationName } from '../src/lib/destinations.js';
import { seedFixtures } from '../src/data/fixtures.js';
import { newFixtures } from '../src/data/newFixtures.js';
import { groupMatches } from '../src/lib/sorting.js';
import { mk } from './helpers.js';

describe('Itinéraire de ville à ville', () => {
  it('ouvre un vrai itinéraire Google Maps entre Paris et Lens', () => {
    const url = new URL(getMatchDirectionsUrl(mk({ zone: 'Autour de Paris', home: 'Lens' })));
    expect(url.origin + url.pathname).toBe('https://www.google.com/maps/dir/');
    expect(url.searchParams.get('api')).toBe('1');
    expect(url.searchParams.get('origin')).toBe('Paris, France');
    expect(url.searchParams.get('destination')).toBe('Lens, France');
  });
  it('aucun itinéraire pour une destination inconnue', () => {
    expect(getMatchDirectionsUrl(mk({ home: 'Inconnu', city: 'Inconnu' }))).toBeNull();
  });
});

describe('Billetteries officielles des clubs receveurs', () => {
  it('lien officiel pour PSG, Lens et Real Madrid', () => {
    expect(getTicketUrl('PSG')).toBe('https://billetterie.psg.fr/');
    expect(getTicketUrl('Lens')).toBe('https://billetterie.rclens.fr/');
    expect(getTicketUrl('Real Madrid')).toBe('https://www.realmadrid.com/fr-FR/billetterie');
  });
  it('aucune URL construite ou inventée pour un club inconnu', () => {
    expect(getTicketUrl('Club inexistant')).toBeNull();
  });
});

describe('Destinations et nettoyage du catalogue', () => {
  it('sépare la destination du pays, même lorsque la zone contient des /', () => {
    expect(getDestinationName(mk({ country: 'Espagne', zone: 'Valence / Villarreal' }))).toBe('Valence / Villarreal');
    expect(getDestinationName(mk({ zone: 'Autour de Paris' }))).toBe('Paris & alentours');
  });
  it('n’expose plus de rencontres des villes italiennes dispersées', () => {
    const all = [...seedFixtures, ...newFixtures];
    expect(all.some(m => m.country === 'Italie' && m.zone === 'Autres villes italiennes')).toBe(false);
    expect(groupMatches(all, 'zone').some(([k]) => k.includes('Autres villes italiennes'))).toBe(false);
  });
});
