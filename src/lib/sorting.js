import { COUNTRY_ORDER } from '../constants.js';
import { getWeekend, timestamp } from './dates.js';

export const compareChrono = (a, b) => timestamp(a.date) - timestamp(b.date) || (a.time || '99').localeCompare(b.time || '99');

/** Rang d'un pays : ordre préféré d'abord, les autres ensuite par ordre alphabétique. */
export function countryRank(country) {
  const i = COUNTRY_ORDER.indexOf(country);
  return i === -1 ? COUNTRY_ORDER.length : i;
}
export const compareCountry = (a, b) => countryRank(a.country) - countryRank(b.country) || String(a.country).localeCompare(String(b.country), 'fr');

export function sortMatches(list, sort) {
  const copy = [...list];
  if (sort === 'country') return copy.sort((a, b) => compareCountry(a, b) || compareChrono(a, b));
  if (sort === 'highlights') return copy.sort((a, b) => Number(b.highlight) - Number(a.highlight) || compareChrono(a, b));
  return copy.sort((a, b) => (sort === 'desc' ? -1 : 1) * compareChrono(a, b));
}

export function groupMatches(list, group) {
  const map = new Map();
  list.forEach(m => {
    const k = group === 'zone-weekend' ? `${getWeekend(m.date)}|${m.country} / ${m.zone}` : group === 'date' ? m.date : group === 'zone-date' ? `${m.date}|${m.country} / ${m.zone}` : `${m.country} / ${m.zone}`;
    if (!map.has(k)) map.set(k, []);
    map.get(k).push(m);
  });
  return [...map.entries()];
}
