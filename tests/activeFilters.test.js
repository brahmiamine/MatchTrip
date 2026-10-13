import { describe, expect, it } from 'vitest';
import { describeActiveFilters, removeFilter } from '../src/lib/activeFilters.js';
import { defaultFilters } from '../src/lib/filters.js';

const full = { ...defaultFilters(), countries: ['France', 'Italie'], zones: ['Paris'], clubs: ['PSG'], leagues: ['Ligue 1'], weekends: ['2026-10-17'], search: ' psg ', dateFrom: '2026-10-17', dateTo: '2026-11-30', day: 'dimanche', slot: 'evening', onlyHighlights: true, onlyCertain: true, onlyFav: true };

describe('filtres actifs', () => {
  it('aucun filtre → aucune pastille', () => expect(describeActiveFilters(defaultFilters())).toEqual([]));
  it('week-ends indisponibles non inclus', () => expect(describeActiveFilters({ ...defaultFilters(), excluded: ['2026-10-31'] })).toEqual([]));
  it('une pastille par valeur de liste et par critère', () => {
    const labels = describeActiveFilters(full).map(i => i.label);
    expect(labels).toEqual(['France', 'Italie', 'Paris', 'PSG', 'Ligue 1', 'Week-end ven 16 oct – dim 18 oct', '« psg »', 'Du sam 17 oct au lun 30 nov', 'Dimanche', 'À partir de 18h', 'Grandes affiches', 'Date et heure vérifiées', 'Favoris']);
  });
  it('identifiants uniques', () => { const ids = describeActiveFilters(full).map(i => i.id); expect(new Set(ids).size).toBe(ids.length); });
  it('période ouverte d’un côté', () => {
    expect(describeActiveFilters({ ...defaultFilters(), dateFrom: '2026-11-01' })[0].label).toBe('À partir du dim 1 nov');
    expect(describeActiveFilters({ ...defaultFilters(), dateTo: '2026-11-01' })[0].label).toBe('Jusqu\'au dim 1 nov');
  });
  it('retirer chaque pastille ramène à l’état par défaut', () => {
    let f = full;
    for (const item of describeActiveFilters(full)) f = removeFilter(f, item);
    expect(f).toEqual(defaultFilters());
  });
  it('retirer une valeur de liste garde les autres', () => {
    const item = describeActiveFilters(full).find(i => i.id === 'countries:France');
    expect(removeFilter(full, item).countries).toEqual(['Italie']);
  });
});
