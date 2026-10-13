import React from 'react';
import { CrestPair } from './ClubLogo.jsx';
import Stadium from './Stadium.jsx';
import DistanceFromHub from './DistanceFromHub.jsx';
import FixtureStatus from './FixtureStatus.jsx';
import { getTicketUrl } from '../lib/ticketing.js';
import { getDestinationHub } from '../lib/destinations.js';
import { enrichFixture } from '../lib/media.js';
import { FLAGS } from '../constants.js';
import { dayLabel, formatDay, formatFull, formatTime, weekendFriday, weekendSunday } from '../lib/dates.js';

const pairsLabel = n => `${n} combinaison${n > 1 ? 's' : ''}`;
const SHOWN = 4;

/** Combinaison d'un week-end en carte. */
export default function WeekendCard({ weekend: w }) {
  const hub = getDestinationHub(w.items[0]);
  return <article className="weekend-card">
    <div className="weekend-top"><span>{FLAGS[w.country]} {w.country}</span><span>{w.items.length} matchs</span></div>
    <div>
      <div className="mono-label">DESTINATION</div>
      <h3>{w.cluster}</h3>
      <div className="weekend-date">{formatFull(weekendFriday(w.weekend))} — {formatFull(weekendSunday(w.weekend))}</div>
      <div className="muted small">{hub && <>Ville de séjour : <strong>{hub}</strong> · </>}{pairsLabel(w.pairs.length)}</div>
    </div>
    <div className="weekend-events">
      {w.items.slice(0, SHOWN).map(enrichFixture).map(m => {
        const ticketUrl = getTicketUrl(m.home);
        return <div className="weekend-event" key={m.fixture_key}>
          <div className="mono muted">{dayLabel(m.date)}</div>
          <div className="weekend-event-body">
            <div className="weekend-teams"><CrestPair match={m}/><span>{m.home} — {m.away}{m.highlight && ' ★'}</span></div>
            <div className="muted small">{formatDay(m.date)} · {formatTime(m.time)}</div>
            <FixtureStatus match={m} compact/>
            <Stadium match={m}/>
            <DistanceFromHub match={m}/>
            {ticketUrl && <a className="accent-link" href={ticketUrl} target="_blank" rel="noopener noreferrer" title={`Billetterie officielle : ${m.home}`}>Billetterie officielle →</a>}
          </div>
        </div>;
      })}
      {w.items.length > SHOWN && <div className="extra">+ {w.items.length - SHOWN} autres matchs</div>}
    </div>
  </article>;
}

/** Combinaison d'un week-end en ligne. */
export function WeekendRow({ weekend: w }) {
  const hub = getDestinationHub(w.items[0]);
  return <div className="weekend-row">
    <div><div className="mono accent">{formatDay(weekendFriday(w.weekend)).slice(4)} – {formatDay(weekendSunday(w.weekend)).slice(4)}</div><div className="muted small">{w.items.length} matchs</div></div>
    <div><div className="weekend-row-title">{FLAGS[w.country]} {w.cluster}</div><div className="muted small">{hub && <>Séjour à {hub} · </>}{pairsLabel(w.pairs.length)}</div></div>
    <div className="weekend-row-items">
      {w.items.slice(0, SHOWN).map(enrichFixture).map(m => <div key={m.fixture_key} className="weekend-row-item"><CrestPair match={m} small/><span className="mono muted">{dayLabel(m.date)} {formatTime(m.time)}</span><strong>{m.home} — {m.away}{m.highlight && ' ★'}</strong></div>)}
      {w.items.length > SHOWN && <div className="muted small">+ {w.items.length - SHOWN} autres matchs</div>}
    </div>
  </div>;
}
