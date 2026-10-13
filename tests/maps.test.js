import { describe, expect, it } from 'vitest';
import { mapsUrl } from '../src/lib/maps.js';

describe('mapsUrl', () => {
  it('recherche Google Maps encodée avec le pays', () => {
    const u = new URL(mapsUrl('Parc des Princes', 'France'));
    expect(u.origin + u.pathname).toBe('https://www.google.com/maps/search/');
    expect(u.searchParams.get('api')).toBe('1');
    expect(u.searchParams.get('query')).toBe('Parc des Princes, France');
  });
  it('caractères spéciaux', () => expect(new URL(mapsUrl('Camp Nou & co')).searchParams.get('query')).toBe('Camp Nou & co'));
});
