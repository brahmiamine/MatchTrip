import React, { useState } from 'react';
import { formatWeekendRange, getWeekend } from '../lib/dates.js';

/** Week-ends indisponibles saisis par l'utilisateur : on choisit un jour, son week-end entier est masqué. */
export default function ExcludedWeekends({ list, onAdd, onRemove }) {
  const [date, setDate] = useState('');
  const add = () => { if (date) { onAdd(date); setDate(''); } };
  return <div className="field"><span className="field-label">WEEK-ENDS INDISPONIBLES</span>
    <div className="excluded-add"><input type="date" aria-label="Jour du week-end à exclure" value={date} onChange={e => setDate(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()}/><button type="button" onClick={add} disabled={!date}>+ Ajouter</button></div>
    {date && <p className="hint">Week-end concerné : {formatWeekendRange(getWeekend(date))}</p>}
    {list.length > 0 && <ul className="excluded-list">{list.map(sat => <li key={sat}><span>{formatWeekendRange(sat)}</span><button type="button" aria-label={`Retirer le week-end ${formatWeekendRange(sat)}`} onClick={() => onRemove(sat)}>×</button></li>)}</ul>}
    <p className="hint">{list.length ? 'Les matchs de ces week-ends sont masqués.' : 'Ajoutez les week-ends où vous n’êtes pas disponible : leurs matchs seront masqués.'}</p>
  </div>;
}
