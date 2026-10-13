import React from 'react';
import { CalendarDays, MapPin } from 'lucide-react';

export default function Hero() {
  return <section className="hero"><div className="hero-copy"><div className="eyebrow"><span className="eyebrow-line"/> PLANIFIEZ VOTRE PROCHAIN DÉPLACEMENT</div>
    <h1>Le foot donne<br/><em>une destination.</em></h1>
    <p>Une seule interface pour dénicher les plus belles affiches en Europe. Combinez les filtres, repérez les week-ends et choisissez votre prochain stade.</p>
    <div className="hero-meta"><span><MapPin size={15}/> Départ : Paris</span><span><CalendarDays size={15}/> Oct. — Déc. 2026</span></div>
  </div><div className="hero-decor"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><span className="decor-ball">⚽</span><div className="decor-tag"><span>5 PAYS</span><strong>1 PASSION.</strong></div></div></section>;
}
