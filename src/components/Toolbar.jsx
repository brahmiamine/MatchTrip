import React from 'react';

const MODES = [['cards', '▦ Cartes'], ['list', '☰ Liste']];

/** Barre collante : affichage et (sur mobile) ouverture des filtres. */
export default function Toolbar({ mode, onMode, filterCount, onOpenFilters }) {
  return <section className="toolbar"><div className="toolbar-row">
    <div className="segment" role="group" aria-label="Affichage">{MODES.map(([k, n]) => <button key={k} type="button" className={mode === k ? 'active' : ''} aria-pressed={mode === k} onClick={() => onMode(k)}>{n}</button>)}</div>
    <button type="button" className="filters-button" onClick={onOpenFilters}>Filtres{filterCount > 0 ? ` · ${filterCount}` : ''}</button>
  </div></section>;
}
