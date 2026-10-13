import React from 'react';
import { ArrowDown, Sparkles } from 'lucide-react';
import { WEEKENDS_PAGE_STEP } from '../constants.js';
import Empty from './Empty.jsx';
import WeekendCard from './WeekendCard.jsx';

export default function WeekendsView({ weekends, pageLimit, onMore, onExamine, onReset }) {
  return <>
    <div className="section-intro"><Sparkles size={16}/><span>Des week-ends avec <strong>au moins deux matchs compatibles sur le papier</strong> dans une même zone de voyage. Ville de séjour indiquée pour chaque destination ; kilomètres à vol d'oiseau entre centres-villes. Temps de trajet et billets à vérifier.</span></div>
    {weekends.length === 0 ? <Empty onReset={onReset}/> : <div className="weekends-grid">{weekends.slice(0, pageLimit).map(w => <WeekendCard key={w.country + w.cluster + w.weekend} weekend={w} onExamine={onExamine}/>)}</div>}
    {weekends.length > pageLimit && <button className="load-more" onClick={() => onMore(WEEKENDS_PAGE_STEP)}>Voir plus de week-ends <ArrowDown size={16}/></button>}
  </>;
}
