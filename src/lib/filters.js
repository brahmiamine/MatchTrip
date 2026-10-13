import { COUNTRY_ORDER, END, EVENING_FROM, EXCLUDED_DEFAULT, START } from '../constants.js';
import { getWeekend, weekdayOf } from './dates.js';
import { normalize, uniqueSorted } from './collections.js';

export const defaultFilters = () => ({
  countries: [], zones: [], clubs: [], leagues: [], search: '',
  dateFrom: START, dateTo: END, month: 'all', day: 'all', slot: 'all',
  onlyHighlights: false, onlyCertain: false, onlyFav: false,
  excluded: [...EXCLUDED_DEFAULT],
});

const timeKey = m => (m.time ? m.time.slice(0, 5) : null);
const searchText = m => normalize([m.home, m.away, m.country, m.zone, m.city, m.league, m.stadium].join(' '));

/** Entrée de plage de dates : borne manquante → défaut, bornes inversées → échangées. */
export function normalizeRange(from, to) {
  const a = from || START, b = to || END;
  return a <= b ? [a, b] : [b, a];
}

export function matchesFilters(m, f, favorites = []) {
  if (f.countries.length && !f.countries.includes(m.country)) return false;
  if (f.zones.length && !f.zones.includes(m.zone)) return false;
  if (f.clubs.length && !f.clubs.includes(m.home)) return false;
  if (f.leagues.length && !f.leagues.includes(m.league)) return false;
  if (f.search && !searchText(m).includes(normalize(f.search.trim()))) return false;
  const [from, to] = normalizeRange(f.dateFrom, f.dateTo);
  if (m.date < from || m.date > to) return false;
  if (f.month !== 'all' && m.date.slice(5, 7) !== f.month) return false;
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
  const lists = [f.countries, f.zones, f.clubs, f.leagues].filter(x => x.length).length;
  const flags = [f.search.trim(), f.month !== 'all', f.day !== 'all', f.slot !== 'all', f.onlyHighlights, f.onlyCertain, f.onlyFav, f.dateFrom !== START, f.dateTo !== END];
  return lists + flags.filter(Boolean).length;
}

/** Options en cascade : zones ← pays, clubs ← pays + zones, compétitions ← pays + zones. */
export function buildOptions(all, f) {
  const inCountries = all.filter(x => !f.countries.length || f.countries.includes(x.country));
  const inZones = inCountries.filter(x => !f.zones.length || f.zones.includes(x.zone));
  return {
    countries: COUNTRY_ORDER.filter(c => all.some(x => x.country === c)),
    zones: uniqueSorted(inCountries.map(x => x.zone)),
    clubs: uniqueSorted(inZones.map(x => x.home)),
    leagues: uniqueSorted(inZones.map(x => x.league)),
  };
}

/** Retire des sélections les valeurs devenues indisponibles après un changement de pays/zone. */
export function pruneSelection(all, f) {
  const o = buildOptions(all, f);
  const keep = (sel, avail) => sel.filter(v => avail.includes(v));
  return { ...f, zones: keep(f.zones, o.zones), clubs: keep(f.clubs, o.clubs), leagues: keep(f.leagues, o.leagues) };
}
