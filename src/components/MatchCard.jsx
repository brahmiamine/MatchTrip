import React from 'react';
import { CrestPair } from './ClubLogo.jsx';
import Stadium from './Stadium.jsx';
import DistanceFromHub from './DistanceFromHub.jsx';
import FixtureStatus from './FixtureStatus.jsx';
import FavoriteButton from './FavoriteButton.jsx';
import { matchDateLabel } from './MatchRow.jsx';
import { getTicketUrl, getTicketLabel } from '../lib/ticketing.js';
import { getDestinationName } from '../lib/destinations.js';
import { FLAGS } from '../constants.js';
import { formatTime } from '../lib/dates.js';

/** Rencontre affichée en carte (affichage « Cartes »). */
export default function MatchCard({ match: m, favorite, onToggleFavorite }) {
  const ticketUrl = getTicketUrl(m.home);
  return <article className={'match-card' + (m.highlight ? ' featured' : '')}>
    <div className="card-top"><CrestPair match={m}/><FavoriteButton active={favorite} onToggle={() => onToggleFavorite(m.fixture_key)}/></div>
    <div>
      <div className="card-teams">{m.home}<br/><span className="vs">vs</span> {m.away}{m.highlight && ' ★'}</div>
      <div className="sub">{FLAGS[m.country]} {getDestinationName(m)} · {m.league}</div>
    </div>
    <div className="mono">{matchDateLabel(m)} · {formatTime(m.time)}</div>
    <FixtureStatus match={m} compact/>
    <div className="card-links">
      <Stadium match={m}/>
      <DistanceFromHub match={m}/>
      {m.source_url && <a className="meta-link" href={m.source_url} target="_blank" rel="noreferrer">Calendrier officiel ↗</a>}
    </div>
    {ticketUrl && <a className="outline-button" href={ticketUrl} target="_blank" rel="noopener noreferrer" title={`${getTicketLabel(m.home)} : ${m.home}`}>{getTicketLabel(m.home)}</a>}
  </article>;
}
