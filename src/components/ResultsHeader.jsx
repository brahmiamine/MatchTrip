import React from 'react';
import { CalendarDays, Compass, Filter } from 'lucide-react';
import ActiveFilters from './ActiveFilters.jsx';

export default function ResultsHeader({ count, view, onView, sort, onSort, active, excludedCount, onRemove, onReset }) {
  return <>
    <div className="results-title"><div><div className="section-eyebrow">EXPLOREZ LES POSSIBILITÉS</div><h2>Votre prochain week-end de 3 jours <span>commence ici.</span></h2></div><div className="results-count">{count} match{count > 1 ? 's' : ''}</div></div>
    <div className="views-row"><div className="view-tabs"><button className={view === 'weekends' ? 'active' : ''} onClick={() => onView('weekends')}><Compass size={16}/> Combinaisons</button><button className={view === 'matches' ? 'active' : ''} onClick={() => onView('matches')}><CalendarDays size={16}/> Tous les matchs</button></div><div className="sort-wrap"><span>Trier</span><select value={sort} onChange={e => onSort(e.target.value)}><option value="asc">Date ↑</option><option value="desc">Date ↓</option><option value="highlights">Affiches marquantes</option><option value="country">Pays</option></select></div></div>
    <div className="active-filters"><span className="active-label"><Filter size={14}/> Filtres actifs :</span>{active.length === 0 ? <span className="filter-placeholder">Tous les critères</span> : <ActiveFilters items={active} onRemove={onRemove} onReset={onReset}/>}{excludedCount > 0 && <span className="excluded-label">{excludedCount} week-end(s) exclu(s)</span>}</div>
  </>;
}
