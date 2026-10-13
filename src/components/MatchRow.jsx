import React from 'react';
import { ArrowUpRight, CalendarDays, Heart, Star } from 'lucide-react';
import { FLAGS } from '../constants.js';
import { formatDay, formatTime } from '../lib/dates.js';

export default function MatchRow({ match: m, favorite, onToggleFavorite }) {
  return <div className={'match-row ' + (m.highlight ? 'featured' : '')}>
    <div className="club-mark">{m.home.slice(0, 2).toUpperCase()}</div>
    <div className="match-details">
      <div className="match-teams"><strong>{m.home}</strong><span>vs</span><strong>{m.away}</strong></div>
      <div className="match-sub"><span>{FLAGS[m.country]} {m.zone}</span><span className="dot-sep">·</span><span>{m.league}</span>{m.highlight && <span className="hot-label"><Star size={11}/> Affiche</span>}</div>
    </div>
    <div className="match-right">
      <span className="match-date"><CalendarDays size={12}/>{formatDay(m.date)}</span>
      <span className="time">{formatTime(m.time)}</span>
      <span className={'reliability ' + (m.provisional ? 'uncertain' : '')}>{m.provisional ? 'Date provisoire' : 'À vérifier'}</span>
    </div>
    <div className="match-actions">
      <button title={favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'} aria-label={favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'} className={favorite ? 'is-fav' : ''} onClick={() => onToggleFavorite(m.fixture_key)}><Heart size={17} fill={favorite ? 'currentColor' : 'none'}/></button>
      <a title="Calendrier officiel" aria-label="Calendrier officiel" target="_blank" rel="noreferrer" href={m.source_url}><ArrowUpRight size={17}/></a>
    </div>
  </div>;
}
