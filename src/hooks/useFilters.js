import { useCallback, useMemo, useState } from 'react';
import { defaultFilters, pruneSelection } from '../lib/filters.js';
import { toggleItem } from '../lib/collections.js';
import { nextDate } from '../lib/dates.js';
import { usePersistentList } from './usePersistentList.js';
import { EXCLUDED_DEFAULT } from '../constants.js';

/** État des filtres + actions. `all` sert à purger les sélections devenues incohérentes. */
export function useFilters(all) {
  const [excluded, setExcluded] = usePersistentList('matchtrip-blocked', EXCLUDED_DEFAULT);
  const [filters, setFilters] = useState(() => ({ ...defaultFilters(), excluded }));
  const merged = useMemo(() => ({ ...filters, excluded }), [filters, excluded]);

  const set = useCallback((key, value) => setFilters(f => ({ ...f, [key]: value })), []);
  const toggleIn = useCallback((key, value) => setFilters(f => pruneSelection(all, { ...f, [key]: toggleItem(f[key], value) })), [all]);
  const toggleExcluded = useCallback(day => setExcluded(p => toggleItem(p, day)), [setExcluded]);
  const reset = useCallback(() => { setFilters(defaultFilters()); setExcluded([...EXCLUDED_DEFAULT]); }, [setExcluded]);
  const focusWeekend = useCallback(w => {
    setFilters(f => ({ ...f, countries: [w.country], zones: w.zones, clubs: [], leagues: [], dateFrom: w.weekend, dateTo: nextDate(w.weekend) }));
    setExcluded(p => p.filter(x => x !== w.weekend));
  }, [setExcluded]);

  return { filters: merged, set, toggleIn, toggleExcluded, reset, focusWeekend };
}
