import React from 'react';
import { FLAGS } from '../constants.js';
import { formatMonth, formatWeekendRange, monthRange } from '../lib/dates.js';
import MultiSelect from './MultiSelect.jsx';
import ExcludedWeekends from './ExcludedWeekends.jsx';

const DAYS = [['all', 'Tous'], ['vendredi', 'Vendredi'], ['samedi', 'Samedi'], ['dimanche', 'Dimanche']];

function Switch({ label, checked, onChange }) {
  return <label className="switch-row"><span>{label}</span><input type="checkbox" role="switch" checked={checked} onChange={e => onChange(e.target.checked)}/></label>;
}

export default function FilterSidebar({ open, onClose, resultCount, favoritesCount, filters: f, options, set, toggleIn, addExcluded, removeExcluded, reset }) {
  const setPeriod = (a, b) => { set('dateFrom', a); set('dateTo', b); };
  return <aside className={'sidebar' + (open ? ' sidebar-open' : '')} aria-label="Filtres">
    <div className="sidebar-head"><h2>Vos critères</h2><div><button type="button" className="reset" onClick={reset}>Réinitialiser</button><button type="button" className="drawer-close" aria-label="Fermer les filtres" onClick={onClose}>×</button></div></div>
    <div className="filters-body">
      <label className="field"><span className="field-label">RECHERCHE LIBRE</span><input className="input" value={f.search} onChange={e => set('search', e.target.value)} placeholder="Club, adversaire, ville…"/></label>
      <div className="field"><span className="field-label">PAYS · CHOIX MULTIPLES</span><div className="chip-wrap">{options.countries.map(c => <button type="button" key={c} className={'chip' + (f.countries.includes(c) ? ' active' : '')} aria-pressed={f.countries.includes(c)} onClick={() => toggleIn('countries', c)}>{FLAGS[c]} {c}</button>)}</div></div>
      <div className="field"><span className="field-label">DESTINATIONS ET CLUBS</span>
        <MultiSelect label="Zones géographiques" values={options.zones} chosen={f.zones} onToggle={z => toggleIn('zones', z)}/>
        <MultiSelect label="Clubs à domicile" values={options.clubs} chosen={f.clubs} onToggle={c => toggleIn('clubs', c)}/>
        <MultiSelect label="Week-ends" values={options.weekends} chosen={f.weekends} onToggle={w => toggleIn('weekends', w)} format={formatWeekendRange}/>
        <MultiSelect label="Compétitions" values={options.leagues} chosen={f.leagues} onToggle={l => toggleIn('leagues', l)}/></div>
      <div className="field"><span className="field-label">PÉRIODE</span>
        <div className="pair-row">
          <label>Du<input className="input sm" type="date" min={options.dateBounds.min} max={options.dateBounds.max} value={f.dateFrom} onChange={e => set('dateFrom', e.target.value)}/></label>
          <label>Au<input className="input sm" type="date" min={options.dateBounds.min} max={options.dateBounds.max} value={f.dateTo} onChange={e => set('dateTo', e.target.value)}/></label></div>
        <div className="chip-wrap"><button type="button" className={'chip square' + (!f.dateFrom && !f.dateTo ? ' active' : '')} onClick={() => setPeriod('', '')}>Tout</button>
          {options.months.map(ym => { const [a, b] = monthRange(ym); const on = f.dateFrom === a && f.dateTo === b; return <button type="button" key={ym} className={'chip square' + (on ? ' active' : '')} onClick={() => setPeriod(a, b)}>{formatMonth(ym)}</button>; })}</div></div>
      <div className="field"><span className="field-label">JOUR DU MATCH</span><div className="segment full">{DAYS.map(([k, n]) => <button type="button" key={k} className={f.day === k ? 'active' : ''} aria-pressed={f.day === k} onClick={() => set('day', k)}>{n}</button>)}</div></div>
      <div className="field"><span className="field-label">HORAIRE</span>
        <select className="input" value={f.slot} onChange={e => set('slot', e.target.value)}><option value="all">Tous les horaires</option><option value="day">Avant 18h</option><option value="evening">À partir de 18h</option><option value="unknown">Heure non confirmée</option></select>
        <div className="pair-row">
          <label>De (inclus)<input className="input sm" aria-label="Heure de début incluse" type="time" value={f.timeFrom} onChange={e => set('timeFrom', e.target.value)}/></label>
          <label>À (exclu)<input className="input sm" aria-label="Heure de fin exclue" type="time" value={f.timeTo} onChange={e => set('timeTo', e.target.value)}/></label></div>
        {f.timeFrom && f.timeTo && f.timeFrom >= f.timeTo && <p className="hint alert" role="alert">L'heure de fin doit être supérieure à l'heure de début.</p>}
        <p className="hint">Exemple 10h–19h : un match à 19h00 est exclu. Les heures inconnues ne sont pas incluses.</p></div>
      <div className="field tight"><span className="field-label">PRÉFÉRENCES</span>
        <Switch label="★ Grandes affiches uniquement" checked={f.onlyHighlights} onChange={v => set('onlyHighlights', v)}/>
        <Switch label="✓ Date et heure vérifiées*" checked={f.onlyCertain} onChange={v => set('onlyCertain', v)}/>
        <Switch label={`♥ Mes favoris (${favoritesCount})`} checked={f.onlyFav} onChange={v => set('onlyFav', v)}/></div>
      <ExcludedWeekends list={f.excluded} onAdd={addExcluded} onRemove={removeExcluded}/>
      <p className="hint">* Vérifié : une publication officielle correspond à la date et à l'heure exactes. Les autres matchs restent à confirmer.</p>
      <button type="button" className="drawer-cta" onClick={onClose}>Voir {resultCount} match{resultCount > 1 ? 's' : ''}</button>
    </div>
  </aside>;
}
