import { EXCLUDED_DEFAULT } from '../constants.js';
import { defaultFilters } from './filters.js';

const LISTS = { c: 'countries', z: 'zones', cl: 'clubs', lg: 'leagues' };
const FLAGS = { hl: 'onlyHighlights', ok: 'onlyCertain', fav: 'onlyFav' };
const ENUMS = {
  m: ['all', '10', '11', '12'], d: ['all', 'samedi', 'dimanche'], slot: ['all', 'day', 'evening', 'unknown'],
  v: ['weekends', 'matches'], sort: ['asc', 'desc', 'highlights'], g: ['date', 'zone', 'zone-date', 'zone-weekend'],
};
const ISO = /^\d{4}-\d{2}-\d{2}$/;

export const defaultView = () => ({ view: 'weekends', sort: 'asc', group: 'date' });

/** Sérialise filtres + vue en query string, en omettant les valeurs par défaut. */
export function encodeState(filters, { view, sort, group }) {
  const p = new URLSearchParams();
  const def = defaultFilters();
  Object.entries(LISTS).forEach(([k, f]) => filters[f].forEach(v => p.append(k, v)));
  if (filters.search.trim()) p.set('q', filters.search.trim());
  if (filters.dateFrom !== def.dateFrom) p.set('from', filters.dateFrom);
  if (filters.dateTo !== def.dateTo) p.set('to', filters.dateTo);
  if (filters.month !== 'all') p.set('m', filters.month);
  if (filters.day !== 'all') p.set('d', filters.day);
  if (filters.slot !== 'all') p.set('slot', filters.slot);
  Object.entries(FLAGS).forEach(([k, f]) => { if (filters[f]) p.set(k, '1'); });
  const sameExcl = filters.excluded.length === EXCLUDED_DEFAULT.length && EXCLUDED_DEFAULT.every(d => filters.excluded.includes(d));
  if (!sameExcl) filters.excluded.length ? filters.excluded.forEach(d => p.append('excl', d)) : p.set('excl', '');
  if (view !== 'weekends') p.set('v', view);
  if (sort !== 'asc') p.set('sort', sort);
  if (group !== 'date') p.set('g', group);
  return p.toString();
}

/** Lit une query string ; toute valeur invalide est ignorée. `excluded` vaut null si absent de l'URL. */
export function decodeState(search) {
  const p = new URLSearchParams(search);
  const filters = defaultFilters();
  Object.entries(LISTS).forEach(([k, f]) => { filters[f] = [...new Set(p.getAll(k).filter(Boolean))]; });
  filters.search = p.get('q') || '';
  const from = p.get('from'), to = p.get('to');
  if (from && ISO.test(from)) filters.dateFrom = from;
  if (to && ISO.test(to)) filters.dateTo = to;
  const pick = (k, fallback) => (ENUMS[k].includes(p.get(k)) ? p.get(k) : fallback);
  filters.month = pick('m', 'all'); filters.day = pick('d', 'all'); filters.slot = pick('slot', 'all');
  Object.entries(FLAGS).forEach(([k, f]) => { filters[f] = p.get(k) === '1'; });
  const excluded = p.has('excl') ? p.getAll('excl').filter(d => ISO.test(d)) : null;
  const dv = defaultView();
  return { filters, excluded, view: { view: pick('v', dv.view), sort: pick('sort', dv.sort), group: pick('g', dv.group) } };
}
