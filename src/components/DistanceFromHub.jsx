import React from 'react';
import { ExternalLink, MapPin } from 'lucide-react';
import { getDestinationHub, getMatchDistance } from '../lib/destinations.js';
import { getMatchDirectionsUrl } from '../lib/maps.js';

/** Distances à vol d'oiseau ; le clic ouvre un itinéraire routier dans Maps. */
export default function DistanceFromHub({ match, compact = false }) {
  const hub = getDestinationHub(match);
  if (!hub) return null;
  const distance = getMatchDistance(match);
  const directions = getMatchDirectionsUrl(match);
  const label = distance ? `${distance.city} · ≈ ${distance.km} km de ${hub}` : `Distance depuis ${hub} indisponible`;
  const cls = compact ? 'hub-distance compact' : 'hub-distance';
  if (!directions) return <span className={cls}><MapPin size={12} aria-hidden="true"/>{label}</span>;
  return <a className={cls} href={directions} target="_blank" rel="noopener noreferrer"
    title={`Ouvrir l'itinéraire Google Maps : ${hub} → ${distance.city}. La distance affichée est à vol d'oiseau.`}>
    <MapPin size={12} aria-hidden="true"/>{label}<ExternalLink size={11} aria-hidden="true"/>
  </a>;
}
