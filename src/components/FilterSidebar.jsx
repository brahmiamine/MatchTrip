import React from 'react';
import { Check, Heart, RotateCcw, Search, SlidersHorizontal, Star, X } from 'lucide-react';
import { END, EXCLUDED_DEFAULT, EXCLUDED_LABELS, FLAGS, START } from '../constants.js';
import MultiSelect from './MultiSelect.jsx';

const MONTHS = [['all', 'Tous'], ['10', 'Oct.'], ['11', 'Nov.'], ['12', 'Déc.']];
const DAYS = [['all', 'Tous'], ['samedi', 'Samedi'], ['dimanche', 'Dimanche']];

function Segment({ items, value, onChange }) {
  return <div className="segment">{items.map(([k, n]) => <button key={k} className={value === k ? 'active' : ''} onClick={() => onChange(k)}>{n}</button>)}</div>;
}

export default function FilterSidebar({ open, filters: f, options, set, toggleIn, toggleExcluded, reset }) {
  return <aside className={'sidebar ' + (open ? 'sidebar-open' : '')}>
    <div className="sidebar-head"><div><SlidersHorizontal size={19}/><h2>Vos critères</h2></div><button className="reset" onClick={reset}><RotateCcw size={14}/> Réinitialiser</button></div>
    <div className="filters-body">
      <div className="field"><label>Recherche libre</label><div className="search-field"><Search size={17}/><input value={f.search} onChange={e => set('search', e.target.value)} placeholder="Club, adversaire, ville…"/>{f.search && <button aria-label="Effacer" onClick={() => set('search', '')}><X size={15}/></button>}</div></div>
      <div className="field"><label>Pays <span className="field-count">choix multiples</span></label><div className="country-grid">{options.countries.map(c => <button className={'country-chip ' + (f.countries.includes(c) ? 'selected' : '')} key={c} onClick={() => toggleIn('countries', c)}><span>{FLAGS[c]}</span>{c}{f.countries.includes(c) && <Check size={13}/>}</button>)}</div></div>
      <div className="field"><label>Destinations et clubs</label>
        <MultiSelect label="Zones géographiques" values={options.zones} chosen={f.zones} onToggle={z => toggleIn('zones', z)}/>
        <MultiSelect label="Clubs à domicile" values={options.clubs} chosen={f.clubs} onToggle={c => toggleIn('clubs', c)}/>
        <MultiSelect label="Compétitions" values={options.leagues} chosen={f.leagues} onToggle={l => toggleIn('leagues', l)}/></div>
      <div className="line"/>
      <div className="field"><label>Période</label><div className="date-row">
        <div><span>Du</span><input type="date" min={START} max={END} value={f.dateFrom} onChange={e => set('dateFrom', e.target.value || START)}/></div>
        <div><span>Au</span><input type="date" min={START} max={END} value={f.dateTo} onChange={e => set('dateTo', e.target.value || END)}/></div></div></div>
      <div className="field"><label>Mois</label><Segment items={MONTHS} value={f.month} onChange={v => set('month', v)}/></div>
      <div className="field"><label>Jour du match</label><Segment items={DAYS} value={f.day} onChange={v => set('day', v)}/></div>
      <div className="field"><label>Horaire</label><select className="native-select" value={f.slot} onChange={e => set('slot', e.target.value)}><option value="all">Tous les horaires</option><option value="day">Avant 18h</option><option value="evening">À partir de 18h</option><option value="unknown">Heure non confirmée</option></select></div>
      <div className="line"/>
      <div className="field"><label>Préférences</label>
        <label className="switch-row"><span><Star size={16}/> Grandes affiches uniquement</span><input type="checkbox" checked={f.onlyHighlights} onChange={e => set('onlyHighlights', e.target.checked)}/></label>
        <label className="switch-row"><span><Check size={16}/> Date et heure confirmées*</span><input type="checkbox" checked={f.onlyCertain} onChange={e => set('onlyCertain', e.target.checked)}/></label>
        <label className="switch-row"><span><Heart size={16}/> Mes favoris</span><input type="checkbox" checked={f.onlyFav} onChange={e => set('onlyFav', e.target.checked)}/></label></div>
      <div className="field"><label>Week-ends indisponibles</label><div className="blocked-grid">{EXCLUDED_DEFAULT.map(d => <label className="blocked-option" key={d}><input type="checkbox" checked={f.excluded.includes(d)} onChange={() => toggleExcluded(d)}/><span>{EXCLUDED_LABELS[d]}</span></label>)}</div><p className="hint">Les matchs de ces week-ends seront masqués. Décochez pour les afficher.</p></div>
      <p className="hint">* Signifie ici « non marqué provisoire et avec un horaire fourni ». Vérifiez toujours sur le site du club.</p>
    </div>
  </aside>;
}
