import { getWeekend, timestamp } from './dates.js';

export const compareChrono = (a, b) => timestamp(a.date) - timestamp(b.date) || (a.time || '99').localeCompare(b.time || '99');

export function sortMatches(list, sort) {
  const copy = [...list];
  if (sort === 'highlights') return copy.sort((a, b) => Number(b.highlight) - Number(a.highlight) || compareChrono(a, b));
  return copy.sort((a, b) => (sort === 'desc' ? -1 : 1) * compareChrono(a, b));
}

export function groupMatches(list, group) {
  const map = new Map();
  list.forEach(m => {
    const k = group === 'country' ? m.country : group === 'zone-weekend' ? `${getWeekend(m.date)}|${m.country} / ${m.zone}` : group === 'date' ? m.date : group === 'zone-date' ? `${m.date}|${m.country} / ${m.zone}` : `${m.country} / ${m.zone}`;
    if (!map.has(k)) map.set(k, []);
    map.get(k).push(m);
  });
  return [...map.entries()];
}
