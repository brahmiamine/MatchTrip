import React from 'react';
import { formatDay, formatFull, weekendFriday, weekendSunday } from '../lib/dates.js';
import { compareCountry, groupMatches } from '../lib/sorting.js';
import { getDestinationHub, getDestinationName } from '../lib/destinations.js';
import { enrichFixture } from '../lib/media.js';
import { FLAGS } from '../constants.js';
import MatchRow, { matchDateLabel } from './MatchRow.jsx';
import MatchCard from './MatchCard.jsx';

/** Date séparée du pays et du nom de la destination pour une lecture claire. */
function groupPeriod(group, key) {
  if (group === 'zone-date') return formatDay(key.split('|')[0]);
  if (group === 'zone-weekend') {
    const sat = key.split('|')[0];
    return `${formatFull(weekendFriday(sat))} – ${formatFull(weekendSunday(sat))}`;
  }
  return '';
}

/** Groupes par week-end, puis pays (les destinations d'un même pays se suivent), puis destination. */
function orderGroups(grouped, group) {
  if (group !== 'zone-weekend') return grouped;
  return [...grouped].sort(([ka, a], [kb, b]) => ka.split('|')[0].localeCompare(kb.split('|')[0])
    || compareCountry(a[0], b[0]) || getDestinationName(a[0]).localeCompare(getDestinationName(b[0]), 'fr'));
}

export default function MatchesView({ ordered, group, mode, favorites, onToggleFavorite }) {
  const grouped = orderGroups(groupMatches(ordered, group), group);
  const Item = mode === 'list' ? MatchRow : MatchCard;
  return <>
    <div className="section-head" id="matchs"><h2>Tous les matchs</h2><span>{ordered.length} match{ordered.length > 1 ? 's' : ''}</span></div>
    <p className="hint">La ville de séjour est le point de départ touristique de chaque destination. Les distances sont approximatives, à vol d'oiseau entre centres-villes (pas les trajets vers les stades).</p>
    <div className="match-groups">{grouped.map(([key, ms]) => {
      const m0 = ms[0], byDate = group === 'date', hub = getDestinationHub(m0), period = groupPeriod(group, key);
      return <div key={key}>
        <div className="group-head">
          <div className="group-title">{byDate ? matchDateLabel(m0) : `${FLAGS[m0.country]} ${m0.country} · ${getDestinationName(m0)}`}{period && <span className="group-period">{period}</span>}<span className="group-count">{ms.length} match{ms.length > 1 ? 's' : ''}</span></div>
          {!byDate && hub && <div className="muted small">Ville de séjour : <strong>{hub}</strong></div>}
        </div>
        <div className={mode === 'list' ? 'list-box' : 'card-grid'}>
          {ms.map(enrichFixture).map(m => <Item key={m.fixture_key} match={m} favorite={favorites.includes(m.fixture_key)} onToggleFavorite={onToggleFavorite}/>)}
        </div>
      </div>;
    })}</div>
  </>;
}
