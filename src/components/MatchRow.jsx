import React from 'react';
import ClubLogo from './ClubLogo.jsx';
import Stadium from './Stadium.jsx';
import { getTicketUrl } from '../lib/ticketing.js';
import DistanceFromHub from './DistanceFromHub.jsx';
import FixtureStatus from './FixtureStatus.jsx';
import { enrichFixture } from '../lib/media.js';
import { ArrowUpRight, CalendarDays, Heart, Ticket, Star } from 'lucide-react';
import { FLAGS } from '../constants.js';
import { formatDay, formatTime } from '../lib/dates.js';

export default function MatchRow({ match, favorite, onToggleFavorite }) {
  const m = enrichFixture(match);
  const ticketUrl = getTicketUrl(m.home);
  return <div className={'match-row ' + (m.highlight ? 'featured' : '')}>
    <ClubLogo club={m.home} url={m.home_logo_url}/>
    <div className="match-details">
      <div className="match-teams"><strong>{m.home}</strong><span>vs</span><ClubLogo club={m.away} url={m.away_logo_url} small/><strong>{m.away}</strong></div>
      <div className="match-sub"><span>{FLAGS[m.country]} {m.zone}</span><span className="dot-sep">·</span><span>{m.league}</span>{m.highlight && <span className="hot-label"><Star size={11}/> Affiche</span>}</div>
      <Stadium match={m}/>
      <DistanceFromHub match={m}/>
    </div>
    <div className="match-right">
      <span className="match-date"><CalendarDays size={12}/>{m.date_window_start && m.date_window_end ? `${formatDay(m.date_window_start)} – ${formatDay(m.date_window_end)}` : formatDay(m.date)}</span>
      <span className="time">{formatTime(m.time)}</span>
      <FixtureStatus match={m}/>
    </div>
    <div className="match-actions">
      {ticketUrl && <a className="ticket-link" href={ticketUrl} target="_blank" rel="noopener noreferrer" title={`Billetterie officielle : ${m.home}`} aria-label={`Billetterie officielle ${m.home}`}><Ticket size={15}/><span>Billetterie</span></a>}
      <button title={favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'} aria-label={favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'} className={favorite ? 'is-fav' : ''} onClick={() => onToggleFavorite(m.fixture_key)}><Heart size={17} fill={favorite ? 'currentColor' : 'none'}/></button>
      <a title="Calendrier officiel" aria-label="Calendrier officiel" target="_blank" rel="noreferrer" href={m.source_url}><ArrowUpRight size={17}/></a>
    </div>
  </div>;
}
