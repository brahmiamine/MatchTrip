import React from 'react';
import ClubLogo from './ClubLogo.jsx';
import Stadium from './Stadium.jsx';
import { getTicketUrl } from '../lib/ticketing.js';
import DistanceFromHub from './DistanceFromHub.jsx';
import { getDestinationHub } from '../lib/destinations.js';
import { enrichFixture } from '../lib/media.js';
import { ArrowRight, CalendarDays, MapPin, Star, Ticket } from 'lucide-react';
import { FLAGS } from '../constants.js';
import { dayLabel, formatDay, formatFull, formatTime, weekendFriday, weekendSunday } from '../lib/dates.js';

export default function WeekendCard({ weekend: w, onExamine }) {
  return <article className="weekend-card">
    <div className="weekend-top"><span className="country-small">{FLAGS[w.country]} {w.country}</span><span className="weekend-count">{w.items.length} matchs</span></div>
    <div className="weekend-destination-label">Destination</div><h3>{w.cluster}</h3>
    <div className="weekend-date"><CalendarDays size={15}/>{formatFull(weekendFriday(w.weekend))} — {formatFull(weekendSunday(w.weekend))}</div>
    {getDestinationHub(w.items[0]) && <div className="weekend-hub"><MapPin size={13}/> Ville de séjour : <strong>{getDestinationHub(w.items[0])}</strong></div>}
    <div className="weekend-events">
      {w.items.slice(0, 4).map(enrichFixture).map(m => <div className="weekend-event" key={m.fixture_key}>
        <span className="weekend-event-day">{dayLabel(m.date)}</span>
        <div><strong className="weekend-teams"><ClubLogo club={m.home} small/>{m.home} <span>—</span><ClubLogo club={m.away} small/> {m.away}</strong><small>{formatDay(m.date)} · {formatTime(m.time)}{m.provisional ? ' · Date provisoire' : ''}</small><Stadium match={m} compact/><DistanceFromHub match={m} compact/>{getTicketUrl(m.home) && <a className="weekend-ticket-link" href={getTicketUrl(m.home)} target="_blank" rel="noopener noreferrer" title={`Billetterie officielle : ${m.home}`}><Ticket size={12}/> Billetterie officielle <ArrowRight size={11}/></a>}</div>
        {m.highlight && <Star size={14} fill="currentColor" className="tiny-star"/>}
      </div>)}
      {w.items.length > 4 && <span className="extra-matches">+ {w.items.length - 4} autres matchs</span>}
    </div>
    <button className="primary-card-button" onClick={() => onExamine(w)}>Examiner ce week-end <ArrowRight size={17}/></button>
  </article>;
}
