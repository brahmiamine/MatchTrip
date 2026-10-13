import React from 'react';
import { ArrowDown, MapPin } from 'lucide-react';
import { MATCHES_PAGE_STEP } from '../constants.js';
import { formatDay, formatFull, nextDate } from '../lib/dates.js';
import { groupMatches } from '../lib/sorting.js';
import Empty from './Empty.jsx';
import MatchRow from './MatchRow.jsx';

import { getDestinationHub, getDestinationName } from '../lib/destinations.js';
import { FLAGS } from '../constants.js';

/** Date séparée du pays et du nom de la destination pour une lecture claire. */
function groupDateLabel(group, key) {
  if (group === 'date') return formatDay(key);
  if (group === 'zone-date') return formatDay(key.split('|')[0]);
  if (group === 'zone-weekend') {
    const sat = key.split('|')[0];
    return `${formatFull(sat)} – ${formatFull(nextDate(sat))}`;
  }
  return null;
}

export default function MatchesView({ ordered, group, onGroup, pageLimit, onMore, favorites, onToggleFavorite, onReset }) {
  const grouped = groupMatches(ordered.slice(0, pageLimit), group);
  return <>
    <div className="list-toolbar"><div>{ordered.length} rencontre{ordered.length > 1 ? 's' : ''} correspond{ordered.length > 1 ? 'ent' : ''} à votre recherche</div><div className="sort-wrap"><span>Regrouper</span><select value={group} onChange={e => onGroup(e.target.value)}><option value="date">Par date</option><option value="zone">Par destination</option><option value="zone-date">Par destination et date</option><option value="zone-weekend">Par destination et week-end</option></select></div></div>
    <p className="distance-explainer">La ville de séjour est le point de départ touristique de chaque destination. Les distances sont approximatives, à vol d'oiseau entre centres-villes (pas les trajets vers les stades).</p>
    {ordered.length === 0 ? <Empty onReset={onReset}/> : <div className="match-groups">{grouped.map(([key, ms]) => <div className="match-group" key={key}>
      <div className="group-head"><div className="group-title">{group === 'date' ? <span>{groupDateLabel(group, key)}</span> : <><span className="group-country">{FLAGS[ms[0].country]} {ms[0].country}</span><span className="group-destination">Destination : {getDestinationName(ms[0])}</span></>}{group !== 'date' && groupDateLabel(group, key) && <span className="group-period">{groupDateLabel(group, key)}</span>}<small>{ms.length} match{ms.length > 1 ? 's' : ''}</small></div>
      {group !== 'date' && getDestinationHub(ms[0]) && <div className="group-hub"><MapPin size={13}/> Ville de séjour : <strong>{getDestinationHub(ms[0])}</strong></div>}</div>
      {ms.map(m => <MatchRow key={m.fixture_key} match={m} favorite={favorites.includes(m.fixture_key)} onToggleFavorite={onToggleFavorite}/>)}
    </div>)}</div>}
    {ordered.length > pageLimit && <button className="load-more" onClick={() => onMore(MATCHES_PAGE_STEP)}>Afficher d'autres matchs <ArrowDown size={16}/></button>}
  </>;
}
