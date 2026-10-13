import { formatDay, formatWeekendRange } from './dates.js';

const SLOTS = { day: 'Avant 18h', evening: 'À partir de 18h', unknown: 'Heure non confirmée' };
const DAYS = { samedi: 'Samedi', dimanche: 'Dimanche' };
const FLAGS = { onlyHighlights: 'Grandes affiches', onlyCertain: 'Date et heure confirmées', onlyFav: 'Favoris' };
const LISTS = [['countries', ''], ['zones', ''], ['clubs', ''], ['leagues', ''], ['weekends', 'Week-end ']];

/** Critères actifs sous forme de pastilles : [{ id, key, value?, label }]. */
export function describeActiveFilters(f) {
  const items = [];
  LISTS.forEach(([key, prefix]) => f[key].forEach(v => items.push({ id: `${key}:${v}`, key, value: v, label: key === 'weekends' ? prefix + formatWeekendRange(v) : v })));
  if (f.search.trim()) items.push({ id: 'search', key: 'search', label: `« ${f.search.trim()} »` });
  if (f.dateFrom || f.dateTo) {
    const label = f.dateFrom && f.dateTo ? `Du ${formatDay(f.dateFrom)} au ${formatDay(f.dateTo)}` : f.dateFrom ? `À partir du ${formatDay(f.dateFrom)}` : `Jusqu'au ${formatDay(f.dateTo)}`;
    items.push({ id: 'period', key: 'period', label });
  }
  if (f.day !== 'all') items.push({ id: 'day', key: 'day', label: DAYS[f.day] });
  if (f.slot !== 'all') items.push({ id: 'slot', key: 'slot', label: SLOTS[f.slot] });
  Object.entries(FLAGS).forEach(([key, label]) => { if (f[key]) items.push({ id: key, key, label }); });
  return items;
}

/** Filtres sans le critère `item` (sélection d'une liste, ou remise à zéro d'un critère simple). */
export function removeFilter(f, item) {
  if (Array.isArray(f[item.key])) return { ...f, [item.key]: f[item.key].filter(v => v !== item.value) };
  if (item.key === 'period') return { ...f, dateFrom: '', dateTo: '' };
  if (item.key === 'search') return { ...f, search: '' };
  if (item.key === 'day' || item.key === 'slot') return { ...f, [item.key]: 'all' };
  return { ...f, [item.key]: false };
}
