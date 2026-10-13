import React, { useEffect, useMemo, useState } from 'react';
import { configured } from './lib/api.js';
import { describeActiveFilters } from './lib/activeFilters.js';
import { applyFilters, buildOptions } from './lib/filters.js';
import { sortMatches } from './lib/sorting.js';
import { decodeState, encodeState } from './lib/urlState.js';
import { toggleItem } from './lib/collections.js';
import { useFixtures } from './hooks/useFixtures.js';
import { useFilters } from './hooks/useFilters.js';
import { usePersistentList } from './hooks/usePersistentList.js';
import { usePersistentValue } from './hooks/usePersistentValue.js';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Toolbar from './components/Toolbar.jsx';
import FilterSidebar from './components/FilterSidebar.jsx';
import ActiveFilters from './components/ActiveFilters.jsx';
import MatchesView from './components/MatchesView.jsx';
import Empty, { Skeletons } from './components/Empty.jsx';
import Footer from './components/Footer.jsx';

const plural = (n, word) => `${n} ${word}${n > 1 ? 's' : ''}`;

export default function App() {
  const { fixtures: all, origin, error, loading } = useFixtures();
  const [initial] = useState(() => decodeState(window.location.search));
  const { filters, set, toggleIn, remove, addExcluded, removeExcluded, reset } = useFilters(all, initial);
  const [favorites, setFavorites] = usePersistentList('matchtrip-favorites', []);
  const [theme, setTheme] = usePersistentValue('matchtrip-theme', 'dark', ['dark', 'light']);
  const [mode, setMode] = usePersistentValue('matchtrip-display', 'cards', ['cards', 'list']);
  const [sort, setSort] = useState(initial.view.sort);
  const [group, setGroup] = useState(initial.view.group);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);
  useEffect(() => {
    const qs = encodeState(filters, { view: 'weekends', sort, group });
    const url = window.location.pathname + (qs ? '?' + qs : '') + window.location.hash;
    if (url !== window.location.pathname + window.location.search + window.location.hash) window.history.replaceState(null, '', url);
  }, [filters, sort, group]);
  // Tiroir de filtres mobile : Échap le ferme, la page derrière ne défile pas.
  useEffect(() => {
    if (!filtersOpen) return undefined;
    const onKey = e => e.key === 'Escape' && setFiltersOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.classList.add('drawer-locked');
    return () => { document.removeEventListener('keydown', onKey); document.body.classList.remove('drawer-locked'); };
  }, [filtersOpen]);

  const options = useMemo(() => buildOptions(all, filters), [all, filters.countries, filters.zones]);
  const filtered = useMemo(() => applyFilters(all, filters, favorites), [all, filters, favorites]);
  const ordered = useMemo(() => sortMatches(filtered, sort), [filtered, sort]);
  const active = useMemo(() => describeActiveFilters(filters), [filters]);
  const summary = loading ? 'Chargement…' : plural(filtered.length, 'match');

  return <div className="app">
    <Header origin={origin} theme={theme} onToggleTheme={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}/>
    <main className="wrap main">
      <Hero all={all} filteredCount={filtered.length}/>
      <Toolbar mode={mode} onMode={setMode} sort={sort} onSort={setSort} group={group} onGroup={setGroup} filterCount={active.length} onOpenFilters={() => setFiltersOpen(true)}/>
      <div className="content-grid">
        {filtersOpen && <div className="drawer-overlay" onClick={() => setFiltersOpen(false)}/>}
        <FilterSidebar open={filtersOpen} onClose={() => setFiltersOpen(false)} resultCount={filtered.length} favoritesCount={favorites.length} filters={filters} options={options} set={set} toggleIn={toggleIn} addExcluded={addExcluded} removeExcluded={removeExcluded} reset={reset}/>
        <section className="results">
          {error && <div className="notice warning"><span>⚠</span>{error}</div>}
          {!configured && <div className="notice"><span className="notice-icon">i</span><div><strong>Mode catalogue autonome</strong><p>Données initiales du 13 octobre 2026. La connexion à un projet Supabase dédié peut être activée ultérieurement.</p></div></div>}
          <ActiveFilters items={active} onRemove={remove} summary={summary} excludedCount={filters.excluded.length}/>
          {loading ? <Skeletons/>
            : filtered.length === 0 ? <Empty onReset={reset} noFavorites={filters.onlyFav && favorites.length === 0}/>
              : <MatchesView ordered={ordered} group={group} mode={mode} favorites={favorites} onToggleFavorite={k => setFavorites(p => toggleItem(p, k))}/>}
        </section>
      </div>
      <Footer/>
    </main>
  </div>;
}
