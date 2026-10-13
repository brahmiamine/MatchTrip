import React from 'react';
import { MapPin } from 'lucide-react';
import { getDestinationHub, getMatchDistance } from '../lib/destinations.js';

/** Distances indicatives entre centres-villes, sans appel réseau. */
export default function DistanceFromHub({ match, compact = false }) {
  const hub = getDestinationHub(match);
  if (!hub) return null;
  const distance = getMatchDistance(match);
  return <span className={compact ? 'hub-distance compact' : 'hub-distance'}
    title="Distance approximative à vol d'oiseau entre centres-villes ; ce n'est pas la distance routière vers le stade.">
    <MapPin size={12} aria-hidden="true"/>
    {distance ? `${distance.city} · ≈ ${distance.km} km de ${hub}` : `Distance depuis ${hub} indisponible`}
  </span>;
}
