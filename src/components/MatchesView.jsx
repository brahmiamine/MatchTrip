import React from 'react';
import { ArrowDown } from 'lucide-react';
import { MATCHES_PAGE_STEP } from '../constants.js';
import { formatDay } from '../lib/dates.js';
import { groupByZoneThenDate, groupMatches } from '../lib/sorting.js';
import Empty from './Empty.jsx';
import MatchRow from './MatchRow.jsx';

export default function MatchesView({ ordered, group, onGroup, pageLimit, onMore, favorites, onToggleFavorite, onReset }) {
  const page = ordered.slice(0, pageLimit);
  const nested = group === 'zone-date';
  const grouped = nested ? [] : groupMatches(page, group);
  const zones = nested ? groupByZoneThenDate(page) : [];
  const row = m => <MatchRow key={m.fixture_key} match={m} favorite={favorites.includes(m.fixture_key)} onToggleFavorite={onToggleFavorite}/>;
  return <>
    <div className="list-toolbar"><div>{ordered.length} rencontre{ordered.length > 1 ? 's' : ''} correspond{ordered.length > 1 ? 'ent' : ''} à votre recherche</div><div className="sort-wrap"><span>Regrouper</span><select value={group} onChange={e => onGroup(e.target.value)}><option value="date">Par date</option><option value="zone">Par destination</option><option value="zone-date">Par destination puis date</option></select></div></div>
    {ordered.length === 0 ? <Empty onReset={onReset}/> : nested
      ? <div className="match-groups">{zones.map(([zone, days]) => <div className="match-group" key={zone}>
        <div className="group-title"><span>{zone}</span><small>{days.reduce((n, [, ms]) => n + ms.length, 0)} matchs</small></div>
        {days.map(([date, ms]) => <div className="match-subgroup" key={date}><div className="subgroup-title">{formatDay(date)}</div>{ms.map(row)}</div>)}
      </div>)}</div>
      : <div className="match-groups">{grouped.map(([key, ms]) => <div className="match-group" key={key}>
        <div className="group-title"><span>{group === 'date' ? formatDay(key) : key}</span><small>{ms.length} match{ms.length > 1 ? 's' : ''}</small></div>
        {ms.map(row)}
      </div>)}</div>}
    {ordered.length > pageLimit && <button className="load-more" onClick={() => onMore(MATCHES_PAGE_STEP)}>Afficher d'autres matchs <ArrowDown size={16}/></button>}
  </>;
}
