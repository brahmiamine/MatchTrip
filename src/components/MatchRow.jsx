import React from 'react';
import ClubLogo from './ClubLogo.jsx';
import Stadium from './Stadium.jsx';
import { enrichFixture } from '../lib/media.js';
import { ArrowUpRight, CalendarDays, Heart, Star } from 'lucide-react';
import { FLAGS } from '../constants.js';
import { formatDay, formatTime } from '../lib/dates.js';

export default function MatchRow({ match, favorite, onToggleFavorite }) {
  const m = enrichFixture(match);
  return <div className={'match-row ' + (m.highlight ? 'featured' : '')}>
    <ClubLogo club={m.home} url={m.home_logo_url}/>
    <div className="match-details">
      <div className="match-teams"><strong>{m.home}</strong><span>vs</span><ClubLogo club={m.away} url={m.away_logo_url} small/><strong>{m.away}</strong></div>
      <div className="match-sub"><span>{FLAGS[m.country]} {m.zone}</span><span className="dot-sep">·</span><span>{m.league}</span>{m.highlight && <span className="hot-label"><Star size={11}/> Affiche</span>}</div>
      <Stadium match={m}/>
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
