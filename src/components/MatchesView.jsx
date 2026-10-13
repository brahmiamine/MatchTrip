import React from 'react';
import { ArrowDown } from 'lucide-react';
import { MATCHES_PAGE_STEP } from '../constants.js';
import { formatDay, formatFull, nextDate } from '../lib/dates.js';
import { groupMatches } from '../lib/sorting.js';
import Empty from './Empty.jsx';
import MatchRow from './MatchRow.jsx';
import DistanceInfo from './DistanceInfo.jsx';

/** « zone-date » : la destination est répétée pour chaque date, groupes dans l'ordre du tri. */
function groupTitle(group, key) {
  if (group === 'date') return formatDay(key);
  if (group === 'zone-date') { const [date, zone] = key.split('|'); return `${zone} · ${formatDay(date)}`; }
  if (group === 'zone-weekend') { const [sat, zone] = key.split('|'); return `${zone} · ${formatFull(sat)} – ${formatFull(nextDate(sat))}`; }
  return key;
}

export default function MatchesView({ ordered, group, onGroup, pageLimit, onMore, favorites, onToggleFavorite, onReset }) {
  const grouped = groupMatches(ordered.slice(0, pageLimit), group);
  return <>
    <div className="list-toolbar"><div>{ordered.length} rencontre{ordered.length > 1 ? 's' : ''} correspond{ordered.length > 1 ? 'ent' : ''} à votre recherche</div><div className="sort-wrap"><span>Regrouper</span><select value={group} onChange={e => onGroup(e.target.value)}><option value="date">Par date</option><option value="zone">Par destination</option><option value="zone-date">Par destination et date</option><option value="zone-weekend">Par destination et week-end</option></select></div></div>
    {ordered.length === 0 ? <Empty onReset={onReset}/> : <div className="match-groups">{grouped.map(([key, ms]) => <div className="match-group" key={key}>
      <div className="group-title"><span>{groupTitle(group, key)}</span><small>{ms.length} match{ms.length > 1 ? 's' : ''}</small></div>
      {group !== 'date' && <DistanceInfo matches={ms} mode={group === 'zone' ? 'spread' : 'legs'}/>}
      {ms.map(m => <MatchRow key={m.fixture_key} match={m} favorite={favorites.includes(m.fixture_key)} onToggleFavorite={onToggleFavorite}/>)}
    </div>)}</div>}
    {ordered.length > pageLimit && <button className="load-more" onClick={() => onMore(MATCHES_PAGE_STEP)}>Afficher d'autres matchs <ArrowDown size={16}/></button>}
  </>;
}
