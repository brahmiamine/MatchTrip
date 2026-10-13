import React from 'react';
import { X } from 'lucide-react';

/** Pastilles des critères actifs ; un clic retire le critère. */
export default function ActiveFilters({ items, onRemove, onReset, className = '' }) {
  if (!items.length) return null;
  return <div className={'chips ' + className} aria-label="Filtres actifs">
    {items.map(it => <button key={it.id} type="button" className="chip" title="Retirer ce filtre" onClick={() => onRemove(it)}><span>{it.label}</span><X size={12}/></button>)}
    {items.length > 1 && <button type="button" className="chip chip-clear" onClick={onReset}>Tout effacer</button>}
  </div>;
}
