import React from 'react';

const MODES = [['cards', '▦ Cartes'], ['list', '☰ Liste']];

/** Barre collante : affichage, regroupement et (sur mobile) ouverture des filtres. */
export default function Toolbar({ mode, onMode, group, onGroup, filterCount, onOpenFilters }) {
  return <section className="toolbar"><div className="toolbar-row">
    <div className="segment" role="group" aria-label="Affichage">{MODES.map(([k, n]) => <button key={k} type="button" className={mode === k ? 'active' : ''} aria-pressed={mode === k} onClick={() => onMode(k)}>{n}</button>)}</div>
    <label className="select-label">Regrouper<select value={group} onChange={e => onGroup(e.target.value)}><option value="date">Par date</option><option value="zone">Par destination</option><option value="zone-date">Destination et date</option><option value="zone-weekend">Destination et week-end</option></select></label>
    <button type="button" className="filters-button" onClick={onOpenFilters}>Filtres{filterCount > 0 ? ` · ${filterCount}` : ''}</button>
  </div></section>;
}
