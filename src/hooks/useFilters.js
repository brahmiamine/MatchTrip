import { useCallback, useMemo, useState } from 'react';
import { removeFilter } from '../lib/activeFilters.js';
import { addExcludedWeekend, defaultFilters, pruneSelection } from '../lib/filters.js';
import { toggleItem } from '../lib/collections.js';
import { weekendFriday, weekendSunday } from '../lib/dates.js';
import { usePersistentList } from './usePersistentList.js';
import { EXCLUDED_DEFAULT } from '../constants.js';

/** État des filtres + actions. `all` sert à purger les sélections devenues incohérentes. */
/** `initial` : { filters, excluded } issu de l'URL ; excluded null → valeur mémorisée localement. */
export function useFilters(all, initial) {
  const [excluded, setExcluded] = usePersistentList('matchtrip-blocked', EXCLUDED_DEFAULT, initial?.excluded);
  const [filters, setFilters] = useState(() => ({ ...defaultFilters(), ...initial?.filters }));
  const merged = useMemo(() => ({ ...filters, excluded }), [filters, excluded]);

  const set = useCallback((key, value) => setFilters(f => ({ ...f, [key]: value })), []);
  const toggleIn = useCallback((key, value) => setFilters(f => pruneSelection(all, { ...f, [key]: toggleItem(f[key], value) })), [all]);
  const remove = useCallback(item => setFilters(f => pruneSelection(all, removeFilter(f, item))), [all]);
  const addExcluded = useCallback(date => setExcluded(p => addExcludedWeekend(p, date)), [setExcluded]);
  const removeExcluded = useCallback(sat => setExcluded(p => p.filter(x => x !== sat)), [setExcluded]);
  /** Les week-ends indisponibles sont des contraintes personnelles : la réinitialisation les conserve. */
  const reset = useCallback(() => setFilters(defaultFilters()), []);
  const focusWeekend = useCallback(w => {
    setFilters(f => ({ ...f, countries: [w.country], zones: w.zones, clubs: [], leagues: [], dateFrom: weekendFriday(w.weekend), dateTo: weekendSunday(w.weekend) }));
    setExcluded(p => p.filter(x => x !== w.weekend));
  }, [setExcluded]);

  return { filters: merged, set, toggleIn, remove, addExcluded, removeExcluded, reset, focusWeekend };
}
