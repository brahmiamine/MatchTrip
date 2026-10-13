import { MIN_GAP_MINUTES } from '../constants.js';
import { getWeekend, isWeekendDay, minutesOf } from './dates.js';
import { compareChrono, compareCountry } from './sorting.js';
import { getWeekendGroup } from './zoneGroups.js';

/** Deux matchs sont combinables s'ils sont sur des jours différents, ou le même jour avec ≥ 4 h d'écart. */
export function compatible(a, b) {
  if (a.date !== b.date) return true;
  const ta = minutesOf(a.time), tb = minutesOf(b.time);
  return ta !== null && tb !== null && Math.abs(ta - tb) >= MIN_GAP_MINUTES;
}

export function buildPairs(items) {
  const pairs = [];
  for (let i = 0; i < items.length; i++) for (let j = i + 1; j < items.length; j++) if (compatible(items[i], items[j])) pairs.push([items[i], items[j]]);
  return pairs;
}

export function buildWeekends(matches, sort = 'asc') {
  const map = new Map();
  matches.forEach(m => {
    // Bundesliga December game dates are unconfirmed within a Friday–Sunday window.
    if (m.date_window_start && m.date_window_end) return;
    if (!isWeekendDay(m.date)) return;
    const cluster = getWeekendGroup(m);
    if (!cluster) return;
    const weekend = getWeekend(m.date);
    const k = `${m.country}|${cluster}|${weekend}`;
    if (!map.has(k)) map.set(k, { weekend, cluster, country: m.country, items: [], zones: new Set() });
    const w = map.get(k);
    w.items.push(m); w.zones.add(m.zone);
  });
  const list = [...map.values()].map(w => {
    const items = w.items.sort(compareChrono);
    return { ...w, items, zones: [...w.zones], pairs: buildPairs(items).filter(([a, b]) => a.home !== b.home), score: items.filter(x => x.highlight).length * 10 + items.length };
  }).filter(w => w.pairs.length > 0);
  return list.sort((a, b) => {
    if (sort === 'country') return compareCountry(a, b) || a.weekend.localeCompare(b.weekend) || a.cluster.localeCompare(b.cluster, 'fr');
    if (sort === 'desc') return b.weekend.localeCompare(a.weekend);
    if (sort === 'highlights') return b.score - a.score || a.weekend.localeCompare(b.weekend);
    return a.weekend.localeCompare(b.weekend) || b.score - a.score;
  });
}
