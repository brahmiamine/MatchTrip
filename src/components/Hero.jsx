import React from 'react';
import { formatMonth } from '../lib/dates.js';

export default function Hero({ all, filteredCount }) {
  const dates = all.map(m => m.date).sort();
  const period = dates.length ? [...new Set([formatMonth(dates[0].slice(0, 7)), formatMonth(dates[dates.length - 1].slice(0, 7))])].join(' – ') : '';
  const stats = [
    [all.length, 'matchs en catalogue'],
    [new Set(all.map(m => m.country)).size, 'pays à explorer'],
    [new Set(all.map(m => m.zone)).size, 'zones de destination'],
  ];
  return <section className="hero">
    <div>
      <div className="eyebrow">PLANIFIEZ VOTRE PROCHAIN DÉPLACEMENT</div>
      <h1>Le foot donne<br/>une destination.</h1>
      <p>Une seule interface pour dénicher les plus belles affiches en Europe. Combinez les filtres, repérez les week-ends et choisissez votre prochain stade.</p>
      <div className="hero-meta"><span>Départ : Paris</span>{period && <span>{period}</span>}</div>
    </div>
    <div className="stats">
      {stats.map(([v, l]) => <div key={l}><span className="stat-number">{v}</span><span className="stat-caption">{l}</span></div>)}
      <div className="stat-result"><span className="stat-number">{filteredCount}</span><span className="stat-caption">matchs selon vos critères</span></div>
    </div>
  </section>;
}
