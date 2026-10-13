import { describe, expect, it } from 'vitest';
import { applyFilters, buildOptions, countActiveFilters, defaultFilters, normalizeRange, pruneSelection } from '../src/lib/filters.js';
import { END, START } from '../src/constants.js';
import { mk } from './helpers.js';

const data = [
  mk({ date: '2026-10-17', time: '15:00', home: 'PSG', away: 'Lyon', highlight: true }),
  mk({ date: '2026-10-18', time: '20:45', home: 'Paris FC', away: 'Rennes' }),
  mk({ date: '2026-10-31', time: '17:00', home: 'Lille', away: 'Nice', zone: 'Nord', cluster: 'Nord' }),
  mk({ date: '2026-11-15', time: null, home: 'Real', away: 'Atletico', country: 'Espagne', zone: 'Madrid', cluster: 'Madrid', league: 'LaLiga', provisional: true }),
  mk({ date: '2026-12-06', time: '12:00', home: 'Inter', away: 'Milan', country: 'Italie', zone: 'Milan', cluster: 'Milan', league: 'Serie A' }),
];
const run = (over, fav = []) => applyFilters(data, { ...defaultFilters(), ...over }, fav).map(m => m.home);

describe('filtres', () => {
  it('par défaut, masque les week-ends exclus', () => expect(run({})).toEqual(['PSG', 'Paris FC', 'Real', 'Inter']));
  it('week-end réactivé', () => expect(run({ excluded: [] })).toContain('Lille'));
  it('pays', () => expect(run({ countries: ['Espagne', 'Italie'] })).toEqual(['Real', 'Inter']));
  it('zone', () => expect(run({ zones: ['Madrid'] })).toEqual(['Real']));
  it('club', () => expect(run({ clubs: ['PSG'] })).toEqual(['PSG']));
  it('compétition', () => expect(run({ leagues: ['Serie A'] })).toEqual(['Inter']));
  it('recherche insensible à la casse et aux accents', () => {
    expect(run({ search: 'ATLÉTICO' })).toEqual(['Real']);
    expect(run({ search: 'atletico' })).toEqual(['Real']);
    expect(run({ search: '  rennes ' })).toEqual(['Paris FC']);
    expect(run({ search: 'espagne' })).toEqual(['Real']);
  });
  it('période', () => expect(run({ dateFrom: '2026-10-18', dateTo: '2026-11-15' })).toEqual(['Paris FC', 'Real']));
  it('période inversée est corrigée', () => expect(run({ dateFrom: '2026-11-15', dateTo: '2026-10-18' })).toEqual(['Paris FC', 'Real']));
  it('mois', () => { expect(run({ month: '12' })).toEqual(['Inter']); expect(run({ month: '10' })).toEqual(['PSG', 'Paris FC']); });
  it('jour', () => { expect(run({ day: 'samedi' })).toEqual(['PSG']); expect(run({ day: 'dimanche' })).toEqual(['Paris FC', 'Real', 'Inter']); });
  it('jour : un match en semaine n’est ni samedi ni dimanche', () => {
    const w = [mk({ date: '2026-10-21' })];
    expect(applyFilters(w, { ...defaultFilters(), day: 'dimanche' })).toEqual([]);
    expect(applyFilters(w, { ...defaultFilters(), day: 'samedi' })).toEqual([]);
  });
  it('horaire : avant 18h', () => expect(run({ slot: 'day' })).toEqual(['PSG', 'Inter']));
  it('horaire : à partir de 18h', () => expect(run({ slot: 'evening' })).toEqual(['Paris FC']));
  it('horaire : inconnu', () => expect(run({ slot: 'unknown' })).toEqual(['Real']));
  it('18h pile est en soirée', () => expect(applyFilters([mk({ time: '18:00' })], { ...defaultFilters(), slot: 'evening' })).toHaveLength(1));
  it('grandes affiches', () => expect(run({ onlyHighlights: true })).toEqual(['PSG']));
  it('confirmés : ni provisoire ni sans heure', () => expect(run({ onlyCertain: true })).toEqual(['PSG', 'Paris FC', 'Inter']));
  it('favoris', () => {
    expect(run({ onlyFav: true }, [])).toEqual([]);
    expect(run({ onlyFav: true }, [data[1].fixture_key])).toEqual(['Paris FC']);
  });
  it('combinaison de filtres', () => expect(run({ countries: ['France'], slot: 'evening', day: 'dimanche' })).toEqual(['Paris FC']));
  it('aucun résultat', () => expect(run({ countries: ['Italie'], day: 'samedi' })).toEqual([]));
  it('normalizeRange', () => {
    expect(normalizeRange('', '')).toEqual([START, END]);
    expect(normalizeRange('2026-12-01', '2026-11-01')).toEqual(['2026-11-01', '2026-12-01']);
  });
  it('countActiveFilters', () => {
    expect(countActiveFilters(defaultFilters())).toBe(0);
    expect(countActiveFilters({ ...defaultFilters(), countries: ['France'], zones: ['Paris'], day: 'samedi', search: ' ' })).toBe(3);
    expect(countActiveFilters({ ...defaultFilters(), dateFrom: '2026-11-01' })).toBe(1);
  });
});

describe('options en cascade', () => {
  it('sans sélection : tout', () => {
    const o = buildOptions(data, defaultFilters());
    expect(o.countries).toEqual(['France', 'Espagne', 'Italie']);
    expect(o.zones).toEqual(['Madrid', 'Milan', 'Nord', 'Paris']);
    expect(o.leagues).toEqual(['LaLiga', 'Ligue 1', 'Serie A']);
  });
  it('un pays restreint zones, clubs et compétitions', () => {
    const o = buildOptions(data, { ...defaultFilters(), countries: ['Espagne'] });
    expect(o.zones).toEqual(['Madrid']);
    expect(o.clubs).toEqual(['Real']);
    expect(o.leagues).toEqual(['LaLiga']);
  });
  it('une zone restreint clubs', () => expect(buildOptions(data, { ...defaultFilters(), zones: ['Paris'] }).clubs).toEqual(['Paris FC', 'PSG']));
  it('pruneSelection retire les valeurs orphelines', () => {
    const f = pruneSelection(data, { ...defaultFilters(), countries: ['Espagne'], zones: ['Paris', 'Madrid'], clubs: ['PSG', 'Real'], leagues: ['Ligue 1'] });
    expect(f.zones).toEqual(['Madrid']);
    expect(f.clubs).toEqual(['Real']);
    expect(f.leagues).toEqual([]);
  });
});
