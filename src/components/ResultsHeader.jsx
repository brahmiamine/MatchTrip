import React from 'react';
import { CalendarDays, Compass, Filter, X } from 'lucide-react';

export default function ResultsHeader({ count, view, onView, sort, onSort, filterCount, excludedCount, onReset }) {
  return <>
    <div className="results-title"><div><div className="section-eyebrow">EXPLOREZ LES POSSIBILITÉS</div><h2>Votre prochain week-end <span>commence ici.</span></h2></div><div className="results-count">{count} match{count > 1 ? 's' : ''}</div></div>
    <div className="views-row"><div className="view-tabs"><button className={view === 'weekends' ? 'active' : ''} onClick={() => onView('weekends')}><Compass size={16}/> Combinaisons</button><button className={view === 'matches' ? 'active' : ''} onClick={() => onView('matches')}><CalendarDays size={16}/> Tous les matchs</button></div><div className="sort-wrap"><span>Trier</span><select value={sort} onChange={e => onSort(e.target.value)}><option value="asc">Date ↑</option><option value="desc">Date ↓</option><option value="highlights">Affiches marquantes</option></select></div></div>
    <div className="active-filters"><span className="active-label"><Filter size={14}/> Filtres actifs :</span>{filterCount === 0 ? <span className="filter-placeholder">Tous les critères</span> : <><span className="applied-count">{filterCount} personnalisé{filterCount > 1 ? 's' : ''}</span><button onClick={onReset}>Tout effacer <X size={13}/></button></>}{excludedCount > 0 && <span className="excluded-label">{excludedCount} week-end(s) exclu(s)</span>}</div>
  </>;
}
