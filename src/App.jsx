import React, { useEffect, useMemo, useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { configured } from './lib/api.js';
import { describeActiveFilters } from './lib/activeFilters.js';
import { applyFilters, buildOptions, countActiveFilters } from './lib/filters.js';
import { sortMatches } from './lib/sorting.js';
import { buildWeekends } from './lib/weekends.js';
import { PAGE_SIZE } from './constants.js';
import { decodeState, encodeState } from './lib/urlState.js';
import { toggleItem } from './lib/collections.js';
import { useFixtures } from './hooks/useFixtures.js';
import { useFilters } from './hooks/useFilters.js';
import { usePersistentList } from './hooks/usePersistentList.js';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Stats from './components/Stats.jsx';
import FilterSidebar from './components/FilterSidebar.jsx';
import ResultsHeader from './components/ResultsHeader.jsx';
import WeekendsView from './components/WeekendsView.jsx';
import MatchesView from './components/MatchesView.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const { fixtures: all, origin, error, loading } = useFixtures();
  const [initial] = useState(() => decodeState(window.location.search));
  const { filters, set, toggleIn, remove, addExcluded, removeExcluded, reset, focusWeekend } = useFilters(all, initial);
  const [favorites, setFavorites] = usePersistentList('matchtrip-favorites', []);
  const [view, setView] = useState(initial.view.view);
  const [sort, setSort] = useState(initial.view.sort);
  const [group, setGroup] = useState(initial.view.group);
  const [pageLimit, setPageLimit] = useState(PAGE_SIZE);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const qs = encodeState(filters, { view, sort, group });
    const url = window.location.pathname + (qs ? '?' + qs : '') + window.location.hash;
    if (url !== window.location.pathname + window.location.search + window.location.hash) window.history.replaceState(null, '', url);
  }, [filters, view, sort, group]);
  useEffect(() => { setPageLimit(PAGE_SIZE); }, [filters, view, sort, group]);

  const options = useMemo(() => buildOptions(all, filters), [all, filters.countries, filters.zones]);
  const filtered = useMemo(() => applyFilters(all, filters, favorites), [all, filters, favorites]);
  const ordered = useMemo(() => sortMatches(filtered, sort), [filtered, sort]);
  const weekends = useMemo(() => buildWeekends(filtered, sort), [filtered, sort]);
  const active = useMemo(() => describeActiveFilters(filters), [filters]);
  const filterCount = countActiveFilters(filters);

  const examineWeekend = w => { focusWeekend(w); setView('matches'); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const more = step => setPageLimit(p => p + step);

  return <div className="app">
    <Header origin={origin}/>
    <main className="wrap">
      <Hero/>
      <Stats all={all} filteredCount={filtered.length}/>
      <div className="content-grid">
        <FilterSidebar open={filtersOpen} filters={filters} active={active} options={options} set={set} toggleIn={toggleIn} remove={remove} addExcluded={addExcluded} removeExcluded={removeExcluded} reset={reset}/>
        <section className="results">
          {error && <div className="warning"><span>⚠</span>{error}</div>}
          {!configured && <div className="notice"><span className="notice-icon">i</span><div><strong>Mode catalogue autonome</strong><p>Données initiales du 13 octobre 2026. La connexion à un projet Supabase dédié peut être activée ultérieurement.</p></div></div>}
          <ResultsHeader count={filtered.length} view={view} onView={setView} sort={sort} onSort={setSort} active={active} onRemove={remove} excludedCount={filters.excluded.length} onReset={reset}/>
          {loading ? <div className="empty"><div className="spinner"/><h3>Chargement des matchs…</h3></div>
            : view === 'weekends'
              ? <WeekendsView weekends={weekends} pageLimit={pageLimit} onMore={more} onExamine={examineWeekend} onReset={reset}/>
              : <MatchesView ordered={ordered} group={group} onGroup={setGroup} pageLimit={pageLimit} onMore={more} favorites={favorites} onToggleFavorite={k => setFavorites(p => toggleItem(p, k))} onReset={reset}/>}
        </section>
      </div>
      <Footer/>
    </main>
    <button className="mobile-filter" onClick={() => setFiltersOpen(p => !p)}>{filtersOpen ? <X size={18}/> : <SlidersHorizontal size={18}/>} {filtersOpen ? 'Fermer les filtres' : 'Filtres'}{filterCount > 0 && <span>{filterCount}</span>}</button>
  </div>;
}
