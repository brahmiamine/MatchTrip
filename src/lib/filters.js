import { COUNTRY_ORDER, EVENING_FROM, EXCLUDED_DEFAULT } from '../constants.js';
import { getWeekend, weekdayOf } from './dates.js';
import { normalize, uniqueSorted } from './collections.js';

export const defaultFilters = () => ({
  countries: [], zones: [], clubs: [], leagues: [], weekends: [], search: '',
  dateFrom: '', dateTo: '', day: 'all', slot: 'all',
  onlyHighlights: false, onlyCertain: false, onlyFav: false,
  excluded: [...EXCLUDED_DEFAULT],
});

const timeKey = m => (m.time ? m.time.slice(0, 5) : null);
const searchText = m => normalize([m.home, m.away, m.country, m.zone, m.city, m.league, m.stadium].join(' '));

/** Plage de dates : une borne vide est ouverte (aucune limite) ; deux bornes inversées sont échangées. */
export function normalizeRange(from, to) {
  return from && to && from > to ? [to, from] : [from || '', to || ''];
}

export function matchesFilters(m, f, favorites = []) {
  if (f.countries.length && !f.countries.includes(m.country)) return false;
  if (f.zones.length && !f.zones.includes(m.zone)) return false;
  if (f.clubs.length && !f.clubs.includes(m.home)) return false;
  if (f.leagues.length && !f.leagues.includes(m.league)) return false;
  if (f.weekends.length && !f.weekends.includes(getWeekend(m.date))) return false;
  if (f.search && !searchText(m).includes(normalize(f.search.trim()))) return false;
  const [from, to] = normalizeRange(f.dateFrom, f.dateTo);
  if ((from && m.date < from) || (to && m.date > to)) return false;
  if (f.day !== 'all') {
    const wd = weekdayOf(m.date);
    if (f.day === 'samedi' ? wd !== 6 : wd !== 0) return false;
  }
  const t = timeKey(m);
  if (f.slot === 'day' && (!t || t >= EVENING_FROM)) return false;
  if (f.slot === 'evening' && (!t || t < EVENING_FROM)) return false;
  if (f.slot === 'unknown' && t) return false;
  if (f.onlyHighlights && !m.highlight) return false;
  if (f.onlyCertain && (m.provisional || !t)) return false;
  if (f.onlyFav && !favorites.includes(m.fixture_key)) return false;
  if (f.excluded.includes(getWeekend(m.date))) return false;
  return true;
}

export const applyFilters = (all, f, favorites) => all.filter(m => matchesFilters(m, f, favorites));

/** Nombre de critères personnalisés actifs (hors période et week-ends exclus). */
export function countActiveFilters(f) {
  const lists = [f.countries, f.zones, f.clubs, f.leagues, f.weekends].filter(x => x.length).length;
  const flags = [f.search.trim(), f.day !== 'all', f.slot !== 'all', f.onlyHighlights, f.onlyCertain, f.onlyFav, Boolean(f.dateFrom), Boolean(f.dateTo)];
  return lists + flags.filter(Boolean).length;
}

/** Ajoute le week-end contenant `date` (clé = samedi) sans doublon, trié. */
export function addExcludedWeekend(list, date) {
  if (!date) return list;
  const sat = getWeekend(date);
  return list.includes(sat) ? list : [...list, sat].sort();
}

const present = list => list.filter(Boolean);

/**
 * Options dérivées de TOUTES les données chargées (rien de codé en dur) :
 * zones ← pays, clubs et compétitions ← pays + zones, mois et bornes de dates ← catalogue.
 */
export function buildOptions(all, f) {
  const inCountries = all.filter(x => !f.countries.length || f.countries.includes(x.country));
  const inZones = inCountries.filter(x => !f.zones.length || f.zones.includes(x.zone));
  const found = uniqueSorted(present(all.map(x => x.country)));
  const dates = present(all.map(x => x.date)).sort();
  return {
    countries: [...COUNTRY_ORDER.filter(c => found.includes(c)), ...found.filter(c => !COUNTRY_ORDER.includes(c))],
    zones: uniqueSorted(present(inCountries.map(x => x.zone))),
    clubs: uniqueSorted(present(inZones.map(x => x.home))),
    leagues: uniqueSorted(present(inZones.map(x => x.league))),
    weekends: [...new Set(present(inZones.map(x => x.date)).map(getWeekend))].sort(),
    months: [...new Set(dates.map(d => d.slice(0, 7)))],
    dateBounds: { min: dates[0] || '', max: dates[dates.length - 1] || '' },
  };
}

/** Retire des sélections les valeurs devenues indisponibles après un changement de pays/zone. */
export function pruneSelection(all, f) {
  const o = buildOptions(all, f);
  const keep = (sel, avail) => sel.filter(v => avail.includes(v));
  return { ...f, zones: keep(f.zones, o.zones), clubs: keep(f.clubs, o.clubs), leagues: keep(f.leagues, o.leagues), weekends: keep(f.weekends, o.weekends) };
}
