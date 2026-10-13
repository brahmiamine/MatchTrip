import React from 'react';
import { Check, Heart, RotateCcw, Search, SlidersHorizontal, Star, X } from 'lucide-react';
import { FLAGS } from '../constants.js';
import { formatMonth, formatWeekendRange, monthRange } from '../lib/dates.js';
import MultiSelect from './MultiSelect.jsx';
import ActiveFilters from './ActiveFilters.jsx';
import ExcludedWeekends from './ExcludedWeekends.jsx';

const DAYS = [['all', 'Tous'], ['vendredi', 'Vendredi'], ['samedi', 'Samedi'], ['dimanche', 'Dimanche']];

function Segment({ items, value, onChange }) {
  return <div className="segment">{items.map(([k, n]) => <button key={k} className={value === k ? 'active' : ''} onClick={() => onChange(k)}>{n}</button>)}</div>;
}

export default function FilterSidebar({ open, filters: f, options, active, set, toggleIn, remove, addExcluded, removeExcluded, reset }) {
  return <aside className={'sidebar ' + (open ? 'sidebar-open' : '')}>
    <div className="sidebar-head"><div><SlidersHorizontal size={19}/><h2>Vos critères</h2></div><button className="reset" onClick={reset}><RotateCcw size={14}/> Réinitialiser</button></div>
    <div className="filters-body">
      {active.length > 0 && <div className="field"><label>Filtres actifs <span className="field-count">{active.length}</span></label><ActiveFilters items={active} onRemove={remove} onReset={reset}/></div>}
      <div className="field"><label>Recherche libre</label><div className="search-field"><Search size={17}/><input value={f.search} onChange={e => set('search', e.target.value)} placeholder="Club, adversaire, ville…"/>{f.search && <button aria-label="Effacer" onClick={() => set('search', '')}><X size={15}/></button>}</div></div>
      <div className="field"><label>Pays <span className="field-count">choix multiples</span></label><div className="country-grid">{options.countries.map(c => <button className={'country-chip ' + (f.countries.includes(c) ? 'selected' : '')} key={c} onClick={() => toggleIn('countries', c)}><span>{FLAGS[c]}</span>{c}{f.countries.includes(c) && <Check size={13}/>}</button>)}</div></div>
      <div className="field"><label>Destinations et clubs</label>
        <MultiSelect label="Zones géographiques" values={options.zones} chosen={f.zones} onToggle={z => toggleIn('zones', z)}/>
        <MultiSelect label="Clubs à domicile" values={options.clubs} chosen={f.clubs} onToggle={c => toggleIn('clubs', c)}/>
        <MultiSelect label="Week-ends" values={options.weekends} chosen={f.weekends} onToggle={w => toggleIn('weekends', w)} format={formatWeekendRange}/>
        <MultiSelect label="Compétitions" values={options.leagues} chosen={f.leagues} onToggle={l => toggleIn('leagues', l)}/></div>
      <div className="line"/>
      <div className="field"><label>Période</label><div className="date-row">
        <div><span>Du</span><input type="date" min={options.dateBounds.min} max={options.dateBounds.max} value={f.dateFrom} onChange={e => set('dateFrom', e.target.value)}/></div>
        <div><span>Au</span><input type="date" min={options.dateBounds.min} max={options.dateBounds.max} value={f.dateTo} onChange={e => set('dateTo', e.target.value)}/></div></div>
        <div className="segment month-shortcuts"><button className={!f.dateFrom && !f.dateTo ? 'active' : ''} onClick={() => { set('dateFrom', ''); set('dateTo', ''); }}>Tout</button>
          {options.months.map(ym => { const [a, b] = monthRange(ym); return <button key={ym} className={f.dateFrom === a && f.dateTo === b ? 'active' : ''} onClick={() => { set('dateFrom', a); set('dateTo', b); }}>{formatMonth(ym)}</button>; })}</div></div>
      <div className="field"><label>Jour du match</label><Segment items={DAYS} value={f.day} onChange={v => set('day', v)}/></div>
      <div className="field"><label>Horaire</label><select className="native-select" value={f.slot} onChange={e => set('slot', e.target.value)}><option value="all">Tous les horaires</option><option value="day">Avant 18h</option><option value="evening">À partir de 18h</option><option value="unknown">Heure non confirmée</option></select><div className="date-row time-range"><div><span>De (inclus)</span><input aria-label="Heure de début incluse" type="time" value={f.timeFrom} onChange={e => set('timeFrom', e.target.value)} /></div><div><span>À (exclu)</span><input aria-label="Heure de fin exclue" type="time" value={f.timeTo} onChange={e => set('timeTo', e.target.value)} /></div></div>{f.timeFrom && f.timeTo && f.timeFrom >= f.timeTo && <p className="hint" role="alert">L'heure de fin doit être supérieure à l'heure de début.</p>}<p className="hint">Exemple 10h–19h : un match à 19h00 est exclu. Les heures inconnues ne sont pas incluses.</p></div>
      <div className="line"/>
      <div className="field"><label>Préférences</label>
        <label className="switch-row"><span><Star size={16}/> Grandes affiches uniquement</span><input type="checkbox" checked={f.onlyHighlights} onChange={e => set('onlyHighlights', e.target.checked)}/></label>
        <label className="switch-row"><span><Check size={16}/> Date et heure vérifiées*</span><input type="checkbox" checked={f.onlyCertain} onChange={e => set('onlyCertain', e.target.checked)}/></label>
        <label className="switch-row"><span><Heart size={16}/> Mes favoris</span><input type="checkbox" checked={f.onlyFav} onChange={e => set('onlyFav', e.target.checked)}/></label></div>
      <ExcludedWeekends list={f.excluded} onAdd={addExcluded} onRemove={removeExcluded}/>
      <p className="hint">* Confirmées seulement si une publication officielle correspond à la date et à l'heure exactes. Les autres matchs restent à vérifier.</p>
    </div>
  </aside>;
}
