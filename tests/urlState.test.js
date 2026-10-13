import { describe, expect, it } from 'vitest';
import { decodeState, defaultView, encodeState } from '../src/lib/urlState.js';
import { defaultFilters } from '../src/lib/filters.js';

const rt = (filters, view = defaultView()) => decodeState('?' + encodeState(filters, view));

describe('état dans l’URL', () => {
  it('état par défaut → URL vide', () => expect(encodeState(defaultFilters(), defaultView())).toBe(''));
  it('URL vide → valeurs par défaut', () => {
    const s = decodeState('');
    expect(s.filters).toEqual(defaultFilters());
    expect(s.excluded).toBeNull();
    expect(s.view).toEqual(defaultView());
  });
  it('aller-retour complet', () => {
    const f = { ...defaultFilters(), countries: ['Pays-Bas', 'Espagne'], zones: ['Paris & alentours'], clubs: ['Paris FC', 'Atlético, Madrid'], leagues: ['Ligue 1'], weekends: ['2026-11-14', '2026-10-31'], search: 'été & plus', dateFrom: '2026-11-01', dateTo: '2026-12-10', day: 'dimanche', slot: 'evening', onlyHighlights: true, onlyCertain: true, onlyFav: true, excluded: ['2026-11-14', '2026-10-31'] };
    const v = { view: 'matches', sort: 'highlights', group: 'zone-weekend' };
    const s = rt(f, v);
    expect(s.filters).toEqual({ ...f, excluded: [] });
    expect(s.excluded).toEqual(['2026-10-31', '2026-11-14']);
    expect(s.view).toEqual(v);
  });
  it('aucun week-end exclu : absent de l’URL', () => expect(encodeState(defaultFilters(), defaultView())).not.toContain('excl'));
  it('plusieurs week-ends exclus', () => expect(rt({ ...defaultFilters(), excluded: ['2026-10-31', '2026-11-07'] }).excluded).toEqual(['2026-10-31', '2026-11-07']));
  it('valeurs invalides ignorées', () => {
    const s = decodeState('?w=pas-une-date&d=lundi&slot=x&v=y&sort=z&g=w&from=abc&to=2026-13&hl=0&excl=nope');
    expect(s.filters).toEqual(defaultFilters());
    expect(s.view).toEqual(defaultView());
    expect(s.excluded).toEqual([]);
  });
  it('doublons dans les listes supprimés', () => expect(decodeState('?c=France&c=France').filters.countries).toEqual(['France']));
  it('recherche vide ou espaces non écrite', () => expect(encodeState({ ...defaultFilters(), search: '  ' }, defaultView())).toBe(''));
});
