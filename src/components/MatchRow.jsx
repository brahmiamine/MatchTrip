import React from 'react';
import { CrestPair } from './ClubLogo.jsx';
import Stadium from './Stadium.jsx';
import DistanceFromHub from './DistanceFromHub.jsx';
import FixtureStatus from './FixtureStatus.jsx';
import FavoriteButton from './FavoriteButton.jsx';
import { getTicketUrl } from '../lib/ticketing.js';
import { getDestinationName } from '../lib/destinations.js';
import { FLAGS } from '../constants.js';
import { formatDay, formatTime } from '../lib/dates.js';

export const matchDateLabel = m => (m.date_window_start && m.date_window_end ? `${formatDay(m.date_window_start)} – ${formatDay(m.date_window_end)}` : formatDay(m.date));

/** Rencontre affichée en ligne (affichage « Liste »). */
export default function MatchRow({ match: m, favorite, onToggleFavorite }) {
  const ticketUrl = getTicketUrl(m.home);
  return <div className={'match-row' + (m.highlight ? ' featured' : '')}>
    <div className="mono when"><div className="muted">{matchDateLabel(m)}</div><div>{formatTime(m.time)}</div></div>
    <div className="match-main">
      <CrestPair match={m}/>
      <div className="match-info">
        <div className="teams">{m.home} <span className="vs">vs</span> {m.away}{m.highlight && ' ★'}</div>
        <div className="sub">{FLAGS[m.country]} {getDestinationName(m)} · {m.league}</div>
        <Stadium match={m}/>
        <DistanceFromHub match={m}/>
        <FixtureStatus match={m}/>
      </div>
    </div>
    <div className="row-actions">
      {ticketUrl && <a className="ghost-button" href={ticketUrl} target="_blank" rel="noopener noreferrer" title={`Billetterie officielle : ${m.home}`}>Billetterie</a>}
      {m.source_url && <a className="icon-button" href={m.source_url} target="_blank" rel="noreferrer" title="Calendrier officiel" aria-label="Calendrier officiel">↗</a>}
      <FavoriteButton active={favorite} onToggle={() => onToggleFavorite(m.fixture_key)}/>
    </div>
  </div>;
}
