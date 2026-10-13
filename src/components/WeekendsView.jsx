import React from 'react';
import WeekendCard, { WeekendRow } from './WeekendCard.jsx';

export default function WeekendsView({ weekends, mode }) {
  const key = w => w.country + w.cluster + w.weekend;
  return <>
    <div className="section-head" id="combinaisons"><h2>Combinaisons de week-ends</h2><span>{weekends.length} week-end{weekends.length > 1 ? 's' : ''}</span></div>
    {weekends.length === 0
      ? <div className="note">Aucune combinaison possible avec ces critères : il faut deux matchs compatibles le même week-end (jours différents, ou 4 h d’écart avec horaires confirmés). Les matchs sont listés ci-dessous.</div>
      : mode === 'list'
        ? <div className="list-box">{weekends.map(w => <WeekendRow key={key(w)} weekend={w}/>)}</div>
        : <div className="card-grid">{weekends.map(w => <WeekendCard key={key(w)} weekend={w}/>)}</div>}
  </>;
}
