import React from 'react';
import { Route } from 'lucide-react';
import approximateStadiums from '../data/approximateStadiums.json';
import { formatKm, legsBetweenMatches, maxSpreadKm } from '../lib/distance.js';

/**
 * Distance entre les stades d'un groupe de 2 matchs ou plus.
 * mode « legs » : trajets successifs (week-end / date) ; mode « spread » : écart maximal (groupe sur toute la période).
 */
export default function DistanceInfo({ matches, mode = 'legs' }) {
  if (matches.length < 2) return null;
  const estimate = matches.some(m => approximateStadiums.includes(m.stadium));
  const note = estimate ? 'Points des nouveaux stades estimés à proximité, distance à vol d’oiseau non utilisable comme durée de trajet.' : 'Distance à vol d’oiseau, hors trajet réel.';
  const distanceLabel = estimate ? 'à vol d’oiseau, position estimée' : 'à vol d’oiseau';
  if (mode === 'spread') {
    const km = maxSpreadKm(matches);
    return km === null ? null : <div className="distance" title={note}><Route size={13}/><span>Écart maximal entre stades : <strong>≈ {formatKm(km)}</strong> <em>{distanceLabel}</em></span></div>;
  }
  const legs = legsBetweenMatches(matches);
  if (!legs.length) return null;
  return <div className="distance" title={note}><Route size={13}/>
    <span>{legs.map((l, i) => <span className="leg" key={i}>{l.from} → {l.to} : <strong>≈ {formatKm(l.km)}</strong></span>)} <em>{distanceLabel}</em></span></div>;
}
