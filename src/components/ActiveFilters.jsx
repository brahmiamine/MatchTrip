import React from 'react';

/** Pastilles des critères actifs ; un clic retire le critère. */
export default function ActiveFilters({ items, onRemove, summary, excludedCount }) {
  return <div className="active-filters" aria-label="Filtres actifs">
    <span className="active-label">{summary} · Filtres actifs :</span>
    {items.length === 0 && <span className="active-label">Tous les critères</span>}
    {items.map(it => <button key={it.id} type="button" className="tag" title="Retirer ce filtre" onClick={() => onRemove(it)}>{it.label} ×</button>)}
    {excludedCount > 0 && <span className="active-label">{excludedCount} week-end(s) exclu(s)</span>}
  </div>;
}
