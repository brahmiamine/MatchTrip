import React from 'react';
import { ArrowRight, CalendarDays, Star } from 'lucide-react';
import { FLAGS } from '../constants.js';
import { dayLabel, formatDay, formatFull, formatTime, nextDate } from '../lib/dates.js';

export default function WeekendCard({ weekend: w, onExamine }) {
  return <article className="weekend-card">
    <div className="weekend-top"><span className="country-small">{FLAGS[w.country]} {w.country}</span><span className="weekend-count">{w.items.length} matchs</span></div>
    <h3>{w.cluster}</h3>
    <div className="weekend-date"><CalendarDays size={15}/>{formatFull(w.weekend)} — {formatFull(nextDate(w.weekend))}</div>
    <div className="weekend-events">
      {w.items.slice(0, 4).map(m => <div className="weekend-event" key={m.fixture_key}>
        <span className="weekend-event-day">{dayLabel(m.date)}</span>
        <div><strong>{m.home} <span>—</span> {m.away}</strong><small>{formatDay(m.date)} · {formatTime(m.time)}{m.provisional ? ' · Date provisoire' : ''}</small></div>
        {m.highlight && <Star size={14} fill="currentColor" className="tiny-star"/>}
      </div>)}
      {w.items.length > 4 && <span className="extra-matches">+ {w.items.length - 4} autres matchs</span>}
    </div>
    <button className="primary-card-button" onClick={() => onExamine(w)}>Examiner ce week-end <ArrowRight size={17}/></button>
  </article>;
}
